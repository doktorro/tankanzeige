import { expect, mock, test } from 'claude-code/testing'

import { bar, refill } from '../hooks/register'

test('bar fills with the share left', async () => {
  expect(bar(100)).toBe('█'.repeat(20))
  expect(bar(0)).toBe('░'.repeat(20))
  expect(bar(50)).toBe('█'.repeat(10) + '░'.repeat(10))
})

test('refill names the span until reset', async () => {
  const now = Date.parse('2026-10-10T10:00:00Z')
  expect(refill('2026-10-10T12:30:00Z', now)).toMatch(/2 h 30 min/)
  expect(refill(undefined, now)).toBe('')
})

test('band shows both windows, red at 20 % left', async ($, on) => {
  mock.clock(on, { now: Date.parse('2099-01-01T10:00:00Z') })
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: {} as never,
    changed: ['rateLimits'],
    rateLimits: [
    { kind: 'five_hour', percentUsed: 85, resetsAt: '2099-01-01T12:00:00Z' },
    { kind: 'seven_day', percentUsed: 30, resetsAt: '2099-01-03T12:00:00Z' },
  ] })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'tankanzeige', surface, component: 'AbovePrompt', props: {} as never })
    expect(await ui.find({ type: 'Text', text: /15 % frei/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /70 % frei/ })).toBeDefined()
    await ui.unmount()
  }
})
