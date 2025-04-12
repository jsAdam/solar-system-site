class Asteriod {
    constructor(x, y, z, scale, a, orbitingBody) {
        this.pos = createVector(x, y, z);
        
        this.scale = scale;
        this.scaleValues = createVector(random(0.9, 1.2) * scale, random(0.9, 1.2) * scale, random(0.9, 1.2) * scale);
        this.model = random(asteriodModels);
        
        this.rotateAngles = createVector(0, 0, 0);
        this.rotateSpeeds = createVector(random(0, 0.03), random(0, 0.03), random(0, 0.03));
        
        this.orbitSpeed = random(0.009, 0.011);
        this.orbitingBody = orbitingBody;
        this.orbitAngle = a;
        this.orbitDist = p5.Vector.sub(orbitingBody.pos, this.pos).mag();
    }
    
    orbit() {
        this.orbitAngle += this.orbitSpeed;
        let p = createVector(this.orbitDist * cos(this.orbitAngle), this.pos.y, this.orbitDist * sin(this.orbitAngle));
        this.pos = p5.Vector.add(this.orbitingBody.pos, p);
    }
    
    show() {
        this.rotateAngles.add(this.rotateSpeeds);
        
        fill(255);
        noStroke();
        
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        push();
        translate(0, 0, 0);
        rotateX(this.rotateAngles.x);
        rotateY(this.rotateAngles.y);
        rotateZ(this.rotateAngles.z);
        scale(this.scaleValues.x, this.scaleValues.y, this.scaleValues.z);
        model(this.model);
        pop();
        pop();
    }
}