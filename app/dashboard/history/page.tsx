"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  History,
  Search,
  ExternalLink,
  Eye,
  Calendar,
  TrendingUp,
  AlertTriangle,
  FileText,
  Code,
  Palette,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export default function HistoryPage() {
  const [selectedChange, setSelectedChange] = useState<any>(null)

  const changes = [
    {
      id: 1,
      competitor: "TechCorp",
      url: "https://techcorp.com/pricing",
      type: "pricing",
      severity: "critical",
      title: "New pricing tier added",
      description: "Added 'Enterprise Plus' tier at $299/month with advanced features",
      timestamp: "2 minutes ago",
      date: "2025-01-15",
      changes: [
        { type: "added", content: "Enterprise Plus - $299/month" },
        { type: "modified", content: "Updated feature comparison table" },
        { type: "added", content: "New 'Contact Sales' CTA button" },
      ],
      screenshot: "/pricing-page-screenshot.jpg",
    },
    {
      id: 2,
      competitor: "StartupXYZ",
      url: "https://startupxyz.io",
      type: "content",
      severity: "medium",
      title: "Homepage hero section updated",
      description: "Changed main headline and added new product demo video",
      timestamp: "15 minutes ago",
      date: "2025-01-15",
      changes: [
        { type: "modified", content: "Main headline: 'Build faster' → 'Ship faster'" },
        { type: "added", content: "Product demo video embedded" },
        { type: "modified", content: "CTA button color changed to blue" },
      ],
      screenshot: "/homepage-hero-section.jpg",
    },
    {
      id: 3,
      competitor: "CompetitorA",
      url: "https://competitora.com/blog",
      type: "content",
      severity: "low",
      title: "New blog post published",
      description: "Published article about 'AI in Customer Service'",
      timestamp: "1 hour ago",
      date: "2025-01-15",
      changes: [
        { type: "added", content: "New blog post: 'AI in Customer Service'" },
        { type: "modified", content: "Updated blog navigation menu" },
      ],
      screenshot: "/blog-post-page.jpg",
    },
    {
      id: 4,
      competitor: "RivalBusiness",
      url: "https://rivalbusiness.net/features",
      type: "features",
      severity: "high",
      title: "New feature announcement",
      description: "Added AI-powered analytics dashboard to their platform",
      timestamp: "3 hours ago",
      date: "2025-01-15",
      changes: [
        { type: "added", content: "AI Analytics Dashboard feature" },
        { type: "modified", content: "Updated features page layout" },
        { type: "added", content: "New feature comparison chart" },
      ],
      screenshot: "/features-page-with-analytics.jpg",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return <TrendingUp className="h-4 w-4" />
      case "content":
        return <FileText className="h-4 w-4" />
      case "features":
        return <AlertTriangle className="h-4 w-4" />
      case "design":
        return <Palette className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "added":
        return "text-green-600 dark:text-green-400"
      case "modified":
        return "text-yellow-600 dark:text-yellow-400"
      case "removed":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Change History</h1>
            <p className="text-muted-foreground">Track all competitor website changes and analyze trends</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Changes</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Changes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+3</span> in last 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Active</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TechCorp</div>
              <p className="text-xs text-muted-foreground">23 changes this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3h</div>
              <p className="text-xs text-muted-foreground">Time to detect changes</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter changes by competitor, type, or severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search changes..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Competitors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitors</SelectItem>
                  <SelectItem value="techcorp">TechCorp</SelectItem>
                  <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                  <SelectItem value="competitora">CompetitorA</SelectItem>
                  <SelectItem value="rivalbusiness">RivalBusiness</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Changes List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
            <CardDescription>All detected changes across your monitored competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {changes.map((change) => (
                <div
                  key={change.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg flex-shrink-0">
                      {getTypeIcon(change.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{change.title}</h3>
                        <Badge variant={getSeverityColor(change.severity)} className="text-xs">
                          {change.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{change.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="font-medium">{change.competitor}</span>
                        <span>•</span>
                        <span>{change.timestamp}</span>
                        <span>•</span>
                        <span>{change.changes.length} changes detected</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={change.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedChange(change)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{change.title}</DialogTitle>
                          <DialogDescription>
                            {change.competitor} • {change.timestamp}
                          </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="changes" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="changes">Changes</TabsTrigger>
                            <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                            <TabsTrigger value="code">Code Diff</TabsTrigger>
                          </TabsList>

                          <TabsContent value="changes" className="space-y-4">
                            <div className="space-y-3">
                              {change.changes.map((item: any, index: number) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                                  <div className={`text-sm font-medium ${getChangeTypeColor(item.type)} capitalize`}>
                                    {item.type}
                                  </div>
                                  <div className="text-sm flex-1">{item.content}</div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="screenshot">
                            <div className="space-y-4">
                              <img
                                src={change.screenshot || "/placeholder.svg"}
                                alt="Website screenshot"
                                className="w-full rounded-lg border"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="code">
                            <div className="space-y-4">
                              <div className="bg-muted p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Code className="h-4 w-4" />
                                  <span className="text-sm font-medium">HTML Changes</span>
                                </div>
                                <pre className="text-xs text-muted-foreground overflow-x-auto">
                                  {`- <h1>Build faster</h1>
+ <h1>Ship faster</h1>

+ <video src="demo.mp4" autoplay></video>

- <button class="bg-green-500">Get Started</button>
+ <button class="bg-blue-500">Get Started</button>`}
                                </pre>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
