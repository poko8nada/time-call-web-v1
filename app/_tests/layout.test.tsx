import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

describe('layout components', () => {
  it('renders Header with title and nav', () => {
    render(<Header />)

    expect(screen.getByText(/Time Call/i)).toBeDefined()
    expect(
      screen.getByRole('navigation', { name: /main navigation/i }),
    ).toBeDefined()
  })

  it('renders Footer with copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/©/)).toBeDefined()
    expect(screen.getByText(/Time Call/)).toBeDefined()
  })
})
