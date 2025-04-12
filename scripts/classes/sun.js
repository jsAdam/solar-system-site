class Sun {
    constructor(x, y, z){
        this.pos = createVector(x, y, z);
        
        this.r = 70;
        this.smig = this.r;
        
        this.particles = [];
        this.particleSpeed = 0.005;
        this.particleSpawnDist = this.r * 0.9;
    }
    
    calculateGrav(planet) {
        let force = p5.Vector.sub(this.pos, planet.pos);
        let dist = force.mag();
        dist = constrain(dist, 20, 50);
        
        force.normalize();
        
        var strength = (g*this.smig*planet.smig)/(dist*dist);
        force.mult(strength);
        return force;
    }
    
    generateParticle() {
        let r = this.particleSpawnDist;
        
        for(let i = 0; i < 5; i++) {
            let u = Math.random();
            let v = Math.random();
            
            let theta = 2 * PI * u;
            let phi = Math.acos(2 * v - 1);
            
            let x = (r * sin(phi) * cos(theta));
            let y = (r * sin(phi) * sin(theta));
            let z = (r * cos(phi));
            
            let p = createVector(x, y, z);
            let pos = p5.Vector.add(this.pos, p);
            
            let speed = this.particleSpeed;
            let vel = createVector(x, y, z);
            vel.mult(speed);
            
            this.particles.push(new SunParticle(pos.x, pos.y, pos.z, vel));
        }
    }
    
    show() {
        this.generateParticle();
        
        for(var i = this.particles.length-1; i >= 0; i--){
            this.particles[i].update();
            this.particles[i].show();
            if(this.particles[i].lifespan < 0){
                this.particles.splice(i, 1);
            }
        }
        
        fill(255, 71, 26);
        noStroke();
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        sphere(this.r);
        pop();
    }
}

class SunParticle {
    constructor(x, y, z, v) {
        this.pos = createVector(x, y, z);
        
        this.vel = v || p5.Vector.random3D();;
        this.vel.mult(0.2, 0.4);
        
        this.r = random(3, 8);
        
        this.lifespan = 255;
    }
    
    update() {
        this.pos.add(this.vel);
    }
    
    show() {
        fill(255, 0, 0, this.lifespan);
        noStroke();
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        sphere(this.r);
        pop();
        
        this.lifespan -= 2;
    }
}