/**
 * Utility functions for parsing and converting ingredient measurements
 */

import type { Ingredient } from './types'

export type WeightUnit = 'g' | 'oz'
export type VolumeUnit = 'ml' | 'cup'

interface ParsedIngredient {
  original: string
  amount?: number
  unit?: string
  ingredient: string
  hasWeight: boolean
  hasVolume: boolean
}

// Weight conversion factors
const WEIGHT_CONVERSIONS: Record<string, number> = {
  // Metric to Imperial
  g: 0.035274, // grams to ounces
  kg: 35.274, // kilograms to ounces
  // Imperial to Metric
  oz: 28.3495, // ounces to grams
  lb: 453.592, // pounds to grams
  lbs: 453.592,
  pound: 453.592,
  pounds: 453.592,
}

// Volume conversion factors (to ml)
const VOLUME_TO_ML: Record<string, number> = {
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
  cup: 236.588,
  cups: 236.588,
  c: 236.588,
  tbsp: 14.7868,
  tablespoon: 14.7868,
  tablespoons: 14.7868,
  tsp: 4.92892,
  teaspoon: 4.92892,
  teaspoons: 4.92892,
  fl: 29.5735, // fluid ounce
  'fl oz': 29.5735,
  'fluid ounce': 29.5735,
  'fluid ounces': 29.5735,
  pt: 473.176, // pint
  pint: 473.176,
  pints: 473.176,
  qt: 946.353, // quart
  quart: 946.353,
  quarts: 946.353,
  gal: 3785.41, // gallon
  gallon: 3785.41,
  gallons: 3785.41,
}

// ML to cups conversion
const ML_TO_CUP = 1 / 236.588

// Conversion factors for tsp/tablespoon to grams (approximate, for common baking ingredients)
// Using average density for dry ingredients like baking soda, salt, etc.
const TSP_TO_ML = 4.92892
const TBSP_TO_ML = 14.7868
// Average density for dry baking ingredients: ~2 g/ml
const DRY_INGREDIENT_DENSITY = 2.0
const TSP_TO_G = TSP_TO_ML * DRY_INGREDIENT_DENSITY // ~9.86 g per tsp
const TBSP_TO_G = TBSP_TO_ML * DRY_INGREDIENT_DENSITY // ~29.57 g per tbsp

/**
 * Parse an ingredient string to extract amount, unit, and ingredient name
 */
export function parseIngredient(ingredient: string): ParsedIngredient {
  const trimmed = ingredient.trim()
  
  // Match patterns like "3 lb pork shoulder", "2 cups flour", "1/2 cup milk"
  const fractionPattern = /(\d+\/\d+|\d+\.?\d*)\s*([a-zA-Z]+\.?)\s+(.+)/i
  const match = trimmed.match(fractionPattern)
  
  if (!match) {
    return {
      original: trimmed,
      ingredient: trimmed,
      hasWeight: false,
      hasVolume: false,
    }
  }
  
  const [, amountStr, unit, ingredientName] = match
  const amount = parseFraction(amountStr)
  const normalizedUnit = unit.toLowerCase().replace(/\.$/, '')
  
  // Use the exported functions
  const hasWeight = isWeightUnit(normalizedUnit)
  const hasVolume = isVolumeUnit(normalizedUnit)
  
  return {
    original: trimmed,
    amount,
    unit: normalizedUnit,
    ingredient: ingredientName.trim(),
    hasWeight,
    hasVolume,
  }
}

/**
 * Parse fraction strings like "1/2" or "3/4" to decimal
 */
function parseFraction(str: string): number {
  if (str.includes('/')) {
    const [numerator, denominator] = str.split('/').map(Number)
    return numerator / denominator
  }
  return parseFloat(str) || 0
}


/**
 * Convert weight from one unit to another
 */
export function convertWeight(amount: number, fromUnit: string, toUnit: WeightUnit): number {
  const normalizedFrom = fromUnit.toLowerCase()
  
  // Convert to grams first
  let grams: number
  if (normalizedFrom === 'g' || normalizedFrom === 'gram' || normalizedFrom === 'grams') {
    grams = amount
  } else if (normalizedFrom === 'kg' || normalizedFrom === 'kilogram' || normalizedFrom === 'kilograms') {
    grams = amount * 1000
  } else if (normalizedFrom === 'oz' || normalizedFrom === 'ounce' || normalizedFrom === 'ounces') {
    grams = amount * WEIGHT_CONVERSIONS.oz
  } else if (normalizedFrom === 'lb' || normalizedFrom === 'lbs' || normalizedFrom === 'pound' || normalizedFrom === 'pounds') {
    grams = amount * WEIGHT_CONVERSIONS.lb
  } else {
    return amount // Unknown unit, return as is
  }
  
  // Convert from grams to target unit
  if (toUnit === 'g') {
    return Math.round(grams * 10) / 10 // Round to 1 decimal
  } else {
    return Math.round((grams * WEIGHT_CONVERSIONS.g) * 10) / 10 // Round to 1 decimal
  }
}

