'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScrollAreaContextValue {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  hasScroll: boolean;
  scrollY: number;
  scrollHeight: number;
  clientHeight: number;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue | null>(null);

function useScrollAreaContext() {
  const context = React.useContext(ScrollAreaContext);
  if (!context) {
    throw new Error('ScrollArea components must be used within ScrollArea.Root');
  }
  return context;
}

interface ScrollAreaRootProps extends React.ComponentProps<'div'> {
  /**
   * Custom gradient classes for top shadow. Defaults to background-based gradient.
   */
  topShadowGradient?: string;
  /**
   * Custom gradient classes for bottom shadow. Defaults to background-based gradient.
   */
  bottomShadowGradient?: string;
}

const ScrollAreaRoot = React.forwardRef<HTMLDivElement, ScrollAreaRootProps>(
  ({ className, children, topShadowGradient, bottomShadowGradient, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [hasScroll, setHasScroll] = React.useState(false);
    const [scrollY, setScrollY] = React.useState(0);
    const [scrollHeight, setScrollHeight] = React.useState(0);
    const [clientHeight, setClientHeight] = React.useState(0);

    React.useEffect(() => {
      const element = scrollRef.current;
      if (!element) return;

      const updateScrollState = () => {
        requestAnimationFrame(() => {
          if (!element) return;
          const sh = element.scrollHeight;
          const ch = element.clientHeight;
          const sy = element.scrollTop;
          setHasScroll(sh > ch);
          setScrollHeight(sh);
          setClientHeight(ch);
          setScrollY(sy);
        });
      };

      const handleScroll = () => {
        updateScrollState();
      };

      const timeoutId = setTimeout(updateScrollState, 0);
      updateScrollState();

      element.addEventListener('scroll', handleScroll, { passive: true });

      const resizeObserver = new ResizeObserver(updateScrollState);
      resizeObserver.observe(element);

      const mutationObserver = new MutationObserver(updateScrollState);
      mutationObserver.observe(element, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      return () => {
        clearTimeout(timeoutId);
        element.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, []);

    const contextValue = React.useMemo(
      () => ({ scrollRef, hasScroll, scrollY, scrollHeight, clientHeight }),
      [hasScroll, scrollY, scrollHeight, clientHeight]
    );

    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
          {children}
          {hasScroll && (
            <>
              {/* Top Shadow */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-x-0 top-0 z-20 h-8 bg-linear-to-b mr-4',
                  topShadowGradient || 'from-background to-transparent'
                )}
              />
              {/* Bottom Shadow */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-linear-to-t mr-4',
                  bottomShadowGradient || 'from-background to-transparent'
                )}
              />
            </>
          )}
        </div>
      </ScrollAreaContext.Provider>
    );
  }
);
ScrollAreaRoot.displayName = 'ScrollAreaRoot';

interface ScrollAreaContentProps extends React.ComponentProps<'div'> {}

const ScrollAreaContent = React.forwardRef<HTMLDivElement, ScrollAreaContentProps>(
  ({ className, children, ...props }, ref) => {
    const { scrollRef } = useScrollAreaContext();

    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        scrollRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
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

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Content: ScrollAreaContent,
};
