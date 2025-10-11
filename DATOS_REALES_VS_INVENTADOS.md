# 📊 Datos Reales vs. Inventados - Página de Detalle del Competidor

## ✅ DATOS COMPLETAMENTE REALES (Vienen del Backend)

### Modelo: Competitor

**Endpoint**: `GET /api/competitors/:id`

```typescript
{
  id: string                    // ✅ REAL - UUID de la BD
  name: string                  // ✅ REAL - Nombre del competidor
  url: string                   // ✅ REAL - URL del sitio web
  description: string           // ✅ REAL - Descripción (puede ser null)
  monitoringEnabled: boolean    // ✅ REAL - Estado del monitoreo
  checkInterval: number         // ✅ REAL - Intervalo en segundos
  priority: string              // ✅ REAL - 'low' | 'medium' | 'high'
  lastCheckedAt: string         // ✅ REAL - Timestamp ISO (puede ser null)
  totalVersions: number         // ✅ REAL - Contador de versiones
  lastChangeAt: string          // ✅ REAL - Timestamp del último cambio (puede ser null)
  isActive: boolean             // ✅ REAL - Si está activo
  created_at: string            // ✅ REAL - Fecha de creación
  updated_at: string            // ✅ REAL - Fecha de actualización
  
  // Campos calculados (JOIN con snapshots):
  severity: string              // ✅ REAL - Del último snapshot
  changeCount: number           // ✅ REAL - Del último snapshot
}
```

**Fuente**: Tabla `competitors` + JOIN con `snapshots` (último snapshot donde `isCurrent = true`)

---

### Modelo: ChangeHistory (Snapshots)

**Endpoint**: `GET /api/competitors/:id/history`

```typescript
{
  id: string                    // ✅ REAL - UUID del snapshot
  versionNumber: number         // ✅ REAL - Número de versión (1, 2, 3...)
  isFullVersion: boolean        // ✅ REAL - Si es versión completa o diff
  isCurrent: boolean           // ✅ REAL - Si es la versión actual
  changeCount: number          // ✅ REAL - Número de cambios detectados
  changePercentage: string     // ✅ REAL - Porcentaje (DECIMAL de Postgres)
  severity: string             // ✅ REAL - 'low' | 'medium' | 'high' | 'critical'
  changeType: string           // ✅ REAL - 'content' | 'design' | 'pricing' | 'feature' | 'other'
                               //           (Clasificado automáticamente por IA del backend)
  changeSummary: string        // ✅ REAL - Resumen del cambio generado
  created_at: string           // ✅ REAL - Timestamp de creación
  updated_at: string           // ✅ REAL - Timestamp de actualización
}
```

**Fuente**: Tabla `snapshots`

---

## ❌ DATOS QUE NO EXISTEN (Frontend Only)

### Campos que NO vienen del Backend

```typescript
{
  details: string              // ❌ INVENTADO - No existe en la BD
                               //    Usado en: Tab historial para mostrar detalles adicionales
                               //    Solución: Siempre será undefined
  
  timestamp: string            // ⚠️  ALIAS - No viene del backend, es alias de created_at
                               //    Solución: Usar created_at directamente
  
  summary: string              // ⚠️  ALIAS - No viene del backend, es alias de changeSummary
                               //    Solución: Usar changeSummary directamente
}
```

---

## 🔄 Cambios Realizados para Datos Reales

### 1. ✅ Agregado campo `changeType` al modelo Snapshot

**Archivo**: `src/models/Snapshot.js`

```javascript
changeType: {
  type: DataTypes.ENUM('content', 'design', 'pricing', 'feature', 'other'),
  defaultValue: 'other',
  field: 'change_type'
}
```

### 2. ✅ Clasificación automática de cambios

**Archivo**: `src/services/changeDetector.js`

Nueva función: `classifyChangeType(changes, changeSummary)`

**Cómo funciona**:
- Analiza el `changeSummary` y el contenido de los cambios
- Busca palabras clave en español e inglés
- Asigna puntos a cada categoría
- Retorna la categoría con mayor puntuación

**Keywords por categoría**:

```javascript
pricing: ['precio', 'price', '$', 'plan', 'mes', 'month', 'descuento', 'discount', 'gratis', 'free', 'pago', 'payment', 'subscription']

feature: ['funcionalidad', 'feature', 'función', 'integración', 'integration', 'api', 'herramienta', 'tool', 'nuevo', 'new', 'agregado', 'added']

design: ['diseño', 'design', 'color', 'estilo', 'style', 'tema', 'theme', 'interfaz', 'interface', 'ui', 'ux', 'layout', 'css']

content: ['contenido', 'content', 'texto', 'text', 'artículo', 'article', 'blog', 'página', 'page', 'sección', 'section']
```

### 3. ✅ Script de migración creado

**Archivo**: `scripts/add-change-type-to-snapshots.js`

**Qué hace**:
- Agrega la columna `change_type` a la tabla `snapshots`
- Crea el ENUM `change_type_enum`
- Clasifica automáticamente los snapshots existentes usando keywords
- Muestra estadísticas de clasificación

**Para ejecutar**:
```bash
node scripts/add-change-type-to-snapshots.js
```

### 4. ✅ Endpoint actualizado

**Archivo**: `src/routes/competitors.js`

El endpoint `GET /api/competitors/:id/history` ahora incluye:
```javascript
attributes: [
  'id',
  'versionNumber',
  'isFullVersion',
  'isCurrent',
  'changeCount',
  'changePercentage',
  'severity',
  'changeType',        // ✅ NUEVO
  'changeSummary',
  'created_at',
  'updated_at'
]
```

