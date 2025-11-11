# Recipe Haven - Design System & UI Guide

## 🎨 Color Palette

### Primary Colors
- **Primary (Coral/Terra Cotta)**: `oklch(0.63 0.19 25)` - Used for CTAs, accents, and interactive elements
- **Secondary (Sage Green)**: `oklch(0.75 0.12 145)` - Fresh, natural accent color
- **Accent (Warm Peach)**: `oklch(0.94 0.04 65)` - Subtle background accents

### Neutral Colors
- **Background**: `oklch(0.99 0.005 85)` - Warm cream background
- **Foreground**: `oklch(0.25 0.01 40)` - Deep charcoal text
- **Muted**: `oklch(0.96 0.005 85)` - Light neutral backgrounds
- **Border**: `oklch(0.90 0.01 85)` - Subtle borders

### Usage in Tailwind
```jsx
<button className="bg-primary text-white">Click Me</button>
<div className="bg-secondary/10 text-secondary">Secondary Badge</div>
<p className="text-muted-foreground">Muted text</p>
```

## 📝 Typography

### Fonts
- **Sans-serif**: Geist Sans (primary font)
- **Monospace**: Geist Mono (code/technical content)

### Heading Sizes
- `h1`: 4xl - 6xl (responsive)
- `h2`: 3xl - 5xl (responsive)
- `h3`: 2xl - 4xl (responsive)
- `h4`: xl - 2xl (responsive)

### Usage Examples
```jsx
<h1>Large Page Title</h1>
<h2 className="text-neutral-700">Section Heading</h2>
<p className="text-lg text-neutral-600">Body text with good readability</p>
```

## 🏗️ Layout Components

### PageLayout
The main layout wrapper that includes Header and Footer.

```jsx
import { PageLayout } from '@/components/layout/PageLayout'

export default function MyPage() {
  return (
    <PageLayout maxWidth="default">
      {/* Your page content */}
    </PageLayout>
  )
}
```

#### Props
- `maxWidth`: `'narrow' | 'default' | 'wide' | 'full'`
  - `narrow`: max-w-3xl (ideal for blog posts, forms)
  - `default`: max-w-7xl (standard pages)
  - `wide`: max-w-[1400px] (wide content)
  - `full`: max-w-full (full width)
- `className`: Additional CSS classes

### Header
Sticky navigation bar with authentication state.

**Features:**
- Responsive mobile/desktop navigation
- User authentication display
- Logo and brand
- Navigation links

### Footer
Site footer with links and social media.

**Features:**
- Brand info
- Quick links
- Social media icons
- Copyright notice

## 🎯 Component Patterns

### Recipe Cards
```jsx
<Card className="border-neutral-200 hover:shadow-lg transition-all duration-300">
  <div className="relative w-full h-56 overflow-hidden bg-neutral-100">
    <Image src={imageUrl} alt={title} fill className="object-cover" />
  </div>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### Form Sections
```jsx
<Card className="border-neutral-200 shadow-sm">
  <CardHeader>
    <CardTitle className="text-xl">Section Title</CardTitle>
    <p className="text-sm text-neutral-600 mt-1">Section description</p>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Form fields */}
  </CardContent>
</Card>
```

### Info Badges
```jsx
<div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
  <Icon className="h-4 w-4" />
  <span>Badge Text</span>
</div>
```

## 🎭 Icons

Using Lucide React icons throughout the site:

```jsx
import { ChefHat, Clock, Users, Heart } from 'lucide-react'

<ChefHat className="h-5 w-5 text-primary" />
```

## 📱 Responsive Design

### Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Patterns
```jsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="md:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-6xl">Responsive Heading</h1>
```

## ✨ Animation & Interactions

### Hover Effects
```jsx
// Card hover
className="hover:shadow-lg transition-shadow"

// Button hover with scale
className="hover:scale-105 transition-transform"

// Image hover zoom
className="hover:scale-110 transition-transform duration-300"
```

### Loading States
```jsx
// Spinner
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />

// Skeleton
<div className="animate-pulse bg-neutral-200 h-4 w-full rounded" />
```

## 🚀 Best Practices

1. **Spacing**: Use consistent spacing with Tailwind's spacing scale (4px increments)
2. **Colors**: Always use semantic color tokens (primary, secondary, etc.) instead of hardcoded colors
3. **Accessibility**: Include proper alt text for images, aria-labels for icon buttons
4. **Performance**: Use Next.js Image component for all images
5. **Consistency**: Use the PageLayout wrapper for all pages
6. **Mobile-First**: Design for mobile, enhance for desktop

## 📂 File Structure

```
components/
├── layout/
│   ├── Header.tsx      # Main navigation
│   ├── Footer.tsx      # Site footer
│   └── PageLayout.tsx  # Page wrapper
└── ui/                 # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...

app/
├── page.tsx            # Homepage (uses PageLayout)
├── recipes/
│   └── [slug]/
│       └── page.tsx    # Recipe detail (uses PageLayout)
└── admin/
    ├── page.tsx        # Admin dashboard (uses PageLayout)
    └── new/
        └── page.tsx    # New recipe form (uses PageLayout)
```

## 🎨 Usage Examples

### Creating a New Page

```tsx
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MyPage() {
  return (
    <PageLayout maxWidth="default">
      <h1 className="mb-4">Page Title</h1>
      <p className="text-neutral-600 mb-8">Page description</p>
      
      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your content */}
        </CardContent>
      </Card>
    </PageLayout>
  )
}
```

### Empty States

```tsx
<div className="text-center py-16 md:py-24">
  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
    <Icon className="h-12 w-12 text-neutral-400" />
  </div>
  <h3 className="text-2xl font-semibold text-neutral-700 mb-2">Empty State Title</h3>
  <p className="text-neutral-500 mb-8">Empty state description</p>
  <Button>Call to Action</Button>
</div>
```

## 🔄 Migration from Old Nav Component

If you have pages still using the old `<Nav />` component, replace:

```tsx
// OLD
<div className="min-h-screen bg-gray-50">
  <Nav />
  <main className="container mx-auto px-4 py-8">
    {/* content */}
  </main>
</div>

// NEW
<PageLayout>
  {/* content */}
</PageLayout>
```

The PageLayout automatically includes the Header (which replaces Nav) and Footer.

