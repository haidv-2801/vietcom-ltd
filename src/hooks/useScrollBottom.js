import React, { useState } from 'react';

export const useScrollToBottom = () => {
  const [isBottom, setIsBottom] = useState(false);
  const [node, setRef] = null;

  React.useEffect(() => {
    let observer;

    if (node && node.parentElement) {
      observer = new IntersectionObserver(
        ([entry]) => setIsBottom(entry.isIntersecting),
        { root: node.parentElement }
      );
      observer.observe(node);
    } else {
      setIsBottom(false);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [node]);

  return [setRef, isBottom];
};
