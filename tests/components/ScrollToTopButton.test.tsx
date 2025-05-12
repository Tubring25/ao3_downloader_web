import { fireEvent, render, screen } from '@testing-library/react';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the window.scrollTo function
const scrollToMock = vi.fn();
Object.defineProperty(window, 'scrollTo', { value: scrollToMock, writable: true })

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    scrollToMock.mockClear()

    // Mock the window.scrollY property
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 500, writable: true })

    render(<ScrollToTopButton />)
  })

  it('should not render the button when not scrolled', () => {
    const button = screen.getByLabelText('Scroll to top')
    expect(button).toHaveClass('opacity-0')
  })

  it('should render the button when scrolled past the half page', () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true })

    fireEvent.scroll(window)

    const button = screen.getByLabelText('Scroll to top')
    expect(button).toHaveClass('opacity-100')
  })

  it('should scroll to the top when the button is clicked', () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 500, writable: true })

    fireEvent.scroll(window)

    const button = screen.getByLabelText('Scroll to top')
    fireEvent.click(button)

    expect(scrollToMock).toHaveBeenCalledTimes(1)
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })

  it('should hide the button when scrolled to the top', () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 500, writable: true })

    fireEvent.scroll(window)

    const button = screen.getByLabelText('Scroll to top')
    expect(button).toHaveClass('opacity-100')

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    fireEvent.scroll(window)

    expect(button).toHaveClass('opacity-0')
  })
})