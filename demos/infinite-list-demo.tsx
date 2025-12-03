'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  MaskedList,
  useInfiniteList,
} from '@/registry/joyco/blocks/infinite-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

type Pokemon = { name: string; url: string; image: string }

async function fetchPokemon(offset: number, limit: number): Promise<Pokemon[]> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  ).then((r) => r.json())
  return Promise.all(
    res.results.map(async (p: { url: string }) => {
      const data = await fetch(p.url).then((r) => r.json())
      return { name: data.name, url: p.url, image: data.sprites.front_default }
    })
  )
}

export function PokemonInfiniteList() {
  const pageSize = 12
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [isPending, startTransition] = useTransition()
  const list = useInfiniteList({ pageSize, initialItems: pokemon })

  useEffect(() => {
    startTransition(async () => setPokemon(await fetchPokemon(0, pageSize * 2)))
  }, [pageSize])

  const loadMore = () => {
    list.nextPage()
    startTransition(async () => {
      const newPokemon = await fetchPokemon(list.offset, pageSize)
      setPokemon((prev) => [...prev, ...newPokemon])
    })
  }

  return (
    <div className="not-prose h-[500px] w-full p-10">
      <div className="bg-card/90 fixed top-10 right-10 z-10 rounded-md border px-3 py-2 font-mono text-xs uppercase backdrop-blur-md">
        Displayed: {list.displayLimit} | Loaded: {list.offset}
      </div>
      <h4 className="mb-4 text-2xl font-semibold">Pokémons</h4>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MaskedList {...list}>
          {pokemon.map((p) => (
            <Card key={p.url} className="overflow-hidden">
              <Image
                src={p.image}
                alt={p.name}
                width={500}
                height={500}
                className="w-full object-cover [image-rendering:pixelated]"
              />
              <CardContent className="p-3">
                <h3 className="font-semibold capitalize">{p.name}</h3>
              </CardContent>
            </Card>
          ))}
        </MaskedList>
      </div>
      <div className="flex justify-center py-4">
        <Button
          onClick={loadMore}
          disabled={isPending}
          variant="outline"
          size="lg"
        >
          {isPending ? 'Loading...' : 'Load More'}
        </Button>
      </div>
    </div>
  )
}

export default PokemonInfiniteList
