# 🚀 Deployar Frontend AHORA - Guía Rápida

## ✅ Estado Actual:
- ✅ Backend en Railway: https://el-impostor.production.up.railway.app
- ✅ PostgreSQL agregado
- ❌ Frontend NO deployado (por eso no ves nada)
- ❌ Base de datos vacía (sin tablas)

---

## 📱 OPCIÓN 1: Vercel Dashboard (MÁS FÁCIL) ⭐

### Paso 1: Importar Proyecto
1. Ve a: **https://vercel.com/new**
2. Si no has hecho login, hazlo con GitHub
3. Busca tu repo: **mauriciotellechea22/El-Impostor**
4. Click **"Import"**

### Paso 2: Configurar Deployment
En la página de configuración:

**Root Directory:**
- Click en "Edit" junto a "Root Directory"
- Escribe: `client`
- ✅ Confirma

**Framework Preset:**
- Debería detectar automáticamente "Vite"
- Si no, selecciónalo del dropdown

**Build Settings:** (deja defaults)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Paso 3: Variables de Entorno
Antes de deployar, agrega:
- Click en **"Environment Variables"**
- **Name:** `VITE_API_URL`
- **Value:** `https://el-impostor.production.up.railway.app`
- Click "Add"

### Paso 4: Deploy
- Click **"Deploy"**
- Espera 2-3 minutos

---

## 💻 OPCIÓN 2: Desde Terminal

Si prefieres CLI:

1. **Aprobar el comando actual:**
   - Ve a: https://vercel.com/oauth/device?user_code=LFPB-JNCM
   - Autoriza
   - Presiona ENTER en la terminal

2. **Una vez logueado, ejecuta:**
```bash
cd client
vercel --prod
```

Cuando pregunte:
- Set up and deploy? → **Y**
- Which scope? → Tu cuenta
- Link to existing project? → **N**
- Project name? → `el-impostor` (Enter)
- Directory? → `./` (Enter)
- Override settings? → **N**

---

## 🗄️ IMPORTANTE: Inicializar Base de Datos

Una vez deployado el frontend, inicializa PostgreSQL:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y link
railway login
railway link

# Ir a carpeta server
cd server

# Inicializar DB (60+ temas)
railway run npm run db:setup
```

Deberías ver:
```
✅ Schema created
✅ Seed data inserted  
✅ Database ready with 60 themes
```

---

## 🎯 Después de Todo Esto

1. **Frontend URL:** https://tu-proyecto.vercel.app
2. **Abrir en navegador**
3. **Crear sala** (código de 4 dígitos)
4. **Jugar con amigos**

---

## ⚡ Actualizar CORS en Railway

Una vez que tengas la URL de Vercel:

1. Railway Dashboard → El-Impostor → Variables
2. Busca `CORS_ORIGIN`
3. Cambiar a: `https://tu-proyecto.vercel.app`
4. Save (auto-redeploy)

---

¿Prefieres la opción 1 (Dashboard) o 2 (CLI)?
