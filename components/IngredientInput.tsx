'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import type { Ingredient } from '@/lib/types'

interface IngredientInputProps {
  ingredients: Ingredient[]
  onIngredientsChange: (ingredients: Ingredient[]) => void
}

const COMMON_UNITS = [
  // Weight
  'g', 'kg', 'oz', 'lb',
  // Volume
  'ml', 'l', 'cup', 'tbsp', 'tsp', 'fl oz',
  // Count
  'piece', 'pieces', 'whole', 'clove', 'cloves',
]

export function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('')
  const [name, setName] = useState('')

  const addIngredient = () => {
    const amountNum = parseFloat(amount)
    if (amountNum > 0 && unit && name.trim()) {
      onIngredientsChange([
        ...ingredients,
        {
          amount: amountNum,
          unit: unit.trim(),
          name: name.trim(),
        },
      ])
      setAmount('')
      setUnit('')
      setName('')
    }
  }

  const removeIngredient = (index: number) => {
    onIngredientsChange(ingredients.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-3">
          <Label htmlFor="ingredient-amount" className="text-xs text-neutral-600">
            Amount
          </Label>
          <Input
            id="ingredient-amount"
            type="number"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="2"
            className="mt-1"
          />
        </div>
        <div className="col-span-3">
          <Label htmlFor="ingredient-unit" className="text-xs text-neutral-600">
            Unit
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger id="ingredient-unit" className="mt-1">
              <SelectValue placeholder="cup" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-5">
          <Label htmlFor="ingredient-name" className="text-xs text-neutral-600">
            Ingredient Name
          </Label>
          <Input
            id="ingredient-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="all-purpose flour"
            className="mt-1"
          />
        </div>
        <div className="col-span-1 flex items-end">
          <Button
            type="button"
            onClick={addIngredient}
            className="gap-2 h-10"
            disabled={!amount || !unit || !name.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {ingredients.length > 0 ? (
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <span className="text-neutral-700">
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeIngredient(index)}
                className="hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-500 text-center py-8">No ingredients added yet</p>
      )}
    </div>
  )
}

