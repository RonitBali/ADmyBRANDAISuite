# Development Guide - ADmyBRAND AI Suite

## Prerequisites

### Required Software
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (or pnpm 8.x)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

## Project Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd ADmyBRANDAISuite
npm install
# or
pnpm install
```

### 2. Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="ADmyBRAND AI Suite"
```

### 3. Development Server
```bash
npm run dev
# or
pnpm dev
```

## Development Workflow

### Code Style and Standards

#### TypeScript Configuration
- Strict mode enabled
- Path mapping configured for clean imports
- Interface-first approach for type definitions

#### Component Structure
```tsx
// Component template
"use client"

import { ComponentProps } from "./types"

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  return (
    <div className="responsive-classes">
      {/* Component content */}
    </div>
  )
}
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `HeroSection`)
- **Files**: kebab-case (e.g., `hero-section.tsx`)
- **Variables**: camelCase (e.g., `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### Component Development Guidelines

#### 1. Mobile-First Approach
Always start with mobile design and scale up:
```tsx
className="text-sm sm:text-base lg:text-lg"
```

#### 2. Animation Implementation
Use Framer Motion with performance considerations:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

#### 3. Form Validation Pattern
Implement forms with React Hook Form + Zod:
```tsx
const schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters")
})

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting }
} = useForm<FormData>({
  resolver: zodResolver(schema)
})
```

## Styling Guidelines

### Tailwind CSS Best Practices

#### 1. Responsive Design
```tsx
// Mobile-first breakpoints
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

#### 2. Color System
```tsx
// Use semantic color names
className="bg-white/5 text-white/80 border-white/20"
```

#### 3. Spacing and Layout
```tsx
// Consistent spacing scale
className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6"
```

### Custom CSS Patterns

#### Glass Morphism Effect
```css
.glass {
  @apply bg-white/5 backdrop-blur-sm border border-white/10;
}
```

#### Button Variants
```css
.btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300;
}
```

## Performance Optimization

### Image Optimization
```tsx
import Image from "next/image"

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={isAboveTheFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Code Splitting
```tsx
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
})
```

### Animation Performance
```tsx
// Use transform properties for better performance
<motion.div
  style={{ transform: "translateY(0px)" }}
  animate={{ transform: "translateY(-10px)" }}
/>
```

## Testing Guidelines

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Component from './Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    render(<Component />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalled()
  })
})
```

### E2E Testing
```typescript
import { test, expect } from '@playwright/test'

test('contact form submission', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="contact-button"]')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('[type="submit"]')
  await expect(page.locator('.success-message')).toBeVisible()
})
```

## Common Patterns and Solutions

### Modal Implementation
```tsx
// Global modal state
const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))

// Scroll lock implementation
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }
}, [isOpen])
```

### Responsive Navigation
```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

return (
  <nav className="hidden md:block">
    {/* Desktop navigation */}
  </nav>
  <div className="md:hidden">
    {/* Mobile navigation */}
  </div>
)
```

### Error Handling
```tsx
const [error, setError] = useState<string | null>(null)

try {
  await submitForm(data)
  setError(null)
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred')
}
```

## Deployment and CI/CD

### Build Process
```bash
# Production build
npm run build

# Build analysis
npm run build:analyze

# Type checking
npm run type-check
```

### Environment Variables
```bash
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Deployment Checklist
- [ ] Run type checking
- [ ] Run linting
- [ ] Test all user flows
- [ ] Check mobile responsiveness
- [ ] Verify form validation
- [ ] Test performance metrics
- [ ] Review accessibility features

## Troubleshooting

### Common Issues

#### Build Errors
1. **TypeScript errors**: Check for type mismatches
2. **Import errors**: Verify file paths and exports
3. **CSS issues**: Check Tailwind class names

#### Runtime Issues
1. **Hydration mismatches**: Ensure server and client render the same
2. **Animation glitches**: Check Framer Motion configuration
3. **Modal scroll issues**: Verify scroll lock implementation

#### Performance Issues
1. **Slow animations**: Use transform properties
2. **Large bundle size**: Implement code splitting
3. **Image loading**: Optimize images and use Next.js Image component

### Debug Commands
```bash
# Analyze bundle
npm run analyze

# Check types
npm run type-check

# Lint code
npm run lint

# Test components
npm run test
```

## Contributing

### Pull Request Process
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run quality checks
4. Submit PR with description
5. Address review feedback
6. Merge after approval

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Components are responsive
- [ ] Animations are smooth
- [ ] Accessibility features included
- [ ] Performance considerations addressed
- [ ] Tests are comprehensive
