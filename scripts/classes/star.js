class Star {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z);
        this.vel = createVector(-5, 0, 0);
        this.r = random(4, 6);
        
        this.flickerStart = millis();
        this.timeBetweenFlicker = random(500, 5000);
    }
    
    update() {
        this.pos.add(this.vel);
    }
    
    show() {
        fill(255);
        noStroke();
        if(millis() > this.flickerStart + this.timeBetweenFlicker) {
            this.flickerStart = millis();
            this.timeBetweenFlicker = random(3000, 25000);
            push();
            translate(this.pos.x, this.pos.y, this.pos.z);
            box(this.r);
            pop();
        } else {
            push();
            translate(this.pos.x, this.pos.y, this.pos.z);
            box(this.r);
            pop();
        }
    }
}