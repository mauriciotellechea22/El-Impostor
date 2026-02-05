# El Impostor - Juego de Fútbol 🎮⚽

Juego multijugador en tiempo real inspirado en el famoso juego de la comunidad 412.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- PostgreSQL 14+

### Instalación

```bash
# Instalar dependencias del servidor
cd server
npm install

# Instalar dependencias del cliente
cd ../client
npm install
```

### Configuración

1. Crear base de datos PostgreSQL:
```bash
createdb elimpostor
```

2. Configurar variables de entorno en `server/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/elimpostor
PORT=3001
```

3. Inicializar base de datos:
```bash
cd server
npm run db:setup
```

### Desarrollo

```bash
# Terminal 1: Servidor (Puerto 3001)
cd server
npm run dev

# Terminal 2: Cliente (Puerto 5173)
cd client
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## 🎮 Cómo Jugar

1. **Crear o unirte a una sala** con código de 4 dígitos
2. **Esperar jugadores** (3-6 jugadores)
3. **Comenzar partida** - Un jugador es el impostor secreto
4. **Dar pistas** - Describe el tema con 1-2 palabras
5. **Votar** - Elimina al sospechoso
6. **Ganar** - Inocentes eliminan al impostor, o impostor sobrevive

## 🛠️ Stack Técnico

- **Frontend**: Vite + React + TypeScript
- **Backend**: Express + Socket.io
- **Base de Datos**: PostgreSQL
- **Tiempo Real**: Socket.io

## 📦 Deployment

Ver [Guía de Deploy a Railway](./docs/DEPLOY.md)

## 📝 Licencia

MIT - Creado con ❤️ para la comunidad 412
