'use client';

import ScrollArea from '@/registry/joyco/blocks/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, Minus, Sparkles, Star, Zap, Heart, Music, Palette, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { icon: Sparkles, title: 'Sparkling Magic', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: Star, title: 'Stellar Design', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Zap, title: 'Lightning Fast', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Heart, title: 'Heartfelt Experience', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: Music, title: 'Harmonious Flow', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { icon: Palette, title: 'Creative Palette', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

export function ScrollAreaDemo() {
  return <SimpleExample />;
}

function SimpleExample() {
  const [itemCount, setItemCount] = useState<number>(4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Example</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea.Root className="h-64" topShadowGradient="fade-card fade-b" bottomShadowGradient="fade-card fade-t">
          <ScrollArea.Content className="space-y-4 p-6">
            {Array.from({ length: itemCount }, (_, i) => (
              <SimpleItem key={i} item={items[i % items.length]} />
            ))}
          </ScrollArea.Content>
        </ScrollArea.Root>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => setItemCount(itemCount + 1)}>
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
          <Button
            variant="secondary"
            onClick={() => setItemCount(Math.max(1, itemCount - 1))}
            disabled={itemCount <= 1}
          >
            <Minus className="w-4 h-4" />
            Remove Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChevronExample() {
  const [itemCount, setItemCount] = useState<number>(6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>With Chevron Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea.Root
          className="h-96 p-4 relative"
          topShadowGradient="fade-card fade-b"
          bottomShadowGradient="fade-card fade-t"
        >
          {/* Scroll indicator arrows */}
          <div
            className={cn(
              'absolute left-1/2 top-2 -translate-x-1/2 z-30 pointer-events-none',
              'group-data-[scroll-top=true]/scroll-area:opacity-100 group-data-[scroll-top=true]/scroll-area:animate-in group-data-[scroll-top=true]/scroll-area:fade-in group-data-[scroll-top=true]/scroll-area:duration-300',
              'group-data-[scroll-top=false]/scroll-area:opacity-0 group-data-[scroll-top=false]/scroll-area:animate-out group-data-[scroll-top=false]/scroll-area:fade-out group-data-[scroll-top=false]/scroll-area:duration-300',
              'opacity-0'
            )}
          >
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div
            className={cn(
              'absolute left-1/2 bottom-2 -translate-x-1/2 z-30 pointer-events-none',
              'group-data-[scroll-bottom=true]/scroll-area:opacity-100 group-data-[scroll-bottom=true]/scroll-area:animate-in group-data-[scroll-bottom=true]/scroll-area:fade-in group-data-[scroll-bottom=true]/scroll-area:duration-200',
              'group-data-[scroll-bottom=false]/scroll-area:opacity-0 group-data-[scroll-bottom=false]/scroll-area:animate-out group-data-[scroll-bottom=false]/scroll-area:fade-out group-data-[scroll-bottom=false]/scroll-area:duration-200',
              'opacity-0'
            )}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </div>
          <ScrollArea.Content className="space-y-4 p-6">
            {Array.from({ length: itemCount }, (_, i) => (
              <SimpleItem key={i} item={items[i % items.length]} />
            ))}
          </ScrollArea.Content>
        </ScrollArea.Root>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => setItemCount(itemCount + 1)}>
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
          <Button
            variant="secondary"
            onClick={() => setItemCount(Math.max(1, itemCount - 1))}
            disabled={itemCount <= 1}
          >
            <Minus className="w-4 h-4" />
            Remove Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const SimpleItem = ({ item }: { item: (typeof items)[number] }) => {
  const Icon = item.icon;
  return (
    <div className="rounded-lg bg-background p-4 border shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${item.bg} p-2 rounded-lg`}>
          <Icon className={`w-5 h-5 ${item.color}`} />
        </div>
        <h3 className="font-semibold">{item.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Scroll down to see the bottom shadow appear, and scroll back up to see the top shadow.
      </p>
    </div>
  );
};
