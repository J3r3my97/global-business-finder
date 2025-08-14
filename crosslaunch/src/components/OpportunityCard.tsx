'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Globe, AlertCircle } from "lucide-react"
import Link from "next/link"

interface OpportunityCardProps {
  opportunity: {
    country: string
    countryCode: string
    score: number
    competitionLevel: 'none' | 'low' | 'medium' | 'high'
    marketSize: number
    quickInsights: string[]
  }
  businessModel: {
    name: string
    category: string
  }
}

export function OpportunityCard({ opportunity, businessModel }: OpportunityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800'
    if (score >= 6) return 'bg-yellow-100 text-yellow-800'
    if (score >= 4) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'none': return 'bg-green-100 text-green-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatMarketSize = (size: number) => {
    if (size >= 1_000_000_000) {
      return `${(size / 1_000_000_000).toFixed(1)}B`
    }
    if (size >= 1_000_000) {
      return `${Math.round(size / 1_000_000)}M`
    }
    return `${Math.round(size / 1_000)}K`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{opportunity.country}</CardTitle>
          </div>
          <Badge 
            variant="secondary" 
            className={getScoreColor(opportunity.score)}
          >
            {opportunity.score.toFixed(1)}/10
          </Badge>
        </div>
        <CardDescription>
          {businessModel.name} opportunity in {opportunity.country}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
            <div className="text-sm text-gray-600">Market Size</div>
            <div className="font-semibold">{formatMarketSize(opportunity.marketSize)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <AlertCircle className="h-5 w-5 mx-auto mb-1 text-gray-600" />
            <div className="text-sm text-gray-600">Competition</div>
            <Badge 
              variant="secondary" 
              className={getCompetitionColor(opportunity.competitionLevel)}
            >
              {opportunity.competitionLevel}
            </Badge>
          </div>
        </div>

        {/* Quick Insights */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Key Insights
          </h4>
          <ul className="space-y-1">
            {opportunity.quickInsights.slice(0, 2).map((insight, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <Link href={`/opportunities/${opportunity.countryCode}?business=${encodeURIComponent(businessModel.name)}`}>
          <Button className="w-full" variant="outline">
            View Full Analysis
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}