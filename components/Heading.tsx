import { createElement, HTMLAttributes, PropsWithChildren } from 'react';

export const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type HeadingLevel = (typeof HEADING_LEVELS)[number];

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
}

export default function Heading({ level, children, ...attrs }: PropsWithChildren<Props>) {
  return createElement(level, attrs, children);
}
