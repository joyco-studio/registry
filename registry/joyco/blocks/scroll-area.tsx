'use client';

import * as React from 'react';
import { Presence } from '@radix-ui/react-presence';
import { cn } from '@/lib/utils';

interface ScrollAreaContextValue {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  hasScroll: boolean;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue | null>(null);

function useScrollAreaContext() {
  const ctx = React.useContext(ScrollAreaContext);
  if (!ctx) {
    throw new Error('ScrollArea components must be used within ScrollArea Root');
  }
  return ctx;
}

interface ScrollAreaRootProps extends React.ComponentProps<'div'> {
  topShadowGradient?: string;
  bottomShadowGradient?: string;
}

/**
 * Root component for the ScrollArea component. (Basic layout that adds a wrapper and shadows handlers)
 * @example
 * ```tsx
 * import ScrollArea from '@/registry/joyco/blocks/scroll-area';
 * ```
 * @example
 * ```tsx
 * <ScrollArea.Root>
 *   <ScrollArea.Content>
 *     <div>Content here</div>
 *   </ScrollArea.Content>
 * </ScrollArea.Root>
 */
export const ScrollAreaRoot = React.forwardRef<HTMLDivElement, ScrollAreaRootProps>(
  ({ className, children, topShadowGradient, bottomShadowGradient, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [hasScrollTop, setHasScrollTop] = React.useState(false);
    const [hasScrollBottom, setHasScrollBottom] = React.useState(false);

    const update = React.useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;

      const scrollY = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;

      const newHasScrollTop = scrollY > 0;
      const newHasScrollBottom = scrollY + clientHeight < scrollHeight;

      setHasScrollTop(newHasScrollTop);
      setHasScrollBottom(newHasScrollBottom);
    }, []);

    // scroll event, resize observer, and mutation observer
    React.useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;

      // scroll event handler` (detects the scroll event)
      const handleScroll = () => requestAnimationFrame(update);
      el.addEventListener('scroll', handleScroll, { passive: true });

      // resize observer (detects when the container size changes)
      const ro = new ResizeObserver(update);
      ro.observe(el);

      // mutation observer (detects when the children of the container change)
      const mo = new MutationObserver(update);
      mo.observe(el, { childList: true });

      update();

      return () => {
        el.removeEventListener('scroll', handleScroll);
        ro.disconnect();
        mo.disconnect();
      };
    }, [update]);

    const hasScroll = hasScrollTop || hasScrollBottom;

    const ctxValue = React.useMemo(
      () => ({
        scrollRef,
        hasScroll,
      }),
      [hasScroll]
    );

    return (
      <ScrollAreaContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={cn('group/scroll-area relative overflow-hidden', className)}
          data-has-scroll={hasScroll}
          data-scroll-top={hasScrollTop}
          data-scroll-bottom={hasScrollBottom}
          {...props}
        >
          {children}

          {/* Top Shadow */}
          <Presence present={hasScrollTop}>
            <div
              data-state={hasScrollTop ? 'open' : 'closed'}
              className={cn(
                'pointer-events-none absolute inset-x-0 top-0 z-20 h-8',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2',
                'duration-300 ease-out',
                topShadowGradient || 'bg-linear-to-b from-background to-transparent'
              )}
            />
          </Presence>

          {/* Bottom Shadow */}
          <Presence present={hasScrollBottom}>
            <div
              data-state={hasScrollBottom ? 'open' : 'closed'}
              className={cn(
                'pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2',
                'duration-300 ease-out',
                bottomShadowGradient || 'bg-linear-to-t from-background to-transparent'
              )}
            />
          </Presence>
        </div>
      </ScrollAreaContext.Provider>
    );
  }
);
ScrollAreaRoot.displayName = 'ScrollAreaRoot';

interface ScrollAreaContentProps extends React.ComponentProps<'div'> {}

/**
 * Content component for the ScrollArea component. (It contains the scrollable content.)
 * @example
 * ```tsx
 * import ScrollArea from '@/registry/joyco/blocks/scroll-area';
 * ```
 * @example
 * ```tsx
 * <ScrollArea.Content>
 *   <div>Content here</div>
 * </ScrollArea.Content>
 */
export const ScrollAreaContent = React.forwardRef<HTMLDivElement, ScrollAreaContentProps>(
  ({ className, children, ...props }, ref) => {
    const { scrollRef } = useScrollAreaContext();

    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        scrollRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as any).current = node;
      },
      [ref, scrollRef]
    );

    return (
      <div
        ref={combinedRef}
        className={cn(
          'absolute inset-0 overflow-y-auto [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:hsl(0_0%_50%)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollAreaContent.displayName = 'ScrollAreaContent';

/**
 * Default export for the ScrollArea component.
 * @example
 * ```tsx
 * import ScrollArea from '@/registry/joyco/blocks/scroll-area';
 * ```
 *
 * @example
 * ```tsx
 * <ScrollArea.Root>
 *   <ScrollArea.Content>
 *     <div>Content here</div>
 *   </ScrollArea.Content>
 * </ScrollArea.Root>
 */
const ScrollArea = Object.assign(
  {},
  {
    Root: ScrollAreaRoot,
    Content: ScrollAreaContent,
  }
);

export default ScrollArea;
