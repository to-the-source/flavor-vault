import { NextRequest, NextResponse } from 'next/server';
import { getRecipesServer, createRecipe } from '@/features/recipes/service';

interface RecipeCreateBody {
  name: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients?: string[];
  tags?: string[];
}
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

    // Use server-side function directly (not HTTP fetch)
    const { data, total } = await getRecipesServer(page, pageSize, search, tags);

    return NextResponse.json({
      data,
      page,
      pageSize,
      total,
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecipeCreateBody;

    // validate required fields
    if (!body.name || !body.instructions) {
      return NextResponse.json({ error: 'Title/Name and instructions are required' }, { status: 400 });
    }

    // create the recipe
    const newRecipe = await createRecipe({
      name: body.name,
      instructions: body.instructions,
      prepTimeMinutes: body.prepTimeMinutes || 0,
      cookTimeMinutes: body.cookTimeMinutes || 0,
      servings: body.servings || 1,
      ingredients: body.ingredients || [],
      tags: body.tags || [],
    });

    return NextResponse.json(newRecipe, { status: 201 }); // Return the full recipe
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}