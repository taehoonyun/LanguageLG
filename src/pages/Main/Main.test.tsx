import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Main from './index';

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null
  })
}));

describe('Main Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockFetch.mockReset();
  });

  it('renders all location inputs', () => {
    // Mock the initial character names fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: ['Luna', 'Alex', 'Emma'] })
    });

    render(<Main />);
    
    expect(screen.getByLabelText('cafe')).toBeInTheDocument();
    expect(screen.getByLabelText('gym')).toBeInTheDocument();
    expect(screen.getByLabelText('restaurant')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    // Mock the initial character names fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: ['Luna', 'Alex', 'Emma'] })
    });

    render(<Main />);
    
    const cafeInput = screen.getByLabelText('cafe') as HTMLInputElement;
    fireEvent.change(cafeInput, { target: { value: 'Test input' } });
    
    expect(cafeInput.value).toBe('Test input');
  });

  it('fetches and displays AI response', async () => {
    // Mock the initial character names fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: ['Luna', 'Alex', 'Emma'] })
    });

    // Mock the AI response fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: true,
        data: {
          Response: 'This is a mock response',
          Error: null
        }
      })
    });

    render(<Main />);
    
    const cafeInput = screen.getByLabelText('cafe') as HTMLInputElement;
    fireEvent.change(cafeInput, { target: { value: 'Test message' } });
    
    const sendButton = screen.getAllByText('Send')[0];
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('This is a mock response')).toBeInTheDocument();
    });
  });

  it('loads character names on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: ['Luna', 'Alex', 'Emma'] })
    });

    render(<Main />);
    
    await waitFor(() => {
      expect(screen.getByText('Luna')).toBeInTheDocument();
    });
  });
}); 