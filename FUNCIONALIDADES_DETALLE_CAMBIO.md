# Funcionalidades Avanzadas - Detalle de Cambio

## 📋 Documento de Especificaciones

Este documento describe las funcionalidades avanzadas propuestas para la página de detalle de cambio individual en el Competitor Tracker.

---

## 1. 🔍 Comparación Visual entre Versiones (Diff HTML)

### **Descripción**
Mostrar una comparación visual lado a lado (o unificada) del HTML entre dos versiones, resaltando las diferencias exactas en el código fuente.

### **Funcionalidad Actual del SaaS**
El sistema ya:
- ✅ Captura HTML completo de cada versión
- ✅ Almacena versiones completas periódicamente
- ✅ Guarda diffs incrementales entre versiones
- ✅ Detecta cambios con `diff` library
- ✅ Normaliza HTML para comparaciones precisas

### **Implementación Propuesta**

#### **Backend (Ya implementado)**
```javascript
// competitor-tracker-Backend/src/services/changeDetector.js
class ChangeDetector {
  async compareVersions(lastSnapshot, currentHtml) {
    // Ya existe:
    const diff = require('diff')
    const changes = diff.diffLines(prevHtmlStr, currHtmlStr)
    
    // Retorna:
    return {
      changes: changes,        // Array de diffs
      changeCount: significantChanges.length,
      htmlBefore: prevHtmlStr, // HTML anterior
      htmlAfter: currHtmlStr   // HTML actual
    }
  }
}
```

#### **Frontend - Componente de Diff Visual**

**Archivo:** `competitor-tracker/components/html-diff-viewer.tsx`

```typescript
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, SplitSquare, FileText } from "lucide-react"

interface HtmlDiffViewerProps {
  htmlBefore: string
  htmlAfter: string
  changes: Array<{
    added?: boolean
    removed?: boolean
    value: string
  }>
}

export const HtmlDiffViewer = ({ htmlBefore, htmlAfter, changes }: HtmlDiffViewerProps) => {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Comparación de HTML
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'unified' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('unified')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Unificado
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('split')}
            >
              <SplitSquare className="h-4 w-4 mr-2" />
              Lado a Lado
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'unified' ? (
          <UnifiedDiffView changes={changes} />
        ) : (
          <SplitDiffView htmlBefore={htmlBefore} htmlAfter={htmlAfter} />
        )}
      </CardContent>
    </Card>
  )
}

const UnifiedDiffView = ({ changes }: { changes: any[] }) => {
  return (
    <div className="font-mono text-xs bg-muted rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
      {changes.map((change, index) => (
        <div
          key={index}
          className={`
            ${change.added ? 'bg-green-500/20 text-green-700 dark:text-green-300' : ''}
            ${change.removed ? 'bg-red-500/20 text-red-700 dark:text-red-300' : ''}
            ${!change.added && !change.removed ? 'text-muted-foreground' : ''}
            whitespace-pre-wrap break-all
          `}
        >
          {change.added && '+ '}
          {change.removed && '- '}
          {!change.added && !change.removed && '  '}
          {change.value}
        </div>
      ))}
    </div>
  )
}

const SplitDiffView = ({ htmlBefore, htmlAfter }: { htmlBefore: string; htmlAfter: string }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Badge variant="destructive" className="mb-2">Antes</Badge>
        <div className="font-mono text-xs bg-muted rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="whitespace-pre-wrap break-all">{htmlBefore}</pre>
        </div>
      </div>
      <div>
        <Badge variant="default" className="mb-2">Después</Badge>
        <div className="font-mono text-xs bg-muted rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="whitespace-pre-wrap break-all">{htmlAfter}</pre>
        </div>
      </div>
    </div>
  )
}
```

#### **API Endpoint Necesario**

**Archivo:** `competitor-tracker-Backend/src/routes/competitors.js`

