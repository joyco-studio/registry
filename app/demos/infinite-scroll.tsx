'use client';
import { getPokemonList } from '@/registry/joyco/blocks/complex-component/lib/pokemon';
import { InfiniteScroll, useInfiniteScrollState } from '@/registry/joyco/blocks/infinite-scroll/infinite-scroll';
import { LoadPageFn } from '@/registry/joyco/blocks/infinite-scroll/use-infinite-scroll';
import { useEffect, useState } from 'react';

type Pokemon = {
  id: number;
  name: string;
  url: string;
};

const loadPage: LoadPageFn<Pokemon> = async ({ offset, limit, page }) => {
  const response = await getPokemonList({ limit, offset, page: page ?? 1 });
  return {
    items: (response?.results.map((result) => ({ id: result.id, name: result.name, url: result.url })) ??
      []) as Pokemon[],
    totalCount: response?.results?.length ?? 0,
  };
};

const InfiniteScrollDemoContent = () => {
  const { visibleItems } = useInfiniteScrollState<Pokemon>();
  return (
    <InfiniteScroll.Root
      className="max-h-96 overflow-y-auto w-full rounded-2xl border border-border p-4"
      id="scroll-container"
    >
      <InfiniteScroll.Viewport>
        {visibleItems.map((item) => (
          <InfiniteScroll.Item key={item.id} index={item.id}>
            <div>{item.name}</div>
          </InfiniteScroll.Item>
        ))}
      </InfiniteScroll.Viewport>
      <InfiniteScroll.Trigger>Load More</InfiniteScroll.Trigger>
      <InfiniteScroll.Sentinel>Sentinel</InfiniteScroll.Sentinel>
      <InfiniteScroll.Debug />
    </InfiniteScroll.Root>
  );
};

const InfiniteScrollDemo = () => {
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    setScrollContainerRef(document.getElementById('scroll-container') as HTMLDivElement);
  }, []);

  return (
    <InfiniteScroll.Provider
      loadPage={loadPage}
      autoAdvance
      bias={10}
      initialPage={1}
      pageSize={10}
      observerOptions={{
        root: scrollContainerRef,
        rootMargin: '0px 0px 100px 0px',
        threshold: 0.1,
      }}
    >
      <InfiniteScrollDemoContent />
    </InfiniteScroll.Provider>
  );
};

export default InfiniteScrollDemo;
