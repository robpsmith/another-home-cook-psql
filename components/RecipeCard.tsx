'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, Share2, Printer } from 'lucide-react'
import { formatIngredient, type WeightUnit, type VolumeUnit } from '@/lib/ingredient-converter'
import type { Ingredient } from '@/lib/types'

interface RecipeCardProps {
  title?: string
  prepTime?: number
  totalTime?: number
  servings?: string
  ingredients: (Ingredient | string)[] // Support both structured and legacy string format
  recipeId?: number
  className?: string
}

export function RecipeCard({
  title,
  prepTime,
  totalTime,
  servings,
  ingredients,
  recipeId,
  className = '',
}: RecipeCardProps) {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('g')
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>('ml')
  const [convertActive, setConvertActive] = useState(false)

  const handleShare = () => {
    const shareTitle = title || 'Recipe'
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: `Check out this recipe: ${shareTitle}`,
        url: window.location.href,
      }).catch(() => {
        // User cancelled or error occurred
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Recipe link copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card className={`border-neutral-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {title && <CardTitle className="text-2xl mb-2">{title}</CardTitle>}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
              {prepTime !== undefined && prepTime > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <span>Prep {prepTime} minutes</span>
                </div>
              )}
              {totalTime !== undefined && totalTime > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <span>Total {totalTime} minutes</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2"
              title="Share recipe"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
              title="Print recipe"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unit Toggles */}
        <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">Weight:</span>
            <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
              <button
                onClick={() => {
                  setWeightUnit('g')
                  setConvertActive(true)
                }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  weightUnit === 'g' && convertActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                g
              </button>
              <button
                onClick={() => {
                  setWeightUnit('oz')
                  setConvertActive(true)
                }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  weightUnit === 'oz' && convertActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                oz
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">Volume:</span>
            <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
              <button
                onClick={() => {
                  setVolumeUnit('ml')
                  setConvertActive(true)
                }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  volumeUnit === 'ml' && convertActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                ml
              </button>
              <button
                onClick={() => {
                  setVolumeUnit('cup')
                  setConvertActive(true)
                }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  volumeUnit === 'cup' && convertActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                cup
              </button>
            </div>
          </div>
          {servings && (
            <div className="flex items-center gap-1.5 text-sm text-neutral-600 ml-auto">
              <Users className="h-4 w-4 text-neutral-400" />
              <span className="font-medium">Servings {servings}</span>
            </div>
          )}
        </div>

        {/* Main Ingredients */}
        {ingredients.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Main Ingredients</h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="text-neutral-700 leading-relaxed">
                    {formatIngredient(ingredient, weightUnit, volumeUnit, convertActive)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

