# Pasos Finales para Completar El Impostor

## ✅ Backend Deployed
- URL: https://el-impostor.production.up.railway.app
- Status: Running ✅

---

## 🔴 PASO 1: Agregar PostgreSQL (URGENTE)

**En Railway Dashboard:**
1. Abre tu proyecto "El-Impostor"
2. Click **"+ New"** (botón arriba a la derecha)
3. Selecciona **"Database"** → **"PostgreSQL"**
4. Espera 30 segundos a que se cree
5. Railway conectará automáticamente `DATABASE_URL`

**Importante:** Sin PostgreSQL el servidor crasheará cuando intentes jugar.

---

## 📊 PASO 2: Inicializar Base de Datos

Una vez agregada PostgreSQL:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Vincular al proyecto
railway link

# Inicializar DB con 60+ temas de fútbol
railway run npm run db:setup
```

Deberías ver:
```
🔧 Setting up database...
✅ Schema created
✅ Seed data inserted
✅ Database ready with 60 themes
```

---

## 🎨 PASO 3: Deploy Frontend en Vercel

El backend NO tiene interfaz. Necesitas deployar el **frontend** (cliente React).

### Opción A: Desde VS Code (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy desde carpeta client
cd client
vercel

# Cuando pregunte:
# - Setup and deploy? → Yes
# - Which scope? → Tu cuenta
# - Link to existing project? → No
# - Project name? → el-impostor-client (Enter)
# - Directory? → ./ (Enter)
# - Override settings? → No

# Deploy a producción
vercel --prod
```

### Opción B: Desde Vercel Dashboard

1. Ve a https://vercel.com/new
2. Importa el repo: `mauriciotellechea22/El-Impostor`
3. **Root Directory:** `client`
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. Click **"Deploy"**

---

## 🔗 PASO 4: Conectar Frontend con Backend

**En Vercel:**
1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. Agrega:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://el-impostor.production.up.railway.app`
3. **Redeploy:** Dashboard → "Deployments" → Click en el último → "Redeploy"

**EN RAILWAY:**
1. Ve a tu servicio → **Variables**
2. Edita `CORS_ORIGIN`:
   - **Value:** `https://tu-proyecto.vercel.app` (copia la URL que te dio Vercel)
3. Railway redeplegará automáticamente

---

## ✅ Verificación Final

Una vez completado todo:
1. Abre tu URL de Vercel (ej: `https://el-impostor-client.vercel.app`)
2. Deberías ver el lobby con "EL IMPOSTOR" en verde neón
3. Crea una sala y prueba con otra pestaña

---

## 🐛 Si algo falla:

**Frontend no carga:**
- Verifica que desplegaste desde `client/`
- Revisa logs en Vercel Dashboard

**"Error de conexión":**
- Verifica `VITE_API_URL` en Vercel
- Verifica `CORS_ORIGIN` en Railway
- Ambas URLs deben coincidir

**Base de datos error:**
- Asegúrate de haber agregado PostgreSQL
- Ejecuta `railway run npm run db:setup`

---

¿En qué paso estás? ¿Necesitas ayuda con alguno?
