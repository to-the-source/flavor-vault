import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { Recipe, RecipesResponse } from '@/features/recipes/types';
import useDebounce from '@/hooks/useDebounce';
import { createRecipe as createRecipeAPI } from '@/features/recipes/service'; 

interface UseRecipesParams {
  initialPage?: number;
  initialPageSize?: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

interface FilterState {
  search: string;
  tags: string[];
  setSearch: (query: string) => void;
  setTags: (tags: string[]) => void;
}

interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: Error | null;
  pagination: PaginationState;
  filters: FilterState;
  searchRecipes: (query?: string, tags?: string[]) => void;
  createRecipe: (recipeData: Omit<Recipe, 'id'>) => Promise<Recipe>; // Added this
  isCreating: boolean; // Added this
}

const fetchRecipes = async ({
  page,
  pageSize,
  search,
  tags,
}: {
  page: number;
  pageSize: number;
  search?: string;
  tags?: string[];
}): Promise<RecipesResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  if (search) {
    params.append('search', search);
  }

  if (tags && tags.length > 0) {
    params.append('tags', tags.join(','));
  }

  const response = await fetch(`/api/recipes?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.status}`);
  }

  return response.json();
};

export function useRecipes({
  initialPage = 1,
  initialPageSize = 10,
}: UseRecipesParams = {}): UseRecipesReturn {
  const queryClient = useQueryClient(); // Added this
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [search, setSearch] = useState<string>('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const debouncedSearch = useDebounce(search, 300);

  const queryKey = ['recipes', page, pageSize, debouncedSearch, currentTags];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      fetchRecipes({
        page,
        pageSize,
        search: debouncedSearch,
        tags: currentTags.length > 0 ? currentTags : undefined,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // CreateRecipe mutation
  const { mutateAsync: createRecipeMutation, isPending: isCreating } = useMutation({
    mutationFn: createRecipeAPI,
    onSuccess: () => {
      // Invalidate queries refetch recipes after creation
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
  };

  const handleSetPageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSetTags = (tags: string[]) => {
    setCurrentTags(tags);
    setPage(1);
  };

  const searchRecipes = (query?: string, tags?: string[]) => {
    if (query !== undefined) {
      setSearch(query);
    }

    if (tags !== undefined) {
      setCurrentTags(tags);
    }

    if (
      (query !== undefined && query !== search) ||
      (tags !== undefined && JSON.stringify(tags) !== JSON.stringify(currentTags))
    ) {
      setPage(1);
    }
  };

  return {
    recipes: data?.data || [],
    loading: isLoading,
    error: error instanceof Error ? error : null,
    searchRecipes,
    createRecipe: createRecipeMutation,
    isCreating,
    pagination: {
      page,
      pageSize,
      totalItems: data?.total || 0,
      setPage: handleSetPage,
      setPageSize: handleSetPageSize,
    },
    filters: {
      search,
      tags: currentTags,
      setSearch,
      setTags: handleSetTags,
    },
  };
}