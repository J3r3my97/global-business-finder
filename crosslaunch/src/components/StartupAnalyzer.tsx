'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, Globe, TrendingUp } from "lucide-react"
import { OpportunityCard } from './OpportunityCard'

interface AnalysisResult {
  businessModel: {
    name: string
    category: string
    businessType: string
    technicalComplexity: string
    regulatoryComplexity: string
  }
  opportunities: Array<{
    country: string
    countryCode: string
    score: number
    competitionLevel: 'none' | 'low' | 'medium' | 'high'
    marketSize: number
    quickInsights: string[]
  }>
  analysisTime: string
}

export function StartupAnalyzer() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter a startup URL or business type')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const isUrl = input.includes('.com') || input.includes('http')
      const payload = isUrl 
        ? { startupUrl: input.trim() }
        : { businessType: input.trim() }

      const response = await fetch('/api/check-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze()
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Opportunity Analyzer
          </CardTitle>
          <CardDescription>
            Enter a startup URL (e.g., airbnb.com) or describe a business model (e.g., "food delivery")
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter startup URL or business type..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-4"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !input.trim()}
              className="px-6"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Business Model Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Business Model Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Business Model</p>
                  <p className="font-semibold">{result.businessModel.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <Badge variant="secondary">{result.businessModel.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Business Type</p>
                  <Badge variant="outline">{result.businessModel.businessType}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Complexity</p>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      Tech: {result.businessModel.technicalComplexity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Reg: {result.businessModel.regulatoryComplexity}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Opportunities */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Market Opportunities</h2>
              <Badge variant="secondary">
                {result.opportunities.length} markets analyzed
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.opportunities.map((opportunity, index) => (
                <OpportunityCard
                  key={opportunity.countryCode}
                  opportunity={opportunity}
                  businessModel={result.businessModel}
                />
              ))}
            </div>
          </div>

          {/* Analysis Footer */}
          <div className="text-center text-sm text-gray-500">
            Analysis completed at {new Date(result.analysisTime).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}