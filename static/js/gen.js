/*!
 * Free Resize Image - Copyright 2022
 * --
 * General Scripts
 */

// General variables
var uploadedImages = [];
var fileIsAvailable = false;
var maxResolution = 2;
var downloadBtn; 
var infoType_old, infoName_old, infoRes_old, infoSize_old;
var infoType, infoName, infoRes, infoSize;
var originalName = "no-file";
var downloadName = "no-file", downloadURL = "#";
var inputDim;

// Buttons Action Detection and loading
$(document).ready(function () {
    // Get objects from DOM

    // Options
    inputDim = document.getElementsByName("dimension");
    inputDim.forEach(element => {
        element.addEventListener('change', function () {
            if (element.id == "dim1") { maxResolution = 1 };
            if (element.id == "dim2") { maxResolution = 2 };
            if (element.id == "dim3") { maxResolution = 3 };
            optionsUpdated();
        });
    });

    // Download and Info
    downloadBtn = document.getElementById("downloadFileBtn");
    infoType_old = document.getElementById("file_type_old");
    infoName_old = document.getElementById("file_name_old");
    infoRes_old = document.getElementById("file_res_old");
    infoSize_old = document.getElementById("file_size_old");
    infoType = document.getElementById("file_type");
    infoName = document.getElementById("file_name");
    infoRes = document.getElementById("file_res");
    infoSize = document.getElementById("file_size");
});



// Alert Message
var alertPlaceholder = document.getElementById("liveAlertPlaceholder");
var duration = 5000;
function alert_message(message, type) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML =
        '<div class="alert alert-' +
        type +
        ' alert-dismissible" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

    if (alertPlaceholder) {
        alertPlaceholder.append(wrapper);
        setTimeout(function () {
            wrapper.parentNode.removeChild(wrapper);
        }, duration);
    }
}

// Register plugins - FilePond
FilePond.registerPlugin(
    //FilePondPluginGetFile,
    FilePondPluginImagePreview,
    FilePondPluginImageTransform,
    FilePondPluginImageResize,
    FilePondPluginImageEdit,
    FilePondPluginFileValidateType,
);


// Append Pond to document
const input = document.querySelector('input[id="filePondUpload"]');

// Create a FilePond instance and post files to /upload
const pond = FilePond.create(input, {
    // CONFIG ------------
    // Only accept images
    acceptedFileTypes: ['image/*'],

    // Main Options
    name: 'filepond',
    credits: false,
    allowImageResize: true,
    dropOnElement: false,
    dropOnPage: true,
    labelIdle: 'Drag & drop your image<br/><span class="filepond--label-action">or browse to upload</span>',
    maxFiles: 1,
    imageResizeMode: "contain",

    //instantUpload: false,

    // Server configuration
    server: {
        //url: "http://127.0.0.1:5000/", // Local server configuration
        timeout: 7000,
        process: {
            url: "./",
            method: "POST",
            withCredentials: true,
            headers: {},
            timeout: 7000,
            onload: null,
            onerror: null,
            ondata: null,
        },
        revert: {
            url: "./",
            method: "POST",
            //withCredentials: true,
            headers: {},
        },
    },

    // Transform Variants
    imageTransformVariants: {
        res_1200_: (transforms) => {
            transforms.resize = {
                size: {
                    width: 1200,
                    height: 1200,
                },
            };
            return transforms;
        },
        res_600_: (transforms) => {
            transforms.resize = {
                size: {
                    width: 600,
                    height: 600,
                },
            };
            return transforms;
        },
        res_300_: (transforms) => {
            transforms.resize = {
                size: {
                    width: 300,
                    height: 300,
                },
            };
            return transforms;
        },
    },

    // FUNCTIONS ------------
    // Call back when image is added
    onaddfile: (err, fileItem) => {
        console.log("On Add File Function called");

        // Disabel FilePond Label
        let label = document.getElementsByClassName("filepond--drop-label")[0];
        label.style.display = "none";
    },

    // Callback onpreparefile(file, output)
    // File has been transformed by the transform plugin or another plugin
    // subscribing to the prepare_output filter. It receives the file item and the output data.
    onpreparefile: (file, output) => {
        console.log("On Prepare File Function called");

        if (typeof output[0] === 'object') {
            // Prepare output for MULTIPLE files
            console.log(output);
            output.forEach(out => { prepareImgFile(file, out.file, out.name) });
        }
        else {
            // Prepare output for a SINGLE file
            prepareImgFile(file, output);
        };
    },

    // File has been removed
    onremovefile: function (error, file) {
        console.log("On Remove File Function called");

        // Disable files variables
        originalName = "no-file";
        downloadName = "no-file";
        downloadURL = "#";
        uploadedImages = [];
        fileIsAvailable = false;

        // Disabel FilePond Label
        let label = document.getElementsByClassName("filepond--drop-label")[0];
        label.style.display = "flex";

        // Disable download button
        downloadBtn.classList.add("disabled");
        optionsUpdated();
    },

    // File progress?
    onaddfileprogress(file, progress) {
        console.log("On Add File Progress?", progress);
        //buttonForm.classList.remove('filepondUpload');
        //buttonForm.removeAttribute('disabled');
    },

    // Call when upload finishes
    onprocessfile(error, file) {
        //console.log("File Uploaded: ", file);
    },

    onprocessfiles() {
        console.log("All functions finished");
        optionsUpdated();
        enableDownloadBtn();
    },
});


