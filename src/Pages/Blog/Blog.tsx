import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import '../Project.css';
import './blog.css';
import TerminalHeader from '../../components/TerminalHeader';
import TerminalLink from '../../components/TerminalLink';
import StatusLine from '../../components/StatusLine';
import { excerpt } from '../../lib/excerpt';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  /** Hand-written preview. Falls back to the opening of the body. */
  description?: string;
  date?: Timestamp;
  tags?: string[];
  pinned?: boolean;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the source of truth for which tag is active - that's what
  // makes "filter down to vulkan" a link someone can share or bookmark
  // instead of state that resets on reload.
  const activeTag = searchParams.get('tag');

  useEffect(() => {
    (async () => {
      try {
        const [postSnap, tagSnap] = await Promise.all([
          getDocs(query(collection(db, 'posts'), orderBy('date', 'desc'))),
          getDocs(query(collection(db, 'tags'), orderBy('createdAt', 'asc'))),
        ]);
        setPosts(postSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost));
        setTags(tagSnap.docs.map((d) => d.id));
      } catch (error) {
        console.error('Error fetching posts:', error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Array.prototype.sort is stable, so within each pinned/unpinned group posts
  // keep the date-desc order the query already fetched them in.
  const visiblePosts = (activeTag ? posts.filter((p) => p.tags?.includes(activeTag)) : posts)
    .slice()
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  const selectTag = (tag: string | null) => {
    if (tag) setSearchParams({ tag });
    else setSearchParams({});
  };

  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Blog" docTitle="Blog // cnel.info" />

      <div className="TerminalContent">
        {loading && <StatusLine>LOADING_RECORDS...</StatusLine>}
        {!loading && failed && <StatusLine tone="error">ERROR: COULD_NOT_REACH_DATABASE.</StatusLine>}

        {!loading && !failed && tags.length > 0 && (
          <div className="TagPicker" style={{ marginBottom: 'var(--sp-5)' }}>
            <button
              type="button"
              className={`TagPill${!activeTag ? ' TagPill--active' : ''}`}
              onClick={() => selectTag(null)}
            >
              ALL
            </button>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={`TagPill${activeTag === t ? ' TagPill--active' : ''}`}
                onClick={() => selectTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {!loading && !failed && posts.length === 0 && <StatusLine>NO_ENTRIES_FOUND.</StatusLine>}
        {!loading && !failed && posts.length > 0 && visiblePosts.length === 0 && (
          <StatusLine>NO_ENTRIES_TAGGED: {activeTag}</StatusLine>
        )}

        {visiblePosts.map((post) => (
          <div className="PostCard" key={post.id}>
            {post.pinned && <span className="PinBadge">[ PINNED ]</span>}
            <Link to={`/blog/${post.id}`}>
              <h2>{'> '}{post.title}</h2>
            </Link>
            <p className="PostMeta">
              DATE: {post.date?.toDate ? post.date.toDate().toLocaleString() : 'UNKNOWN'}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="TagPicker" style={{ margin: '0 0 var(--sp-2)' }}>
                {post.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="TagPill"
                    onClick={() => selectTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <p className="PostExcerpt">{excerpt(post.description, post.content)}</p>
            <TerminalLink label="READ_MORE" to={`/blog/${post.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