```javascript
// Nuevo endpoint para obtener diff completo
router.get('/:id/changes/:changeId/diff', 
  validateCompetitor.getById, 
  asyncHandler(async (req, res) => {
    const { id, changeId } = req.params
    const userId = req.user.id

    // Obtener el snapshot específico
    const snapshot = await Snapshot.findOne({
      where: { 
        id: changeId,
        competitorId: id 
      }
    })

    if (!snapshot) {
      throw new AppError('Snapshot no encontrado', 404)
    }

    // Obtener snapshot anterior
    const previousSnapshot = await Snapshot.findOne({
      where: {
        competitorId: id,
        versionNumber: snapshot.versionNumber - 1
      }
    })

    // Reconstruir HTML completo
    const changeDetector = require('../services/changeDetector')
    const currentHtml = await changeDetector.getHTMLFromSnapshot(snapshot)
    const previousHtml = previousSnapshot 
      ? await changeDetector.getHTMLFromSnapshot(previousSnapshot)
      : ''

    // Generar diff
    const diff = require('diff')
    const changes = diff.diffLines(previousHtml, currentHtml)

    res.json({
      success: true,
      data: {
        htmlBefore: previousHtml,
        htmlAfter: currentHtml,
        changes: changes,
        snapshotId: snapshot.id,
        versionNumber: snapshot.versionNumber
      }
    })
  })
)
```

#### **Integración en la Página de Detalle**

```typescript
// En competitor-tracker/app/dashboard/competitors/[id]/changes/[changeId]/page.tsx

const [diffData, setDiffData] = useState(null)
const [loadingDiff, setLoadingDiff] = useState(false)

const loadDiffData = async () => {
  try {
    setLoadingDiff(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/competitors/${competitorId}/changes/${changeId}/diff`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    const data = await response.json()
    setDiffData(data.data)
  } catch (error) {
    console.error('Error loading diff:', error)
  } finally {
    setLoadingDiff(false)
  }
}

// En el JSX, agregar:
{diffData && (
  <HtmlDiffViewer
    htmlBefore={diffData.htmlBefore}
    htmlAfter={diffData.htmlAfter}
    changes={diffData.changes}
  />
)}
```

---

## 2. 📸 Screenshots del Sitio en ese Momento

### **Descripción**
Capturar y almacenar screenshots visuales del sitio web en el momento exacto de cada cambio detectado, permitiendo ver cómo se veía visualmente la página.

### **Funcionalidad Actual del SaaS**
El sistema ya:
- ✅ Usa HeadlessX con Playwright (navegador headless)
- ✅ Captura HTML completo
- ✅ Tiene acceso a capacidades de screenshot de Playwright
- ✅ Almacena metadatos en JSONB

### **Implementación Propuesta**

#### **Backend - Servicio de Screenshots**

**Archivo:** `competitor-tracker-Backend/src/services/screenshotService.js`

```javascript
const path = require('path')
const fs = require('fs').promises
const logger = require('../utils/logger')
const { AppError } = require('../middleware/errorHandler')

class ScreenshotService {
  constructor() {
    this.screenshotsDir = path.join(__dirname, '../../public/screenshots')
    this.ensureDirectoryExists()
  }

  async ensureDirectoryExists() {
    try {
      await fs.mkdir(this.screenshotsDir, { recursive: true })
    } catch (error) {
      logger.error('Error creando directorio de screenshots:', error)
    }
  }

  /**
   * Capturar screenshot usando HeadlessX
   */
  async captureScreenshot(url, snapshotId, options = {}) {
    try {
      const headlessXService = require('./headlessXService')
      
      // Solicitar screenshot a HeadlessX
      const response = await headlessXService.captureScreenshot(url, {
        fullPage: options.fullPage !== false,
        waitFor: options.waitFor || 3000,
        viewport: options.viewport || { width: 1920, height: 1080 }
      })

      // Guardar imagen
      const filename = `${snapshotId}-${Date.now()}.png`
      const filepath = path.join(this.screenshotsDir, filename)
      
      await fs.writeFile(filepath, response.screenshot, 'base64')

      logger.info(`Screenshot guardado: ${filename}`)

      return {
        filename,
        filepath,
        url: `/screenshots/${filename}`,
        size: response.size,
        dimensions: response.dimensions
      }
    } catch (error) {
      logger.error('Error capturando screenshot:', error)
      throw new AppError('Error capturando screenshot', 500)
    }
  }

  /**
   * Obtener screenshot por ID
   */
  async getScreenshot(snapshotId) {
    try {
      const files = await fs.readdir(this.screenshotsDir)
      const screenshot = files.find(f => f.startsWith(snapshotId))
      
      if (!screenshot) {
        return null
      }

      return {
        filename: screenshot,
        url: `/screenshots/${screenshot}`,
        filepath: path.join(this.screenshotsDir, screenshot)
      }
    } catch (error) {
      logger.error('Error obteniendo screenshot:', error)
      return null
    }
  }

