import { useEffect, useRef, useState } from 'react';
import type { MediaImage } from '../content';

interface Props {
  images: MediaImage[];
  intervalMs?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * Screenshot gallery.
 *
 * Replaces a pure-CSS carousel whose @keyframes were hardcoded to exactly three
 * slides, so it couldn't take a variable-length list. Driving the index from
 * state also makes the two things that CSS version got wrong cheap to fix:
 * it never paused, and it ignored prefers-reduced-motion. An auto-advancing
 * carousel with no way to stop it is a WCAG 2.2.2 failure.
 */
export default function Gallery({ images, intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    if (paused || reduced.current || images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [paused, images.length, intervalMs]);

  if (images.length === 0) return null;

  const current = images[Math.min(index, images.length - 1)];

  return (
    <div
      className="Gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="GalleryViewport">
        <div
          className="GalleryTrack"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img) => (
            <div className="GallerySlide" key={img.src}>
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="GalleryControls">
          <button
            type="button"
            className="GalleryNav"
            aria-label="Previous screenshot"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
          >
            {'<'}
          </button>

          <ul className="GalleryDots">
            {images.map((img, i) => (
              <li key={img.src}>
                <button
                  type="button"
                  className="GalleryDot"
                  aria-current={i === index}
                  aria-label={`Screenshot ${i + 1} of ${images.length}`}
                  onClick={() => setIndex(i)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="GalleryNav"
            aria-label="Next screenshot"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
          >
            {'>'}
          </button>

          <span className="GalleryCaption">{current.alt}</span>
        </div>
      )}
    </div>
  );
}
