'use client';

import { InfiniteScroll, useInfiniteScrollState } from '@/registry/joyco/blocks/infinite-scroll/infinite-scroll';
import { LoadPageFn } from '@/registry/joyco/blocks/infinite-scroll/use-infinite-scroll';
import { useRef } from 'react';

type Pokemon = {
  id: number;
  name: string;
  url: string;
};

const loadPage: LoadPageFn<Pokemon> = async ({ offset, limit, page }) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}&page=${page}`);
  const data = await response.json();
  return {
    items: (data.results.map((result: { id: number; name: string; url: string }) => ({
      id: result.id,
      name: result.name,
      url: result.url,
    })) ?? []) as Pokemon[],
    totalCount: data.count ?? 0,
  };
};

const InfiniteScrollDemoContent = ({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) => {
  const { visibleItems } = useInfiniteScrollState<Pokemon>();
  return (
    <InfiniteScroll.Root className="max-h-96 overflow-y-auto w-full rounded-2xl border border-border p-4">
      <InfiniteScroll.Viewport ref={ref}>
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  return (
    <InfiniteScroll.Provider loadPage={loadPage} autoAdvance bias={10} initialPage={1} pageSize={10}>
      <InfiniteScrollDemoContent ref={scrollContainerRef} />
    </InfiniteScroll.Provider>
  );
};

export default InfiniteScrollDemo;
