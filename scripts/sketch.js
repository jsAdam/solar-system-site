let sun;
let easycam;
let keys = [];
let asteriodModels = [];

let planets = [];
let asteriodBelt = [];
let stars = [];
let colValues = [[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];

let form;
let sizeInput;
let weightInput;
let colorInput;
let frameInput;
let gasCheck;

let creatingPlanet = false;
let newPlanetValues;

const MAX_PLANET_DIST = 4000;
const MAX_ORBIT_SPEED = 0.3;
const MIN_ORBIT_SPEED = 0.001;

let orbitingBodyIdx = -1;
let cameraBodyIdx = -1;

window.addEventListener('contextmenu', function (e) { 
  // Remove context menu on right click
  e.preventDefault(); 
}, false);

function preload() {
    asteriodModels.push(loadModel("assets/Asteriod1.obj"));
    asteriodModels.push(loadModel("assets/Asteriod2.obj"));
    asteriodModels.push(loadModel("assets/Asteriod2.obj"));
}

function setup(){
    let myCanvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    myCanvas.parent("canvasHolder");
    
    sun = new Sun(0, 0, 0);
    G = 1;
    
    // Must have in order for EasyCam to work (unfixed bug)
    Dw.EasyCam.prototype.apply = function(n) {
      var o = this.cam;
      n = n || o.renderer,
      n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
    };
    
    easycam = createEasyCam();
    easycam.setDistanceMin(160);
    easycam.setDistanceMax(3750);
    
    let p1 = new Planet(sun.pos.x, 300, 8, color(102, 255, 153), sun);
    let p2 = new Planet(sun.pos.x, 600, 10, color(50, 150, 153), sun);
    let p3 = new Planet(sun.pos.x, -750, 20, color(70, 255, 0), sun, false, 0);
    let p4 = new Planet(sun.pos.x, 850, 15, color(200, 75, 120), sun);
    let p5 = new Planet(sun.pos.x, -1400, 30, color(0, 50, 153), sun, true);
    let p6 = new Planet(sun.pos.x, 1800, 60, color(255, 204, 153), sun, true, 20);
    
    planets.push(p1);
    planets.push(p2);
    planets.push(p3);
    planets.push(p4);
    planets.push(p5);
    planets.push(p6);
    
    // Generate star field
    let r = 4000;
    for(let i = 0; i < 400; i++) {
        let u = Math.random();
        let v = Math.random();
        let theta = 2 * PI * u;
        let phi = Math.acos(2 * v - 1);
        let x = (r * sin(phi) * cos(theta));
        let y = (r * sin(phi) * sin(theta));
        let z = (r * cos(phi));

        let p = createVector(x, y, z);
        
        stars.push(new Star(x, y, z));
    }
    
    // Generate Asteriods
    for(let i = 0; i < 200; i++) {
        let a = random(2 * PI);
        let r = 1000 * random(1, 1.2);
        let p = createVector(r * cos(a), random(-15, 15), r * sin(a));
        asteriodBelt.push(new Asteriod(p.x, p.y, p.z, random(1.5, 3), a, sun));
    }
    
    sizeInput = select("#sizeSlider");
    weightInput = select("#weightSlider");
    colorInput = select("#colorSlider");
    frameInput = select("#frameSlider");
    gasCheck = select("#gasGiant");
    
    form = select("#planetForm");
    //form.style("background-image", `linear-gradient(to right, ${colString})`);
}

function keyPressed() {
    if(keyCode == LEFT_ARROW) {
        orbitingBodyIdx--;
        if(orbitingBodyIdx < -1) {
            orbitingBodyIdx = planets.length - 1;
        }
        
        keys[0] = true;
    }
    if(keyCode == RIGHT_ARROW) {
        orbitingBodyIdx++;
        if(orbitingBodyIdx > planets.length - 1) {
            orbitingBodyIdx = -1;
        }
        
        keys[1] = true;
    }
    if(keyCode == UP_ARROW) {
        keys[2] = true;
    }
    if(keyCode == DOWN_ARROW) {
        keys[3] = true;
    }
}

function keyReleased() {
    if(keyCode == LEFT_ARROW) {
        keys[0] = false;
    }
    if(keyCode == RIGHT_ARROW) {
        keys[1] = false;
    }
    if(keyCode == UP_ARROW) {
        keys[2] = false;
    }
    if(keyCode == DOWN_ARROW) {
        keys[3] = false;
    }

    if(keyCode == 69) {
        if(creatingPlanet) {
            createPlanet();
        } else {
            startPlanetCreation();
        }
    }

    if(keyCode == 82) {
        incrementCameraBody();
    }
}

function startPlanetCreation() {
    creatingPlanet = true;

    let dist = 200;
    let angle = 5 * PI/4;
    newPlanetValues = {
        angle: angle,
        dist: dist
    };

    document.getElementById("planetCreationStarted").style.display = "block";
    document.getElementById("planetCreationWaiting").style.display = "none";
}

function createPlanet() {
    let orbitingBody = null;
    if(orbitingBodyIdx == -1) {
        orbitingBody = sun;
    } else {
        orbitingBody = planets[orbitingBodyIdx];
    }
    
    let val = colorInput.value() % 255;

    let colorOneIndex = floor(colorInput.value() / 255);
    let colorTwoIndex = colorOneIndex + 1;

    let colorOne = colValues[colorOneIndex];
    let colorTwo = colValues[colorTwoIndex];

    let mapR = map(val, 0, 255, colorOne[0], colorTwo[0]);
    let mapG = map(val, 0, 255, colorOne[1], colorTwo[1]);
    let mapB = map(val, 0, 255, colorOne[2], colorTwo[2]);
    let col = color(mapR, mapG, mapB);
    
    console.log(col);
    let pos = createVector(newPlanetValues.dist * cos(newPlanetValues.angle), 0, newPlanetValues.dist * sin(newPlanetValues.angle));
    pos.add(orbitingBody.pos);
    
    let p = new Planet(pos.x, pos.z, sizeInput.value(), col, orbitingBody, gasCheck.checked(), weightInput.value());
    p.orbitAngle = newPlanetValues.angle;
    planets.push(p);
    
    creatingPlanet = false;
    document.getElementById("planetCreationStarted").style.display = "none";
    document.getElementById("planetCreationWaiting").style.display = "block";
}

function moveCamera(target) {
    easycam.state.center = target.array();
}

function incrementCameraBody() {
    cameraBodyIdx++;

    if(cameraBodyIdx > planets.length - 1) {
        cameraBodyIdx = -1;
    }
}

function draw(){
    background(0);
    
    // Create sun illumination
    let pos = 160;
    let z = pos;
    for (let i = 0; i < 2; i++) {
        z = -z;
        pointLight(255, 255, 255, -pos, -pos, z);
        pointLight(255, 255, 255, pos, -pos, z);
        pointLight(255, 255, 255, pos, pos, z);
        pointLight(255, 255, 255, -pos, pos, z);
    }
    frameRate(frameInput.value());
    
    
    // Show Sun
    sun.show();
    
    // Show star field
    for(let star of stars) {
        star.show();
    }
    
    // Show asteriod field
    for(let a of asteriodBelt) {
        a.orbit();
        a.show();
    }

    // camera to planet
    if(cameraBodyIdx > -1) {
        moveCamera(planets[cameraBodyIdx].pos);
    } else {
        moveCamera(new p5.Vector(0, 0, 0));
    }

    // Show planets
    for(let p of planets) {
        p.orbit();
        p.drawTrail();
        p.show();
    }
    
    if(creatingPlanet) {
        let orbitingBody = orbitingBodyIdx == -1 ? sun : planets[orbitingBodyIdx];
        
        // Update planet speed with slider value
        let speed = map(weightInput.value(), 0, 200, MIN_ORBIT_SPEED, MAX_ORBIT_SPEED)  * map(newPlanetValues.dist, 0, MAX_PLANET_DIST, 1, MIN_ORBIT_SPEED);
        newPlanetValues.angle += speed;
        
        if(keys[2]) {
            newPlanetValues.dist += 15;
            
            if(newPlanetValues.dist > MAX_PLANET_DIST) {
                newPlanetValues.dist = MAX_PLANET_DIST;
            }
        } else if(keys[3]) {
            newPlanetValues.dist -= 15;
            
            if(newPlanetValues.dist < orbitingBody.r + sizeInput.value()) {
                newPlanetValues.dist = orbitingBody.r + sizeInput.value();
            }
        }
        
        // Show orbit trail
        let dist = newPlanetValues.dist;
        
        noFill();
        stroke(255, 255, 255, 40);
        strokeWeight(1);
        
        push();
        translate(orbitingBody.pos.x, orbitingBody.pos.y, orbitingBody.pos.z);
        beginShape();
        for(let i = 0; i < 360; i+=360/50) {
            let a = (PI/180) * i;
            vertex(dist * cos(a), 0, dist * sin(a));
        }
        vertex(dist * cos(0), 0, dist * sin(0));
        endShape();
        pop();
        
        // Give planet mapped slider value color
        let val = colorInput.value() % 255;
        let colorOneIndex = floor(colorInput.value() / 255);
        let colorTwoIndex = colorOneIndex + 1;

        let col = color(255, 0, 0);
        if (colorTwoIndex < colValues.length) {
            let colorOne = colValues[colorOneIndex];
            let colorTwo = colValues[colorTwoIndex];

            let mapR = map(val, 0, 255, colorOne[0], colorTwo[0]);
            let mapG = map(val, 0, 255, colorOne[1], colorTwo[1]);
            let mapB = map(val, 0, 255, colorOne[2], colorTwo[2]);
            
            col = color(mapR, mapG, mapB);
        }
        
        let pos = createVector(newPlanetValues.dist * cos(newPlanetValues.angle), 0, newPlanetValues.dist * sin(newPlanetValues.angle));
        pos.add(orbitingBody.pos);
        
        // Show planet with chosen color and position
        fill(col);
        push();
        translate(pos.x, pos.y, pos.z);
        sphere(sizeInput.value());
        pop();
    }
}