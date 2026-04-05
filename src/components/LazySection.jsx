import { useEffect, useRef, useState } from 'react';

export default function LazySection({
  children,
  fallback = null,
  rootMargin = '300px 0px',
  threshold = 0.01,
  className = '',
  style,
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return undefined;

    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {isVisible ? children : fallback}
    </div>
  );
}
