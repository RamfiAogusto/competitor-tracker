"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Mail,
  MessageSquare,
  Webhook,
  Plus,
  Settings,
  Check,
  X,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export default function NotificationsPage() {
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false)

  const notifications = [
    {
      id: 1,
      title: "TechCorp pricing page updated",
      message: "New Enterprise Plus tier added at $299/month",
      type: "critical",
      competitor: "TechCorp",
      timestamp: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "StartupXYZ homepage changes",
      message: "Hero section updated with new messaging",
      type: "medium",
      competitor: "StartupXYZ",
      timestamp: "15 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "CompetitorA blog post",
      message: "New article published about AI trends",
      type: "low",
      competitor: "CompetitorA",
      timestamp: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      title: "RivalBusiness feature update",
      message: "AI Analytics Dashboard added to platform",
      type: "high",
      competitor: "RivalBusiness",
      timestamp: "3 hours ago",
      read: true,
    },
  ]

  const notificationRules = [
    {
      id: 1,
      name: "Critical Pricing Changes",
      description: "Alert when competitors update pricing pages",
      competitor: "All",
      type: "pricing",
      severity: "critical",
      channels: ["email", "slack"],
      enabled: true,
    },
    {
      id: 2,
      name: "New Feature Announcements",
      description: "Monitor feature page updates from key competitors",
      competitor: "TechCorp, StartupXYZ",
      type: "features",
      severity: "high",
      channels: ["email", "webhook"],
      enabled: true,
    },
    {
      id: 3,
      name: "Content Updates",
      description: "Track blog posts and content changes",
      competitor: "All",
      type: "content",
      severity: "low",
      channels: ["email"],
      enabled: false,
    },
  ]

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "low":
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Manage alerts and notification preferences</p>
          </div>
          <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Notification Rule</DialogTitle>
                <DialogDescription>Set up automated alerts for specific competitor changes.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input id="rule-name" placeholder="e.g. Critical Pricing Changes" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rule-description">Description</Label>
                  <Textarea id="rule-description" placeholder="Brief description of this rule..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Competitor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select competitor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Competitors</SelectItem>
                        <SelectItem value="techcorp">TechCorp</SelectItem>
                        <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                        <SelectItem value="competitora">CompetitorA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Change Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pricing">Pricing</SelectItem>
                        <SelectItem value="features">Features</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Minimum Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="rule-enabled" defaultChecked />
                  <Label htmlFor="rule-enabled">Enable this rule</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRuleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddRuleDialogOpen(false)}>Create Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 critical, 1 medium</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 rule disabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Alerts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+4</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2m</div>
              <p className="text-xs text-muted-foreground">Average alert delay</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notification Inbox</CardTitle>
                    <CardDescription>Recent alerts from your monitored competitors</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Mark All Read
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 border rounded-lg transition-colors ${
                        !notification.read ? "bg-accent/50 border-primary/20" : "border-border hover:bg-accent/30"
                      }`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3
                            className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h3>
                          <Badge variant={getNotificationTypeColor(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="font-medium">{notification.competitor}</span>
                          <span>•</span>
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Rules</CardTitle>
                <CardDescription>Configure automated alerts based on competitor changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Switch checked={rule.enabled} />
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>Competitor: {rule.competitor}</span>
                            <span>•</span>
                            <span>Type: {rule.type}</span>
                            <span>•</span>
                            <span>Min Severity: {rule.severity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {rule.channels.includes("email") && (
                            <Badge variant="outline" className="text-xs">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Badge>
                          )}
                          {rule.channels.includes("slack") && (
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Slack
                            </Badge>
                          )}
                          {rule.channels.includes("webhook") && (
                            <Badge variant="outline" className="text-xs">
                              <Webhook className="h-3 w-3 mr-1" />
                              Webhook
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>Configure email alert settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-enabled">Enable email notifications</Label>
                    <Switch id="email-enabled" defaultChecked />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input id="email-address" type="email" placeholder="alerts@company.com" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-digest">Daily digest</Label>
                    <Switch id="email-digest" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Slack Integration
                  </CardTitle>
                  <CardDescription>Send alerts to Slack channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-enabled">Enable Slack notifications</Label>
                    <Switch id="slack-enabled" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slack-webhook">Webhook URL</Label>
                    <Input id="slack-webhook" placeholder="https://hooks.slack.com/..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slack-channel">Channel</Label>
                    <Input id="slack-channel" placeholder="#competitor-alerts" />
                  </div>
                  <Button variant="outline" size="sm">
                    Test Connection
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Webhook className="h-5 w-5 mr-2" />
                    Webhook Integration
                  </CardTitle>
                  <CardDescription>Send alerts to custom endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="webhook-enabled">Enable webhook notifications</Label>
                    <Switch id="webhook-enabled" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://api.yourapp.com/webhooks/alerts" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-secret">Secret Key (Optional)</Label>
                    <Input id="webhook-secret" type="password" placeholder="Your webhook secret" />
                  </div>
                  <Button variant="outline" size="sm">
                    Test Webhook
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Push Notifications
                  </CardTitle>
                  <CardDescription>Browser and mobile push alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-enabled">Enable push notifications</Label>
                    <Switch id="push-enabled" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-critical">Critical alerts only</Label>
                    <Switch id="push-critical" defaultChecked />
                  </div>
                  <Button variant="outline" size="sm">
                    Request Permission
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
