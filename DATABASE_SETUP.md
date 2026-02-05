# 🎯 ÚLTIMO PASO - Inicializar Base de Datos

## ✅ Estado Actual:
- ✅ Juego deployado en Railway
- ✅ Socket.IO funcionando
- ✅ Salas funcionan
- ✅ Botón "Comenzar Juego" aparece
- ❌ **Error al iniciar:** Base de datos vacía (sin temas)

---

## 🔧 Solución: Ejecutar Script de Setup

### Opción 1: Desde Railway CLI (Recomendado)

1. **Abre PowerShell/Terminal** en tu computadora

2. **Ejecuta:**
   ```bash
   railway run npm run db:setup
   ```

3. **Debería mostrar:**
   ```
   🔧 Setting up database...
   ✅ Schema created
   ✅ Seed data inserted
   ✅ Database ready with X themes
   ```

---

### Opción 2: Desde Variables de Sistema

Si Railway CLI no funciona, necesito agregar el comando al `package.json` y ejecutarlo desde Railway:

1. Ve a Railway → tu proyecto "El-Impostor" (el servicio backend)
2. Settings → **Variables**
3. Agrega nueva variable:
   - Key: `RUN_DB_SETUP`
   - Value: `true`
4. Redeploy

(Necesitaría modificar el código para que ejecute esto automáticamente)

---

### Opción 3: SQL Manual

Si nada funciona, puedo darte el SQL para que lo pegues directo en Railway Database:

1. Railway → servicio "Postgres"
2. **"Query"** o **"Data"**
3. Ejecutar SQL de `seed.sql`

---

## 📋 ¿Tienes Railway CLI instalado?

**Verifica:**
```bash
railway --version
```

**Si NO está instalado:**
```bash
npm install -g @railway/cli
```

**Login:**
```bash
railway login
```

**Link al proyecto:**
```bash
cd C:\Users\elfac\Documents\el-impostor
railway link
```

---

**¿Qué opción prefieres?**
1. Instalar Railway CLI y ejecutar `railway run npm run db:setup`
2. Agregar variable y redeploy automático
3. SQL manual en Railway Database

Dime cuál y te guío paso a paso.
