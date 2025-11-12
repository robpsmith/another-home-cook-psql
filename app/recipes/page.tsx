import Link from 'next/link'
import Image from 'next/image'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, ChefHat } from 'lucide-react'

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

export default async function RecipesPage() {
  const recipes = await getRecipes()

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="mb-4">All Recipes</h1>
        <p className="text-lg text-neutral-600">
          Browse our complete collection of delicious recipes
        </p>
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-16 md:py-24">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <ChefHat className="h-12 w-12 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-semibold text-neutral-700 mb-2">No recipes yet</h3>
          <p className="text-neutral-500 mb-8">Be the first to share your culinary creation!</p>
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <ChefHat className="h-5 w-5" />
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-700">
              {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recipes.map((recipe: any) => (
              <Link key={recipe.recipe_id} href={`/recipes/${recipe.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-neutral-200 overflow-hidden">
                  {recipe.image_url && (
                    <div className="relative w-full h-56 md:h-64 overflow-hidden bg-neutral-100">
                      <Image
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="space-y-2">
                    <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                      {recipe.title}
                    </CardTitle>
                    {recipe.description && (
                      <CardDescription className="line-clamp-2 text-neutral-600">
                        {recipe.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                      {recipe.prep_time_min && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-neutral-400" />
                          <span>{recipe.prep_time_min + (recipe.cook_time_min || 0)} min</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-neutral-400" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </PageLayout>
  )
}

