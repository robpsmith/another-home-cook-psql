import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/recipes - Public: Get all recipes
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        published_date: 'desc',
      },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Admin: Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      description,
      prep_time_min,
      cook_time_min,
      servings,
      image_url,
      ingredients,
      instructions,
    } = body

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        slug,
        description,
        prep_time_min: prep_time_min ? parseInt(prep_time_min) : null,
        cook_time_min: cook_time_min ? parseInt(cook_time_min) : null,
        servings,
        image_url,
        ingredients: ingredients || [],
        instructions: instructions || [],
        published_date: new Date(),
      },
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error: any) {
    console.error('Error creating recipe:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A recipe with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}

