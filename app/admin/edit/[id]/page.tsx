'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [id, setId] = useState<string | null>(null)
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    prep_time_min: '',
    cook_time_min: '',
    servings: '',
    image_url: '',
    ingredients: [] as string[],
    instructions: [] as string[],
  })
  const [ingredientInput, setIngredientInput] = useState('')
  const [instructionInput, setInstructionInput] = useState('')

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn && id) {
      fetchRecipe()
    }
  }, [isSignedIn, id])

  const fetchRecipe = async () => {
    try {
      const res = await fetch('/api/recipes')
      if (res.ok) {
        const recipes = await res.json()
        const recipe = recipes.find(
          (r: any) => r.recipe_id === parseInt(id!)
        )
        if (recipe) {
          setFormData({
            title: recipe.title || '',
            slug: recipe.slug || '',
            description: recipe.description || '',
            prep_time_min: recipe.prep_time_min?.toString() || '',
            cook_time_min: recipe.cook_time_min?.toString() || '',
            servings: recipe.servings || '',
            image_url: recipe.image_url || '',
            ingredients: Array.isArray(recipe.ingredients)
              ? recipe.ingredients
              : [],
            instructions: Array.isArray(recipe.instructions)
              ? recipe.instructions
              : [],
          })
        }
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoadingData(false)
    }
  }

  if (!isLoaded || !isSignedIn || !id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, ingredientInput.trim()],
      })
      setIngredientInput('')
    }
  }

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    })
  }

  const addInstruction = () => {
    if (instructionInput.trim()) {
      setFormData({
        ...formData,
        instructions: [...formData.instructions, instructionInput.trim()],
      })
      setInstructionInput('')
    }
  }

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (res.ok) {
        const data = await res.json()
        setFormData((prev) => ({ ...prev, image_url: data.url }))
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update recipe')
      }
    } catch (error) {
      console.error('Error updating recipe:', error)
      alert('Failed to update recipe')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="container mx-auto px-4 py-8">
          <p>Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Edit Recipe</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prep_time_min">Prep Time (min)</Label>
                  <Input
                    id="prep_time_min"
                    type="number"
                    value={formData.prep_time_min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prep_time_min: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="cook_time_min">Cook Time (min)</Label>
                  <Input
                    id="cook_time_min"
                    type="number"
                    value={formData.cook_time_min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cook_time_min: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({ ...formData, servings: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addIngredient()
                    }
                  }}
                  placeholder="Add ingredient (e.g., 2 cups flour)"
                />
                <Button type="button" onClick={addIngredient}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <span>{ingredient}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={instructionInput}
                  onChange={(e) => setInstructionInput(e.target.value)}
                  placeholder="Add instruction step"
                  rows={2}
                />
                <Button type="button" onClick={addInstruction}>
                  Add
                </Button>
              </div>
              <ol className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between p-2 bg-gray-100 rounded"
                  >
                    <span>
                      <span className="font-semibold mr-2">{index + 1}.</span>
                      {instruction}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Recipe'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

