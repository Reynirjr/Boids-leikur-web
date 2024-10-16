// hakarl.js

class Hakarl {
    constructor(x, y) {
        this.position = new Vec2D(x, y);
        this.velocity = new Vec2D(0,0);
        this.size = 20;  
        this.maxSpeed = 3;

        this.scaleSpeed();

        this.image = new Image();  
        this.image.src = '../img/hakarl.png';
        this.keysPressed = {};
        this.angle = 0;

        this.targetPosition = null;
        this.isUsingTouch = false;
    }
    scaleSpeed() {
        let scaleFactor = Math.min(canvas.width / 1920, canvas.height / 1080); 
        this.maxSpeed = 5 * scaleFactor;
    }
    handleInput() {
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            let touchPos = this.getTouchPos(event);
            this.targetPosition = touchPos;
            this.isUsingTouch = true;

            let direction = Vec2D.subtract(touchPos, this.position);
            direction.normalize();
            direction.multiply(this.maxSpeed);
            this.velocity = direction;
        }, { passive: false });

        window.addEventListener('keydown', (event) => {
            this.keysPressed[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keysPressed[event.key] = false;
        });
    }

    getTouchPos(event) {
        let rect = canvas.getBoundingClientRect();
        let touch = event.touches[0] || event.changedTouches[0];
        return new Vec2D(touch.clientX - rect.left, touch.clientY - rect.top);
    }



    update() {
        this.scaleSpeed();
        if (this.isUsingTouch && this.targetPosition) {
            let distanceToTarget = this.position.distance(this.targetPosition);

            if (distanceToTarget < this.size) {
                this.velocity = new Vec2D(0, 0);  
                this.targetPosition = null; 
            } else {

                let direction = Vec2D.subtract(this.targetPosition, this.position);
                direction.normalize();
                direction.multiply(this.maxSpeed);
                this.velocity = direction;
            }
        }
        if (!this.isUsingTouch) {
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

            if (this.velocity.magnitude() > 0) {
                this.velocity.normalize();
                this.velocity.multiply(this.maxSpeed);
            }
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
        if(this.isUsingTouch){
            ctx.rotate(angle);
        }else {
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
