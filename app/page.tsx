import Link from 'next/link'
import Image from 'next/image'
import { Nav } from '@/components/nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getRecipes() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/recipes`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      return []
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

export default async function Home() {
  const recipes = await getRecipes()

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Recipe Blog</h1>
          <p className="text-gray-600">Discover delicious recipes from around the world</p>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe: any) => (
              <Link key={recipe.recipe_id} href={`/recipes/${recipe.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {recipe.image_url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{recipe.title}</CardTitle>
                    {recipe.description && (
                      <CardDescription className="line-clamp-2">
                        {recipe.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {recipe.prep_time_min && (
                        <span>Prep: {recipe.prep_time_min} min</span>
                      )}
                      {recipe.cook_time_min && (
                        <span>Cook: {recipe.cook_time_min} min</span>
                      )}
                      {recipe.servings && <span>Serves: {recipe.servings}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
