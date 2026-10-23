import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../Project.css';
import './blog.css';
import TerminalHeader from '../../components/TerminalHeader';
import TerminalLink from '../../components/TerminalLink';
import StatusLine from '../../components/StatusLine';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date?: Timestamp;
  /** Hand-written preview for the blog index and the share card. Not rendered
   *  on the post itself. Set it in /blog/admin. */
  description?: string;
  /** Share card only - baked into og:image by scripts/prerender.ts, never
   *  rendered here. Set it in /blog/admin. */
  image?: string;
  tags?: string[];
}

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'posts', id));
        if (snap.exists()) setPost({ id: snap.id, ...snap.data() } as BlogPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="Page">
        <TerminalHeader path="Users/Neil/Blog" backTo="/blog" />
        <div className="TerminalContent">
          <StatusLine>LOADING_RECORD...</StatusLine>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="Page">
        <TerminalHeader path="Users/Neil/Blog" backTo="/blog" />
        <div className="TerminalContent">
          <StatusLine tone="error">ERROR: RECORD_NOT_FOUND</StatusLine>
          <TerminalLink label="BACK_TO_LOGS" to="/blog" />
        </div>
      </div>
    );
  }

  return (
    <div className="Page">
      {/* The breadcrumb deliberately stops at Blog. It used to append the post
          title with every space replaced by an underscore, which turned a long
          name into two wrapped lines of h1 that read as a filename. The title
          gets to be a title below, spaces and punctuation intact. */}
      <TerminalHeader path="Users/Neil/Blog" backTo="/blog" docTitle={`${post.title} // cnel.info`} />

      <div className="TerminalContent TerminalContent--prose">
        {/* '> ' matches how the same title is rendered on the blog index. */}
        <h2 className="PostTitle">{'> '}{post.title}</h2>
        <p className="PostMeta">
          TIMESTAMP: {post.date?.toDate ? post.date.toDate().toLocaleString() : 'UNKNOWN'}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="TagPicker" style={{ marginBottom: 'var(--sp-5)' }}>
            {post.tags.map((t) => (
              <Link key={t} to={`/blog?tag=${t}`} className="TagPill">
                {t}
              </Link>
            ))}
          </div>
        )}

        <div className="MarkdownContent">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Supports ![Alt | 300px](url) and ![Alt | 50%](url) for sizing.
              img: ({ alt, ...props }) => {
                const [altText, width] = alt ? alt.split('|').map((s) => s.trim()) : ['', '100%'];
                return (
                  <img
                    {...props}
                    alt={altText}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: width || '100%',
                      maxWidth: '100%',
                      border: '1px solid var(--fg)',
                      margin: 'var(--sp-3) 0',
                      display: 'block',
                    }}
                  />
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <p style={{ marginTop: 'var(--sp-6)' }}>
          <Link to="/blog" className="TermLink">{'<< BACK_TO_LOGS'}</Link>
        </p>
      </div>
    </div>
  );
}
