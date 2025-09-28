"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, ExternalLink, Eye, EyeOff, Trash2, Edit, Globe, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export default function CompetitorsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const competitors = [
    {
      id: 1,
      name: "TechCorp",
      url: "https://techcorp.com",
      status: "active",
      lastCheck: "2 minutes ago",
      changes: 23,
      priority: "high",
      monitoring: true,
    },
    {
      id: 2,
      name: "StartupXYZ",
      url: "https://startupxyz.io",
      status: "active",
      lastCheck: "5 minutes ago",
      changes: 18,
      priority: "medium",
      monitoring: true,
    },
    {
      id: 3,
      name: "CompetitorA",
      url: "https://competitora.com",
      status: "active",
      lastCheck: "1 hour ago",
      changes: 12,
      priority: "low",
      monitoring: true,
    },
    {
      id: 4,
      name: "RivalBusiness",
      url: "https://rivalbusiness.net",
      status: "paused",
      lastCheck: "3 hours ago",
      changes: 8,
      priority: "low",
      monitoring: false,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Competitors</h1>
            <p className="text-muted-foreground">Manage and monitor your competitor websites</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Competitor</DialogTitle>
                <DialogDescription>Add a competitor website to start monitoring changes.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" placeholder="e.g. TechCorp" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input id="url" placeholder="https://example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" placeholder="Brief description of this competitor..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="monitoring" defaultChecked />
                  <Label htmlFor="monitoring">Start monitoring immediately</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Add Competitor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Competitors</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">3 active, 1 paused</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">75% of competitors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Badge variant="destructive" className="h-4 w-4 rounded-full p-0"></Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Check Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3m</div>
              <p className="text-xs text-muted-foreground">Every 5 minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* Competitors List */}
        <Card>
          <CardHeader>
            <CardTitle>Competitor List</CardTitle>
            <CardDescription>All your monitored competitors and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(competitor.status)}`}></div>
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {competitor.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{competitor.name}</h3>
                        <Badge variant={getPriorityColor(competitor.priority)} className="text-xs">
                          {competitor.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{competitor.url}</span>
                        <span>•</span>
                        <span>{competitor.changes} changes</span>
                        <span>•</span>
                        <span>Last check: {competitor.lastCheck}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>

                    <Button variant="ghost" size="sm">
                      {competitor.monitoring ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Changes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {competitor.monitoring ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Pause Monitoring
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Resume Monitoring
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Setup Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Setup Guide</CardTitle>
            <CardDescription>Get the most out of competitor monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Add Competitors</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by adding your main competitors' websites to begin monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Set Priorities</h4>
                  <p className="text-sm text-muted-foreground">
                    Mark important competitors as high priority for faster notifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Configure Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Set up notifications to get alerted when important changes happen.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
