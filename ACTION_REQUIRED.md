# ⚡ ACCIÓN INMEDIATA - Deploy El Impostor

## 🔴 PROBLEMA: 
La web no funciona porque **solo tienes el backend** deployado. Railway no tiene interfaz visual, es solo el servidor API.

## ✅ SOLUCIÓN EN 2 PASOS:

---

## PASO 1: Deploy Frontend (5 minutos)

### Ve a: https://vercel.com/new

1. **Login** con tu cuenta GitHub
2. **Busca:** `mauriciotellechea22/El-Impostor`
3. Click **"Import"**
4. **CONFIGURAR:**
   - **Root Directory:** Click "Edit" → Escribe `client` → ✓
   - **Framework:** Vite (auto-detectado)
   - **Environment Variables:** Click "Add"
     - Name: `VITE_API_URL`
     - Value: `https://el-impostor.production.up.railway.app`
5. Click **"Deploy"** y espera 2-3 minutos

**Resultado:** Tendrás una URL como `https://el-impostor-xxxxx.vercel.app` ← Esta es tu web del juego

---

## PASO 2: Inicializar Base de Datos

En tu terminal (VSCode):

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login (abrirá navegador)
railway login

# Link al proyecto
railway link

# Inicializar DB con 60 temas
railway run npm run db:setup
```

**Deberías ver:**
```
✅ Schema created
✅ Seed data inserted
✅ Database ready with 60 themes
```

---

## PASO 3: Actualizar CORS

1. Ve a: **Railway Dashboard** → Tu proyecto → **Variables**
2. Busca `CORS_ORIGIN`
3. Cambia a tu URL de Vercel: `https://tu-proyecto.vercel.app`
4. Save (auto-redeploy)

---

## 🎮 ¡LISTO PARA JUGAR!

Abre tu URL de Vercel → Verás "EL IMPOSTOR" en verde neón → Crear sala → Jugar

---

**¿Problemas?** Escríbeme con el error específico.
