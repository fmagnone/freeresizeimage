// Simple downsample
function downScaleImage(img, inputType, cropMode, backColor, scalePercentage, fixedWidth, fixedHeight) {
    // Define main variables
    let sx, sy, sw, sh;
    let dx, dy, dw, dh;
    let cw, ch;
    sx = 0; 
    sy = 0;
    sw = img.width;
    sh = img.height;
    dx = 0;
    dy = 0;
    cw = 600; 
    ch = 400;
    // Define canvas width and height depending on type
    if (inputType == "percentage") {
        // Scale image auto to a defined percentage
        cw = Math.ceil(sw * scalePercentage);
        ch = Math.ceil(sh * scalePercentage);
    } else if (inputType == "forced") {
        // Force image to a fixed size
        cw = fixedWidth;
        ch = fixedHeight;
        dw = fixedWidth;
        dh = fixedHeight;
        // Prevent from cw canvas width or ch canvas height to be 0
        if (fixedWidth == 0) { 
            cw = Math.ceil(sw / (sh / fixedHeight)); 
            dw = cw;
        }
        if (fixedHeight == 0) { 
            ch = Math.ceil(sh / (sw / fixedWidth)); 
            dh = ch;
        }
        if (fixedWidth == 0 && fixedHeight == 0) { 
            cw = sw;
            ch = sh;
            dw = sw;
            dh = sh;
        }
    } else if (inputType == "fixed") {
        // Scale image to a fixed dimension
        cw = fixedWidth;
        ch = fixedHeight;

        // Prevent from cw canvas width or ch canvas height to be 0
        if (fixedWidth == 0) { cw = Math.ceil(sw / (sh / fixedHeight)); }
        if (fixedHeight == 0) { ch = Math.ceil(sh / (sw / fixedWidth)); }
        if (fixedWidth == 0 && fixedHeight == 0) { 
            cw = sw;
            ch = sh;
        }
    }
    // If type is not forced, crop or contain image
    if (inputType != "forced") {
        // Calculate Scale Factor and scale size
        let sfw = img.width / cw;
        let sfh = img.height / ch;

        if (cropMode) {
            // > Crop
            if (sfw < sfh) {
                // Scale and crop using width
                //console.log("Scale by Width: ", sfw);
                dw = Math.ceil(sw / sfw);
                dh = Math.ceil(sh / sfw);
                // Calculate centered position
                dy = Math.ceil((ch - dh) / 2);
            } else {
                // Scale and crop using width
                //console.log("Scale by Height: ", sfh);
                dw = Math.ceil(sw / sfh);
                dh = Math.ceil(sh / sfh);
                // Calculate centered position
                dx = Math.ceil((cw - dw) / 2);
            }
        } else {
            // > Contain
            if (sfw > sfh) {
                // Scale and crop using width
                //console.log("Scale by Width: ", sfw);
                dw = Math.ceil(sw / sfw);
                dh = Math.ceil(sh / sfw);
                // Calculate centered position
                dy = Math.ceil((ch - dh) / 2);
            } else {
                // Scale and crop using width
                //console.log("Scale by Height: ", sfh);
                dw = Math.ceil(sw / sfh);
                dh = Math.ceil(sh / sfh);
                // Calculate centered position
                dx = Math.ceil((cw - dw) / 2);
            }
        }
    }
    // Print analysis
    //console.log("S: ", sx, sy, sw, sh);
    //console.log("D: ", dx, dy, dw, dh);
    //console.log("C: ", cw, ch);
    // Create a new canvas
    let canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    let ctx = canvas.getContext("2d");
    // Define Background Color
    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, cw, ch);
    // Draw scaled image inside canvas
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    // Return final canvas
    return canvas;
}
