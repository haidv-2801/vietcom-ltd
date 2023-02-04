import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

export const useScroll = (
  {
    top: callbackTop,
    bottom: callbackBottom,
    scrollDown: callbackScrollDown,
    scrollTop: callbackScrollTop,
  },
  offset
) => {
  const node = useRef();
  const isDown = useRef(false);
  const isTop = useRef(false);
  const lastestPosition = useRef(0);

  useEffect(() => {
    const callBackInside = (e) => {
      let scrollTop = e.target.scrollTop;
      if (
        (!offset && scrollTop > lastestPosition.current) ||
        (offset &&
          e.target.scrollHeight -
            e.target.scrollTop -
            e.target.clientHeight -
            offset <=
            0)
      ) {
        callbackScrollDown && callbackScrollDown();
      } else if (scrollTop < lastestPosition.current) {
        callbackScrollTop && callbackScrollTop();
      }

      lastestPosition.current = scrollTop || 0;

      if (
        e.target.scrollHeight - e.target.scrollTop ===
        e.target.clientHeight
      ) {
        callbackBottom && callbackBottom();
      } else {
      }

      if (e.target.scrollTop === 0) {
        callbackTop && callbackTop();
      }
    };
    node?.current && node.current.addEventListener('scroll', callBackInside);
    return () => {
      node?.current && node.current.removeEventListener('scroll');
    };
  }, [node]);

  return node;
};
