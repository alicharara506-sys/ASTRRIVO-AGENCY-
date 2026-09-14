'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of delay, used to stagger siblings. */
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
  /**
   * aisaige's section-header preset: a longer rise that settles up from a
   * slight scale-down, fired a touch earlier than the default content reveal.
   */
  header?: boolean;
};

/** Scroll-triggered entrance that respects `prefers-reduced-motion`. */
export function Reveal({ children, className, delay = 0, y = 26, as = 'div', header = false }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  const from = header ? { opacity: 0, y: 32, scale: 0.97 } : { opacity: 0, y };
  const to = header ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0 };

  return (
    <Tag
      className={className}
      initial={reduce ? false : from}
      whileInView={reduce ? undefined : to}
      viewport={{ once: true, margin: header ? '-50px' : '-80px' }}
      transition={{ duration: header ? 0.8 : 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
