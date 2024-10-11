let gameStarted = false;
let canvas, ctx;
let boids = [];
let hakarl;
let score = 0;
let gameController;
let backgroundImage = new Image();
backgroundImage.src = '../img/vatnBakgrunnur.jpg';
let backgroundMusic = new Audio('../sound/Groove.mp3');
let eatSound = new Audio('../sound/ate.mp3');
backgroundMusic.loop = true;
let animationFrameId; 

window.onload = function() {
    const introScreen = document.getElementById('introScreen');
    const gameContainer = document.getElementById('gameContainer');
    const startButton = document.getElementById('startButton');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const restartButton = document.getElementById('restartButton');

    startButton.addEventListener('click', function() {
        introScreen.style.display = 'none'; 
        gameContainer.style.display = 'block'; 

        backgroundMusic.play();  
        
        init();
    });
    restartButton.addEventListener('click', function() {
        gameOverScreen.style.display = 'none'; 
        gameContainer.style.display = 'block'; 
        resetGame(); 
    });

   
};

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fishTypes = ['bluefish', 'brownfish', 'orangefish', 'pufferfish'];
    for (let i = 0; i < 100; i++) {
        const randomType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, randomType));
    }
    hakarl = new Hakarl(canvas.width / 2, canvas.height / 2);
    hakarl.handleInput();	
    window.addEventListener('keydown', (event) => {
        if(event.key === 'r'){
            resetGame();
        }
    });

    gameController = new GameController();
    gameLoop();
}
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function resetGame() {
    cancelAnimationFrame(animationFrameId);
    boids = [];
    score = 0;
    const fishTypes = ['bluefish', 'brownfish', 'orangefish', 'pufferfish'];
    for (let i = 0; i < 100; i++) {
        const randomType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, randomType));
    }
    hakarl = new Hakarl(canvas.width / 2, canvas.height / 2);
    hakarl.handleInput(); 
    gameController.isGameOver = false;  
    gameLoop();  
}

function gameLoop() {
    if (!gameController.isPaused && !gameController.isGameOver){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        boids.forEach(boid => {
            boid.update(boids, hakarl);
            boid.draw(ctx);
        });
    
        hakarl.update();
        hakarl.draw(ctx);


        checkCollisions();


        document.getElementById('scoreLabel').innerText = 'Fiskar borðaðir: ' + score;

        gameController.checkGameOver();

        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function checkCollisions() {
    for (let i = boids.length - 1; i >= 0; i--) {
        if (hakarl.collidesWith(boids[i])) {
            eatSound.play();

            boids.splice(i, 1);
            hakarl.grow();
            score++;
        }
    }
    if (boids.length === 0) {
        endGame();
    }
}

function endGame() {
    gameController.isGameOver = true;
    cancelAnimationFrame(animationFrameId);

    const gameContainer = document.getElementById('gameContainer');
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameContainer.style.display = 'none'; 
    gameOverScreen.style.display = 'flex';  
}
