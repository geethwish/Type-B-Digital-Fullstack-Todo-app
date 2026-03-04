import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<EmptyState title="Nothing here" description="Add something to get started." />);
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument();
  });

  it('does not render a description when omitted', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.queryByText(/add something/i)).not.toBeInTheDocument();
  });

  it('renders the default icon (📝) when no icon is provided', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByRole('img', { name: /empty/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /empty/i }).textContent).toBe('📝');
  });

  it('renders a custom icon when provided', () => {
    render(<EmptyState title="Nothing here" icon="🏆" />);
    expect(screen.getByRole('img', { name: /empty/i }).textContent).toBe('🏆');
  });
});