  /**
   * Eliminar screenshots antiguos (cleanup)
   */
  async cleanupOldScreenshots(daysOld = 90) {
    try {
      const files = await fs.readdir(this.screenshotsDir)
      const now = Date.now()
      const maxAge = daysOld * 24 * 60 * 60 * 1000

      for (const file of files) {
        const filepath = path.join(this.screenshotsDir, file)
        const stats = await fs.stat(filepath)
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filepath)
          logger.info(`Screenshot eliminado: ${file}`)
        }
      }
    } catch (error) {
      logger.error('Error limpiando screenshots:', error)
    }
  }
}

module.exports = new ScreenshotService()
```

#### **Backend - Extensión de HeadlessX Service**

**Archivo:** `competitor-tracker-Backend/src/services/headlessXService.js`

```javascript
// Agregar método para capturar screenshots
async captureScreenshot(url, options = {}) {
  try {
    const response = await this.client.post('/api/screenshot', {
      url,
      fullPage: options.fullPage !== false,
      waitFor: options.waitFor || 3000,
      viewport: options.viewport || { width: 1920, height: 1080 },
      format: 'png',
      quality: options.quality || 90
    })

    return {
      screenshot: response.data.screenshot, // Base64
      size: response.data.size,
      dimensions: response.data.dimensions
    }
  } catch (error) {
    throw this.handleError(error, 'Error capturando screenshot')
  }
}
```

#### **Backend - Integración en Change Detector**

```javascript
// En competitor-tracker-Backend/src/services/changeDetector.js

async createNewVersion(competitorId, comparison, options = {}) {
  // ... código existente ...

  // Capturar screenshot si está habilitado
  let screenshotData = null
  if (options.captureScreenshot) {
    try {
      const screenshotService = require('./screenshotService')
      const { Competitor } = require('../models')
      const competitor = await Competitor.findByPk(competitorId)
      
      screenshotData = await screenshotService.captureScreenshot(
        competitor.url,
        snapshot.id,
        { fullPage: true }
      )
      
      logger.info('Screenshot capturado exitosamente', {
        snapshotId: snapshot.id,
        filename: screenshotData.filename
      })
    } catch (error) {
      logger.error('Error capturando screenshot:', error)
      // No fallar si el screenshot falla
    }
  }

  // Actualizar metadata con screenshot
  if (screenshotData) {
    await snapshot.update({
      metadata: {
        ...snapshot.metadata,
        screenshot: {
          filename: screenshotData.filename,
          url: screenshotData.url,
          size: screenshotData.size,
          dimensions: screenshotData.dimensions,
          capturedAt: new Date().toISOString()
        }
      }
    })
  }

  return snapshot
}
```

#### **Frontend - Componente de Screenshot Viewer**

**Archivo:** `competitor-tracker/components/screenshot-viewer.tsx`

```typescript
"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, Maximize2, Download, ExternalLink } from "lucide-react"

interface ScreenshotViewerProps {
  screenshot: {
    url: string
    filename: string
    dimensions?: { width: number; height: number }
    capturedAt: string
  }
  competitorUrl: string
}

