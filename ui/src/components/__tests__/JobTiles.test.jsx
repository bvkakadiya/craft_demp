import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import JobTiles from './JobTiles';

// Mock the child components
vi.mock('./JobPostingForm', () => ({
  __esModule: true,
  default: () => <div>JobPostingForm Mock</div>,
}));

vi.mock('./PlaceBidModal', () => ({
  __esModule: true,
  default: ({ visible, onCancel, jobId, onBidPlaced }) => (
    visible ? <div>PlaceBidModal Mock</div> : null
  ),
}));

// Mock the fetch API
global.fetch = vi.fn();

describe('JobTiles', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders loading state initially', () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    });

    render(<JobTiles />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders recent and active jobs after fetching', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 1, description: 'Recent Job' }]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 2, description: 'Active Job' }]),
      });

    render(<JobTiles />);

    await waitFor(() => {
      expect(screen.getByText('Recent Job')).toBeInTheDocument();
      expect(screen.getByText('Active Job')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<JobTiles />);

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  it('opens and closes the bid modal', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 1, description: 'Recent Job' }]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 2, description: 'Active Job' }]),
      });

    render(<JobTiles />);

    await waitFor(() => {
      expect(screen.getByText('Recent Job')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Place Bid')[0]);
    expect(screen.getByText('PlaceBidModal Mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('PlaceBidModal Mock'));
    expect(screen.queryByText('PlaceBidModal Mock')).not.toBeInTheDocument();
  });

  it('opens and closes the job posting modal', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 1, description: 'Recent Job' }]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 2, description: 'Active Job' }]),
      });

    render(<JobTiles />);

    await waitFor(() => {
      expect(screen.getByText('Recent Job')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Post a New Job'));
    expect(screen.getByText('JobPostingForm Mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('JobPostingForm Mock'));
    expect(screen.queryByText('JobPostingForm Mock')).not.toBeInTheDocument();
  });
});