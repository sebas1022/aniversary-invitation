# 🎮 Juego de Aniversario - Web Interactiva Romántica

Una web interactiva especial creada para celebrar un aniversario con un juego 2D estilo runner y una carta romántica sorpresa.

## ✨ Características

### 🎮 Juego 2D
- **Estilo**: Runner/plataformas en 2D
- **Personaje**: Princesita adorable que puede saltar
- **Objetivo**: Llegar al final del nivel esquivando obstáculos
- **Duración**: 2 minutos (120 segundos) con dificultad progresiva
- **Controles**: 
  - **Teclado**: Presiona ESPACIO para saltar
  - **Móvil**: Toca la pantalla para saltar
  - **💫 Doble salto**: Presiona ESPACIO dos veces para saltar más alto

### 💌 Carta Romántica
- **Animación**: Sobre que se abre con efecto suave
- **Contenido**: Mensaje romántico personalizado
- **Sorpresa**: Incluye mensaje especial sobre el correo
- **Efectos**: Confeti animado al abrir el sobre

### 🎨 Diseño
- **Colores**: Paleta romántica con rosados, dorados y celestes
- **Estilo**: Minimalista y dulce
- **Responsive**: Funciona perfectamente en escritorio y móvil
- **Animaciones**: Efectos suaves y partículas flotantes

## 🚀 Cómo usar

### Opción 1: Abrir directamente
1. Descarga todos los archivos
2. Abre `index.html` en tu navegador web
3. ¡Disfruta del juego!

### Opción 2: GitHub Pages
1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama principal
4. Tu web estará disponible en `https://tuusuario.github.io/turepositorio`

## 📁 Estructura de archivos

```
aniversary-invitation/
├── index.html          # Página principal
├── styles.css          # Estilos y animaciones
├── game.js            # Lógica del juego
└── README.md          # Este archivo
```

## 🎯 Cómo jugar

1. **Pantalla de inicio**: Lee las instrucciones y presiona "Comenzar Aventura"
2. **Juego**: 
   - Usa ESPACIO (teclado) o toca la pantalla (móvil) para saltar
   - Presiona ESPACIO dos veces para hacer doble salto y saltar más alto
   - Esquiva los obstáculos de colores (ahora más pequeños y fáciles)
   - ¡Tienes 2 minutos para llegar al final antes de que aumente la velocidad!
   - La velocidad aumenta cada 20 segundos para mayor desafío
3. **Carta**: Al completar el juego, haz clic en el sobre para revelar la sorpresa

## 🎵 Audio

- **Música de fondo**: Suave y romántica (se puede silenciar)
- **Efectos de sonido**: Al saltar y completar el juego
- **Control**: Botón de silenciar en la esquina superior derecha

## 💝 Personalización

### Cambiar el mensaje de la carta
Edita el contenido en `index.html` dentro de la sección `letter-content`:

```html
<div class="letter-content">
    <h2>💕 Mi Amor</h2>
    <p>Tu mensaje personalizado aquí...</p>
    <div class="special-message">
        <p><strong>Pasa por tu correo, hay una sorpresa esperándote... ❤️</strong></p>
    </div>
</div>
```

### Cambiar colores
Modifica las variables de color en `styles.css`:

```css
/* Colores principales */
--primary-color: #ff6b9d;
--secondary-color: #ff8fab;
--accent-color: #FFD700;
```

## 🌟 Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos, animaciones y responsive design
- **JavaScript**: Lógica del juego y interactividad
- **Canvas API**: Renderizado del juego 2D
- **Web Audio API**: Efectos de sonido

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles (iOS/Android)

## 🎉 ¡Disfruta!

Esta web está diseñada para crear un momento especial y memorable. ¡Esperamos que disfrutes del juego y la sorpresa romántica!

---

*Creado con ❤️ para celebrar el amor* 