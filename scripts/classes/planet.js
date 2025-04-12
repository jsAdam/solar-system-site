class Planet {
    constructor(x, z, r, col, orbitingBody, gasGaint, smig) {
        this.pos = createVector(x, 0, z);
        this.vel = createVector(5, 0, 0);
        this.acc = createVector(0, 0, 0);
        
        this.col = col || color(255);
        
        this.r = r || 10;
        this.smig = smig || this.r;
        
        this.orbitingBody = orbitingBody;
        this.orbitDist = p5.Vector.sub(this.pos, orbitingBody.pos).mag();
        this.orbitAngle = 0;
        this.orbitSpeed = map(this.smig, 0, 200, MIN_ORBIT_SPEED, MAX_ORBIT_SPEED) * map(this.orbitDist, 0, MAX_PLANET_DIST, 1, 0);
        
        this.history = [];
        this.trailLength = 70;
        this.trailClarity = 3;
        
        if(this.orbitSpeed > 0.1) {
            this.trailClarity = 1;
        }
        
        this.gasGaint = gasGaint || false;
        
        if(this.gasGaint) {
            this.texture = generateGasTexture(col.levels[0], col.levels[1], col.levels[2], random(0, 20));
        } else {
            this.texture = generatePlanetTexture(col.levels[0], col.levels[1], col.levels[2]);
        }

        this.particles = [];
    }
    
    orbit() {
        if(frameCount%this.trailClarity == 0) {
            this.history.push({pos: this.pos.copy(), behindSun: this.behindSun});

            if(this.history.length > this.trailLength){
                this.history.splice(0, 1);
            }
        }
        
        this.orbitAngle += this.orbitSpeed;
        
        let p = createVector(this.orbitDist * cos(this.orbitAngle), 0, this.orbitDist * sin(this.orbitAngle));
        this.pos = p5.Vector.add(this.orbitingBody.pos, p);
    }
    
    applyForce(f){
        this.acc.add(f);
    }
    
    drawTrail() {
        noFill();
        stroke(255, 255, 255, 40);
        strokeWeight(1);
        beginShape();
        for(var i = 0; i < this.history.length; i++){
            var loc = this.history[i].pos;
            vertex(loc.x, loc.y, loc.z);
        }
        endShape();
    }
    
    update() {
        this.history.push({pos: this.pos.copy(), behindSun: this.behindSun});
        
        if(this.history.length > 70){
            this.history.splice(0, 1);
        }
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    
    show(){
        fill(this.col);
        noStroke();
        
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        texture(this.texture);
        sphere(this.r);
        pop();
    }
}