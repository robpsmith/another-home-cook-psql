import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/recipes/[id] - Admin: Update a recipe
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const {
      title,
      slug,
      description,
      prep_time_min,
      cook_time_min,
      servings,
      image_url,
      blog_content,
      blog_images,
      ingredients,
      instructions,
    } = body

    const recipe = await prisma.recipe.update({
      where: { recipe_id: parseInt(id) },
      data: {
        title,
        slug,
        description,
        prep_time_min: prep_time_min ? parseInt(prep_time_min) : null,
        cook_time_min: cook_time_min ? parseInt(cook_time_min) : null,
        servings,
        image_url,
        blog_content: blog_content || null,
        blog_images: blog_images || [],
        ingredients: ingredients || [],
        instructions: instructions || [],
      },
    })

    return NextResponse.json(recipe)
  } catch (error: any) {
    console.error('Error updating recipe:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A recipe with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/recipes/[id] - Admin: Delete a recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.recipe.delete({
      where: { recipe_id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting recipe:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}

