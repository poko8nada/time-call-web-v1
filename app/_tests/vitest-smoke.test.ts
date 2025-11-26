import { describe, expect, it } from 'vitest'

describe('vitest smoke', () => {
  it('runs in jsdom and jest-dom matchers are available', () => {
    // create a minimal DOM node and assert using jest-dom matcher
    document.body.innerHTML = `<div data-testid="root">hello vitest</div>`
    const el = document.querySelector('[data-testid="root"]')

    if (!el) throw new Error('root element not found')

    expect(el).not.toBeNull()
    expect(el.textContent).toBe('hello vitest')
  })
})
