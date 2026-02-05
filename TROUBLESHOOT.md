# 🔍 Diagnóstico: Botones no funcionan

## ✅ Lo que SÍ funciona:
- Frontend desplegado correctamente
- Diseño 412 se ve perfecto
- Interfaz carga

## ❌ Problema:
Al hacer click en "CREAR SALA" no pasa nada.

## 🔧 Causas Posibles:

### 1. Variable VITE_API_URL no está en Vercel
**Verificar:**
1. https://vercel.com → tu proyecto → Settings → Environment Variables
2. Debería existir: `VITE_API_URL` = `https://el-impostor.production.up.railway.app`

**Si no existe:**
- Click "Add New"
- Name: `VITE_API_URL`
- Value: `https://el-impostor.production.up.railway.app`
- Save
- **IMPORTANTE:** Redeploy: Deployments → último deployment → "Redeploy"

### 2. CORS_ORIGIN en Railway no actualizado
**Verificar:**
1. https://railway.app → El-Impostor → Variables
2. `CORS_ORIGIN` debe ser: `https://el-impostor-jet.vercel.app`

**Si está diferente:**
- Edit → cambiar valor → Save

### 3. Backend caído en Railway
**Verificar:**
1. Railway → El-Impostor servicio → Deployments
2. El último deployment debe estar en verde (✓)
3. Si está rojo (X) → hay error

### 4. PostgreSQL sin inicializar
Esto no impide crear sala, pero sí iniciar juego.

---

## 🚨 SOLUCIÓN RÁPIDA:

### Paso 1: Vercel Environment Variables
1. https://vercel.com/mauriciotellecheas-projects/el-impostor/settings/environment-variables
2. Agregar si no existe:
   - `VITE_API_URL` = `https://el-impostor.production.up.railway.app`
3. Ir a Deployments → Redeploy

### Paso 2: Ver errores en consola
1. Abre https://el-impostor-jet.vercel.app
2. Presiona **F12** (DevTools)
3. Pestaña **Console**
4. Intenta crear sala
5. **¿Qué error aparece en rojo?**

Copia ese error y pégalo aquí para ayudarte mejor.

---

## 📸 ¿Qué necesito ver?

Un screenshot de:
1. Vercel → Settings → Environment Variables
2. Railway → Variables (mostrando CORS_ORIGIN)
3. Console de DevTools con el error

O simplemente el texto del error en la consola.
