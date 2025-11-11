# Layout Components

Modern, reusable layout components for the Recipe Haven website.

## Quick Start

### Basic Page

```tsx
import { PageLayout } from '@/components/layout/PageLayout'

export default function MyPage() {
  return (
    <PageLayout>
      <h1>Welcome to My Page</h1>
      <p>Content goes here</p>
    </PageLayout>
  )
}
```

### Page with Narrow Content

```tsx
<PageLayout maxWidth="narrow">
  {/* Perfect for blog posts, forms, article content */}
</PageLayout>
```

### Page with Wide Content

```tsx
<PageLayout maxWidth="wide">
  {/* Perfect for dashboards, galleries, wide tables */}
</PageLayout>
```

### Page with Full Width Content

```tsx
<PageLayout maxWidth="full">
  {/* Full width content, no container constraints */}
</PageLayout>
```

### Page with Custom Styling

```tsx
<PageLayout className="bg-gradient-to-b from-white to-neutral-50">
  {/* Page with custom background */}
</PageLayout>
```

## Components

### Header
- Sticky navigation bar
- Auto-shows/hides user authentication state
- Responsive mobile menu
- Brand logo and navigation links

### Footer  
- Copyright information
- Quick links
- Social media links
- Automatic current year

### PageLayout
Combines Header + Main Content Area + Footer into a single wrapper component.

**Props:**
- `children` (required): Your page content
- `maxWidth`: 'narrow' | 'default' | 'wide' | 'full' (default: 'default')
- `className`: Additional CSS classes for the main content area

## Examples by Page Type

### Homepage / Recipe Listing
```tsx
<PageLayout>
  <h1>Discover Recipes</h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Recipe cards */}
  </div>
</PageLayout>
```

### Recipe Detail Page
```tsx
<PageLayout maxWidth="narrow">
  <h1>{recipe.title}</h1>
  <Image src={recipe.image} alt={recipe.title} />
  {/* Recipe content */}
</PageLayout>
```

### Form Pages
```tsx
<PageLayout maxWidth="narrow">
  <h1>Create New Recipe</h1>
  <form>
    {/* Form fields */}
  </form>
</PageLayout>
```

### Dashboard Pages
```tsx
<PageLayout maxWidth="wide">
  <h1>Dashboard</h1>
  <div className="grid grid-cols-4 gap-4">
    {/* Stats, cards, etc */}
  </div>
</PageLayout>
```

## Customization

### Changing the Brand Name
Edit `components/layout/Header.tsx`:
```tsx
<span className="hidden sm:inline">Your Brand Name</span>
```

### Changing Social Links
Edit `components/layout/Footer.tsx`:
```tsx
<a href="https://your-instagram.com" target="_blank" rel="noopener noreferrer">
  <Instagram className="h-4 w-4" />
</a>
```

### Adding Navigation Links
Edit `components/layout/Header.tsx`:
```tsx
<Link href="/your-page">
  <Button variant="ghost" className="gap-2">
    <Icon className="h-4 w-4" />
    Your Page
  </Button>
</Link>
```

## Notes

- All pages automatically include header and footer
- Header is sticky (stays at top when scrolling)
- Footer automatically pushes to bottom on short pages
- Fully responsive and mobile-friendly
- Uses semantic HTML for better SEO and accessibility

