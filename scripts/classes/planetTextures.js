function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

function generateHueFromRGB(r, g, b) {
    let R = r / 255;
    let G = g / 255;
    let B = b / 255;
    let values = [R, G, B];
    
    let min = 1000;
    let max = -1000;
    
    for(let i = 0; i < values.length; i++) {
        if(values[i] > max) {
            max = values[i];
        }
        if(values[i] < min) {
            min = values[i];
        }
    }
    
    let hue;
    if(max == R) {
        hue = (G-B)/(max-min);
    } else if(max == G) {
        hue = 2 + (B-R)/(max-min);
    } else if(max == B) {
        hue = 4 + (R-G)/(max-min);
    }
    
    hue *= 60;
    if(hue < 0) {
        hue += 360;
    }
    
    return hue;
}

function generatePlanetTexture(r, g, b) {
    // Generate an analogous color to the one inputed
    // (triade scheme with a distance of 0.8 and the fourth color in the array is the closest I could find to an analagous color)
    var scheme = new ColorScheme;
    var hue = Math.ceil(generateHueFromRGB(r, g, b));
    colors = scheme.from_hue(hue)  
        .scheme('triade')
        .distance(0.8)
        .colors();
    
    let natureColor = [r, g, b];
    let groundColor = [101, 67, 33];
    let waterColor = hexToRgb(colors[4]);
    
    let pixelWidth = 400;
    let pixelHeight = 200;
    
    let img = createImage(pixelWidth, pixelHeight);
    let s = 125;
    
    let inc = 0.026;
    let scale = 1;
    let cols = floor(pixelWidth / scale);
    let rows = floor(pixelHeight / scale);
    
    img.loadPixels();
    
    let yOff = 0;
    for(let y = 0; y < rows; y++) {
        let xOff = 0;
        for(let x = 0; x < cols; x++) {
            let n = noise(xOff, yOff) * 255;
            let col ;
            if(n > s) {
                let r = map(n, 255, s, natureColor[0], groundColor[0]);
                let g = map(n, 255, s, natureColor[1], groundColor[1]);
                let b = map(n, 255, s, natureColor[2], groundColor[2]);
                col = [r, g, b];
            } else {
                let r = map(n, s + 50, 0, groundColor[0], waterColor[0]);
                let g = map(n, s + 50, 0, groundColor[1], waterColor[1]);
                let b = map(n, s + 50, 0, groundColor[2], waterColor[2]);
                col = [r, g, b];
            }
            xOff += inc;
            
            let index = (x + y * pixelWidth) * 4;
            img.pixels[index] = col[0];
            img.pixels[index + 1] =  col[1];
            img.pixels[index + 2] =  col[2];
            img.pixels[index + 3] = 255;
        }
        yOff += inc;
    }
    
    img.updatePixels();
    return img;
}

function generateGasTexture(r, g, b, brightness) {
    let pixelWidth = 400;
    let pixelHeight = 200;
    
    let img = createImage(pixelWidth, pixelHeight);
    
    let inputCol = [r, g, b];
    
    let inc = 0.04;
    let scale = 1;
    let cols = floor(pixelWidth / scale);
    let rows = floor(pixelHeight / scale);
    
    img.loadPixels();
    
    let yOff = 0;
    for(let y = 0; y < rows; y++) {
        let xOff = 0;
        for(let x = 0; x < cols; x++) {
            let n = noise(xOff, yOff) * 255;
            
            let r = map(n, 255, 0, inputCol[0], brightness);
            let g = map(n, 255, 0, inputCol[1], brightness);
            let b = map(n, 255, 0, inputCol[2], brightness);
            let col = [r, g, b];
            
            xOff += inc;
            
            let index = (x + y * pixelWidth) * 4;
            img.pixels[index] = col[0];
            img.pixels[index + 1] =  col[1];
            img.pixels[index + 2] =  col[2];
            img.pixels[index + 3] = 255;
        }
        yOff += inc * 2;
    }
    
    img.updatePixels();
    return img;
}