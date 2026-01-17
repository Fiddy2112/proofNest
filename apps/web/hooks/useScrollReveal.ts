"use client";

import { useEffect, useRef, useState } from "react";

type ScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
};

export function useScrollReveal(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    delay = 0,
  } = options;

  const domRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = domRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }

          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay]);

  return { domRef, isVisible };
}