function prepareImgFile(file, output, prefix) {
    console.log("Preparing file ... ... ", file.filename, file.fileSize);

    // Make file available
    fileIsAvailable = true;

    // Create new image
    let img = new Image();
    img.src = URL.createObjectURL(output);
    img.id = prefix;

    // Get size (wait to the image to load)
    img.onload = function () {
        let w = img.width;
        let h = img.height;
        let id = img.id;

        // Assign to previous function
        uploadedImages.forEach(element => {
            if (element.pre == prefix) {
                element.res = w + "x" + h + "px";
                console.log(element);
            }
        });
    }

    // Load data in array for main image
    if (!prefix) {
        console.log("PREFIX ", file);

        let imageData = {
            pre: prefix,
            name: file.filename,
            url: "#",
            size: output.size,
            res: "",
            type: file.type
        };
        uploadedImages.push(imageData);

        // Console print
        console.log("File prepared __  ", imageData.pre, output.size);
    }
    // Load data in array for images with prefix (transformed)
    if (prefix) {
        // Store data in array uploadedImages
        let imageData = {
            pre: prefix,
            name: prefix + file.filename,
            url: img.src,
            size: output.size,
            res: "",
            type: output.type
        };
        uploadedImages.push(imageData);

        // Console print
        console.log("File prepared __  ", imageData.pre, output.size);
    };
};


function optionsUpdated() {
    let imageInfo;
    let originalRes = "", originalSize = "";
    let downloadType = "-", downloadRes = "", downloadSize = "";
    
    if (fileIsAvailable) {
        // Old
        imageInfo = uploadedImages[0];
        
        originalName = imageInfo.name;
        originalRes = imageInfo.res;
        originalSize = bytesToSize(imageInfo.size);

        // New
        imageInfo = uploadedImages[maxResolution];

        downloadName = imageInfo.name;
        downloadURL = imageInfo.url;
        downloadType = imageInfo.type.substring(6);
        downloadSize = bytesToSize(imageInfo.size);
        downloadRes = imageInfo.res;
    };

    // Old file assign
    infoType_old.innerHTML = downloadType;
    infoName_old.innerHTML = originalName;
    infoRes_old.innerHTML = originalRes;
    infoSize_old.innerHTML = originalSize;

    // New file assign
    infoType.innerHTML = downloadType;
    infoName.innerHTML = downloadName;
    infoRes.innerHTML = downloadRes;
    infoSize.innerHTML = downloadSize;

    // Print options
    console.log("Options Updated__", maxResolution, downloadName, downloadURL);

    // Assign new options to download button
    downloadBtn.href = downloadURL;
    downloadBtn.setAttribute("download", downloadName);
};

// Enable Download Button
function enableDownloadBtn(fileUrl) {
    downloadBtn.classList.remove("disabled");
    //downloadBtn.click();
}

// Convert format
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}