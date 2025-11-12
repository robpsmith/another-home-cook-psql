/**
 * Type definitions for recipe data structures
 */

export interface Ingredient {
  amount: number
  unit: string
  name: string
}

export interface Recipe {
  recipe_id: number
  title: string
  slug: string
  description?: string | null
  prep_time_min?: number | null
  cook_time_min?: number | null
  servings?: string | null
  image_url?: string | null
  ingredients?: Ingredient[] | string[] // Support both structured and legacy string format
  instructions?: any[]
  published_date?: Date | null
  updated_date?: Date | null
}

