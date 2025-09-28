import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Bell, TrendingUp, AlertTriangle, Clock, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your competitors and track changes in real-time</p>
          </div>
          <Link href="/dashboard/competitors">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitors</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Changes Detected</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+1</span> in last 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3m</div>
              <p className="text-xs text-muted-foreground">Average detection time</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Top Competitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Changes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Changes</CardTitle>
                  <CardDescription>Latest competitor website updates</CardDescription>
                </div>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm">
                    View All
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">TechCorp.com</p>
                    <Badge variant="destructive" className="text-xs">
                      Critical
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">New pricing page launched</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">StartupXYZ.io</p>
                    <Badge variant="secondary" className="text-xs">
                      Medium
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Homepage hero section updated</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">CompetitorA.com</p>
                    <Badge variant="outline" className="text-xs">
                      Low
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Blog post published</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">RivalBusiness.net</p>
                    <Badge variant="outline" className="text-xs">
                      Info
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Footer links modified</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Competitors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Competitors</CardTitle>
                  <CardDescription>Most active competitors this week</CardDescription>
                </div>
                <Link href="/dashboard/competitors">
                  <Button variant="ghost" size="sm">
                    Manage
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">TC</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">TechCorp.com</p>
                    <p className="text-xs text-muted-foreground">23 changes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={85} className="w-16 h-2" />
                  <Badge variant="destructive" className="text-xs">
                    High
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">SX</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">StartupXYZ.io</p>
                    <p className="text-xs text-muted-foreground">18 changes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={65} className="w-16 h-2" />
                  <Badge variant="secondary" className="text-xs">
                    Medium
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">CA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">CompetitorA.com</p>
                    <p className="text-xs text-muted-foreground">12 changes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={45} className="w-16 h-2" />
                  <Badge variant="outline" className="text-xs">
                    Low
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">RB</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">RivalBusiness.net</p>
                    <p className="text-xs text-muted-foreground">8 changes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={30} className="w-16 h-2" />
                  <Badge variant="outline" className="text-xs">
                    Low
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/competitors">
                <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Add Competitor</div>
                    <div className="text-xs text-muted-foreground">Start monitoring a new website</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/notifications">
                <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                  <Bell className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Setup Alerts</div>
                    <div className="text-xs text-muted-foreground">Configure notification preferences</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/history">
                <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-xs text-muted-foreground">Analyze competitor trends</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
