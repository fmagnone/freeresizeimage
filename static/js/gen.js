/*!
 * Free Resize Image - Copyright 2022
 * --
 * General Scripts
 */

// General variables
var downloadName = "resized_unknown.jpg";
var downloadURL = "";
var uploadedImages = {};
var img_width = 800;
var img_height = 800;
var downloadBtn;

// Buttons Action Detection and loading
$(document).ready(function () {
    // Image from File button or general box
    $("#uploadBox").click(function () {
        getManualUploadContents();
    });
    $("#btnUploadFromFile").click(function () {
        getManualUploadContents();
    });

    // Image from URL button
    $("#btnUploadFromUrl").click(function () {
        getClipboardContents();
    });

    downloadBtn = document.getElementById("downloadFileBtn");
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

// Get Contents Manual Upload
function getManualUploadContents() {
    $("#inputUploadFromFile").trigger("click");

    // Select File
    const inputElement = document.getElementById("inputUploadFromFile");
    inputElement.addEventListener("change", handleFiles, false);
    function handleFiles() {
        const fileList = this.files;

        // Get file information
        const uploaded_files_count = fileList.length;
        let uploaded_files_names = [];
        console.log("Files uploaded: ", uploaded_files_count);
        for (
            let i = 0, uploaded_files_count = fileList.length;
            i < uploaded_files_count;
            i++
        ) {
            const file = fileList[i];
            uploaded_files_names.push(file.name);
            console.log("File " + i + " name = " + file.name);
        }
        alert_message(
            "We catch " +
            uploaded_files_count +
            " file(s) dopped with this info:<br/>" +
            uploaded_files_names,
            "success"
        );
    }
}

// Get Contents Clipboard Upload
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

// Get Content Drag and Drop - FilePond Plugin
FilePond.registerPlugin(
    //FilePondPluginGetFile,
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
);

// Append Pond to document
const input = document.querySelector('input[id="filePondUpload"]');

// Create a FilePond instance and post files to /upload
const pond = FilePond.create(input, {
    name: 'filepond',
    maxFiles: 1,
    labelIdle: 'Drag & drop your image<br/><span class="filepond--label-action">or browse to upload</span>',
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

    // Call back when image is added
    onaddfile: (err, fileItem) => {
        console.log("On Add File Function called");
        //console.log(err, fileItem.getMetadata('resize'));
        // Disabel FilePond Label
        let label = document.getElementsByClassName("filepond--drop-label")[0];
        label.style.display = "none";
    },

    // onpreparefile(file, output)
    // File has been transformed by the transform plugin or another plugin
    // subscribing to the prepare_output filter. It receives the file item and the output data.
    onpreparefile: (file, output) => {
        console.log("On Prepare File Function called");

        // Create new image
        const img = new Image();
        img.src = URL.createObjectURL(output);
        console.log(file.fileSize, output.size);

        // Pass new image URL
        downloadName = "res_" + file.filename;
        downloadURL = img.src;

        // Pass new image to dict
        uploadedImages[downloadName] = downloadURL;

        // Console print
        //console.log("Image Name: ", downloadName);
        //console.log("Image URL: ", downloadURL);

        //console.log(file);

        console.log(uploadedImages);

    },

    // Resize the file
    //imageResizeUpscale: false,
    allowImageResize: true,
    imageResizeMode: "contain",
    imageResizeTargetWidth: 400,
    imageResizeTargetHeight: 400,

    /*
        imageTransformVariants: {
            thumb_medium_: (transforms) => {
              transforms.resize.size.width = 384;
              return transforms;
            },
            thumb_small_: (transforms) => {
              transforms.resize.size.width = 128;
              return transforms;
            }
        },
        */

    onremovefile: function (error, file) {
        console.log("On Remove File Function called");
        if (file.serverId) {
            //let input = document.createElement('input');
            //input.type = 'hidden';
            //input.name = 'DeletedFilepondImages';
            //input.value = file.serverId;
            //uploadForm.appendChild(input);
        }

        // Disabel FilePond Label
        let label = document.getElementsByClassName("filepond--drop-label")[0];
        label.style.display = "flex";

        // Disable download button
        downloadBtn.classList.add("disabled");
    },
    onaddfileprogress(file, progress) {
        console.log("On Add File Progress?", progress);
        //buttonForm.classList.remove('filepondUpload');
        //buttonForm.removeAttribute('disabled');
    },

    // Call when upload finishes
    onprocessfile(error, file) {
        console.log("File Uploaded: ", file);
        //buttonForm.classList.remove('filepondUpload');
        //buttonForm.removeAttribute('disabled');
    },
    onprocessfiles() {
        console.log("All functions finished");

        enableDownloadBtn();
    },
});


// Enable Download Button
function enableDownloadBtn(fileUrl) {
    downloadBtn.classList.remove("disabled");
    //downloadBtn.innerHTML = "Download file: " + downloadName;
    downloadBtn.href = downloadURL;
    downloadBtn.setAttribute("download", downloadName);

    //downloadBtn.click();
}
