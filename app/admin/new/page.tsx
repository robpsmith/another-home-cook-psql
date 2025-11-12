'use client'

import { useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react'
import { IngredientInput } from '@/components/IngredientInput'
import type { Ingredient } from '@/lib/types'

export default function NewRecipePage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    prep_time_min: '',
    cook_time_min: '',
    servings: '',
    image_url: '',
    blog_content: '',
    blog_images: [] as Array<{ url: string; alt: string; caption: string }>,
    ingredients: [] as Ingredient[],
    instructions: [] as string[],
  })
  const [instructionInput, setInstructionInput] = useState('')
  const [blogImageInput, setBlogImageInput] = useState({ alt: '', caption: '' })
  const blogContentTextareaRef = useRef<HTMLTextAreaElement>(null)

  if (!isLoaded || !isSignedIn) {
    router.push('/')
    return null
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({ ...formData, title })
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      setFormData({ ...formData, title, slug: generateSlug(title) })
    } else {
      setFormData({ ...formData, title })
    }
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

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        // Use alt text from input, or generate from filename, or use default
        const altText = blogImageInput.alt || file.name.replace(/\.[^/.]+$/, '') || 'Blog image'
        setFormData((prev) => ({
          ...prev,
          blog_images: [
            ...prev.blog_images,
            {
              url: data.url,
              alt: altText,
              caption: blogImageInput.caption || '',
            },
          ],
        }))
        // Clear the input but keep alt/caption for next upload if user wants
        // Reset file input
        e.target.value = ''
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

  const removeBlogImage = (index: number) => {
    // Reindex remaining image placeholders
    let updatedContent = formData.blog_content
    // Remove the placeholder for the deleted image
    updatedContent = updatedContent.replace(new RegExp(`\\{\\{image:${index}\\}\\}`, 'g'), '')
    // Update placeholders for images after the deleted one
    for (let i = formData.blog_images.length - 1; i > index; i--) {
      updatedContent = updatedContent.replace(
        new RegExp(`\\{\\{image:${i}\\}\\}`, 'g'),
        `{{image:${i - 1}}}`
      )
    }
    setFormData({
      ...formData,
      blog_images: formData.blog_images.filter((_, i) => i !== index),
      blog_content: updatedContent,
    })
  }

  const insertImagePlaceholder = (imageIndex: number) => {
    const textarea = blogContentTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.blog_content
    const placeholder = `\n\n{{image:${imageIndex}}}\n\n`
    
    const newText = text.substring(0, start) + placeholder + text.substring(end)
    setFormData({
      ...formData,
      blog_content: newText,
    })

    // Set cursor position after the inserted placeholder
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + placeholder.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create recipe')
      }
    } catch (error) {
      console.error('Error creating recipe:', error)
      alert('Failed to create recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout maxWidth="narrow" className="!py-0">
      {/* Back Button */}
      <div className="py-6">
        <Link href="/admin">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="pb-12">
        <h1 className="mb-2">Create New Recipe</h1>
        <p className="text-neutral-600 mb-8">Share your culinary creation with the world</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Basic Information</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">Give your recipe a name and description</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-neutral-700">Recipe Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  placeholder="e.g., Classic Chocolate Chip Cookies"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-neutral-700">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  placeholder="e.g., classic-chocolate-chip-cookies"
                  className="mt-1.5"
                />
                <p className="text-xs text-neutral-500 mt-1">This will be part of the recipe URL</p>
              </div>

              <div>
                <Label htmlFor="description" className="text-neutral-700">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="A brief description of your recipe..."
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prep_time_min" className="text-neutral-700">Prep Time (min)</Label>
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
                    placeholder="15"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="cook_time_min" className="text-neutral-700">Cook Time (min)</Label>
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
                    placeholder="30"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="servings" className="text-neutral-700">Servings</Label>
                  <Input
                    id="servings"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({ ...formData, servings: e.target.value })
                    }
                    placeholder="4"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-neutral-700">Recipe Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="mt-1.5"
                />
                {formData.image_url && (
                  <div className="mt-4">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-48 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
                {!formData.image_url && (
                  <div className="mt-4 border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-neutral-400 mb-2" />
                    <p className="text-sm text-neutral-500">Upload an image to showcase your recipe</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blog Content */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Blog Content</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">Add blog-style content that appears before the recipe card</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="blog_content" className="text-neutral-700">Blog Content</Label>
                <Textarea
                  ref={blogContentTextareaRef}
                  id="blog_content"
                  value={formData.blog_content}
                  onChange={(e) =>
                    setFormData({ ...formData, blog_content: e.target.value })
                  }
                  rows={8}
                  placeholder="Write your blog content here... You can add multiple paragraphs, tips, and stories about this recipe. Use {{image:0}} to insert images at specific positions."
                  className="mt-1.5"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Use line breaks to separate paragraphs. Click "Insert" next to uploaded images to place them in your content at the cursor position.
                </p>
              </div>

              {/* Blog Images */}
              <div>
                <Label className="text-neutral-700 mb-2 block">Additional Blog Images</Label>
                <div className="space-y-3 mb-4">
                  <div>
                    <Label htmlFor="blog_image_file" className="text-sm text-neutral-600 mb-2 block">Upload Image</Label>
                    <Input
                      id="blog_image_file"
                      type="file"
                      accept="image/*"
                      onChange={handleBlogImageUpload}
                      disabled={loading}
                      className="mt-1"
                    />
                    <p className="text-xs text-neutral-500 mt-1">Upload an image first, then add alt text and caption below</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="blog_image_alt" className="text-sm text-neutral-600">Alt Text (Optional)</Label>
                      <Input
                        id="blog_image_alt"
                        value={blogImageInput.alt}
                        onChange={(e) =>
                          setBlogImageInput({ ...blogImageInput, alt: e.target.value })
                        }
                        placeholder="Describe the image for accessibility"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog_image_caption" className="text-sm text-neutral-600">Caption (Optional)</Label>
                      <Input
                        id="blog_image_caption"
                        value={blogImageInput.caption}
                        onChange={(e) =>
                          setBlogImageInput({ ...blogImageInput, caption: e.target.value })
                        }
                        placeholder="Image caption"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {formData.blog_images.length > 0 ? (
                  <div className="space-y-3">
                    {formData.blog_images.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-24 h-24 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            Image {index + 1}: {image.alt}
                          </p>
                          {image.caption && (
                            <p className="text-sm text-neutral-600 mt-1">{image.caption}</p>
                          )}
                          <p className="text-xs text-neutral-500 mt-1">
                            Placeholder: <code className="bg-white px-1 py-0.5 rounded text-xs">{`{{image:${index}}}`}</code>
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertImagePlaceholder(index)}
                            className="text-xs"
                          >
                            Insert
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBlogImage(index)}
                            className="hover:bg-neutral-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4 border-2 border-dashed border-neutral-200 rounded-lg">
                    No blog images added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Ingredients</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">List all the ingredients needed</p>
            </CardHeader>
            <CardContent>
              <IngredientInput
                ingredients={formData.ingredients}
                onIngredientsChange={(ingredients) =>
                  setFormData({ ...formData, ingredients })
                }
              />
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Instructions</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">Add step-by-step cooking instructions</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-start">
                <Textarea
                  value={instructionInput}
                  onChange={(e) => setInstructionInput(e.target.value)}
                  placeholder="e.g., Preheat the oven to 350°F..."
                  rows={2}
                  className="flex-1"
                />
                <Button type="button" onClick={addInstruction} className="gap-2 mt-0">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              {formData.instructions.length > 0 ? (
                <ol className="space-y-2">
                  {formData.instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <span className="text-neutral-700">
                        <span className="font-semibold text-primary mr-2">{index + 1}.</span>
                        {instruction}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        className="hover:bg-neutral-100 flex-shrink-0 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-neutral-500 text-center py-8">No instructions added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} size="lg" className="shadow-lg">
              {loading ? 'Creating...' : 'Create Recipe'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

