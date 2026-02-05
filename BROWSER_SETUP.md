# 🌐 Configuración Final - Solo desde Navegador

## ✅ Lo que YA está listo:
- ✅ Backend en Railway
- ✅ Frontend en Vercel: https://el-impostor-jet.vercel.app
- ✅ PostgreSQL agregado

## 🔧 Configuración que falta (2 pasos en navegador):

---

## PASO 1: Actualizar CORS en Railway

### Ve a: https://railway.app

1. **Login** con GitHub
2. **Selecciona** tu proyecto "El-Impostor"
3. **Click** en el servicio "El-Impostor" (el que tiene el ícono de GitHub, NO el de PostgreSQL)
4. **Click** en la pestaña **"Variables"** (arriba)
5. Busca la variable `CORS_ORIGIN`
6. **Click** en los **3 puntos** (...) a la derecha de esa variable
7. Selecciona **"Edit"**
8. **Borra** el valor actual
9. **Escribe:** `https://el-impostor-jet.vercel.app`
10. **Click** "Update" o presiona Enter
11. Railway se redeployará automáticamente (30 segundos)

**Si NO ves `CORS_ORIGIN`:**
- Click en **"New Variable"** (botón arriba a la derecha)
- Name: `CORS_ORIGIN`
- Value: `https://el-impostor-jet.vercel.app`
- Click "Add"

---

## PASO 2: Inicializar Base de Datos

### Ve a Railway → Pestaña "Settings"

**Opción A: Desde Railway CLI Web Console**

1. En tu proyecto de Railway
2. Click en el servicio **"El-Impostor"** (no Postgres)
3. Pestaña **"Settings"**
4. Busca **"Service Domains"** o **"Deployments"**
5. Ve a **"Deployments"**
6. Click en el deployment más reciente (el verde con ✓)
7. Busca **"View Logs"**
8. En los logs, busca botón de **"Console"** o **"Shell"**

**O mejor aún, IGNORAR esta parte por ahora:**

El juego funcionará sin datos iniciales, pero no habrá temas pre-cargados. Los jugadores podrán jugar si agregas temas manualmente en Railway → Postgres → Data → Create table.

---

## 🎮 Prueba Rápida (sin base de datos):

1. **Abre:** https://el-impostor-jet.vercel.app
2. Deberías ver "EL IMPOSTOR" en verde neón
3. Si ves eso → Frontend está bien ✅
4. Si dice "Error de conexión" → Revisa CORS_ORIGIN

---

## 🆘 ¿Qué pasa si no hay datos?

Sin ejecutar `npm run db:setup`, la base de datos estará vacía. Cuando alguien intente iniciar un juego, dará error porque no hay temas.

**Solución temporal:** Agregar temas manualmente:
1. Railway → Postgres → Data
2. Crear tabla manualmente siguiendo schema.sql

**Solución definitiva:** Necesitarías ejecutar el script de setup, pero eso requiere CLI.

---

## 💡 Recomendación:

**SOLO haz el PASO 1 (CORS_ORIGIN) por ahora.**

Abre https://el-impostor-jet.vercel.app y dime qué ves. Si funciona visualmente, después vemos cómo inicializar la base de datos de la forma más simple.

¿Quieres intentar con el PASO 1?
