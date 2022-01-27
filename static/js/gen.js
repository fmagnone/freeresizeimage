/*!
 * Free Resize Image - Copyright 2022
 * --
 * General Scripts
 */

// General variables
var originalFile;
var downloadName = "resized_unknown.jpg";
var downloadURL = "";
var uploadedImages = {};
var img_width = 100;
var img_height = 100;
var downloadBtn;
var inputWidth;
var inputHeight;
var fileIsAvailable = false;

// Buttons Action Detection and loading
$(document).ready(function () {
    // Get objects from DOM
    downloadBtn = document.getElementById("downloadFileBtn");
    inputWidth = document.getElementById("width");
    inputHeight = document.getElementById("height");

    inputWidth.addEventListener('change', event => { updatePondProperties() });
    inputHeight.addEventListener('change', event => { updatePondProperties() });

    // Assign pre-defined values to width and height to Pond
    updatePondProperties();
});


// Resolution Range change value
/*
document.getElementById('resolution-percentage').addEventListener('change', event => {
    resolution = document.getElementById('resolution-percentage').value;
    document.getElementById('resolution-percentage-label').innerHTML = "Image compression: " + resolution + "%";
    //console.log("resolution change", resolution);
})
*/

// Ctrl + V Detection
/*
$(document).ready(function () {
    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        vKey = 86;

    $(document)
        .keydown(function (e) {
            if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
        })
        .keyup(function (e) {
            if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
        });

    $(".no-copy-paste").keydown(function (e) {
        if (ctrlDown && e.keyCode == vKey) return false;
    });

    $(document).keydown(function (e) {
        if (ctrlDown && e.keyCode == vKey) {
            getClipboardContents();
        }
    });
});*/

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

// Get Contents Clipboard Upload
/* 
async function getClipboardContents() {
    let pasted_data = "(no data)";

    try {
        // Read image data
        const img = await navigator.clipboard.read();

        // Read text data
        const text = await navigator.clipboard.readText();
        pasted_data = text;

        console.log("Pasted content: ", img);
        console.log("Pasted content: ", text);

        if (text != "") {
            alert_message(
                "We catch some text from Ctrl+V with this info:<br/>" + pasted_data,
                "success"
            );
        } else {
            alert_message(
                "We catch something with Ctrl+V but is not an URL... Please copy your URL and try again!",
                "danger"
            );
        }
    } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
        alert_message(
            "Sorry, in this case we are not allowed to catch the data, please try another method!",
            "danger"
        );
    }
}
*/

// Register plugins - FilePond
FilePond.registerPlugin(
    //FilePondPluginGetFile,
    //FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
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

    // Server configuration
    server: {
        url: "http://127.0.0.1:5000/",
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
        prepareImgFile (file, output);

        // Add file to variable originalFile
        originalFile = output;
    },

    // File has been removed
    onremovefile: function (error, file) {
        console.log("On Remove File Function called");
        if (file.serverId) {
            //let input = document.createElement('input');
            //input.type = 'hidden';
            //input.name = 'DeletedFilepondImages';
            //input.value = file.serverId;
            //uploadForm.appendChild(input);
        }

        // Disable files variables
        downloadName = "resized_unknown.jpg";
        downloadURL = "";
        fileIsAvailable = false;

        // Disabel FilePond Label
        let label = document.getElementsByClassName("filepond--drop-label")[0];
        label.style.display = "flex";

        // Disable download button
        downloadBtn.classList.add("disabled");
    },

    // File progress?
    onaddfileprogress(file, progress) {
        console.log("On Add File Progress?", progress);
        //buttonForm.classList.remove('filepondUpload');
        //buttonForm.removeAttribute('disabled');
    },

    // Call when upload finishes
    onprocessfile(error, file) {
        console.log("File Uploaded: ", file);
    },
    onprocessfiles() {
        console.log("All functions finished");
        enableDownloadBtn();
    },
});

function prepareImgFile (file, output) {
    // Create new image
    let img = new Image();
    img.src = URL.createObjectURL(output);
    console.log("Preparing file ... ", file.fileSize, output.size);

    // Pass new image URL
    downloadName = "res_" + file.filename;
    downloadURL = img.src;
    fileIsAvailable = true;

    // Console print
    console.log("Image Name: ", downloadName);
    console.log("Image URL: ", downloadURL);
};

function updatePondProperties() {
    // Get data (check if value could be updated, or return second as an error)
    //if (!isNaN(parseInt(inputWidth.value))) { img_width = parseInt(inputWidth.value) };
    //if (!isNaN(parseInt(inputHeight.value))) { img_height = parseInt(inputHeight.value) };
    img_width = getValue(inputWidth, img_width);
    img_height = getValue(inputHeight, img_height);

    // Assign
    pond.setOptions({
        maxFiles: 1,
        imageResizeTargetWidth: img_width,
        imageResizeTargetHeight: img_height,
        imageResizeMode: "contain"
    });

    // Re-process files
    if(fileIsAvailable) {
        reProcessPondFiles();
    };

    // Print log
    console.log("Pond Resize properties updated: ", pond.imageResizeTargetWidth, pond.imageResizeTargetHeight);
};

function reProcessPondFiles() {
    console.log("________")

    //pond.processFile();
    //pond.prepareFile();
    
    /*
    pond.prepareFile().then(({ file, output }) => {
        console.log("New file preparation", file, output);
        //console.log("Re-process function called, filesize: ", file.fileSize);
    });
    
    
    pond.processFile().then((file) => {
        console.log("New file process", file.fileSize);
        //console.log("__");
        //console.log("Re-process function called, filesize: ", file.fileSize);
    });
    */

    // Adding a single file
    //pond.addFile(originalFileURL);

    // Adding a Blob or File
    //console.log("ORIGINAL: ", originalFile);
    //let img = new Image();
    //img.src = URL.createObjectURL(originalFile);
    //console.log("ORIGINAL URL: ", img.src);
    
    //pond.addFile(img.src);
};

// Get values from input form
function getValue(input, errorValue) {
    // Check if value could be used
    if (!isNaN(parseInt(input.value))) { 
        return parseInt(input.value);
    };
    // Return original value
    return errorValue;
}

// Enable Download Button
function enableDownloadBtn(fileUrl) {
    downloadBtn.classList.remove("disabled");
    downloadBtn.href = downloadURL;
    downloadBtn.setAttribute("download", downloadName);
    //downloadBtn.click();
}

