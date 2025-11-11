'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Trash2, Edit, Plus, ChefHat } from 'lucide-react'
import Image from 'next/image'

interface Recipe {
  recipe_id: number
  title: string
  slug: string
  description: string | null
  image_url: string | null
}

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn) {
      fetchRecipes()
    }
  }, [isSignedIn])

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes')
      if (res.ok) {
        const data = await res.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/recipes/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setRecipes(recipes.filter((r) => r.recipe_id !== id))
      } else {
        alert('Failed to delete recipe')
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe')
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">Manage your recipes and create new culinary masterpieces</p>
        </div>
        <Link href="/admin/new">
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <Plus className="h-5 w-5" />
            New Recipe
          </Button>
        </Link>
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading recipes...</p>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <ChefHat className="h-10 w-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No recipes yet</h3>
            <p className="text-neutral-500 mb-6">Create your first recipe to get started!</p>
            <Link href="/admin/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Recipe
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.recipe_id} className="border-neutral-200 hover:shadow-lg transition-shadow overflow-hidden">
              {recipe.image_url && (
                <div className="relative w-full h-48 bg-neutral-100">
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                {recipe.description && (
                  <p className="text-sm text-neutral-600 line-clamp-2 mt-2">{recipe.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/admin/edit/${recipe.recipe_id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleDelete(recipe.recipe_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  )
}

