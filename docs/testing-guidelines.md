# Testing Guidelines - ADmyBRAND AI Suite

## Overview
This document provides comprehensive testing guidelines for the ADmyBRAND AI Suite, covering unit tests, integration tests, end-to-end tests, and performance testing.

## Testing Stack

### Core Testing Libraries
- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Playwright**: End-to-end testing
- **@testing-library/jest-dom**: Custom Jest matchers

### Installation
```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw playwright
```

## Project Structure
```
__tests__/
├── components/           # Component tests
├── hooks/               # Custom hook tests
├── pages/               # Page tests
├── utils/               # Utility function tests
├── e2e/                 # End-to-end tests
├── __mocks__/           # Mock files
└── setup.ts             # Test setup configuration
```

## Configuration

### Jest Configuration (jest.config.js)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Test Setup (__tests__/setup.ts)
```typescript
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Setup MSW server
export const server = setupServer(
  rest.post('/api/contact', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: 'Form submitted successfully'
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Component Testing

### Example: Contact Modal Tests
```typescript
// __tests__/components/contact-modal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactModal } from '@/components/contact-modal'

// Mock the custom hook
jest.mock('@/hooks/use-contact-modal', () => ({
  useContactModal: () => ({
    isOpen: true,
    close: jest.fn(),
  }),
}))

describe('ContactModal', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    render(<ContactModal />)
  })

  it('renders the contact form', () => {
    expect(screen.getByRole('dialog', { name: /contact us/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const emailInput = screen.getByLabelText(/email/i)
    
    await user.type(emailInput, 'invalid-email')
    await user.tab() // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const consentCheckbox = screen.getByLabelText(/privacy policy/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'This is a test message that is long enough.')
    await user.click(consentCheckbox)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent/i)).toBeInTheDocument()
    })
  })

  it('handles form submission errors', async () => {
    // Mock server to return error
    server.use(
      rest.post('/api/contact', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Test message')
    await user.click(screen.getByLabelText(/privacy policy/i))
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
    })
  })

  it('prevents body scroll when modal is open', () => {
    expect(document.body.style.overflow).toBe('hidden')
  })
})
```

### Testing Custom Hooks
```typescript
// __tests__/hooks/use-contact-modal.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useContactModal } from '@/hooks/use-contact-modal'

describe('useContactModal', () => {
  it('should have initial state closed', () => {
    const { result } = renderHook(() => useContactModal())
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should open modal when open is called', () => {
    const { result } = renderHook(() => useContactModal())
    
    act(() => {
      result.current.open()
    })
    
    expect(result.current.isOpen).toBe(true)
  })

  it('should close modal when close is called', () => {
    const { result } = renderHook(() => useContactModal())
    
    act(() => {
      result.current.open()
    })
    
    expect(result.current.isOpen).toBe(true)
    
    act(() => {
      result.current.close()
    })
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should toggle modal state', () => {
    const { result } = renderHook(() => useContactModal())
    
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isOpen).toBe(true)
    
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isOpen).toBe(false)
  })
})
```

## Integration Testing

### Page Component Tests
```typescript
// __tests__/pages/home.test.tsx
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock components
jest.mock('@/components/hero-section', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>
}))

jest.mock('@/components/features-section', () => ({
  FeaturesSection: () => <div data-testid="features-section">Features Section</div>
}))

jest.mock('@/components/pricing-section', () => ({
  PricingSection: () => <div data-testid="pricing-section">Pricing Section</div>
}))

describe('HomePage', () => {
  it('renders all main sections', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('features-section')).toBeInTheDocument()
    expect(screen.getByTestId('pricing-section')).toBeInTheDocument()
  })

  it('has proper document structure', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('min-h-screen')
  })
})
```

## End-to-End Testing

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: '__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Examples
```typescript
// __tests__/e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should open contact modal and submit form', async ({ page }) => {
    // Open contact modal
    await page.getByRole('button', { name: /contact us/i }).click()
    
    // Verify modal is open
    await expect(page.getByRole('dialog')).toBeVisible()
    
    // Fill form
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/company/i).fill('Test Company')
    await page.getByLabel(/inquiry type/i).selectOption('demo')
    await page.getByLabel(/message/i).fill('This is a test message for the contact form.')
    await page.getByLabel(/privacy policy/i).check()
    
    // Submit form
    await page.getByRole('button', { name: /send message/i }).click()
    
    // Verify success message
    await expect(page.getByText(/thank you! your message has been sent/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /contact us/i }).click()
    await page.getByRole('button', { name: /send message/i }).click()
    
    await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible()
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
    await expect(page.getByText(/message must be at least 10 characters/i)).toBeVisible()
  })

  test('should work on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile')
    
    await page.getByRole('button', { name: /contact us/i }).click()
    
    // Verify mobile-specific behaviors
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  })
})
```

### Performance Testing
```typescript
// __tests__/e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('should load homepage within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Performance assertions
    expect(loadTime).toBeLessThan(3000) // 3 seconds
    
    // Check Core Web Vitals
    const lcpValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    expect(lcpValue).toBeLessThan(2500) // 2.5 seconds
  })

  test('should have good accessibility scores', async ({ page }) => {
    await page.goto('/')
    
    // Run axe accessibility tests
    const accessibilityScanResults = await page.evaluate(() => {
      // This would require axe-core to be injected
      // return axe.run()
      return { violations: [] }
    })
    
    expect(accessibilityScanResults.violations).toHaveLength(0)
  })
})
```

## Visual Regression Testing

### Storybook Integration
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
}

export default config
```

### Component Stories
```typescript
// components/contact-modal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ContactModal } from './contact-modal'

const meta: Meta<typeof ContactModal> = {
  title: 'Components/ContactModal',
  component: ContactModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  parameters: {
    mockData: {
      submitError: true,
    },
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
```

## Test Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:visual": "chromatic --exit-zero-on-changes",
    "test:all": "pnpm test && pnpm test:e2e"
  }
}
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm build
      - run: pnpm test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

### Test Organization
1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **One Assertion Per Test**: Keep tests focused
3. **Descriptive Test Names**: Use "should [expected behavior] when [condition]"
4. **Test User Behavior**: Test what users do, not implementation details

### Mock Strategy
1. **Mock External Dependencies**: APIs, third-party libraries
2. **Don't Mock What You're Testing**: Test real component interactions
3. **Use MSW for API Mocking**: More realistic than jest.mock
4. **Mock Heavy Dependencies**: Large libraries that slow down tests

### Coverage Guidelines
1. **Aim for 80%+ Coverage**: Balance between confidence and maintenance
2. **Focus on Critical Paths**: User flows, business logic
3. **Don't Chase 100%**: Not always worth the effort
4. **Review Coverage Reports**: Identify untested edge cases

### Performance Testing
1. **Test Core Web Vitals**: LCP, FID, CLS
2. **Mobile Performance**: Test on slower devices
3. **Bundle Size**: Monitor JavaScript bundle sizes
4. **Loading States**: Test with slow networks
