// Simple downsample
function downScaleImage(img, inputType, cropMode, backColor, scalePercentage, fixedWidth, fixedHeight) {
    // Define main variables
    let sx, sy, sw, sh;
    let dx, dy, dw, dh;
    let cw, ch;
    sx = 0, sy = 0;
    sw = img.width;
    sh = img.height;
    dx = 0, dy = 0;
    cw = 600, ch = 400;

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
    };

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
        };
    };

    // Print analysis
    //console.log("S: ", sx, sy, sw, sh);
    //console.log("D: ", dx, dy, dw, dh);
    //console.log("C: ", cw, ch);

    // Create a new canvas
    let canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    ctx = canvas.getContext("2d");

    // Define Background Color
    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, cw, ch);

    // Draw scaled image inside canvas
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

    return canvas;
}







// Multiple downsample

// Scales the image by (float) scale < 1 and returns a canvas containing the scaled image.
/*
function downScaleImage(img, scale, width) {
var imgCV = document.createElement('canvas');
imgCV.width = img.width;
imgCV.height = img.height;
var imgCtx = imgCV.getContext('2d');
imgCtx.drawImage(img, 0, 0);

return downScaleCanvas(imgCV, scale, width);
}
*/
/*
function downScaleCanvas(cv, scale, width) {
    // If scale is fixed, force to fixed width
    if (width) {
        var sqScale = scale * scale; // square scale = area of source pixel within target
        var sw = cv.width - 1; // source image width
        var sh = cv.height - 1; // source image height

        var tw = Math.floor(sw * scale); // target image width
        var th = Math.floor(sh * scale); // target image height

        tw = width; // custom FM
        scale = tw / sw // custom FM
        sqScale = scale * scale; // custom FM
        rt = sh / sw; // custom FM
        th = tw * rt; // custom FM
    }
    // If scale is not fixed
    else {
        if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 '); // REVIEW

        var sqScale = scale * scale; // square scale = area of source pixel within target
        var sw = cv.width - 1; // source image width
        var sh = cv.height - 1; // source image height

        var tw = Math.floor(sw * scale); // target image width
        var th = Math.floor(sh * scale); // target image height
    }



    var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    var tX = 0, tY = 0; // rounded tx, ty
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    var crossX = false; // does scaled px cross its current px right border ?
    var crossY = false; // does scaled px cross its current px bottom border ?
    var sBuffer = cv.getContext('2d').
        getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
    var sR = 0, sG = 0, sB = 0; // source's current point r,g,b


    for (sy = 0; sy < sh; sy++) {
        ty = sy * scale; // y src position within target
        tY = 0 | ty;     // rounded : target pixel's y
        yIndex = 3 * tY * tw;  // line index within target array
        crossY = (tY != (0 | ty + scale));
        if (crossY) { // if pixel is crossing botton target pixel
            wy = (tY + 1 - ty); // weight of point within target pixel
            nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
        }
        for (sx = 0; sx < sw; sx++, sIndex += 4) {
            tx = sx * scale; // x src position within target
            tX = 0 | tx;    // rounded : target pixel's x
            tIndex = yIndex + tX * 3; // target pixel index within target array
            crossX = (tX != (0 | tx + scale));
            if (crossX) { // if pixel is crossing target pixel's right
                wx = (tX + 1 - tx); // weight of point within target pixel
                nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
            }
            sR = sBuffer[sIndex];   // retrieving r,g,b for curr src px.
            sG = sBuffer[sIndex + 1];
            sB = sBuffer[sIndex + 2];

           
            if (!crossX && !crossY) { // pixel does not cross
                // just add components weighted by squared scale.
                tBuffer[tIndex] += sR * sqScale;
                tBuffer[tIndex + 1] += sG * sqScale;
                tBuffer[tIndex + 2] += sB * sqScale;
            } else if (crossX && !crossY) { // cross on X only
                w = wx * scale;
                // add weighted component for current px
                tBuffer[tIndex] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tX+1) px                
                nw = nwx * scale
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
            } else if (crossY && !crossX) { // cross on Y only
                w = wy * scale;
                // add weighted component for current px
                tBuffer[tIndex] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tY+1) px                
                nw = nwy * scale
                tBuffer[tIndex + 3 * tw] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
            } else { // crosses both x and y : four target points involved
                // add weighted component for current px
                w = wx * wy;
                tBuffer[tIndex] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // for tX + 1; tY px
                nw = nwx * wy;
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
                // for tX ; tY + 1 px
                nw = wx * nwy;
                tBuffer[tIndex + 3 * tw] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                // for tX + 1 ; tY +1 px
                nw = nwx * nwy;
                tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                tBuffer[tIndex + 3 * tw + 5] += sB * nw;
            }
        } // end for sx 
    } // end for sy

    // create result canvas
    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d');
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    var pxIndex = 0; //  
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
        tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
        tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
        tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
        tByteBuffer[tIndex + 3] = 255;
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV;
}
*/