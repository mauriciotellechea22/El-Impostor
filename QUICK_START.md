# 📋 Instrucciones Rápidas - El Impostor

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Crear Base de Datos
```bash
createdb elimpostor
```

### 2. Configurar Variables de Entorno
El archivo `server/.env` ya está creado con valores por defecto.
**Edita la contraseña:**
```env
DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA@localhost:5432/elimpostor
```

### 3. Inicializar Base de Datos
```bash
cd server
npm run db:setup
```

### 4. Iniciar Servidores

**Terminal 1 - Backend (Puerto 3001):**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend (Puerto 5173):**
```bash
cd client
npm run dev
```

### 5. Jugar
Abre **http://localhost:5173** en 3+ tabs/ventanas para probar.

---

## 🎮 Cómo Jugar

1. **Crear Sala**: Da tu nombre → "Crear Sala" → Comparte código
2. **Unirse**: Otros jugadores usan el código de 4 dígitos
3. **Iniciar**: Host inicia con 3+ jugadores
4. **Jugar**: Da pistas de 1-2 palabras sobre el tema
5. **Votar**: Elimina al sospechoso
6. **Ganar**: Inocentes eliminan al impostor, o impostor sobrevive

---

## 🚀 Deployment a Railway

### Paso 1: Push a GitHub
```bash
# Crear repo en GitHub, luego:
git remote add origin https://github.com/TU_USUARIO/el-impostor.git
git branch -M main
git push -u origin main
```

### Paso 2: Deploy Backend en Railway
1. Ir a **https://railway.app**
2. "New Project" → "Deploy from GitHub repo"
3. Seleccionar `el-impostor`
4. Railway detectará la configuración automáticamente

### Paso 3: Agregar PostgreSQL
1. En el proyecto Railway: "New" → "Database" → "PostgreSQL"
2. Railway conectará automáticamente la variable `DATABASE_URL`

### Paso 4: Inicializar DB en Railway
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Inicializar DB
railway run npm run db:setup
```

### Paso 5: Deploy Frontend en Vercel
```bash
cd client
vercel
```

Cuando pregunte:
- **Project name:** el-impostor-client
- **Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Paso 6: Configurar Variable en Vercel
1. Ir al dashboard de Vercel
2. Project Settings → Environment Variables
3. Agregar:
   - **Name:** `VITE_API_URL`
   - **Value:** URL de Railway (ej: `https://tu-proyecto.up.railway.app`)
4. Redeploy: `vercel --prod`

---

## 📊 Tabla de Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar dev server (backend o frontend) |
| `npm run db:setup` | Crear tablas + poblar datos |
| `railway up` | Deploy a Railway |
| `vercel --prod` | Deploy producción Vercel |
| `git log` | Ver commits |

---

## ⚠️ Troubleshooting

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Revisa credenciales en `server/.env`

### Error: "CORS policy"
- Actualiza `CORS_ORIGIN` en `server/.env` con la URL del frontend

### Frontend no se conecta
- Verifica que backend esté corriendo en puerto 3001
- Revisa `client/.env` tiene `VITE_API_URL` correcto

---

## 💡 Tips

- **Probar localmente con múltiples jugadores:** Usa ventanas incógnito
- **Ver logs de Socket.io:** Abre DevTools → Console
- **Cambiar puerto del servidor:** Edita `PORT` en `server/.env`

---

## 🎨 Personalización

### Cambiar Colores 412
Edita `client/src/index.css`:
```css
:root {
  --neon-green: #00FF00;  /* Color principal */
  --dark-bg: #0A0A0A;     /* Fondo */
}
```

### Agregar Más Temas de Fútbol
Edita `server/database/seed.sql` y vuelve a correr:
```bash
npm run db:setup
```

---

¡Listo para jugar! 🎮⚽
