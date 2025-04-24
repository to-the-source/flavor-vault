import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { useRecipes } from './useRecipes';

// Mock fetch
global.fetch = jest.fn();

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'QueryClientWrapper';

  return Wrapper;
};

describe('useRecipes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with default values', async () => {
    // arrange
    const mockResponse = {
      recipes: [],
      page: 1,
      pageSize: 10,
      total: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // act
    const { result } = renderHook(() => useRecipes(), {
      wrapper: createWrapper(),
    });

    // assert
    expect(result.current.pagination.page).toBe(1);
    expect(result.current.pagination.pageSize).toBe(10);
    expect(result.current.filters.search).toBe('');
  });

  it('should initialize with custom values', async () => {
    // arrange
    const mockResponse = {
      recipes: [],
      page: 2,
      pageSize: 20,
      total: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // act
    const { result } = renderHook(() => useRecipes({ initialPage: 2, initialPageSize: 20 }), {
      wrapper: createWrapper(),
    });

    // assert
    expect(result.current.pagination.page).toBe(2);
    expect(result.current.pagination.pageSize).toBe(20);
  });

  it('should reset page to 1 when search query changes', async () => {
    // arrange
    const mockResponse = {
      recipes: [],
      page: 1,
      pageSize: 10,
      total: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // act
    const { result } = renderHook(() => useRecipes(), {
      wrapper: createWrapper(),
    });

    // Set page to 2
    act(() => {
      result.current.pagination.setPage(2);
    });
    expect(result.current.pagination.page).toBe(2);

    // Change search - should reset page to 1
    act(() => {
      result.current.searchRecipes('test');
    });

    // assert
    expect(result.current.pagination.page).toBe(1);
    expect(result.current.filters.search).toBe('test');
  });

  it('should reset page to 1 when tags change', async () => {
    // arrange
    const mockResponse = {
      recipes: [],
      page: 1,
      pageSize: 10,
      total: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // act
    const { result } = renderHook(() => useRecipes(), {
      wrapper: createWrapper(),
    });

    // Set page to 2
    act(() => {
      result.current.pagination.setPage(2);
    });
    expect(result.current.pagination.page).toBe(2);

    // Change tags - should reset page to 1
    act(() => {
      result.current.filters.setTags(['vegetarian']);
    });

    // assert
    expect(result.current.pagination.page).toBe(1);
  });

  it('should reset page to 1 when page size changes', async () => {
    // arrange
    const mockResponse = {
      recipes: [],
      page: 1,
      pageSize: 10,
      total: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // act
    const { result } = renderHook(() => useRecipes(), {
      wrapper: createWrapper(),
    });

    // Set page to 2
    act(() => {
      result.current.pagination.setPage(2);
    });
    expect(result.current.pagination.page).toBe(2);

    // Change page size - should reset page to 1
    act(() => {
      result.current.pagination.setPageSize(20);
    });

    // assert
    expect(result.current.pagination.page).toBe(1);
    expect(result.current.pagination.pageSize).toBe(20);
  });
});