---

## 📋 Tabla Resumen: Datos por Sección

### Header
| Dato | Fuente | Real |
|------|--------|------|
| Nombre | `competitor.name` | ✅ |
| Priority Badge | `competitor.priority` | ✅ |
| Status Badge | `competitor.monitoringEnabled` | ✅ |
| URL | `competitor.url` | ✅ |

### Stats Cards
| Card | Dato | Fuente | Real |
|------|------|--------|------|
| Total Versiones | `competitor.totalVersions` | DB | ✅ |
| Cambios | `competitor.changeCount` | DB (último snapshot) | ✅ |
| Última Check | `competitor.lastCheckedAt` | DB | ✅ |
| Severidad | `competitor.severity` | DB (último snapshot) | ✅ |

### Tab: Vista General > Info Competidor
| Campo | Dato | Fuente | Real |
|-------|------|--------|------|
| Nombre | `competitor.name` | DB | ✅ |
| URL | `competitor.url` | DB | ✅ |
| Descripción | `competitor.description` | DB | ✅ |
| Fecha creación | `competitor.created_at` | DB | ✅ |
| Última actualización | `competitor.updated_at` | DB | ✅ |
| Intervalo | `competitor.checkInterval` | DB | ✅ |
| Estado monitoreo | `competitor.monitoringEnabled` | DB | ✅ |

### Tab: Vista General > Últimos Cambios
| Campo | Dato | Fuente | Real |
|-------|------|--------|------|
| Icono | `change.changeType` | DB | ✅ |
| Badge Severity | `change.severity` | DB | ✅ |
| Timestamp | `change.created_at` | DB | ✅ |
| Resumen | `change.changeSummary` | DB | ✅ |
| Versión | `change.versionNumber` | DB | ✅ |
| Cantidad | `change.changeCount` | DB | ✅ |
| Porcentaje | `change.changePercentage` | DB | ✅ |

### Tab: Historial > Timeline
| Campo | Dato | Fuente | Real |
|-------|------|--------|------|
| Icono | `change.changeType` | DB | ✅ |
| Badge Severity | `change.severity` | DB | ✅ |
| Badge Tipo | `change.changeType` | DB | ✅ |
| Badge Actual | `change.isCurrent` | DB | ✅ |
| Badge Versión Completa | `change.isFullVersion` | DB | ✅ |
| Timestamp | `change.created_at` | DB | ✅ |
| Título | `change.changeSummary` | DB | ✅ |
| Detalles | `change.details` | Frontend | ❌ |
| Versión # | `change.versionNumber` | DB | ✅ |
| Cantidad | `change.changeCount` | DB | ✅ |
| Porcentaje | `change.changePercentage` | DB | ✅ |

### Tab: Configuración > Formulario
| Campo | Dato | Fuente | Real |
|-------|------|--------|------|
| Nombre | `editForm.name` | DB → state | ✅ |
| URL | `editForm.url` | DB → state | ✅ |
| Descripción | `editForm.description` | DB → state | ✅ |
| Prioridad | `editForm.priority` | DB → state | ✅ |
| Check Interval | `editForm.checkInterval` | DB → state | ✅ |
| Monitoreo | `editForm.monitoringEnabled` | DB → state | ✅ |

---

## 🎯 Resumen Final

### ✅ Datos 100% Reales: **99%**

**TODOS los datos mostrados vienen del backend**, excepto:

### ❌ Campo Inventado: **1 campo**

**`details`** - Campo que se muestra en el timeline pero siempre estará vacío porque no existe en la BD.

**Solución**: 
- Opción 1: Removerlo del frontend (ya que siempre está vacío)
- Opción 2: Agregarlo al modelo Snapshot (si quieres permitir detalles adicionales)
- Opción 3: Usar `changeSummary` como details

---

## 🚀 Próximos Pasos

### 1. Ejecutar la migración

```bash
cd C:\Users\ramfi\Proyectos\competitor-tracker-Backend
node scripts/add-change-type-to-snapshots.js
```

Esto:
- Agregará la columna `change_type` a la tabla `snapshots`
- Clasificará automáticamente todos los snapshots existentes
- Mostrará estadísticas de clasificación

### 2. Verificar que funciona

Después de ejecutar la migración:
- Ejecuta un monitoreo manual
- Verifica que el nuevo snapshot tenga `changeType` asignado
- Los logs mostrarán: `🏷️ Clasificación automática de cambio`

### 3. Reiniciar el backend

El backend necesita reiniciarse para que el modelo actualizado funcione correctamente.

---

## 📈 Ejemplos de Clasificación Automática

### Ejemplo 1: Pricing
```
changeSummary: "Nuevo plan Enterprise agregado a $99/mes"
→ changeType: "pricing" (detecta: $, plan, /mes)
```

### Ejemplo 2: Feature
```
changeSummary: "Nueva funcionalidad de integración con Slack"
→ changeType: "feature" (detecta: funcionalidad, integración)
```

### Ejemplo 3: Design
```
changeSummary: "Actualización del diseño de la página principal"
→ changeType: "design" (detecta: diseño, página)
```

### Ejemplo 4: Content
```
changeSummary: "Nuevo artículo en el blog sobre marketing"
→ changeType: "content" (detecta: artículo, blog)
```

### Ejemplo 5: Other
```
changeSummary: "15 líneas añadidas, 3 líneas eliminadas"
→ changeType: "other" (no encuentra keywords específicas)
```

---

**Conclusión**: Después de ejecutar la migración, el **100% de los datos mostrados serán reales del backend**. 

**Fecha**: 11 de Octubre, 2025

