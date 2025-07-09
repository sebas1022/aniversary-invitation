// Variables globales del juego
let canvas, ctx;
let gameRunning = false;
let gameTime = 120;
let timer;
let isMuted = false;
let lives = 3; // Sistema de 3 vidas

// Variables del personaje
let player = {
    x: 50,
    y: 300,
    width: 60, // Más ancho
    height: 90, // Más alto
    velocityY: 0,
    isJumping: false,
    doubleJumpAvailable: true,
    gravity: 0.25, // Mucho más lento en el aire
    jumpPower: -13 // Salto alto pero no exagerado
};

// Variables de los obstáculos
let obstacles = [];
let obstacleSpeed = 1.5; // Más lento
let obstacleSpawnRate = 0.008; // Obstáculos mucho más separados
let speedIncreaseInterval = 20; // Aumentar velocidad cada 20 segundos

// Variables de las plataformas
let platforms = [];
let finishLine = { x: 750, y: 300, width: 50, height: 100 };

// Variables de partículas
let particles = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Ajustar canvas para dispositivos móviles
    if (window.innerWidth <= 768) {
        canvas.width = 400;
        canvas.height = 300;
        player.x = 30;
        player.y = 220;
        finishLine.x = 350;
        finishLine.y = 220;
    }
    
    // Crear plataformas iniciales
    createPlatforms();
    
    // Iniciar música de fondo
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.3;
}

function setupEventListeners() {
    // Botón de inicio
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Botón de reinicio
    document.getElementById('restartButton').addEventListener('click', restartGame);
    
    // Botón de silenciar
    document.getElementById('muteButton').addEventListener('click', toggleMute);
    
    // Botón de salto móvil
    document.getElementById('jumpButton').addEventListener('click', jump);
    
    // Controles de teclado
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && gameRunning) {
            e.preventDefault();
            jump();
        }
    });
    
    // Controles táctiles
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (gameRunning) {
            jump();
        }
    });
    
    // Click en la solapa para abrir el sobre
    document.querySelector('.envelope-flap').addEventListener('click', openEnvelope);
}

function startGame() {
    showScreen('gameScreen');
    gameRunning = true;
    gameTime = 60; // 1 minuto (60 segundos)
    lives = 3; // Resetear vidas
    
    // Iniciar música
    if (!isMuted) {
        document.getElementById('bgMusic').play();
    }
    
    // Iniciar timer
    timer = setInterval(function() {
        gameTime--;
        document.getElementById('timer').textContent = gameTime;
        
        // Aumentar velocidad cada 20 segundos
        if (gameTime % speedIncreaseInterval === 0 && gameTime > 0) {
            increaseSpeed();
        }
        
        if (gameTime <= 0) {
            timeUp(); // Tiempo agotado - mostrar carta
        }
    }, 1000);
    
    // Iniciar loop del juego
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Actualizar jugador
    updatePlayer();
    
    // Actualizar obstáculos
    updateObstacles();
    
    // Actualizar partículas
    updateParticles();
    
    // Verificar colisiones
    checkCollisions();
    
    // Verificar si llegó al final
    checkFinish();
}

function updatePlayer() {
    // Aplicar gravedad
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Limitar altura máxima (no salir del canvas)
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }

    // Verificar colisión con el suelo
    if (player.y > 300) {
        player.y = 300;
        player.velocityY = 0;
        player.isJumping = false;
        player.doubleJumpAvailable = true; // Resetear doble salto al tocar suelo
    }

    // Ajustar para móviles
    if (window.innerWidth <= 768 && player.y > 220) {
        player.y = 220;
        player.velocityY = 0;
        player.isJumping = false;
        player.doubleJumpAvailable = true; // Resetear doble salto al tocar suelo
    }
}

