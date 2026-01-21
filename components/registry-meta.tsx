'use client'

import * as React from 'react'

export type RegistryCounts = {
  components: number
  toolbox: number
  logs: number
}

type RegistryMetaContextValue = {
  counts: RegistryCounts
}

const RegistryMetaContext =
  React.createContext<RegistryMetaContextValue | null>(null)

export function RegistryMetaProvider({
  counts,
  children,
}: React.PropsWithChildren<RegistryMetaContextValue>) {
  return (
    <RegistryMetaContext.Provider value={{ counts }}>
      {children}
    </RegistryMetaContext.Provider>
  )
}

export function useRegistryMeta() {
  const ctx = React.useContext(RegistryMetaContext)
  return (
    ctx ?? {
      counts: {
        components: 0,
        toolbox: 0,
        logs: 0,
      },
    }
  )
}
