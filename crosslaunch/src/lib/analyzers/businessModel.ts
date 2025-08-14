import type { BusinessModel } from './opportunityScorer'

export class BusinessModelAnalyzer {
  private static readonly KNOWN_MODELS: Record<string, BusinessModel> = {
    'affirm': {
      name: 'Buy Now Pay Later (BNPL)',
      keywords: ['buy now pay later', 'installment', 'financing', 'payment plans'],
      category: 'Fintech',
      businessType: 'B2C',
      technicalComplexity: 'medium',
      regulatoryComplexity: 'high'
    },
    'doordash': {
      name: 'Food Delivery Marketplace',
      keywords: ['food delivery', 'restaurant delivery', 'meal delivery'],
      category: 'Marketplace',
      businessType: 'B2C',
      technicalComplexity: 'medium',
      regulatoryComplexity: 'medium'
    },
    'robinhood': {
      name: 'Commission-free Trading',
      keywords: ['stock trading', 'investing', 'commission-free', 'retail trading'],
      category: 'Fintech',
      businessType: 'B2C',
      technicalComplexity: 'high',
      regulatoryComplexity: 'high'
    },
    'duolingo': {
      name: 'Gamified Learning Platform',
      keywords: ['language learning', 'education', 'gamification', 'mobile learning'],
      category: 'Education',
      businessType: 'B2C',
      technicalComplexity: 'medium',
      regulatoryComplexity: 'low'
    },
    'canva': {
      name: 'Online Design Tool',
      keywords: ['graphic design', 'templates', 'design tool', 'visual content'],
      category: 'SaaS',
      businessType: 'B2C',
      technicalComplexity: 'medium',
      regulatoryComplexity: 'low'
    },
    'notion': {
      name: 'All-in-one Workspace',
      keywords: ['notes', 'productivity', 'collaboration', 'workspace', 'documentation'],
      category: 'Productivity',
      businessType: 'B2B2C',
      technicalComplexity: 'medium',
      regulatoryComplexity: 'low'
    },
    'discord': {
      name: 'Community Chat Platform',
      keywords: ['chat', 'community', 'gaming', 'voice chat', 'server'],
      category: 'Communication',
      businessType: 'B2C',
      technicalComplexity: 'medium',
      regulatoryComplexity: 'low'
    },
    'calendly': {
      name: 'Scheduling Tool',
      keywords: ['calendar', 'booking', 'scheduling', 'appointments', 'meetings'],
      category: 'SaaS',
      businessType: 'B2B',
      technicalComplexity: 'low',
      regulatoryComplexity: 'low'
    },
    'zoom': {
      name: 'Video Conferencing',
      keywords: ['video call', 'meeting', 'conferencing', 'webinar', 'remote'],
      category: 'Communication',
      businessType: 'B2B',
      technicalComplexity: 'high',
      regulatoryComplexity: 'medium'
    },
    'substack': {
      name: 'Newsletter Platform',
      keywords: ['newsletter', 'publishing', 'subscription', 'content creator'],
      category: 'Publishing',
      businessType: 'B2C',
      technicalComplexity: 'low',
      regulatoryComplexity: 'low'
    }
  }

  static identifyBusinessModel(input: {
    name?: string
    url?: string
    description?: string
    keywords?: string[]
  }): BusinessModel {
    // Try to match against known models first
    if (input.name) {
      const normalizedName = input.name.toLowerCase()
      for (const [key, model] of Object.entries(this.KNOWN_MODELS)) {
        if (normalizedName.includes(key)) {
          return model
        }
      }
    }

    if (input.url) {
      const domain = this.extractDomain(input.url)
      if (domain && this.KNOWN_MODELS[domain]) {
        return this.KNOWN_MODELS[domain]
      }
    }

    // Fallback to keyword-based classification
    return this.classifyByKeywords(input.keywords || [], input.description || '')
  }

  private static extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      const hostname = urlObj.hostname.toLowerCase()
      // Remove www. and get main domain
      const domain = hostname.replace(/^www\./, '').split('.')[0]
      return domain
    } catch {
      return null
    }
  }

  private static classifyByKeywords(keywords: string[], description: string): BusinessModel {
    const text = [...keywords, description].join(' ').toLowerCase()

    // Fintech patterns
    if (this.matchesPattern(text, ['payment', 'finance', 'banking', 'loan', 'credit', 'trading', 'invest'])) {
      return {
        name: 'Financial Services',
        keywords: ['fintech', 'financial services'],
        category: 'Fintech',
        businessType: 'B2C',
        technicalComplexity: 'high',
        regulatoryComplexity: 'high'
      }
    }

    // Marketplace patterns
    if (this.matchesPattern(text, ['marketplace', 'delivery', 'booking', 'platform', 'connect'])) {
      return {
        name: 'Marketplace Platform',
        keywords: ['marketplace', 'platform'],
        category: 'Marketplace',
        businessType: 'B2C',
        technicalComplexity: 'medium',
        regulatoryComplexity: 'medium'
      }
    }

    // SaaS/Productivity patterns
    if (this.matchesPattern(text, ['software', 'saas', 'tool', 'productivity', 'management', 'automation'])) {
      return {
        name: 'SaaS Tool',
        keywords: ['saas', 'software', 'tool'],
        category: 'SaaS',
        businessType: 'B2B',
        technicalComplexity: 'medium',
        regulatoryComplexity: 'low'
      }
    }

    // Education patterns
    if (this.matchesPattern(text, ['education', 'learning', 'course', 'training', 'teach'])) {
      return {
        name: 'Education Platform',
        keywords: ['education', 'learning'],
        category: 'Education',
        businessType: 'B2C',
        technicalComplexity: 'medium',
        regulatoryComplexity: 'low'
      }
    }

    // Communication patterns
    if (this.matchesPattern(text, ['chat', 'messaging', 'communication', 'social', 'community'])) {
      return {
        name: 'Communication Platform',
        keywords: ['communication', 'social'],
        category: 'Communication',
        businessType: 'B2C',
        technicalComplexity: 'medium',
        regulatoryComplexity: 'low'
      }
    }

    // E-commerce patterns
    if (this.matchesPattern(text, ['ecommerce', 'shop', 'retail', 'store', 'sell'])) {
      return {
        name: 'E-commerce Platform',
        keywords: ['ecommerce', 'retail'],
        category: 'E-commerce',
        businessType: 'B2C',
        technicalComplexity: 'medium',
        regulatoryComplexity: 'medium'
      }
    }

    // Default fallback
    return {
      name: 'Digital Platform',
      keywords: ['digital', 'platform'],
      category: 'Technology',
      businessType: 'B2C',
      technicalComplexity: 'medium',
      regulatoryComplexity: 'low'
    }
  }

  private static matchesPattern(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern))
  }

  static getBusinessModelKeywords(businessModel: BusinessModel): string[] {
    return [
      ...businessModel.keywords,
      businessModel.name.toLowerCase(),
      businessModel.category.toLowerCase()
    ]
  }
}