import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  collection, addDoc, serverTimestamp, query, orderBy, where, getDocs, doc,
  deleteDoc, updateDoc, getDoc, deleteField, setDoc, writeBatch, arrayRemove,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { EXCERPT_LIMIT } from '../../lib/excerpt';
import { slugify } from '../../lib/slug';
import '../Project.css';
import './blog.css';
import TerminalHeader from '../../components/TerminalHeader';
import StatusLine from '../../components/StatusLine';

/**
 * Blog admin.
 *
 * This used to compare against a hardcoded `ADMIN_PASSWORD` in the bundle, but
 * that was never what protected anything: the client only decides what UI to
 * show. Writes are authorized by firestore.rules, which now requires a specific
 * authenticated uid. Signing in through Firebase Auth is what makes those rules
 * able to say yes.
 */
interface BlogPost {
  id: string;
  title: string;
  pinned?: boolean;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // Shown on /blog and as the og:description in an unfurl. Optional: when it
  // is blank both fall back to the opening of the body.
  const [description, setDescription] = useState('');
  // Share card only - it is never rendered in the post body. scripts/prerender.ts
  // bakes it into that post's og:image at build time.
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const report = (message: string, error = false) => {
    setStatus(message);
    setIsError(error);
  };

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setAuthChecked(true);
  }), []);

  /** Returns null on failure so the caller decides what to render. */
  const loadPosts = useCallback(async (): Promise<BlogPost[] | null> => {
    try {
      const snapshot = await getDocs(query(collection(db, 'posts'), orderBy('date', 'desc')));
      return snapshot.docs.map((d) => ({ id: d.id, title: d.data().title, pinned: !!d.data().pinned }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      return null;
    }
  }, []);

  const applyPosts = useCallback((list: BlogPost[] | null) => {
    if (list) setPosts(list);
    else report('ERROR_LISTING_ENTRIES.', true);
  }, []);

  const refreshPosts = useCallback(async () => {
    applyPosts(await loadPosts());
  }, [applyPosts, loadPosts]);

  const loadTags = useCallback(async (): Promise<string[] | null> => {
    try {
      const snapshot = await getDocs(query(collection(db, 'tags'), orderBy('createdAt', 'asc')));
      return snapshot.docs.map((d) => d.id);
    } catch (error) {
      console.error('Error fetching tags:', error);
      return null;
    }
  }, []);

  const refreshTags = useCallback(async () => {
    const list = await loadTags();
    if (list) setTags(list);
    else report('ERROR_LISTING_TAGS.', true);
  }, [loadTags]);

  useEffect(() => {
    if (!user) return;
    let live = true;
    (async () => {
      const [postList, tagList] = await Promise.all([loadPosts(), loadTags()]);
      if (!live) return;
      applyPosts(postList);
      if (tagList) setTags(tagList);
    })();
    return () => {
      live = false;
    };
  }, [user, loadPosts, applyPosts, loadTags]);

  const handleCreateTag = async (e: FormEvent) => {
    e.preventDefault();
    const id = slugify(newTag);
    if (!id) return report('TAG_NAME_INVALID: USE_LETTERS/NUMBERS.', true);
    if (tags.includes(id)) return report(`TAG_ALREADY_EXISTS: ${id}`, true);
    try {
      await setDoc(doc(db, 'tags', id), { createdAt: serverTimestamp() });
      setNewTag('');
      await refreshTags();
      report(`TAG_CREATED: ${id}`);
    } catch (error) {
      console.error('Error creating tag:', error);
      report('TAG_CREATE_FAILED.', true);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!window.confirm(`SURE_TO_DESTROY_TAG? [${id}] - removes it from every entry.`)) return;
    try {
      // Destroying a tag has to un-tag every post carrying it, or the tag
      // survives as an orphaned string that /blog can never filter by again.
      const affected = await getDocs(query(collection(db, 'posts'), where('tags', 'array-contains', id)));
      if (!affected.empty) {
        const batch = writeBatch(db);
        affected.docs.forEach((d) => {
          batch.update(d.ref, { tags: arrayRemove(id), lastEdited: serverTimestamp() });
        });
        await batch.commit();
      }
      await deleteDoc(doc(db, 'tags', id));
      setSelectedTags((current) => current.filter((t) => t !== id));
      await refreshTags();
      report(`TAG_DESTROYED: ${id} (${affected.size}_ENTRIES_UPDATED)`);
    } catch (error) {
      console.error('Error deleting tag:', error);
      report('TAG_DELETE_FAILED.', true);
    }
  };

  const toggleSelectedTag = (id: string) => {
    setSelectedTags((current) => (
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id]
    ));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    report('AUTHENTICATING...');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setPassword('');
      report('');
    } catch {
      report('ACCESS_DENIED: INVALID_CREDENTIALS', true);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setDescription('');
    setImage('');
    setSelectedTags([]);
    report('EDIT_CANCELLED.');
  };

  const handleEditInitiate = async (post: BlogPost) => {
    report('LOADING_EDIT_DATA...');
    try {
      const snap = await getDoc(doc(db, 'posts', post.id));
      if (!snap.exists()) return report('RECORD_NOT_FOUND.', true);
      const data = snap.data();
      setTitle(data.title ?? '');
      setContent(data.content ?? '');
      setDescription(data.description ?? '');
      setImage(data.image ?? '');
      setSelectedTags(data.tags ?? []);
      setEditingId(post.id);
      report(`EDITING_MODE: ${post.id}`);
    } catch (error) {
      console.error('Error loading post for edit:', error);
      report('ERROR_LOADING_DATA.', true);
    }
  };

  const handlePinToggle = async (post: BlogPost) => {
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        pinned: !post.pinned,
        lastEdited: serverTimestamp(),
      });
      await refreshPosts();
      report(post.pinned ? 'POST_UNPINNED.' : 'POST_PINNED.');
    } catch (error) {
      console.error('Error toggling pin:', error);
      report('PIN_TOGGLE_FAILED.', true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`SURE_TO_DELETE_ENTRY? [${id}]`)) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      if (editingId === id) cancelEdit();
      await refreshPosts();
      report('ENTRY_DELETED_SUCCESSFULLY.');
    } catch (error) {
      console.error('Delete failed:', error);
      report('DELETE_OPERATION_FAILED.', true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    report(editingId ? 'UPDATING_DATA...' : 'UPLOADING_DATA...');

    // Both optional fields are trimmed here because an empty box has to mean
    // "no field" rather than "the field, blank": firestore.rules requires a
    // non-empty string whenever either key is present. The image is further
    // restricted to https:// or a site-relative path, since its value is
    // copied verbatim into an og:image on every prerendered page.
    const summary = description.trim();
    const shareImage = image.trim();
    if (shareImage && !/^(https:\/\/|\/[^/])/.test(shareImage)) {
      return report('IMAGE_MUST_BE_https://_OR_/site-relative', true);
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'posts', editingId), {
          title,
          content,
          description: summary || deleteField(),
          image: shareImage || deleteField(),
          tags: selectedTags.length ? selectedTags : deleteField(),
          lastEdited: serverTimestamp(),
        });
        setEditingId(null);
        report('UPDATE_SUCCESSFUL: RECORD_SYNCED. REDEPLOY_TO_REFRESH_SHARE_CARD.');
      } else {
        await addDoc(collection(db, 'posts'), {
          title,
          content,
          ...(summary ? { description: summary } : {}),
          ...(shareImage ? { image: shareImage } : {}),
          ...(selectedTags.length ? { tags: selectedTags } : {}),
          date: serverTimestamp(),
          lastEdited: serverTimestamp(),
        });
        // The post is readable the instant it lands, but its share card is a
        // file written by scripts/prerender.ts at build time. Until the next
        // deploy the URL falls through to 404.html, which Pages serves with a
        // 404 status - so unfurlers show nothing at all, not even a generic
        // card. Worth saying out loud, because the link looks fine when you
        // click it yourself.
        report('POST_SAVED. NO_SHARE_CARD_UNTIL_YOU_RUN: npm run deploy');
      }
      setTitle('');
      setContent('');
      setDescription('');
      setImage('');
      setSelectedTags([]);
      await refreshPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      report('SYSTEM_ERROR: OPERATION_FAILED', true);
    }
  };

  if (!authChecked) {
    return (
      <div className="Page">
        <TerminalHeader path="Users/Neil/Blog/Admin" backTo="/blog" docTitle="Admin // cnel.info" />
        <div className="TerminalContent">
          <StatusLine>CHECKING_SESSION...</StatusLine>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="Page">
        <TerminalHeader path="Users/Neil/Blog/Admin" backTo="/blog" docTitle="Admin // cnel.info" />
        <div className="TerminalContent">
          <h2>Authenticate</h2>
          <form onSubmit={handleLogin}>
            <input
              className="TerminalInput"
              type="email"
              autoComplete="username"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="TerminalInput"
              type="password"
              autoComplete="current-password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ marginTop: 'var(--sp-2)' }}
            />
            <div className="AdminRow">
              <button className="AdminButton" type="submit">[ SIGN_IN ]</button>
            </div>
          </form>
          {status && <StatusLine tone={isError ? 'error' : 'info'}>{status}</StatusLine>}
        </div>
      </div>
    );
  }

  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Blog/Admin" backTo="/blog" docTitle="Admin // cnel.info" />

      <div className="TerminalContent" style={{ maxWidth: 'none' }}>
        <div className="EntryRow" style={{ borderBottom: 'none' }}>
          <span>SESSION: {user.email}</span>
          <button className="AdminButton" type="button" onClick={() => void signOut(auth)}>
            [ SIGN_OUT ]
          </button>
        </div>

        {status && <StatusLine tone={isError ? 'error' : 'info'}>{status}</StatusLine>}

        <div className="AdminGrid">
          <form onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Entry' : 'New Entry'}</h2>
            <input
              className="TerminalInput"
              placeholder="TITLE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="TerminalTextarea TerminalTextarea--short"
              placeholder="DESCRIPTION (optional) - shown on /blog and in link previews"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ marginTop: 'var(--sp-2)' }}
            />
            <p className={`AdminHint${description.length > EXCERPT_LIMIT ? ' AdminHint--over' : ''}`}>
              {description.length}/{EXCERPT_LIMIT}
              {description.length === 0 && ' - blank falls back to the start of the post'}
              {description.length > EXCERPT_LIMIT && ' - long enough that cards will clip it'}
            </p>
            <input
              className="TerminalInput"
              placeholder="SHARE_IMAGE_URL (optional, 1200x630)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{ marginTop: 'var(--sp-2)' }}
            />
            <textarea
              className="TerminalTextarea"
              placeholder="CONTENT (markdown supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ marginTop: 'var(--sp-2)' }}
            />

            <p className="AdminHint" style={{ marginTop: 'var(--sp-3)' }}>
              TAGS{tags.length === 0 && ' - none exist yet, create one on the right'}
            </p>
            <div className="TagPicker">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`TagPill${selectedTags.includes(t) ? ' TagPill--active' : ''}`}
                  onClick={() => toggleSelectedTag(t)}
                  aria-pressed={selectedTags.includes(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="AdminRow">
              <button className="AdminButton" type="submit">
                {editingId ? '[ COMMIT_UPDATE ]' : '[ COMMIT_TO_DATABASE ]'}
              </button>
              {editingId && (
                <button className="AdminButton" type="button" onClick={cancelEdit}>
                  [ CANCEL ]
                </button>
              )}
            </div>
          </form>

          <div>
            <h2>Manage Tags</h2>
            <form onSubmit={(e) => void handleCreateTag(e)} className="AdminRow" style={{ marginTop: 0 }}>
              <input
                className="TerminalInput"
                placeholder="NEW_TAG_NAME"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button className="AdminButton" type="submit">[ CREATE ]</button>
            </form>
            {tags.length === 0 ? (
              <p style={{ marginTop: 'var(--sp-2)' }}>NO_TAGS_FOUND.</p>
            ) : (
              <div style={{ marginTop: 'var(--sp-2)' }}>
                {tags.map((t) => (
                  <div className="EntryRow" key={t}>
                    <span>{t}</span>
                    <button
                      className="AdminButton AdminButton--danger"
                      type="button"
                      onClick={() => void handleDeleteTag(t)}
                    >
                      [ DESTROY ]
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ marginTop: 'var(--sp-5)' }}>Manage Entries</h2>
            {posts.length === 0 ? (
              <p>NO_ENTRIES_FOUND.</p>
            ) : (
              posts.map((post) => (
                <div className="EntryRow" key={post.id}>
                  <span>{post.pinned && '* '}{post.title}</span>
                  <span className="AdminRow" style={{ marginTop: 0 }}>
                    <button
                      className="AdminButton"
                      type="button"
                      onClick={() => void handlePinToggle(post)}
                    >
                      {post.pinned ? '[ UNPIN ]' : '[ PIN ]'}
                    </button>
                    <button
                      className="AdminButton"
                      type="button"
                      onClick={() => void handleEditInitiate(post)}
                    >
                      [ EDIT ]
                    </button>
                    <button
                      className="AdminButton AdminButton--danger"
                      type="button"
                      onClick={() => void handleDelete(post.id)}
                    >
                      [ DEL ]
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