/**
 * Convert volume from one unit to another
 */
export function convertVolume(amount: number, fromUnit: string, toUnit: VolumeUnit): number {
  const normalizedFrom = fromUnit.toLowerCase().replace(/s$/, '')
  
  // Convert to ml first
  let ml: number
  if (normalizedFrom in VOLUME_TO_ML) {
    ml = amount * VOLUME_TO_ML[normalizedFrom]
  } else {
    return amount // Unknown unit, return as is
  }
  
  // Convert from ml to target unit
  if (toUnit === 'ml') {
    return Math.round(ml * 10) / 10 // Round to 1 decimal
  } else {
    return Math.round((ml * ML_TO_CUP) * 100) / 100 // Round to 2 decimals for cups
  }
}

/**
 * Check if a unit is a weight unit
 */
export function isWeightUnit(unit: string): boolean {
  const weightUnits = ['g', 'gram', 'grams', 'kg', 'kilogram', 'kilograms', 'oz', 'ounce', 'ounces', 'lb', 'lbs', 'pound', 'pounds']
  return weightUnits.includes(unit.toLowerCase())
}

/**
 * Check if a unit is a volume unit
 */
export function isVolumeUnit(unit: string): boolean {
  return unit.toLowerCase() in VOLUME_TO_ML || unit.toLowerCase().replace(/s$/, '') in VOLUME_TO_ML
}

/**
 * Convert tsp/tablespoon to grams
 */
function convertTspTbspToGrams(amount: number, unit: string): number {
  const normalizedUnit = unit.toLowerCase().replace(/s$/, '')
  if (normalizedUnit === 'tsp' || normalizedUnit === 'teaspoon') {
    return Math.round(amount * TSP_TO_G * 10) / 10
  } else if (normalizedUnit === 'tbsp' || normalizedUnit === 'tablespoon') {
    return Math.round(amount * TBSP_TO_G * 10) / 10
  }
  return amount
}

/**
 * Convert grams to tsp/tablespoon (for when cups is selected but original is grams)
 */
function convertGramsToTspTbsp(amount: number): { amount: number; unit: string } {
  // Determine if we should use tsp or tbsp based on the amount
  // If amount is >= 15g, prefer tbsp, otherwise tsp
  if (amount >= 15) {
    const tbspAmount = amount / TBSP_TO_G
    if (tbspAmount >= 0.5) {
      return {
        amount: Math.round(tbspAmount * 100) / 100,
        unit: tbspAmount === 1 ? 'tablespoon' : 'tablespoons'
      }
    }
  }
  
  const tspAmount = amount / TSP_TO_G
  return {
    amount: Math.round(tspAmount * 100) / 100,
    unit: tspAmount === 1 ? 'teaspoon' : 'teaspoons'
  }
}

/**
 * Check if unit is tsp or tablespoon
 */
function isTspOrTbsp(unit: string): boolean {
  const normalized = unit.toLowerCase().replace(/s$/, '')
  return normalized === 'tsp' || normalized === 'teaspoon' || 
         normalized === 'tbsp' || normalized === 'tablespoon'
}

/**
 * Format a structured ingredient with converted units
 */
export function formatStructuredIngredient(
  ingredient: Ingredient,
  weightUnit: WeightUnit = 'g',
  volumeUnit: VolumeUnit = 'ml',
  convertActive: boolean = false
): string {
  const { amount, unit, name } = ingredient
  
  if (!amount || !unit) {
    return name
  }
  
  // If conversion is not active, return original
  if (!convertActive) {
    const formattedAmount = formatAmount(amount)
    return `${formattedAmount} ${unit} ${name}`
  }
  
  const normalizedUnit = unit.toLowerCase().replace(/s$/, '')
  const hasWeight = isWeightUnit(normalizedUnit)
  const hasVolume = isVolumeUnit(normalizedUnit)
  const isTspTbsp = isTspOrTbsp(normalizedUnit)
  
  let convertedAmount = amount
  let convertedUnit = unit
  
  if (hasWeight) {
    // Special case: if original is grams and volume unit is cups, convert to tsp/tablespoon
    if ((normalizedUnit === 'g' || normalizedUnit === 'gram') && volumeUnit === 'cup') {
      const result = convertGramsToTspTbsp(amount)
      convertedAmount = result.amount
      convertedUnit = result.unit
    } else {
      convertedAmount = convertWeight(amount, normalizedUnit, weightUnit)
      convertedUnit = weightUnit === 'g' ? 'g' : 'oz'
    }
  } else if (hasVolume) {
    // Special case: if tsp or tablespoon, convert to grams instead of ml/cups
    if (isTspTbsp) {
      convertedAmount = convertTspTbspToGrams(amount, normalizedUnit)
      convertedUnit = weightUnit === 'g' ? 'g' : 'oz'
      // If weight unit is oz, convert grams to oz
      if (weightUnit === 'oz') {
        convertedAmount = Math.round((convertedAmount * WEIGHT_CONVERSIONS.g) * 10) / 10
        convertedUnit = 'oz'
      }
    } else {
      convertedAmount = convertVolume(amount, normalizedUnit, volumeUnit)
      convertedUnit = volumeUnit === 'ml' ? 'ml' : 'cup'
      if (volumeUnit === 'cup' && convertedAmount !== 1) {
        convertedUnit = 'cups'
      }
    }
  }
  
  // Format the amount nicely
  let formattedAmount = formatAmount(convertedAmount)
  
  return `${formattedAmount} ${convertedUnit} ${name}`
}

