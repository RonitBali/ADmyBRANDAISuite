# API Documentation - ADmyBRAND AI Suite

## Overview
This document outlines the API structure and implementation patterns used in the ADmyBRAND AI Suite frontend application.

## Contact Form API

### Form Submission Endpoint
Currently implemented as a mock API with planned backend integration.

```typescript
// Current implementation (mock)
const submitContactForm = async (data: ContactFormData): Promise<SubmissionResult> => {
  // Simulate API call
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        resolve(data)
      } else {
        reject(new Error('Network error'))
      }
    }, 2000)
  })
  
  return {
    success: true,
    message: 'Thank you! Your message has been sent successfully.'
  }
}
```

### Data Types

#### ContactFormData Interface
```typescript
interface ContactFormData {
  name: string                    // Required: 2-100 characters, letters and spaces only
  email: string                   // Required: Valid email format, 5-100 characters
  company?: string               // Optional: Max 100 characters
  phone?: string                 // Optional: Flexible format validation
  inquiryType: InquiryType       // Required: Enum value
  message: string                // Required: 10-1000 characters
  consent: boolean               // Required: Must be true
}

type InquiryType = 
  | "general" 
  | "demo" 
  | "pricing" 
  | "support" 
  | "partnership"
```

#### Validation Schema
```typescript
const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  
  company: z.string()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  
  phone: z.string()
    .refine((val) => {
      if (!val || val === "") return true
      const phoneRegex = /^[\+]?[(]?[\d\s\-\.\(\)]{10,17}$/
      return phoneRegex.test(val.replace(/\s/g, ''))
    }, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  
  inquiryType: z.enum(["general", "demo", "pricing", "support", "partnership"]),
  
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  
  consent: z.boolean()
    .refine(value => value === true, "You must agree to the privacy policy")
})
```

## Future API Integrations

### Planned Backend Endpoints

#### Authentication
```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: UserProfile
  expiresIn: number
}
```

#### User Management
```typescript
// GET /api/user/profile
interface UserProfile {
  id: string
  name: string
  email: string
  company?: string
  plan: SubscriptionPlan
  createdAt: string
}

// PUT /api/user/profile
interface UpdateProfileRequest {
  name?: string
  company?: string
  phone?: string
}
```

#### Campaign Management
```typescript
// GET /api/campaigns
interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed'
  metrics: CampaignMetrics
  createdAt: string
  updatedAt: string
}

// POST /api/campaigns
interface CreateCampaignRequest {
  name: string
  type: CampaignType
  targetAudience: AudienceConfig
  budget: BudgetConfig
}
```

#### Content Generation
```typescript
// POST /api/content/generate
interface ContentGenerationRequest {
  type: 'ad-copy' | 'email' | 'social-post' | 'blog-article'
  brandVoice: BrandVoiceConfig
  targetAudience: string[]
  keywords: string[]
  length: 'short' | 'medium' | 'long'
}

interface ContentGenerationResponse {
  content: string
  suggestions: string[]
  seoScore: number
  engagementPrediction: number
}
```

#### Analytics
```typescript
// GET /api/analytics/dashboard
interface DashboardMetrics {
  totalCampaigns: number
  activeUsers: number
  conversionRate: number
  totalRevenue: number
  recentActivity: Activity[]
}

// GET /api/analytics/campaigns/{campaignId}
interface CampaignAnalytics {
  impressions: number
  clicks: number
  conversions: number
  cost: number
  roi: number
  timeline: TimelineData[]
}
```

## Error Handling

### Standard Error Format
```typescript
interface APIError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Common error codes
enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR'
}
```

### Error Handling Pattern
```typescript
const handleAPICall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    return await apiCall()
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.code) {
        case ErrorCodes.VALIDATION_ERROR:
          showValidationErrors(error.details)
          break
        case ErrorCodes.UNAUTHORIZED:
          redirectToLogin()
          break
        case ErrorCodes.RATE_LIMITED:
          showRateLimitMessage()
          break
        default:
          showGenericError()
      }
    }
    throw error
  }
}
```

## Rate Limiting

### Client-Side Rate Limiting
```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  canMakeRequest(endpoint: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const requests = this.requests.get(endpoint) || []
    
    // Remove requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= limit) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(endpoint, validRequests)
    return true
  }
}
```

## Caching Strategy

### Response Caching
```typescript
interface CacheConfig {
  key: string
  ttl: number // Time to live in milliseconds
  staleWhileRevalidate?: boolean
}

class APICache {
  private cache = new Map<string, CachedResponse>()
  
  async get<T>(key: string, fetcher: () => Promise<T>, config: CacheConfig): Promise<T> {
    const cached = this.cache.get(key)
    
    if (cached && !this.isExpired(cached, config.ttl)) {
      return cached.data
    }
    
    const data = await fetcher()
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    
    return data
  }
  
  private isExpired(cached: CachedResponse, ttl: number): boolean {
    return Date.now() - cached.timestamp > ttl
  }
}
```

## Security Considerations

### CSRF Protection
```typescript
// Include CSRF token in all state-changing requests
const apiClient = axios.create({
  headers: {
    'X-CSRF-Token': getCSRFToken()
  }
})
```

### Input Sanitization
```typescript
import DOMPurify from 'dompurify'

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}
```

### Request Signing
```typescript
const signRequest = (payload: any, secret: string): string => {
  const timestamp = Date.now()
  const data = JSON.stringify({ ...payload, timestamp })
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}
```

## Testing APIs

### Mock API Setup
```typescript
// __mocks__/api.ts
export const mockContactFormSubmission = jest.fn().mockImplementation(
  (data: ContactFormData) => {
    return Promise.resolve({
      success: true,
      message: 'Form submitted successfully'
    })
  }
)
```

### Integration Testing
```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.post('/api/contact', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: 'Contact form submitted'
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Environment Configuration

### API Endpoints
```typescript
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 5000
  },
  staging: {
    baseURL: 'https://staging-api.admybrand.ai',
    timeout: 10000
  },
  production: {
    baseURL: 'https://api.admybrand.ai',
    timeout: 10000
  }
}

export const getAPIConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  return API_CONFIG[env as keyof typeof API_CONFIG]
}
```
