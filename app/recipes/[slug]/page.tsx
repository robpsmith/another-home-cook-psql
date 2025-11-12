import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecipeCard } from '@/components/RecipeCard'

async function getRecipe(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/recipes/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      return null
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : []
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : []

  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0)

  return (
    <PageLayout maxWidth="narrow" className="!py-0">
      {/* Back Button */}
      <div className="py-6 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Button>
        </Link>
        <a href="#recipe-card">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowDown className="h-4 w-4" />
            Jump to Recipe
          </Button>
        </a>
      </div>

      <article className="pb-12">
        {/* Hero Image */}
        {recipe.image_url && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] mb-8 rounded-xl overflow-hidden shadow-xl">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title & Description */}
        <div className="mb-8">
          <h1 className="mb-4">{recipe.title}</h1>
          {recipe.description && (
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
              {recipe.description}
            </p>
          )}
        </div>

        {/* Blog Content Section */}
        {(recipe.blog_content || (recipe.blog_images && recipe.blog_images.length > 0)) && (
          <div className="mb-8 space-y-6">
            {/* Blog Content with Inline Images */}
            {recipe.blog_content && (
              <div className="prose prose-lg max-w-none">
                {(() => {
                  const blogImages = Array.isArray(recipe.blog_images) ? recipe.blog_images : []
                  const content = recipe.blog_content
                  
                  // Split content by image placeholders
                  const parts = content.split(/(\{\{image:\d+\}\})/g)
                  
                  const elements: JSX.Element[] = []
                  
                  parts.forEach((part, index) => {
                    // Check if this part is an image placeholder
                    const imageMatch = part.match(/\{\{image:(\d+)\}\}/)
                    if (imageMatch) {
                      const imageIndex = parseInt(imageMatch[1])
                      const image = blogImages[imageIndex]
                      
                      if (image) {
                        elements.push(
                          <figure key={`img-${index}`} className="my-8 rounded-xl overflow-hidden shadow-lg">
                            <div className="relative w-full aspect-[16/9]">
                              <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {image.caption && (
                              <figcaption className="p-4 bg-neutral-50 text-sm text-neutral-600 italic text-center">
                                {image.caption}
                              </figcaption>
                            )}
                          </figure>
                        )
                      }
                    } else if (part.trim()) {
                      // Regular text content - split by paragraphs
                      part.split('\n\n').forEach((paragraph: string, pIndex: number) => {
                        if (paragraph.trim()) {
                          elements.push(
                            <p key={`text-${index}-${pIndex}`} className="text-neutral-700 leading-relaxed mb-4">
                              {paragraph.trim()}
                            </p>
                          )
                        }
                      })
                    }
                  })
                  
                  return elements
                })()}
              </div>
            )}
          </div>
        )}

        {/* Recipe Card with Ingredients */}
        {ingredients.length > 0 && (
          <div id="recipe-card" className="mb-8 scroll-mt-6">
            <RecipeCard
              prepTime={recipe.prep_time_min || undefined}
              totalTime={totalTime || undefined}
              servings={recipe.servings || undefined}
              ingredients={ingredients}
              recipeId={recipe.recipe_id}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-8">

          {instructions.length > 0 && (
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Instructions</CardTitle>
                <p className="text-sm text-neutral-600 mt-2">Step-by-step guide to cooking perfection</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-6">
                  {instructions.map((instruction: any, index: number) => {
                    const step =
                      typeof instruction === 'string'
                        ? instruction
                        : instruction.step || instruction
                    return (
                      <li key={index} className="flex items-start gap-4 group">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                          {index + 1}
                        </span>
                        <span className="text-neutral-700 leading-relaxed pt-0.5">{step}</span>
                      </li>
                    )
                  })}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </article>
    </PageLayout>
  )
}