/**
 * Format an ingredient string with converted units (legacy support)
 */
export function formatIngredient(
  ingredient: string | Ingredient,
  weightUnit: WeightUnit = 'g',
  volumeUnit: VolumeUnit = 'ml',
  convertActive: boolean = false
): string {
  // If it's already a structured ingredient, use the structured formatter
  if (typeof ingredient === 'object' && 'amount' in ingredient && 'unit' in ingredient && 'name' in ingredient) {
    return formatStructuredIngredient(ingredient, weightUnit, volumeUnit, convertActive)
  }
  
  // Legacy: parse string ingredient
  const parsed = parseIngredient(ingredient as string)
  
  if (!parsed.amount || !parsed.unit) {
    return parsed.original
  }
  
  // If conversion is not active, return original
  if (!convertActive) {
    return parsed.original
  }
  
  const normalizedUnit = parsed.unit.toLowerCase().replace(/s$/, '')
  const isTspTbsp = isTspOrTbsp(normalizedUnit)
  
  let convertedAmount = parsed.amount
  let convertedUnit = parsed.unit
  
  if (parsed.hasWeight) {
    // Special case: if original is grams and volume unit is cups, convert to tsp/tablespoon
    if ((normalizedUnit === 'g' || normalizedUnit === 'gram') && volumeUnit === 'cup') {
      const result = convertGramsToTspTbsp(parsed.amount)
      convertedAmount = result.amount
      convertedUnit = result.unit
    } else {
      convertedAmount = convertWeight(parsed.amount, parsed.unit, weightUnit)
      convertedUnit = weightUnit === 'g' ? 'g' : 'oz'
    }
  } else if (parsed.hasVolume) {
    // Special case: if tsp or tablespoon, convert to grams instead of ml/cups
    if (isTspTbsp) {
      convertedAmount = convertTspTbspToGrams(parsed.amount, normalizedUnit)
      convertedUnit = weightUnit === 'g' ? 'g' : 'oz'
      // If weight unit is oz, convert grams to oz
      if (weightUnit === 'oz') {
        convertedAmount = Math.round((convertedAmount * WEIGHT_CONVERSIONS.g) * 10) / 10
        convertedUnit = 'oz'
      }
    } else {
      convertedAmount = convertVolume(parsed.amount, parsed.unit, volumeUnit)
      convertedUnit = volumeUnit === 'ml' ? 'ml' : 'cup'
      if (volumeUnit === 'cup' && convertedAmount !== 1) {
        convertedUnit = 'cups'
      }
    }
  }
  
  // Format the amount nicely
  let formattedAmount = formatAmount(convertedAmount)
  
  return `${formattedAmount} ${convertedUnit} ${parsed.ingredient}`
}

/**
 * Format amount with proper decimal/fraction formatting
 */
function formatAmount(amount: number): string {
  if (amount % 1 === 0) {
    return amount.toString()
  } else if (amount < 1) {
    // Try to format as fraction for small amounts
    const fraction = decimalToFraction(amount)
    if (fraction) {
      return fraction
    } else {
      return amount.toFixed(2).replace(/\.?0+$/, '')
    }
  } else {
    return amount.toFixed(2).replace(/\.?0+$/, '')
  }
}

/**
 * Convert decimal to common fraction
 */
function decimalToFraction(decimal: number): string | null {
  const commonFractions: Record<number, string> = {
    0.125: '1/8',
    0.25: '1/4',
    0.33: '1/3',
    0.333: '1/3',
    0.5: '1/2',
    0.66: '2/3',
    0.667: '2/3',
    0.75: '3/4',
  }
  
  const tolerance = 0.01
  for (const [dec, frac] of Object.entries(commonFractions)) {
    if (Math.abs(decimal - parseFloat(dec)) < tolerance) {
      return frac
    }
  }
  
  return null
}

