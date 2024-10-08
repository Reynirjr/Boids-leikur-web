// boid.js

class Boid {
    constructor(x, y, type) {
        this.position = new Vec2D(x, y);
        this.velocity = new Vec2D(Math.random() - 0.5, Math.random() - 0.5);
        this.acceleration = new Vec2D(0, 0);
        this.maxSpeed = 3;  
        this.maxForce = 0.05;
        this.fleeSpeed = 3.2;
        this.isFleeing = false;
        this.fleedelay = 0;
        this.fleeReactionTime = 20;
        this.type = type;

        this.image = new Image();
        this.setImageBasedonType();
    }

    setImageBasedonType() {
        switch (this.type){
            case 'bluefish':
                this.image.src = '../img/bluefish.png';
                break;
            case 'brownfish':
                this.image.src = '../img/brownfish.png';
                break;
            case 'orangefish':
                this.image.src = '../img/orangeFish.png';
                break;
            case 'pufferfish':
                this.image.src = '../img/pufferFish.png';
                break;
        }
    }

    checkProximity(predator) {
        const d = this.position.distance(predator.position);
        if(d < 110){
            this.fleeDelay++;
            if(this.fleeDelay > this.fleeReactionTime){
                this.isFleeing = true;
            }
        } else {   
            this.isFleeing = false;
            this.fleeDelay = 0;
        }
    }

    flee(predator) {
        if(this.isFleeing){
            let fleeVector = Vec2D.subtract(this.position, predator.position);
            fleeVector.normalize();
            fleeVector.multiply(this.fleeSpeed);
            this.acceleration.add(fleeVector);
        }
    }

    screenWrap() {
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
        if (this.position.y > canvas.height) this.position.y = 0;

    }

    
    update(boids, predator) {
        this.checkProximity(predator);
        if(this.isFleeing){
            this.flee(predator);
        }else{
            this.applyBehaviors(boids, predator);
        }
       

      
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.isFleeing? this.fleeSpeed : this.maxSpeed);
        this.position.add(this.velocity);

        this.screenWrap();

        this.acceleration.multiply(0);
    }


    draw(ctx) {
 
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        let angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.rotate(angle + Math.PI );

      
        ctx.drawImage(this.image, -10, -10, 30, 30);

        ctx.restore();
    }


    applyBehaviors(boids, predator) {
        let separationForce = this.separation(boids);
        let alignmentForce = this.alignment(boids);
        let cohesionForce = this.cohesion(boids);
        let avoidanceForce = this.avoidPredator(predator);


        separationForce.multiply(1.5);
        alignmentForce.multiply(1.0);
        cohesionForce.multiply(1.0);
        avoidanceForce.multiply(2.0); 

   
        this.acceleration.add(separationForce);
        this.acceleration.add(alignmentForce);
        this.acceleration.add(cohesionForce);
        this.acceleration.add(avoidanceForce);
    }

    separation(boids) {
        let desiredSeparation = 25;
        let steer = new Vec2D(0, 0);
        let count = 0;

        boids.forEach(boid => {
            if(boid.type === this.type){
                let d = this.position.distance(boid.position);
                if (d > 0 && d < desiredSeparation) {
                    let diff = Vec2D.subtract(this.position, boid.position);
                    diff.normalize();
                    diff.divide(d);  
                    steer.add(diff);
                    count++;
                }
            }
        });

        if (count > 0) {
            steer.divide(count);
        }

        if (steer.magnitude() > 0) {
            steer.setMagnitude(this.maxSpeed);
            steer.subtract(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    
    alignment(boids) {
        let neighborDist = 50;
        let sum = new Vec2D(0, 0);
        let count = 0;

        boids.forEach(boid => {
            if (boid.type === this.type){
                let d = this.position.distance(boid.position);
                if (d > 0 && d < neighborDist) {
                    sum.add(boid.velocity);
                    count++;
                }
            }
        });

        if (count > 0) {
            sum.divide(count);
            sum.setMagnitude(this.maxSpeed);
            let steer = Vec2D.subtract(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }
        return new Vec2D(0, 0);
    }

    cohesion(boids) {
        let neighborDist = 50;
        let sum = new Vec2D(0, 0);
        let count = 0;

        boids.forEach(boid => {
            if (boid.type === this.type){
                let d = this.position.distance(boid.position);
                if (d > 0 && d < neighborDist) {
                    sum.add(boid.position);
                    count++;
                }
            }
        });

        if (count > 0) {
            sum.divide(count);
            return this.seek(sum); 
        }
        return new Vec2D(0, 0);
    }

    avoidPredator(predator) {
        let desiredSeparation = 75;
        let steer = new Vec2D(0, 0);
        let d = this.position.distance(predator.position);

        if (d < desiredSeparation) {
            let diff = Vec2D.subtract(this.position, predator.position);
            diff.normalize();
            diff.divide(d); 
            steer.add(diff);
        }

        if (steer.magnitude() > 0) {
            steer.setMagnitude(this.maxSpeed);
            steer.subtract(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    seek(target) {
        let desired = Vec2D.subtract(target, this.position);
        desired.setMagnitude(this.maxSpeed);

        let steer = Vec2D.subtract(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }
}
