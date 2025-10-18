"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Key, Trash2, Download, Upload, Eye, Moon, Sun, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user, refreshAuth } = useAuth()
  const { toast } = useToast()
  const [theme, setTheme] = useState("system")
  
  // Profile form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  // Check if profile has changes
  const hasProfileChanges = () => {
    if (!user) return false
    return name.trim() !== (user.name || "") || email.trim() !== (user.email || "")
  }

  // Check if password form is complete
  const canUpdatePassword = () => {
    return currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0
  }

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingProfile(true)
    try {
      await apiClient.put('/users/profile', {
        name: name.trim(),
        email: email.trim(),
      })

      // Refresh auth to get updated user data
      await refreshAuth()

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingPassword(true)
    try {
      await apiClient.put('/users/profile', {
        currentPassword,
        password: newPassword,
      })

      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Éxito",
        description: "Contraseña actualizada correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la contraseña",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Administra tu cuenta y preferencias</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="billing">Facturación</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Actualiza tu información personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" disabled>
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground">Próximamente disponible</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>

                <Alert>
                  <AlertDescription>
                    Las siguientes opciones estarán disponibles próximamente: Empresa, Bio, Zona horaria y Tema.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-2">
                  <Label htmlFor="company" className="text-muted-foreground">Empresa</Label>
                  <Input id="company" disabled placeholder="Próximamente" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
                  <Textarea id="bio" disabled placeholder="Próximamente" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timezone" className="text-muted-foreground">Zona Horaria</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Próximamente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Próximamente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="theme" className="text-muted-foreground">Tema</Label>
                  <Select value={theme} onValueChange={setTheme} disabled>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          Oscuro
                        </div>
                      </SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={isUpdatingProfile || !hasProfileChanges()}
                >
                  {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Monitoreo</CardTitle>
                <CardDescription>Configura cómo se monitorean tus competidores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertDescription>
                    Esta sección estará disponible próximamente.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <Label htmlFor="auto-monitoring">Auto-iniciar monitoreo</Label>
                    <p className="text-sm text-muted-foreground">Iniciar monitoreo automáticamente en nuevos competidores</p>
                  </div>
                  <Switch id="auto-monitoring" disabled />
                </div>

                <div className="grid gap-2 opacity-50">
                  <Label htmlFor="check-frequency">Frecuencia de Verificación</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Próximamente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Cada 5 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button disabled>Guardar Preferencias</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>Cambia tu contraseña</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button 
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword || !canUpdatePassword()}
                >
                  {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Actualizar Contraseña
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autenticación de Dos Factores</CardTitle>
                <CardDescription>Agrega una capa extra de seguridad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Esta funcionalidad estará disponible próximamente.
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">Protege tu cuenta con 2FA</p>
                  </div>
                  <Button variant="outline" disabled>Habilitar 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claves API</CardTitle>
                <CardDescription>Administra claves API para integraciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Esta funcionalidad estará disponible próximamente.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" disabled>
                  <Key className="h-4 w-4 mr-2" />
                  Generar Nueva Clave
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Actual</CardTitle>
                <CardDescription>Administra tu suscripción y facturación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertDescription>
                    El sistema de facturación estará disponible próximamente.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                  <div>
                    <h3 className="font-semibold">Plan Gratuito</h3>
                    <p className="text-sm text-muted-foreground">Acceso básico</p>
                  </div>
                  <Badge variant="outline">Activo</Badge>
                </div>

                <div className="flex space-x-2">
                  <Button disabled>Mejorar Plan</Button>
                  <Button variant="outline" disabled>Cambiar Facturación</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Datos</CardTitle>
                <CardDescription>Exporta tus datos e historial de monitoreo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Esta funcionalidad estará disponible próximamente.
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <Label>Exportar Todos los Datos</Label>
                    <p className="text-sm text-muted-foreground">Descarga todos tus datos de monitoreo</p>
                  </div>
                  <Button variant="outline" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integraciones</CardTitle>
                <CardDescription>Conecta con herramientas y servicios externos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Las integraciones estarán disponibles próximamente.
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-sm text-muted-foreground">Enviar alertas a canales de Slack</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Conectar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                  <div>
                    <p className="font-medium">Zapier</p>
                    <p className="text-sm text-muted-foreground">Automatiza flujos de trabajo</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Conectar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
                <CardDescription>Acciones irreversibles y destructivas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Esta funcionalidad estará disponible próximamente.
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <Label>Eliminar Cuenta</Label>
                    <p className="text-sm text-muted-foreground">
                      Elimina permanentemente tu cuenta y todos los datos asociados
                    </p>
                  </div>
                  <Button variant="destructive" disabled>Eliminar Cuenta</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
