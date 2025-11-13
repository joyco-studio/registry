import { PokemonCard } from '@/registry/joyco/blocks/complex-component/components/pokemon-card';
import { ExampleForm } from '@/registry/joyco/blocks/example-form/example-form';
import { HelloWorld } from '@/registry/joyco/blocks/hello-world/hello-world';

import * as React from 'react';
import InfiniteScrollDemo from './demos/infinite-scroll';

// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <h1>Joyco Registry</h1>
      <HelloWorld />
      <ExampleForm />
      <PokemonCard name="pikachu" />
      <InfiniteScrollDemo />
    </div>
  );
}
