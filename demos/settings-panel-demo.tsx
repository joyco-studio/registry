'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Bell, Lock, User, Palette, Globe, CreditCard } from 'lucide-react'

type NotificationPreference = 'all' | 'important' | 'none'

export function SettingsPanelDemo() {
  const [notifications, setNotifications] =
    React.useState<NotificationPreference>('all')
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(
    'system'
  )
  const [language, setLanguage] = React.useState('en')

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
      {/* Profile Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Profile Settings
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Manage your account information
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Display Name
            </span>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              John Doe
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Email
            </span>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              john@example.com
            </span>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Notifications
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Configure how you receive updates
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {(['all', 'important', 'none'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setNotifications(option)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                notifications === option
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Security
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Protect your account
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Two-Factor Authentication
            </span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Last Password Change
            </span>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              30 days ago
            </span>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Appearance
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Customize the look and feel
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTheme(option)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                theme === option
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Language Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Language & Region
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Set your preferred language
            </p>
          </div>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {/* Billing Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Billing
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Manage your subscription
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Current Plan
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Pro
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Next Billing Date
            </span>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Jan 15, 2026
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

export default SettingsPanelDemo
