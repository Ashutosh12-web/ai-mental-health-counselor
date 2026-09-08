import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

// Mock navigate
const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('LandingPage Component', () => {
  it('renders without crashing and displays the main heading', () => {
    render(
      <BrowserRouter>
        <LandingPage userName="" setUserName={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Welcome to Haven/i)).toBeInTheDocument();
  });

  it('allows user to input their name', () => {
    const setUserNameMock = vi.fn();
    render(
      <BrowserRouter>
        <LandingPage userName="" setUserName={setUserNameMock} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Your preferred name/i);
    fireEvent.change(input, { target: { value: 'Ashutosh' } });
    
    expect(input.value).toBe('Ashutosh');
  });

  it('contains both sticky notes', () => {
    render(
      <BrowserRouter>
        <LandingPage userName="" setUserName={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Inside the App: AI & Architecture/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Advanced AI Capabilities/i)[0]).toBeInTheDocument();
  });
});
