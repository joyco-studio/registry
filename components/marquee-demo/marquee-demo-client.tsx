'use client';

import { useState } from 'react';
import { Marquee } from '@/registry/joyco/blocks/marquee/marquee';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ITEMS = [
  { id: 1, emoji: '🎨', text: 'Design' },
  { id: 2, emoji: '💻', text: 'Code' },
  { id: 3, emoji: '🚀', text: 'Deploy' },
  { id: 4, emoji: '✨', text: 'Iterate' },
  { id: 5, emoji: '🎯', text: 'Perfect' },
  { id: 6, emoji: '🔥', text: 'Ship' },
  { id: 7, emoji: '🌟', text: 'Celebrate' },
  { id: 8, emoji: '🎉', text: 'Repeat' },
];

export function MarqueeDemoClient() {
  const [speed, setSpeed] = useState(100);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [play, setPlay] = useState(true);

  return (
    <div className="not-prose space-y-6">
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <Marquee 
            speed={speed} 
            speedFactor={1} 
            direction={direction}
            play={play}
          >
            <div className="flex gap-6 py-6 px-4">
              {ITEMS.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 px-6 py-3 bg-fd-primary/10 rounded-lg border border-fd-primary/20 whitespace-nowrap"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-lg font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </Marquee>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setPlay(!play)}
            variant="outline"
            size="sm"
          >
            {play ? '⏸ Pause' : '▶️ Play'}
          </Button>
          
          <Button 
            onClick={() => setDirection(direction === 1 ? -1 : 1)}
            variant="outline"
            size="sm"
          >
            🔄 Reverse
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-fd-muted-foreground">Speed:</span>
            <Button 
              onClick={() => setSpeed(Math.max(20, speed - 20))}
              variant="outline"
              size="sm"
              disabled={speed <= 20}
            >
              🐌 Slower
            </Button>
            <span className="text-sm font-mono w-12 text-center">{speed}</span>
            <Button 
              onClick={() => setSpeed(Math.min(300, speed + 20))}
              variant="outline"
              size="sm"
              disabled={speed >= 300}
            >
              🚀 Faster
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-fd-muted-foreground font-mono border-l-2 border-fd-border pl-3">
        Current settings: speed={speed}, direction={direction === 1 ? 'right-to-left' : 'left-to-right'}, play={play.toString()}
      </div>
    </div>
  );
}