export const ScreenshotViewer = ({ screenshot, competitorUrl }: ScreenshotViewerProps) => {
  const [fullscreen, setFullscreen] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `${process.env.NEXT_PUBLIC_API_URL}${screenshot.url}`
    link.download = screenshot.filename
    link.click()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Screenshot del Sitio
            </CardTitle>
            <Badge variant="outline">
              {new Date(screenshot.capturedAt).toLocaleDateString('es-ES')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative group cursor-pointer" onClick={() => setFullscreen(true)}>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${screenshot.url}`}
              alt="Screenshot del sitio"
              width={screenshot.dimensions?.width || 1920}
              height={screenshot.dimensions?.height || 1080}
              className="w-full h-auto rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Maximize2 className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setFullscreen(true)}>
              <Maximize2 className="h-4 w-4 mr-2" />
              Ver Completo
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={competitorUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Sitio Actual
              </a>
            </Button>
          </div>

          {screenshot.dimensions && (
            <div className="text-xs text-muted-foreground">
              Dimensiones: {screenshot.dimensions.width} x {screenshot.dimensions.height}px
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <DialogHeader className="p-4">
            <DialogTitle>Screenshot Completo</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto p-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${screenshot.url}`}
              alt="Screenshot del sitio"
              width={screenshot.dimensions?.width || 1920}
              height={screenshot.dimensions?.height || 1080}
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

#### **Integración en Página de Detalle**

```typescript
// En competitor-tracker/app/dashboard/competitors/[id]/changes/[changeId]/page.tsx

// En la sección de columna principal, agregar:
{change.metadata?.screenshot && (
  <ScreenshotViewer
    screenshot={change.metadata.screenshot}
    competitorUrl={competitor.url}
  />
)}
```

---

## 3. 📊 Configuración y Habilitación

### **Settings del Competidor**

Agregar opciones en la configuración del competidor:

```typescript
// En la página de settings del competidor
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <Label>Capturar Screenshots</Label>
      <p className="text-sm text-muted-foreground">
        Guardar capturas visuales en cada cambio detectado
      </p>
    </div>
    <Switch
      checked={captureScreenshots}
      onCheckedChange={setCaptureScreenshots}
    />
  </div>

  <div className="flex items-center justify-between">
    <div>
      <Label>Screenshot Completo</Label>
      <p className="text-sm text-muted-foreground">
        Capturar toda la página (puede ser más lento)
      </p>
    </div>
    <Switch
      checked={fullPageScreenshot}
      onCheckedChange={setFullPageScreenshot}
      disabled={!captureScreenshots}
    />
  </div>
</div>
```

---

## 4. 🗄️ Consideraciones de Almacenamiento

### **Estimación de Espacio**

- **Screenshot promedio**: ~500KB - 2MB (PNG comprimido)
- **100 cambios/mes**: ~50MB - 200MB
- **1 año**: ~600MB - 2.4GB por competidor

### **Estrategias de Optimización**

1. **Compresión**: Usar WebP en lugar de PNG (60-70% menos espacio)
2. **Limpieza automática**: Eliminar screenshots > 90 días
3. **Almacenamiento en la nube**: S3/CloudFlare R2 para escalabilidad
4. **Screenshots opcionales**: Solo para cambios importantes (medium/high/critical)

---

## 5. 📝 Resumen de Archivos a Crear/Modificar

### **Backend**
- ✅ `src/services/screenshotService.js` (nuevo)
- ✅ `src/services/headlessXService.js` (extender)
- ✅ `src/services/changeDetector.js` (modificar)
- ✅ `src/routes/competitors.js` (agregar endpoint `/diff`)
- ✅ `public/screenshots/` (crear directorio)

### **Frontend**
- ✅ `components/html-diff-viewer.tsx` (nuevo)
- ✅ `components/screenshot-viewer.tsx` (nuevo)
- ✅ `app/dashboard/competitors/[id]/changes/[changeId]/page.tsx` (modificar)
- ✅ `app/dashboard/competitors/[id]/page.tsx` (agregar settings)

### **Base de Datos**
- ✅ Metadata ya soporta JSONB (no requiere migración)

---

## 6. 🚀 Plan de Implementación

### **Fase 1: Diff HTML** (2-3 horas)
1. Crear endpoint `/diff` en backend
2. Crear componente `HtmlDiffViewer`
3. Integrar en página de detalle
4. Testing

### **Fase 2: Screenshots** (4-6 horas)
1. Implementar `screenshotService`
2. Extender HeadlessX service
3. Integrar en `changeDetector`
4. Crear componente `ScreenshotViewer`
5. Agregar configuración en settings
6. Testing y optimización

### **Fase 3: Optimización** (2-3 horas)
1. Implementar compresión WebP
2. Crear job de limpieza automática
3. Configurar almacenamiento en la nube (opcional)
4. Documentación

---

## 7. ✅ Estado Actual

- ✅ Página de detalle de cambio creada
- ✅ Navegación entre cambios implementada
- ✅ Visualización de secciones detectadas
- ✅ Análisis de IA integrado
- ⏳ Diff HTML (pendiente)
- ⏳ Screenshots (pendiente)

---

**Última actualización:** 2 de Noviembre, 2025

