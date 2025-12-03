'use client'
import { Marquee } from '@/registry/joyco/blocks/marquee'
import { Card } from '@/components/ui/card'
import { IBMLogo, NasaLogo, SpaceXLogo, ValveLogo } from '@/components/logos'

const LOGOS = [IBMLogo, NasaLogo, SpaceXLogo, ValveLogo]
const ITEMS = [...LOGOS, ...LOGOS].map((Logo, i) => ({ Logo, id: i }))

export function MarqueeDemo() {
  return (
    <div className="not-prose max-w-full">
      <Card className="bg-card overflow-hidden rounded-none">
        <div className="py-6">
          <Marquee speed={100} speedFactor={0.5} direction={1} play>
            {ITEMS.map(({ Logo, id }) => (
              <Logo key={id} className="h-8 w-auto" />
            ))}
          </Marquee>
        </div>
      </Card>
    </div>
  )
}

export default MarqueeDemo
