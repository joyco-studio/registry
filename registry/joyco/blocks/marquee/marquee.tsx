'use client';

import { Marquee as MarqueeComponent, useMarquee as useMarqueeHook } from '@joycostudio/marquee/react';

export const useMarquee = useMarqueeHook;

export function Marquee({ children, ...props }: React.ComponentProps<typeof MarqueeComponent>) {
  return (
    <MarqueeComponent {...props}>
      {children}
    </MarqueeComponent>
  );
}
