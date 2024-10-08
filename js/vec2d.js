// vec2d.js

class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let mag = this.magnitude();
        if (mag !== 0) {
            this.divide(mag);
        }
    }

    setMagnitude(mag) {
        this.normalize();
        this.multiply(mag);
    }

    limit(max) {
        if (this.magnitude() > max) {
            this.setMagnitude(max);
        }
    }

    distance(vec) {
        let dx = this.x - vec.x;
        let dy = this.y - vec.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static subtract(v1, v2) {
        return new Vec2D(v1.x - v2.x, v1.y - v2.y);
    }
}