function updateObstacles() {
    // Generar nuevos obstáculos solo si no hay obstáculos muy cerca
    if (Math.random() < obstacleSpawnRate) {
        // Verificar que no haya obstáculos muy cerca del borde derecho
        let canSpawn = true;
        for (let obstacle of obstacles) {
            if (obstacle.x > canvas.width - 250) { // Espacio mínimo de 250px
                canSpawn = false;
                break;
            }
        }
        
        if (canSpawn) {
            createObstacle();
        }
    }
    
    // Mover obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        
        // Eliminar obstáculos fuera de pantalla
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].life--;
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function createObstacle() {
    const types = [
        { width: 15, height: 25, color: '#ff6b6b' }, // Obstáculo alto (más pequeño)
        { width: 30, height: 15, color: '#4ecdc4' }, // Obstáculo ancho (más pequeño)
        { width: 20, height: 20, color: '#45b7d1' }, // Obstáculo cuadrado (más pequeño)
        { width: 25, height: 18, color: '#ffa500' }  // Obstáculo nuevo (más fácil)
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const groundY = window.innerWidth <= 768 ? 220 : 300;
    
    obstacles.push({
        x: canvas.width,
        y: groundY - type.height,
        width: type.width,
        height: type.height,
        color: type.color
    });
}

function createPlatforms() {
    const groundY = window.innerWidth <= 768 ? 220 : 300;
    
    // Plataforma principal
    platforms.push({
        x: 0,
        y: groundY,
        width: canvas.width,
        height: 20,
        color: '#8B4513'
    });
    
    // Algunas plataformas flotantes
    platforms.push({
        x: 200,
        y: groundY - 80,
        width: 60,
        height: 15,
        color: '#228B22'
    });
    
    platforms.push({
        x: 400,
        y: groundY - 60,
        width: 50,
        height: 15,
        color: '#228B22'
    });
}

function jump() {
    if (gameRunning) {
        // Primer salto
        if (!player.isJumping) {
            player.velocityY = player.jumpPower;
            player.isJumping = true;
            
            // Efecto de sonido
            if (!isMuted) {
                document.getElementById('jumpSound').play();
            }
            
            // Crear partículas de salto
            createJumpParticles();
        }
        // Doble salto
        else if (player.doubleJumpAvailable) {
            player.velocityY = player.jumpPower * 0.8; // Salto ligeramente más débil
            player.doubleJumpAvailable = false;
            
            // Efecto de sonido
            if (!isMuted) {
                document.getElementById('jumpSound').play();
            }
            
            // Crear partículas de doble salto (diferentes)
            createDoubleJumpParticles();
        }
    }
}

function createJumpParticles() {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 2 + 1,
            life: 20,
            color: '#FFD700'
        });
    }
}

function createDoubleJumpParticles() {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 25,
            color: '#FF69B4' // Color rosa para diferenciar del salto normal
        });
    }
}

function checkCollisions() {
    // Colisión con obstáculos
    for (let obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            loseLife();
        }
    }
    
    // Colisión con plataformas
    for (let platform of platforms) {
        if (platform.y < 300) { // Solo plataformas flotantes
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height >= platform.y &&
                player.y + player.height <= platform.y + 10 &&
                player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }
    }
}

function checkFinish() {
    if (player.x + player.width >= finishLine.x &&
        player.x <= finishLine.x + finishLine.width &&
        player.y + player.height >= finishLine.y) {
        winGame();
    }
}

function loseLife() {
    lives--;
    updateLivesDisplay();
    
    // Crear partículas de pérdida de vida
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 40,
            color: '#FF6B6B'
        });
    }
    
    // Verificar si se acabaron las vidas
    if (lives <= 0) {
        gameOver();
        return;
    }
    
    // Resetear posición del jugador
    player.x = window.innerWidth <= 768 ? 30 : 50;
    player.y = window.innerWidth <= 768 ? 220 : 300;
    player.velocityY = 0;
    player.isJumping = false;
    player.doubleJumpAvailable = true;
    
    // Eliminar obstáculos cercanos al jugador
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].x < player.x + 200) { // Eliminar obstáculos en un radio de 200px
            obstacles.splice(i, 1);
        }
    }
    
    // Mostrar mensaje de vida perdida (sin pausar el juego)
    showLifeLostMessage();
}

function showLifeLostMessage() {
    // Mostrar mensaje de vida perdida
    ctx.fillStyle = 'rgba(255, 107, 107, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(`¡Vida perdida! Te quedan ${lives} vidas`, canvas.width / 2, canvas.height / 2);
    
    // El mensaje se limpiará en el próximo frame del juego
    setTimeout(() => {
        // El mensaje se limpiará automáticamente en el próximo render
    }, 1000);
}

function updateLivesDisplay() {
    const livesDisplay = document.getElementById('livesDisplay');
    const hearts = '❤️'.repeat(lives);
    livesDisplay.textContent = hearts;
}

function gameOver() {
    gameRunning = false;
    clearInterval(timer);
    
    // Mostrar mensaje de game over
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('¡Se acabaron las vidas!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Inténtalo de nuevo', canvas.width / 2, canvas.height / 2 + 20);
    
    setTimeout(() => {
        showScreen('startScreen');
    }, 3000);
}

function increaseSpeed() {
    // Aumentar velocidad gradualmente
    obstacleSpeed += 0.5;
    obstacleSpawnRate += 0.005;
    
    // Crear efecto visual de aumento de velocidad
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            color: '#FF6B6B' // Color rojo para indicar aumento de dificultad
        });
    }
    
    // Mostrar mensaje de velocidad aumentada
    ctx.fillStyle = 'rgba(255, 107, 107, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('¡Velocidad aumentada!', canvas.width / 2, canvas.height / 2);
    
    // Limpiar el mensaje después de 1 segundo
    setTimeout(() => {
        // El mensaje se limpiará en el próximo frame del juego
    }, 1000);
}

