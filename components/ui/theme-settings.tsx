'use client'

import * as React from 'react'
import { MoonIcon, SunIcon, MonitorIcon, PaletteIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type ThemeMode = 'light' | 'dark' | 'system'
type AccentColor = 'blue' | 'purple' | 'green' | 'orange'

/* -------------------------------------------------------------------------------------------------
 * ThemeSettings
 * -------------------------------------------------------------------------------------------------*/

type ThemeSettingsProps = React.ComponentProps<'div'> & {
  defaultMode?: ThemeMode
  defaultAccent?: AccentColor
  onModeChange?: (mode: ThemeMode) => void
  onAccentChange?: (accent: AccentColor) => void
}

export function ThemeSettings({
  className,
  defaultMode = 'system',
  defaultAccent = 'blue',
  onModeChange,
  onAccentChange,
  ...props
}: ThemeSettingsProps) {
  const [mode, setMode] = React.useState<ThemeMode>(defaultMode)
  const [accent, setAccent] = React.useState<AccentColor>(defaultAccent)
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode)
    onModeChange?.(newMode)
  }

  const handleAccentChange = (newAccent: AccentColor) => {
    setAccent(newAccent)
    onAccentChange?.(newAccent)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={cn(
        'bg-card border-border rounded-lg border p-4',
        className
      )}
      {...props}
    >
      <ThemeSettingsHeader
        mode={mode}
        accent={accent}
        isExpanded={isExpanded}
        onToggleExpanded={toggleExpanded}
      />
      {isExpanded && (
        <ThemeSettingsContent
          mode={mode}
          accent={accent}
          onModeChange={handleModeChange}
          onAccentChange={handleAccentChange}
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeSettingsHeader
 * -------------------------------------------------------------------------------------------------*/

type ThemeSettingsHeaderProps = {
  mode: ThemeMode
  accent: AccentColor
  isExpanded: boolean
  onToggleExpanded: () => void
}

function ThemeSettingsHeader({
  mode,
  accent,
  isExpanded,
  onToggleExpanded,
}: ThemeSettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <ThemeSettingsTitle mode={mode} accent={accent} />
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleExpanded}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Collapse' : 'Expand'}
      </Button>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeSettingsTitle
 * -------------------------------------------------------------------------------------------------*/

type ThemeSettingsTitleProps = {
  mode: ThemeMode
  accent: AccentColor
}

function ThemeSettingsTitle({ mode, accent }: ThemeSettingsTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <PaletteIcon className="text-muted-foreground size-5" />
      <div>
        <h3 className="text-sm font-medium">Theme Settings</h3>
        <ThemeSettingsSubtitle mode={mode} accent={accent} />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeSettingsSubtitle
 * -------------------------------------------------------------------------------------------------*/

type ThemeSettingsSubtitleProps = {
  mode: ThemeMode
  accent: AccentColor
}

function ThemeSettingsSubtitle({ mode, accent }: ThemeSettingsSubtitleProps) {
  return (
    <p className="text-muted-foreground text-xs">
      {mode.charAt(0).toUpperCase() + mode.slice(1)} mode · {accent.charAt(0).toUpperCase() + accent.slice(1)} accent
    </p>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeSettingsContent
 * -------------------------------------------------------------------------------------------------*/

type ThemeSettingsContentProps = {
  mode: ThemeMode
  accent: AccentColor
  onModeChange: (mode: ThemeMode) => void
  onAccentChange: (accent: AccentColor) => void
}

function ThemeSettingsContent({
  mode,
  accent,
  onModeChange,
  onAccentChange,
}: ThemeSettingsContentProps) {
  return (
    <div className="mt-4 space-y-4">
      <ThemeModeSelector mode={mode} onModeChange={onModeChange} />
      <ThemeAccentSelector accent={accent} onAccentChange={onAccentChange} />
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeModeSelector
 * -------------------------------------------------------------------------------------------------*/

type ThemeModeSelectorProps = {
  mode: ThemeMode
  onModeChange: (mode: ThemeMode) => void
}

function ThemeModeSelector({ mode, onModeChange }: ThemeModeSelectorProps) {
  const modes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <SunIcon className="size-4" /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon className="size-4" /> },
    { value: 'system', label: 'System', icon: <MonitorIcon className="size-4" /> },
  ]

  return (
    <div>
      <label className="text-muted-foreground mb-2 block text-xs font-medium">
        Mode
      </label>
      <div className="flex gap-2">
        {modes.map((m) => (
          <ThemeModeButton
            key={m.value}
            value={m.value}
            label={m.label}
            icon={m.icon}
            isSelected={mode === m.value}
            onSelect={onModeChange}
          />
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeModeButton
 * -------------------------------------------------------------------------------------------------*/

type ThemeModeButtonProps = {
  value: ThemeMode
  label: string
  icon: React.ReactNode
  isSelected: boolean
  onSelect: (mode: ThemeMode) => void
}

function ThemeModeButton({
  value,
  label,
  icon,
  isSelected,
  onSelect,
}: ThemeModeButtonProps) {
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      size="sm"
      onClick={() => onSelect(value)}
      className="flex items-center gap-1.5"
    >
      {icon}
      {label}
    </Button>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeAccentSelector
 * -------------------------------------------------------------------------------------------------*/

type ThemeAccentSelectorProps = {
  accent: AccentColor
  onAccentChange: (accent: AccentColor) => void
}

function ThemeAccentSelector({ accent, onAccentChange }: ThemeAccentSelectorProps) {
  const accents: { value: AccentColor; color: string }[] = [
    { value: 'blue', color: 'bg-blue-500' },
    { value: 'purple', color: 'bg-purple-500' },
    { value: 'green', color: 'bg-green-500' },
    { value: 'orange', color: 'bg-orange-500' },
  ]

  return (
    <div>
      <label className="text-muted-foreground mb-2 block text-xs font-medium">
        Accent Color
      </label>
      <div className="flex gap-2">
        {accents.map((a) => (
          <ThemeAccentButton
            key={a.value}
            value={a.value}
            color={a.color}
            isSelected={accent === a.value}
            onSelect={onAccentChange}
          />
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ThemeAccentButton
 * -------------------------------------------------------------------------------------------------*/

type ThemeAccentButtonProps = {
  value: AccentColor
  color: string
  isSelected: boolean
  onSelect: (accent: AccentColor) => void
}

function ThemeAccentButton({
  value,
  color,
  isSelected,
  onSelect,
}: ThemeAccentButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'size-8 rounded-full transition-transform',
        color,
        isSelected && 'ring-ring ring-2 ring-offset-2 scale-110'
      )}
      aria-label={`Select ${value} accent color`}
      aria-pressed={isSelected}
    />
  )
}
