// DOM load
document.addEventListener('DOMContentLoaded', (event) => {


	// Elements
	const imagesDiv = document.getElementById("imagesPreviewContainer");
	const imageResizedContainer = document.getElementById("imageResizedContainer");
	const imagePrevContainer = document.getElementById("imagePrevContainer");
	const downloadContainer = document.getElementById("downloadContainer");
	const presetListContainer = document.getElementById("presetListContainer");
	const dataContainer = document.getElementById("dataContainer");
	const inputSlider = document.getElementById("range");
	const inputWidth = document.getElementById("width");
	const inputHeight = document.getElementById("height");
	const updateButton = document.getElementById("updateButton");
	const updateCheckbox = document.getElementById("updateCheckbox");
	const cropModeCheckbox = document.getElementById("cropModeCheckbox");
	const containModeCheckbox = document.getElementById("containModeCheckbox");
	const autoForceWidthHeightCheckbox = document.getElementById("autoForceWidthHeightCheckbox");
	const backColorPicker = document.getElementById("backColorPicker");
	const example_image = document.getElementsByClassName("example_image");

	
	// Variables
	var presetSizeCategorySet = new Set();
	var imageList = [];
	var inputType = "percentage";
	var cropMode = true;
	var forceMode = false;
	var backColor = "#f5f5f5";
	var resizingFactor = 0.5;
	var resizingWidth = 0;
	var resizingHeight = 0;
	var autoUpdate = true;
	var minSizeValue = 50;


	// Image Class Constructor
	class imageData {
		constructor(
			name, url,
			id_btn, id_file,
			size_old, size_new,
			id_img_old, id_img_new,
			ext_old, ext_new,
			res_old, res_new,
		) {
			this.valid = true;
			this.name = name;
			this.url = url;
			this.id_img_old = id_img_old;
			this.id_img_new = id_img_new;
			this.id_btn = id_btn;
			this.id_file = id_file;
			this.ext_old = ext_old;
			this.ext_new = ext_new;
			this.size_old = size_old;
			this.size_new = size_new;
			this.res_old = res_old;
			this.res_new = res_new;
		}
	}
	function saveImageData (name, url, size_old, ext_old, id_file) {
		// Save image data into the list
		// Get current ID
		id = imageList.length;

		// Assign data
		var new_image = new imageData();
		new_image.name = name;
		new_image.url = url;
		new_image.size_old = size_old;
		new_image.ext_old = ext_old;
		new_image.id_file = id_file;
		new_image.id_img_new = "img_res_" + id;
		new_image.id_img_old = "img_prev_" + id;
		new_image.id_btn = "download_" + id;
		new_image.ext_new = "ext new undefined";
		new_image.size_new = "? (not calculated)";
		new_image.res_old = "res old undefined";
		new_image.res_new = "res new undefined";

		// Push data
		imageList.push(new_image);
		//console.log("New image added to list", id);

		return id;
	}
	function removeImageData (id_file) {
		for (var id in imageList) {
			if (imageList[id].id_file == id_file) {
				imageList[id].valid = false;
				document.getElementById(imageList[id].id_img_old).remove();
				document.getElementById(imageList[id].id_img_new).remove();
				document.getElementById(imageList[id].id_btn).remove();
				return;
			}
		}
		console.error("Trying to remove a not found image.");
	}

	// Standard sizes options
	function setSelectListOptions () {
		// Load categories into set
		for (i in presetSizeDataList) {
			presetSizeCategorySet.add(presetSizeDataList[i].category);
		}

		// Select and create elements in DOM
		let selectList = document.createElement('select');
		let presetSizeContainer = document.createElement('div');

		// Assign info
		selectList.name = "presetList";
		presetSizeContainer.name = "presetSizeContainer";
		function loadAllButtonsCategory (category) {
			// Add category container
			let cat_container = document.createElement('div');
			cat_container.name = category;
			if (c != 0) { cat_container.style.display = "none"; }
			cat_container.className = "category-container";
			cat_container.id = "cat_" + category;
			presetSizeContainer.appendChild(cat_container);

			// Add buttons
			for (i in presetSizeDataList) {
				if (presetSizeDataList[i].category == category) {
					let btn_container = document.createElement('div');
					let button = document.createElement('button');
					let tag_name = document.createElement('span');
					let tag_size = document.createElement('span');
					btn_container.className = "preset-size-button-container";
					button.id = presetSizeDataList[i].name;
					button.className = "preset-size-button";
					button.innerHTML = presetSizeDataList[i].prop;
					button.onclick = function () { inputButtonPresetUpdate(this.id) };
					tag_name.innerHTML = presetSizeDataList[i].tag;
					tag_name.className = "preset-size-tag-name";
					tag_size.innerHTML = presetSizeDataList[i].width + "x" + presetSizeDataList[i].height;
					tag_size.className = "preset-size-tag-size";
					btn_container.appendChild(button);
					btn_container.appendChild(tag_name);
					btn_container.appendChild(tag_size);
					cat_container.appendChild(btn_container);
				}
			}
		}

		// Iterate through each category
		let c = 0;
		for (let category of presetSizeCategorySet) {
			//console.log(category, c);
			selectList.options[c] = new Option(category, category);
			loadAllButtonsCategory(category);
			c += 1;
		};

		// Add List changer listener
		selectList.addEventListener("change", function () {
			//console.log(selectList.selectedIndex);
			console.log(selectList.value);

			for (let category of presetSizeCategorySet) {
				let category_id = "cat_" + category;
				let element = document.getElementById(category_id);
				if (category == selectList.value) {
					element.style.display = "block";
				}
				else {
					element.style.display = "none";
				}
			};
		});

		// Append to DOM
		presetListContainer.appendChild(selectList);
		presetListContainer.appendChild(presetSizeContainer);

	};
	if (presetSizeDataList) { setSelectListOptions(); }

	// Listeners and global functions
	function clearValues () {
		// Clear fixed width and height input and slider input
		resizingFactor = 0.5;
		resizingWidth = 0;
		resizingHeight = 0;
		inputSlider.value = 50;
		inputWidth.value = "";
		inputHeight.value = "";
		inputType = "percentage";
	}
	function clearStyles () {
		// Clear style in all selectable elements
		inputSlider.classList.remove('selected');
		inputWidth.classList.remove('selected');
		inputHeight.classList.remove('selected');
		for (i in presetSizeDataList) {
			let element = document.getElementById(presetSizeDataList[i].name);
			element.classList.remove('selected');
		};
	}
	function displayState (show) {
		if (show) {
			// Show image
			imagesDiv.style.visibility = "visible";
			downloadContainer.style.visibility = "visible";
		}
		else {
			// Go to original state
			imagesDiv.style.visibility = "hidden";
			downloadContainer.style.visibility = "hidden";
			clearValues();
		}
		imagePrevContainer.style.display = "none";
	}
	displayState(false);
	function dataDisplay () {
		// Clear
		dataContainer.innerHTML = "";
		let empty = true;

		// If there is valid images, return info
		for (i in imageList) {
			if (imageList[i].valid) {
				let img_data = document.createElement("div");
				img_data.id = "data_" + imageList[i].id_btn;
				img_data.innerHTML = "IMAGE " + i + " </br>";
				img_data.innerHTML += "File name: " + imageList[i].name + " </br>";
				img_data.innerHTML += "File extension: " + imageList[i].ext_old + " </br>";
				img_data.innerHTML += "Size original: " + imageList[i].size_old + " bytes </br>";
				img_data.innerHTML += "Size new: " + imageList[i].size_new + " bytes </br>";
				img_data.innerHTML += "Resolution original: " + imageList[i].res_old + " px </br>";
				img_data.innerHTML += "Resolution new: " + imageList[i].res_new + " px </br>";
				img_data.innerHTML += "</br></br>"
				dataContainer.appendChild(img_data);
				//console.log(imageList[i]);
				empty = false;
			}
		}

		// No valid images, delete all data
		if (empty) {
			let no_data = document.createElement("span");
			no_data.innerHTML = "No data to be displayed"
			dataContainer.appendChild(no_data);
		};
	};
	dataDisplay();
	function checkAutoUpdateMode () {
		// Check defined mode when start app
		if (autoUpdate == true) {
			updateCheckbox.checked = true;
			updateButton.disabled = true;
		}
		else {
			autoUpdate = false;
			updateButton.disabled = false;
		}
	}
	checkAutoUpdateMode();
	for (var i = 0; i < example_image.length; i++) {
		// Add example image event listeners
		example_image[i].onclick = function () {
			addCustomPond(this.src);
		}
	};
	function addDownloadButton (id) {
		// Add button variable
		let new_button = document.createElement("button");
		new_button.id = imageList[id].id_btn;
		new_button.innerHTML = "Download " + imageList[id].id_img_old + " [" + imageList[id].name + "]";
		// Add listener
		new_button.onclick = function () {
			//filename = "freeimageresizer_" + resizingWidth + "x" + resizingHeight + "_" + imageList[id].name;
			filename = "freeimageresizer_" + imageList[id].name;
			let url = imageList[id].url;
			var element = document.createElement('a');
			element.setAttribute('href', url);
			element.setAttribute('download', filename);
			document.body.appendChild(element);
			element.click();
			//console.log("Downloaded: ", new_button.id);
		}
		// Append element to DOM
		downloadContainer.appendChild(new_button);

	}
	function addResizedImageToDOM (fileItem, id) {
		// Add image to DOM
		var new_img = document.createElement("img");
		new_img.id = "img_res_" + id;
		new_img.className = "singleImage";
		new_img.src = URL.createObjectURL(fileItem.file);
		imageResizedContainer.appendChild(new_img);
	}
	function addPrevImageToDOM (fileItem, id) {
		// Add image to DOM
		var new_img = document.createElement("img");
		new_img.id = "img_prev_" + id;
		new_img.className = "singleImage";
		new_img.src = URL.createObjectURL(fileItem.file);
		imagePrevContainer.appendChild(new_img);
	}
	updateCheckbox.onchange = function () {
		if (this.checked) {
			autoUpdate = true;
			updateButton.disabled = true;
			updateImagesResize();
		}
		else {
			autoUpdate = false;
			updateButton.disabled = false;
		}
	}
	cropModeCheckbox.onchange = function () {
		if (this.checked) {
			cropMode = true;
			containModeCheckbox.checked = false;

			// Resize images update
			if (updateCheckbox.checked) { updateImagesResize() };
		}
		else {
			cropMode = false;
			containModeCheckbox.checked = true;
		}
	}
	containModeCheckbox.onchange = function () {
		if (this.checked) {
			cropMode = false;
			cropModeCheckbox.checked = false;

			// Resize images update
			if (updateCheckbox.checked) { updateImagesResize() };
		}
		else {
			cropMode = true;
			cropModeCheckbox.checked = true;
		}
	}
	backColorPicker.onchange = function () {
		backColor = this.value;
		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	}
	autoForceWidthHeightCheckbox.onchange = function () {
		if (this.checked) {
			forceMode = true;
			//cropModeCheckbox.checked = false;
			//containModeCheckbox.checked = false;
		}
		else {
			forceMode = false;
			clearValues();
			clearStyles();
			//updateImagesResize();
			//forceModeCheckbox.checked = false;
			//cropMode = "crop";
			//cropModeCheckbox.checked = true;
		}

		if (updateCheckbox.checked) { updateImagesResize() };
	}
	updateButton.onclick = function () {
		// Resize all images when update button is clicked
		updateImagesResize();
	}
	inputSlider.oninput = function () {
		// Update values
		let i = this.value;
		clearValues();
		this.value = i;
		resizingFactor = i / 100;
		inputType = "percentage";

		// Update styles
		clearStyles();
		this.classList.add("selected");

		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	};
	inputWidth.onchange = function () {
		// Check user input
		if (this.value < minSizeValue) {
			console.log("Width min value: " + minSizeValue);
			this.value = "";
			//return;
		}
		if (isNaN(this.value)) {
			console.log("Width should be a numeric value");
			this.value = "";
		}

		// Update values
		let i = this.value;
		let z = inputHeight.value;
		clearValues();
		this.value = i;
		inputHeight.value = z; // NEW
		resizingWidth = parseInt(i);
		resizingHeight = parseInt(z); // NEW
		inputType = "fixed";

		// Prevent from empty field
		if (isNaN(resizingWidth)) { resizingWidth = 0; };
		if (isNaN(resizingHeight)) { resizingHeight = 0; }

		// Update styles
		clearStyles();
		this.classList.add("selected");
		inputHeight.classList.add("selected");

		// Update values and styles if forced
		if (forceMode) {
			inputType = "forced";
		}

		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	};
	inputHeight.onchange = function () {
		// Check user input
		if (this.value < minSizeValue) {
			console.log("Height min value: " + minSizeValue);
			this.value = "";
			//return;
		}
		if (isNaN(this.value)) {
			console.log("Height should be a numeric value");
			this.value = "";
		}

		// Update values
		let i = this.value;
		let z = inputWidth.value;
		clearValues();
		this.value = i;
		inputWidth.value = z; // NEW
		resizingHeight = parseInt(i);
		resizingWidth = parseInt(z); // NEW
		inputType = "fixed";

		// Prevent from empty field
		if (isNaN(resizingWidth)) { resizingWidth = 0; };
		if (isNaN(resizingHeight)) { resizingHeight = 0; }

		// Update styles
		clearStyles();
		this.classList.add("selected");
		inputWidth.classList.add("selected");

		// Update values and styles if forced
		if (forceMode) {
			inputType = "forced";
		}

		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	};
	function inputButtonPresetUpdate (button_id) {
		// Get values
		let w;
		let h;
		for (i in presetSizeDataList) {
			if (button_id == presetSizeDataList[i].name) {
				w = presetSizeDataList[i].width;
				h = presetSizeDataList[i].height;
			}
		}
		// Update values
		clearValues();
		resizingWidth = w;
		resizingHeight = h;
		inputType = "fixed";

		// Update styles
		clearStyles();
		let element = document.getElementById(button_id);
		element.classList.add("selected");

		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	}


	// --------------------------------------------------- //
	// Resizer caller
	function resizeImage (id) {
		console.log("Resize call id " + id, inputType);

		// Assign img to variable
		let img_old = document.getElementById(imageList[id].id_img_old);
		let img_new = document.getElementById(imageList[id].id_img_new);

		// Call the resizer
		let canvas = downScaleImage(img_old, inputType, cropMode, backColor, resizingFactor, resizingWidth, resizingHeight);

		// Prevent from error in downsampling
		if (canvas == undefined) {
			console.error("Downsample not possible, canvas undefined")
			return;
		}

		// Assign the image
		let type = "image/" + imageList[id].ext_old;
		img_new.src = canvas.toDataURL(type);
		imageList[id].url = img_new.src;

		// Update imagelist data and reload data displayed
		img_new.onload = function () {
			imageList[id].res_old = img_old.width + " x " + img_old.height;
			imageList[id].res_new = img_new.width + " x " + img_new.height + " (not correct) ";
			//console.log(img_new.size);
			//console.log("new", img_new.width, img_new.height); // img new tiene max width 100% y no carga el tamaño real
			// Update data displayed
			dataDisplay();
		}

		// Update data displayed
		dataDisplay();

		// Ensure new resizer call when is loaded
		img_old.onload = function () { updateImagesResize(); };
	};
	function updateImagesResize () {
		for (let i in imageList) {
			if (imageList[i].valid == true) {
				let id = parseInt(i);
				resizeImage(id);
			}
		}
	}


	// --------------------------------------------------- //
	// FilePond caller

	// Get a file input reference and apply properties
	const input = document.querySelector('input[type="file"]');
	const pond = FilePond.create(input, {
		// CONFIG ------------
		// Only accept images
		acceptedFileTypes: ['image/*'],

		// Main Options
		name: 'filepond',
		credits: false,
		dropOnElement: false,
		dropOnPage: true,
		labelIdle: 'Drag & drop your image<br/><span class="filepond--label-action">or browse to upload</span>',


		// FUNCTIONS ------------
		// Call back when image is added
		onaddfile: (err, fileItem) => {
			//console.log("FP Add File Function called");

			// Assign image to list
			id = saveImageData(
				fileItem.file.name,
				URL.createObjectURL(fileItem.file),
				fileItem.fileSize,
				fileItem.fileExtension,
				fileItem.id);

			// Add images to DOM
			addPrevImageToDOM(fileItem, id);
			addResizedImageToDOM(fileItem, id);

			// Resize image and add to the list
			if (autoUpdate) { resizeImage(id); }

			// Add download button
			addDownloadButton(id);

			// Update show status
			displayState(true);
		},
		// File has been removed
		onremovefile: function (error, fileItem) {
			//console.log("FP Remove File Function called");

			// Remove item from list and remove download button
			removeImageData(fileItem.id);

			// Update show status
			let off = true;
			for (let i in imageList) { if (imageList[i].valid == true) { off = false; } }
			if (off) { displayState(false) }

			// Update data display
			dataDisplay();
		},
	});
	pond.maxFiles = 10;

	function addCustomPond (src) {
		pond.addFile(src);
	};

	// TEMP auto testing
	//pond.addFile("img/porsche.jpg");
	//pond.addFile("img/couple.jpg");

	// DOM info
	console.log('DOM fully loaded and parsed');

	
});