function timeUp() {
    gameRunning = false;
    clearInterval(timer);
    // Mostrar mensaje de tiempo agotado
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('¡Tiempo agotado!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Descubre tu sorpresa', canvas.width / 2, canvas.height / 2 + 20);
    // Redirigir después de 2 segundos
    setTimeout(() => {
        window.location.href = 'carta.html';
    }, 2000);
}

function winGame() {
    gameRunning = false;
    clearInterval(timer);
    // Mostrar mensaje de victoria
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('¡Felicidades!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Descubre tu sorpresa', canvas.width / 2, canvas.height / 2 + 20);
    // Redirigir después de 2 segundos
    setTimeout(() => {
        window.location.href = 'carta.html';
    }, 2000);
}

function render() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar fondo
    drawBackground();
    
    // Dibujar plataformas
    drawPlatforms();
    
    // Dibujar obstáculos
    drawObstacles();
    
    // Dibujar jugador
    drawPlayer();
    
    // Dibujar línea de meta
    drawFinishLine();
    
    // Dibujar partículas
    drawParticles();
}

function drawBackground() {
    // Gradiente de cielo
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Nubes decorativas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(100, 80, 20, 0, Math.PI * 2);
    ctx.arc(120, 80, 25, 0, Math.PI * 2);
    ctx.arc(140, 80, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(300, 60, 15, 0, Math.PI * 2);
    ctx.arc(315, 60, 20, 0, Math.PI * 2);
    ctx.arc(330, 60, 15, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlatforms() {
    for (let platform of platforms) {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function drawObstacles() {
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Detalles en los obstáculos
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, 3);
    }
}

const princesaImg = new Image();
princesaImg.src = 'princesa.png';

let princesaLoaded = false;
princesaImg.onload = () => {
    princesaLoaded = true;
    document.getElementById('startButton').disabled = false;
    document.getElementById('loadingMsg').style.display = 'none';
    console.log('Imagen princesa cargada:', princesaImg.width, princesaImg.height);
};
princesaImg.onerror = () => {
    console.error('No se pudo cargar princesa.png');
};

function drawPlayer() {
    if (princesaLoaded) {
    console.log('Dibujando princesa');
        ctx.drawImage(princesaImg, player.x, player.y, player.width, player.height);
    } else {
        console.log('Esperando a que se cargue la imagen de la princesa');
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

function drawFinishLine() {
    // Bandera de meta
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(finishLine.x, finishLine.y, finishLine.width, finishLine.height);
    
    // Poste de la bandera
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(finishLine.x - 5, finishLine.y, 5, finishLine.height);
    
    // Bandera
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(finishLine.x + 5, finishLine.y + 10, 30, 20);
    
    // Texto
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('META', finishLine.x + finishLine.width / 2, finishLine.y + finishLine.height + 15);
}

function drawParticles() {
    for (let particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 60;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    document.getElementById(screenId).classList.add('active');
    
    // Detener música si no estamos en el juego
    if (screenId !== 'gameScreen') {
        document.getElementById('bgMusic').pause();
        document.getElementById('bgMusic').currentTime = 0;
    }
}

function restartGame() {
    // Reiniciar variables del juego
    player.x = window.innerWidth <= 768 ? 30 : 50;
    player.y = window.innerWidth <= 768 ? 220 : 300;
    player.velocityY = 0;
    player.isJumping = false;
    player.doubleJumpAvailable = true; // Resetear doble salto
    
    // Resetear velocidades
    obstacleSpeed = 2.5;
    obstacleSpawnRate = 0.02;
    
    obstacles = [];
    particles = [];
    
    showScreen('startScreen');
}

function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('muteButton');
    
    if (isMuted) {
        muteButton.textContent = '🔇';
        document.getElementById('bgMusic').pause();
    } else {
        muteButton.textContent = '🔊';
        if (gameRunning) {
            document.getElementById('bgMusic').play();
        }
    }
}

function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    
    // Crear partículas de confeti
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            life: 120,
            color: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#FF6B6B'][Math.floor(Math.random() * 5)]
        });
    }
    
    // Animar partículas de confeti
    function animateConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1000';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confetti = [];
        for (let i = 0; i < 50; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                life: 120,
                color: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#FF6B6B'][Math.floor(Math.random() * 5)]
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = confetti.length - 1; i >= 0; i--) {
                const piece = confetti[i];
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.life--;
                
                if (piece.life <= 0) {
                    confetti.splice(i, 1);
                } else {
                    ctx.fillStyle = piece.color;
                    ctx.globalAlpha = piece.life / 120;
                    ctx.fillRect(piece.x, piece.y, 8, 8);
                }
            }
            
            if (confetti.length > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(canvas);
            }
        }
        
        animate();
    }
    
    setTimeout(animateConfetti, 500);
} 

// Botón de debug para forzar la victoria y ver la carta
document.getElementById('forceWinButton').addEventListener('click', () => {
    showScreen('letterScreen');
    setTimeout(() => {
        document.querySelector('.envelope').classList.add('open');
    }, 300);
});