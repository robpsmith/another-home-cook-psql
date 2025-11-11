import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, ChefHat, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      <div className="py-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Button>
        </Link>
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

        {/* Recipe Meta Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {totalTime > 0 && (
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Total Time</p>
                <p className="text-lg font-semibold text-neutral-900">{totalTime} min</p>
              </div>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Servings</p>
                <p className="text-lg font-semibold text-neutral-900">{recipe.servings}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200 col-span-2 md:col-span-1">
            <div className="p-2 bg-accent/50 rounded-lg">
              <ChefHat className="h-5 w-5 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Difficulty</p>
              <p className="text-lg font-semibold text-neutral-900">Medium</p>
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="space-y-8">
          {ingredients.length > 0 && (
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Ingredients</CardTitle>
                <p className="text-sm text-neutral-600 mt-2">Everything you need to make this recipe</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-neutral-700 leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

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

