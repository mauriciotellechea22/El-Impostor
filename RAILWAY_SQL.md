# 🎯 EJECUTAR SQL EN RAILWAY - Guía Paso a Paso

## 📋 Pasos (5 minutos):

### 1. Abre Railway Database

1. Ve a **Railway.app**
2. Tu proyecto
3. Click en el servicio **"Postgres"** (NO el-impostor)

---

### 2. Conecta a la Base de Datos

Busca una de estas opciones:
- **"Query"** (pestaña arriba)
- **"Data"** (pestaña arriba)  
- **"Connect"** → SQL Client

(Railway cambia la UI, puede ser cualquiera de esos nombres)

---

### 3. Ejecuta el SQL

**COPIA Y PEGA** este SQL exactamente:

```sql
-- Seed data for El Impostor
INSERT INTO themes (category, name, description, difficulty, hints) VALUES
('jugador', 'Lionel Messi', 'Considerado uno de los mejores jugadores de la historia', 1, '["Argentina", "Barcelona", "8 Balones de Oro", "Qatar 2022", "PSG"]'),
('jugador', 'Diego Maradona', 'Leyenda argentina del fútbol mundial', 1, '["Argentina", "Napoli", "Mano de Dios", "México 86", "10"]'),
('jugador', 'Pelé', 'Único tricampeón del mundo como jugador', 1, '["Brasil", "Santos", "3 Mundiales", "Rey", "1000 goles"]'),
('jugador', 'Cristiano Ronaldo', 'Máximo goleador de la Champions League', 1, '["Portugal", "Real Madrid", "5 Champions", "CR7", "Manchester"]'),
('jugador', 'Zinedine Zidane', 'Campeón del mundo con Francia en 1998', 2, '["Francia", "Real Madrid", "Cabezazo", "Balón de Oro", "Juventus"]'),
('jugador', 'Johan Cruyff', 'Padre del fútbol total holandés', 2, '["Holanda", "Barcelona", "Ajax", "14", "Total"]'),
('jugador', 'Franz Beckenbauer', 'Kaiser alemán, ganó todo', 2, '["Alemania", "Bayern", "Líbero", "Kaiser", "Mundial 74"]'),
('jugador', 'Ronaldo Nazário', 'El Fenómeno brasileño', 2, '["Brasil", "Inter", "Fenómeno", "2 Mundiales", "Real Madrid"]'),
('jugador', 'Alfredo Di Stéfano', 'Leyenda del Real Madrid', 2, '["Argentina", "Real Madrid", "5 Copas Europa", "Saeta"]'),
('jugador', 'Paolo Maldini', 'Defensor italiano legendario', 2, '["Italia", "Milan", "25 años", "3", "Capitán"]'),
('jugador', 'Gerd Müller', 'Máximo goleador de Alemania', 3, '["Alemania", "Bayern", "Bomber", "Mundial 74", "365 goles"]'),
('jugador', 'Michel Platini', 'Francés triple Balón de Oro', 3, '["Francia", "Juventus", "3 Balones Oro", "Eurocopa 84"]'),
('jugador', 'Ronaldinho', 'Mago brasileño del fútbol', 2, '["Brasil", "Barcelona", "Sonrisa", "Balón Oro 2005", "PSG"]'),
('jugador', 'Garrincha', 'Alegría del pueblo brasileño', 3, '["Brasil", "Botafogo", "Piernas torcidas", "Mundial 62"]'),
('jugador', 'George Best', 'Estrella del Manchester United', 3, '["Irlanda Norte", "Manchester United", "7", "Beatles"]'),
('jugador', 'Xavi Hernández', 'Cerebro del Barcelona y España', 2, '["España", "Barcelona", "Mediocampista", "Mundial 2010", "Tiki-taka"]'),
('jugador', 'Andrés Iniesta', 'Goleador del Mundial 2010', 2, '["España", "Barcelona", "Sudáfrica", "Vissel Kobe", "8"]'),
('jugador', 'Zlatan Ibrahimović', 'Delantero sueco polémico', 2, '["Suecia", "Milan", "PSG", "Arrogante", "Taekwondo"]'),
('jugador', 'Sergio Ramos', 'Defensa español campeón de todo', 2, '["España", "Real Madrid", "4 Champions", "Sevilla", "Mundial"]'),
('jugador', 'Lev Yashin', 'Único arquero con Balón de Oro', 3, '["URSS", "Portero", "Araña Negra", "Balón Oro 1963"]'),

('club', 'Real Madrid', 'Club más ganador de Europa', 1, '["España", "15 Champions", "Blanco", "Bernabéu", "Galácticos"]'),
('club', 'FC Barcelona', 'Más que un club', 1, '["España", "Camp Nou", "Azulgrana", "Messi", "Cataluña"]'),
('club', 'Boca Juniors', 'Pasión argentina', 1, '["Argentina", "Bombonera", "Azul y Oro", "Maradona", "Libertadores"]'),
('club', 'River Plate', 'Millonario argentino', 1, '["Argentina", "Monumental", "Banda roja", "Gallardo", "Madrid 2018"]'),
('club', 'AC Milan', 'Rossonero italiano', 2, '["Italia", "7 Champions", "Rojo y Negro", "San Siro", "Maldini"]'),
('club', 'Liverpool FC', 'Reds ingleses', 2, '["Inglaterra", "Anfield", "6 Champions", "Rojo", "You Never Walk"]'),
('club', 'Bayern München', 'Gigante bávaro', 2, '["Alemania", "Allianz", "Rojo", "6 Champions", "Bundesliga"]'),
('club', 'Manchester United', 'Diablos rojos', 2, '["Inglaterra", "Old Trafford", "Rojo", "Ferguson", "Treble 99"]'),
('club', 'Ajax Amsterdam', 'Formador de estrellas', 2, '["Holanda", "Cruyff", "Blanco Rojo", "4 Champions", "Cantera"]'),
('club', 'Juventus', 'Vieja Señora italiana', 2, '["Italia", "Turín", "Blanco Negro", "Buffon", "CR7"]'),
('club', 'Inter de Milán', 'Nerazzurro', 2, '["Italia", "San Siro", "Negro Azul", "Triplete 2010", "Mourinho"]'),
('club', 'Santos FC', 'Casa de Pelé', 3, '["Brasil", "Pelé", "Blanco", "3 Libertadores", "Neymar"]'),
('club', 'Flamengo', 'Más popular de Brasil', 2, '["Brasil", "Rojo Negro", "Zico", "Maracaná", "Libertadores"]'),
('club', 'Peñarol', 'Carbonero uruguayo', 3, '["Uruguay", "Amarillo Negro", "5 Libertadores", "Montevideo"]'),
('club', 'Celtic FC', 'Escoceses verdes', 3, '["Escocia", "Verde", "Lisbon Lions", "Champions 67"]'),

('estadio', 'Maracaná', 'Templo del fútbol brasileño', 2, '["Río Janeiro", "Brasil", "200.000", "Final Mundial 50", "Pelé"]'),
('estadio', 'Camp Nou', 'Estadio más grande de Europa', 1, '["Barcelona", "99.000", "Azulgrana", "Messi", "España"]'),
('estadio', 'La Bombonera', 'La cancha que tiembla', 1, '["Buenos Aires", "Boca", "Verticalidad", "Argentina", "54.000"]'),
('estadio', 'Santiago Bernabéu', 'Casa del Real Madrid', 1, '["Madrid", "81.000", "Blanco", "15 Champions", "España"]'),
('estadio', 'Old Trafford', 'Teatro de los sueños', 2, '["Manchester", "75.000", "Inglaterra", "Diablos Rojos"]'),
('estadio', 'San Siro', 'Scala del Calcio', 2, '["Milán", "Italia", "80.000", "Milan Inter", "Giuseppe Meazza"]'),
('estadio', 'Wembley', 'Templo del fútbol inglés', 2, '["Londres", "90.000", "Inglaterra", "Arco", "Final Champions"]'),
('estadio', 'Allianz Arena', 'Estadio iluminado', 2, '["Múnich", "Bayern", "75.000", "Alemania", "LED"]'),
('estadio', 'Anfield', 'Fortaleza del Liverpool', 2, '["Liverpool", "54.000", "You Never Walk", "Kop", "Inglaterra"]'),
('estadio', 'Azteca', 'Escenario de dos finales mundiales', 2, '["México", "87.000", "Maradona", "Pelé", "Altura"]'),

('partido', 'Argentina 3-3 Francia (Mundial 2022)', 'Final más épica del mundo', 1, '["Qatar", "Messi", "Mbappé", "Penales", "Lusail"]'),
('partido', 'Alemania 1-7 Brasil (Mundial 2014)', 'Mineirazo histórico', 1, '["Semifinal", "Brasil", "Humillación", "Klose", "Belo Horizonte"]'),
('partido', 'Barcelona 6-1 PSG (Champions 2017)', 'La Remontada', 1, '["Champions", "6-1", "Neymar", "Sergi Roberto", "Camp Nou"]'),
('partido', 'Liverpool 4-0 Barcelona (Champions 2019)', 'Corner taken quickly', 2, '["Anfield", "Remontada", "Origi", "0-3", "Semifinal"]'),
('partido', 'Argentina 2-1 Inglaterra (Mundial 1986)', 'Mano de Dios', 1, '["Maradona", "México 86", "Cuartos", "Gambeta siglo"]'),
('partido', 'Italia 3-3 Alemania (Mundial 1970)', 'Partido del Siglo', 3, '["México 70", "Semifinal", "Prorroga", "Azteca"]'),
('partido', 'Real Madrid 3-1 Liverpool (Champions 2018)', 'Final en Kiev', 2, '["Bale", "Chilena", "Karius", "13va Champions"]'),
('partido', 'River 3-1 Boca (Libertadores 2018)', 'Superfinal en Madrid', 1, '["Bernabéu", "Libertadores", "Superclásico", "Histórico"]'),

('dt', 'Pep Guardiola', 'Maestro del tiki-taka', 2, '["Barcelona", "Bayern", "City", "Tiki-taka", "Calvo"]'),
('dt', 'José Mourinho', 'The Special One', 2, '["Porto", "Inter", "Chelsea", "Autobús", "Polémico"]'),
('dt', 'Carlo Ancelotti', 'Rey de las Champions', 2, '["Milan", "Real Madrid", "Champions", "Ceja", "Italia"]'),
('dt', 'Marcelo Bielsa', 'El Loco', 2, '["Argentina", "Leeds", "Táctico", "Cuaderno", "Intensidad"]'),
('dt', 'Sir Alex Ferguson', 'Leyenda del United', 2, '["Manchester", "13 Premier", "Chicle", "Escocia", "Treble"]'),
('dt', 'Johan Cruyff', 'Padre del Barça moderno', 3, '["Barcelona", "Dream Team", "Holanda", "Ajax", "14"]'),
('dt', 'Arsène Wenger', 'Le Professeur', 3, '["Arsenal", "Invencibles", "Francia", "22 años"]'),
('dt', 'Vicente del Bosque', 'Campeón del mundo con España', 3, '["España", "Mundial 2010", "Eurocopa 2012", "Real Madrid"]');
```

**Click "Run" o "Execute"**

---

### 4. Verifica

Deberías ver: **68 rows inserted** o similar

**O ejecuta para verificar:**
```sql
SELECT COUNT(*) FROM themes;
```

Debería mostrar: **68**

---

## 🎮 Luego:

1. Ve a tu juego: `https://el-impostor.production.up.railway.app`
2. Crea sala con 3+ jugadores
3. **Click "Comenzar Juego"**
4. **DEBERÍA FUNCIONAR** ✅

---

**Mándame screenshot cuando lo ejecutes y cuántas filas insertó.**
