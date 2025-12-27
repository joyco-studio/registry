const JOYCO_WORKER_SECRET = process.env.JOYCO_WORKER_SECRET || ''

export async function trackDownload(componentName: string) {
  if (!JOYCO_WORKER_SECRET) {
    console.error(`[Registry Download] No worker secret found`)
    return
  }

  try {
    const response = await fetch(
      'https://workers.joyco.studio/registry/downloads',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JOYCO_WORKER_SECRET}`,
        },
        body: JSON.stringify({ component: componentName }),
      }
    )

    if (response.ok) {
      console.info(
        `[Registry Download] Tracked download for ${componentName}`,
        await response.text()
      )
    } else {
      console.error(
        `[Registry Download] Failed to track for ${componentName}:`,
        await response.text()
      )
    }

    return response.ok
  } catch (error: any) {
    console.error(
      `[Registry Download] Failed to track for ${componentName}:`,
      error.message
    )
    return
  }
}
