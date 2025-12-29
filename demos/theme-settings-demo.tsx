'use client'

import { ThemeSettings } from '@/components/ui/theme-settings'

export function ThemeSettingsDemo() {
  return (
    <div className="flex min-h-[300px] items-center justify-center p-8">
      <ThemeSettings
        defaultMode="system"
        defaultAccent="blue"
        onModeChange={(mode) => console.log('Mode changed:', mode)}
        onAccentChange={(accent) => console.log('Accent changed:', accent)}
      />
    </div>
  )
}
