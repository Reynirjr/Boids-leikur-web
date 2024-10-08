// hakarl.js

class Hakarl {
    constructor(x, y) {
        this.position = new Vec2D(x, y);
        this.velocity = new Vec2D(Math.random() - 0.5, Math.random() - 0.5);
        this.size = 20;  
        this.maxSpeed = 3;

        this.image = new Image();  
        this.image.src = '../img/hakarl.png';
        this.keysPressed = {};
        this.angle = 0;
    }
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keysPressed[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keysPressed[event.key] = false;
        });
    }


    update() {

        this.velocity = new Vec2D(0, 0);

        if (this.keysPressed['ArrowUp']) {
            this.velocity.y = -this.maxSpeed;
            this.angle = Math.PI * 1.5;  
        }
        if (this.keysPressed['ArrowDown']) {
            this.velocity.y = this.maxSpeed;
            this.angle = Math.PI / 2;  
        }
        if (this.keysPressed['ArrowLeft']) {
            this.velocity.x = -this.maxSpeed;
            this.angle = Math.PI;  
        }
        if (this.keysPressed['ArrowRight']) {
            this.velocity.x = this.maxSpeed;
            this.angle = 0;  
        }

        if(this.velocity.magnitude() > 0){
            this.velocity.normalize();
            this.velocity.multiply(this.maxSpeed);
        }


        this.position.add(this.velocity);

        
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
        if (this.position.y > canvas.height) this.position.y = 0;
    }

 
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        let angle = Math.atan2(this.velocity.y, this.velocity.x);

        if(this.velocity.x < 0 && this.velocity.y === 0){
            ctx.scale(-1, 1);
        }else if(this.velocity.x < 0 && this.velocity.y < 0){
            ctx.scale(1, -1);
            ctx.rotate(angle * Math.PI / 2);
        
        }else if(this.velocity.x < 0 && this.velocity.y > 0){
            ctx.scale(1, -1);
            ctx.rotate(angle * Math.PI / 2);
        }else{
            ctx.rotate(angle);
        }

        ctx.drawImage(this.image, -this.size, -this.size, this.size * 3, this.size * 2);

        ctx.restore();
    }

 
    collidesWith(boid) {
        let distance = this.position.distance(boid.position);
        return distance < this.size; 
    }


    grow() {
        this.size += 0.5;  
        if (this.size > 100) {
            this.size = 100;  
        }
    }
}
