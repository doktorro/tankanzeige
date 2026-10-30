import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Window } from '../types'

const windows = atom({ plugin: 'tankanzeige', key: 'windows' } as const, [] as Window[])

const LABELS: Record<string, string> = { five_hour: '5 h', seven_day: '7 Tage' }
const WIDTH = 20

export function bar(percentLeft: number): string {
  const full = Math.round((Math.max(0, Math.min(100, percentLeft)) / 100) * WIDTH)
  return '█'.repeat(full) + '░'.repeat(WIDTH - full)
}

export function refill(resetsAt: string | undefined, now: number): string {
  if (!resetsAt) return ''
  const at = Date.parse(resetsAt)
  if (Number.isNaN(at)) return ''
  const minutes = Math.max(0, Math.round((at - now) / 60000))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const span = h >= 24 ? `${Math.floor(h / 24)} d ${h % 24} h` : h > 0 ? `${h} h ${m} min` : `${m} min`
  let clock = ''
  try {
    clock = new Date(at).toLocaleString('de-DE', {
      timeZone: 'Europe/Berlin',
      weekday: h >= 24 ? 'short' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    clock = ''
  }
  return clock ? `voll um ${clock} (in ${span})` : `voll in ${span}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const usage = await $.session.usage()
    await update($, windows, () => usage.rateLimits)
    return result
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      await update($, windows, () => e.rateLimits)
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = (await read($, windows)).filter(w => w.kind in LABELS)
    if (e.props.hasSurvey || list.length === 0) return next(e)

    const now = await $.clock.now()
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        {list.map(w => {
          const left = Math.max(0, 100 - w.percentUsed)
          const color = left <= 20 ? 'error' : left <= 50 ? 'warning' : 'success'
          return (
            <Box key={w.kind}>
              <Text>⛽ Tank {LABELS[w.kind]} </Text>
              <Text color={color}>{bar(left)}</Text>
              <Text color={color} bold>
                {' '}
                {Math.round(left)} % frei
              </Text>
              <Text dimColor> · {refill(w.resetsAt, now)}</Text>
            </Box>
          )
        })}
      </Box>
    )
  })
}
