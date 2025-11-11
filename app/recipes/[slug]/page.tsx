import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Nav } from '@/components/nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          {recipe.image_url && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-xl text-gray-600 mb-4">{recipe.description}</p>
            )}

            <div className="flex gap-6 text-gray-600 mb-6">
              {recipe.prep_time_min && (
                <div>
                  <span className="font-semibold">Prep Time:</span>{' '}
                  {recipe.prep_time_min} minutes
                </div>
              )}
              {recipe.cook_time_min && (
                <div>
                  <span className="font-semibold">Cook Time:</span>{' '}
                  {recipe.cook_time_min} minutes
                </div>
              )}
              {recipe.servings && (
                <div>
                  <span className="font-semibold">Servings:</span>{' '}
                  {recipe.servings}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ingredients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ingredients.map((ingredient: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {instructions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {instructions.map((instruction: any, index: number) => {
                      const step =
                        typeof instruction === 'string'
                          ? instruction
                          : instruction.step || instruction
                      return (
                        <li key={index} className="flex items-start">
                          <span className="font-semibold mr-2 min-w-[2rem]">
                            {index + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      )
                    })}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        </article>
      </main>
    </div>
  )
}

