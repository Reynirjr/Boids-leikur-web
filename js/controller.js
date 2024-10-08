// controller.js

class GameController {
    constructor() {
        this.isPaused = false;
        this.isGameOver = false;
        this.initializeEventListeners();
    }


    initializeEventListeners() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'p':   
                    this.togglePause();
                    break;
                case 'm':
                    backgroundMusic.muted = !backgroundMusic.muted;
                    eatSound.muted = !eatSound.muted;
                    break;
                default:
                    break;
            }
        });
    }


    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            console.log("Game paused");
            backgroundMusic.pause();
        } else {
            console.log("Game resumed");
            backgroundMusic.play();
            this.resumeGame();
        }
    }


    resumeGame() {
        if (!this.isPaused) {
            requestAnimationFrame(gameLoop);  
        }
    }

  
    restartGame() {
        console.log("Game restarted");
        score = 0;
        boids = [];  
        hakarl = new Hakarl(canvas.width / 2, canvas.height / 2); 

        for (let i = 0; i < 100; i++) {
            boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
        }

        this.isGameOver = false;
        if (!this.isPaused) {
            requestAnimationFrame(gameLoop);
        }
    }

  
    checkGameOver() {
        if (boids.length === 0) {
            this.isGameOver = true;
            this.displayGameOver();
        }
    }

 
    displayGameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText("Game Over! You ate all the boids!", canvas.width / 2 - 200, canvas.height / 2);
        console.log("Game over");
    }
}
