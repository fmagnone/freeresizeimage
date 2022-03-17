// DOM load
document.addEventListener('DOMContentLoaded', (event) => {

	// Elements
	// --> General
	const imagesContainer = document.getElementById("showContainer");
	const resizeOptionsContainer = document.getElementById("resizeOptionsContainer");
	const exampleImageContainer = document.getElementById("exampleImagesContainer");
	const imageResizedContainer = document.getElementById("imageResizedContainer");
	const imagePrevContainer = document.getElementById("imagePrevContainer");
	// --> Options
	const resizeMethod = document.getElementById("resizeMethod");
	const optionsBoxMode = document.getElementById("options-box-mode");
	const optionsBoxPreset = document.getElementById("options-box-preset");
	const optionsBoxCustomSize = document.getElementById("options-box-custom-size");
	const optionsBoxPrecentage = document.getElementById("options-box-percentage");
	const presetListContainer = document.getElementById("presetListContainer");
	const inputSlider = document.getElementById("range");
	const inputWidth = document.getElementById("width");
	const inputHeight = document.getElementById("height");
	const cropModeCheckbox = document.getElementById("cropModeCheckbox");
	const containModeCheckbox = document.getElementById("containModeCheckbox");
	const autoForceWidthHeightCheckbox = document.getElementById("autoForceWidthHeightCheckbox");
	const backColorPicker = document.getElementById("backColorPicker");
	const updateCheckbox = document.getElementById("updateCheckbox");
	const updateButton = document.getElementById("updateButton");
	// --> Example images
	const exampleImage = document.getElementsByClassName("example-image");
	// --> Show
	const showTitle = document.getElementById("show-title");
	const showDescription = document.getElementById("show-description");
	const showSingleBox = document.getElementById("show-single");
	const showMultipleBox = document.getElementById("show-multiple");


	// Variables
	var presetSizeCategorySet = new Set();
	var imageList = [];
	var inputType = "";
	var cropMode = true;
	var forceMode = false;
	var backColor = "#f5f5f5";
	var resizingFactor = 0.5;
	var resizingWidth = 0;
	var resizingHeight = 0;
	var description = " ";
	var minSizeValue = 50;
	var maxSizeValue = 3000;


	// Image Class Constructor
	class imageData {
		constructor(
			//id, 
			name, url,
			id_btn, id_file,
			size_old, size_new,
			ext_old, ext_new,
			res_old, res_new,
		) {
			this.valid = true;
			this.name = name;
			this.url = url;
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
	function saveImageData(name, url, size_old, ext_old, id_file) {
		// Save image data into the list
		// Get current ID
		let id = imageList.length;

		// Assign data
		var new_image = new imageData();
		new_image.name = name;
		new_image.url = url;
		new_image.size_old = size_old;
		new_image.ext_old = ext_old.toUpperCase();
		new_image.ext_new = "-";
		new_image.id_file = id_file;
		//new_image.id_btn = "download_" + id;
		new_image.size_new = "? (not calculated yet)";
		new_image.res_old = "0x0";
		new_image.res_new = "0x0";

		// Push data
		imageList.push(new_image);
		//console.log("New image added to list", id);

		return id;
	}
	function removeImageData(id_file) {
		for (let id in imageList) {
			if (imageList[id].id_file == id_file) {
				imageList[id].valid = false;

				let img_pre = document.getElementById("img_pre_" + id);
				let img_res = document.getElementById("img_res_" + id);
				let s_div = document.getElementById("s_div_" + id);
				let m_div = document.getElementById("m_div_" + id);

				if (isNaN(img_pre)) { s_div.remove() };
				if (isNaN(img_res)) { s_div.remove() };
				if (isNaN(s_div)) { s_div.remove() };
				if (isNaN(m_div)) { m_div.remove() };

				return;
			}
		}
		console.error("Trying to remove a not found image.");
	}

	// Standard sizes options
	function setSelectListOptions() {
		// Load categories into set
		for (i in presetSizeDataList) {
			presetSizeCategorySet.add(presetSizeDataList[i].category);
		}

		// Select and create elements in DOM
		let selectList = document.createElement('select');
		let presetSizeContainer = document.createElement('div');

		// Assign info
		selectList.name = "presetList";
		selectList.className = "preset-list";
		presetSizeContainer.name = "presetSizeContainer";
		function loadAllButtonsCategory(category) {
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
	function clearValues() {
		// Clear fixed width and height input and slider input
		// Initialize
		resizingFactor = 0.5;
		resizingWidth = 0;
		resizingHeight = 0;
		inputSlider.value = 50;
		inputWidth.value = "";
		inputHeight.value = "";
		inputType = "fixed";
	}
	function clearStyles() {
		// Clear style in all selectable elements
		inputSlider.classList.remove('selected'); // TODO --> Update to css
		inputWidth.classList.remove('selected');  // TODO --> Update to css
		inputHeight.classList.remove('selected');  // TODO --> Update to css
		for (i in presetSizeDataList) {
			let element = document.getElementById(presetSizeDataList[i].name);
			element.classList.remove("preset-size-selected");
		};
	}
	function displayState(show) {
		if (show) {
			// Hide resized and prev images from user
			resizeOptionsContainer.style.display = "block";
			imageResizedContainer.style.display = "none";
			imagePrevContainer.style.display = "none";

			// Check valid lenght count
			let validLenght = 0;
			for (i in imageList) { if (imageList[i].valid) { validLenght += 1 } };

			// Show single or multiple
			if (validLenght == 1) {
				// Update Description
				showTitle.innerHTML = "Your resized image";
				// Show single image only
				showSingleBox.style.display = "flex";
				showMultipleBox.style.display = "none";
			} else if (validLenght > 1) {
				// Update Description
				showTitle.innerHTML = "Your " + validLenght + " resized images";
				// Show multiple images only
				showSingleBox.style.display = "none";
				showMultipleBox.style.display = "flex";
			};

			// Show image container
			imagesContainer.style.display = "block";
			exampleImageContainer.style.display = "none";
		}
		else {
			// Go to original state
			resizeOptionsContainer.style.display = "none";
			imagesContainer.style.display = "none";
			exampleImageContainer.style.display = "block";
			clearValues();
		}
	}
	function dataDisplay() {
		// General Description

		// Base data not defined
		description = "All images auto resized."
			+ "</br> Input Type: " + inputType
			+ "</br> crop mode: " + cropMode
			+ "</br> resizing factor: " + resizingFactor * 100 + "%"
			+ "</br> width height: " + resizingWidth + " x " + resizingHeight
			+ "</br> force mode: " + forceMode; // TODO --> To be removed
		if (inputType == "percentage") {
			description = "All images auto resized and croped to <b>" + parseInt(resizingFactor * 100) + "%</b> of it original size."
		};
		if (inputType == "fixed") {
			let txt1, txt2;
			if (cropMode) { txt1 = "croped to" } else { txt1 = "contained in" };
			if (cropMode) { txt1 = "croped to" } else { txt1 = "contained in" };
			description = "All images are auto resized and " + txt1 + " a standard or custom size."
			// "All auto resized and croped to a standard size of 16:9 Widescreen."
			// TODO --> Complete all descriptions
		};
		if (inputType == "forced" && resizingWidth != 0 && resizingHeight != 0) {
			description = "All images are <b>forced</b> to a custom size of " + resizingWidth + " x " + resizingHeight + "."
		};
		showDescription.innerHTML = description;


		// Images size tag and description
		for (i in imageList) {
			if (imageList[i].valid) {
				let n = parseInt(i) + 1;
				let s_text = document.getElementById("s_txt_" + i);
				let s_size = document.getElementById("s_siz_" + i);
				let m_text = document.getElementById("m_txt_" + i);
				let m_size = document.getElementById("m_siz_" + i);
				s_text.innerHTML = "Resized image No. " + n + " in " + imageList[i].ext_old + ".";
				m_text.innerHTML = "Resized image No. " + n + " in " + imageList[i].ext_old + ".";
				s_size.innerHTML = imageList[i].res_new;
				m_size.innerHTML = imageList[i].res_new;


				/*
				img_data.innerHTML = "IMAGE " + i + " </br>";
				img_data.innerHTML += "File name: " + imageList[i].name + " </br>";
				img_data.innerHTML += "File extension: " + imageList[i].ext_old + " </br>";
				img_data.innerHTML += "Size original: " + imageList[i].size_old + " bytes </br>";
				img_data.innerHTML += "Size new: " + imageList[i].size_new + " bytes </br>";
				img_data.innerHTML += "Resolution original: " + imageList[i].res_old + " px </br>";
				img_data.innerHTML += "Resolution new: " + imageList[i].res_new + " px </br>";
				img_data.innerHTML += "</br></br>"
				*/
			}
		};


		// TODO --> NEXT ___ TO BE REMOVED
		// Clear
		/*
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
		};

		// No valid images, delete all data
		if (empty) {
			let no_data = document.createElement("span");
			no_data.innerHTML = "No data to be displayed"
			dataContainer.appendChild(no_data);
		};
		*/
	};
	function checkAutoUpdateMode() {
		// Check defined mode when start app
		if (autoUpdate == true) {
			updateCheckbox.checked = true;
			updateButton.style.display = "none";
		}
		else {
			autoUpdate = false;
			updateButton.style.display = "block";
		}
	}
	for (var i = 0; i < exampleImage.length; i++) {
		// Add example image event listeners
		exampleImage[i].onclick = function () {
			uploadCustomFile(this.src);
		}
	};
	function addResizedImageToDOM(fileItem, id) {
		// Add hidden images to DOM
		var new_res = document.createElement("img");
		new_res.id = "img_res_" + id;
		new_res.className = "singleImage";
		new_res.src = URL.createObjectURL(fileItem.file);
		imageResizedContainer.appendChild(new_res);
	}
	function addResizedImageToDOM_ShowSingle(fileItem, id) {
		// Add all images to single
		var s_container = document.createElement("div");
		var s_column1 = document.createElement("div");
		var s_column2 = document.createElement("div");
		var s_show = document.createElement("div");
		//var s_plh = document.createElement("span");
		var s_siz = document.createElement("div");
		var s_img = document.createElement("img");
		var s_txt = document.createElement("p");
		var s_btn = document.createElement("button");
		s_container.id = "s_div_" + id;
		s_container.classList.add("row");
		s_column1.classList.add("col-sm-8");
		s_column2.classList.add("col-sm");
		s_show.classList.add("show-single-image");
		//s_plh.classList.add("placeholder");
		//s_plh.classList.add("col-12");
		//s_plh.style.height = "60vh";
		s_siz.id = "s_siz_" + id;
		s_siz.classList.add("show-size-tag");
		s_siz.innerHTML = "0x0";
		s_img.id = "s_img_" + id;
		s_img.className = "singleImage";
		s_img.src = URL.createObjectURL(fileItem.file);
		s_txt.innerHTML = "Image description";
		s_txt.id = "s_txt_" + id;
		s_btn.innerHTML = "<i class='bi bi-download bi-mr'></i> Download";
		s_btn.type = "button";
		s_btn.id = "s_btn_" + id;
		s_btn.onclick = function () {
			// TODO --> review download for iphone, should open image?
			// Download (desktop)
			let filename = "freeimageresizer_" + imageList[id].name;
			let url = imageList[id].url;
			var element = document.createElement('a');
			element.setAttribute('href', url);
			element.setAttribute('download', filename);
			document.body.appendChild(element);
			element.click();

			// Open in new window (mobile)
			//var image = new Image();
			//image.src = imageList[id].url;
			//var w = window.open("");
			//w.document.write(image.outerHTML);

			// TODO --> Mobile download
			// Add a tag for user to save: click on image and save it, (icon iphone [^])
			// hide "download?"
			// open in a new browser button?

			console.log("Download with name: ", filename);

		}
		s_btn.classList.add("btn");
		s_btn.classList.add("btn-download");
		s_show.appendChild(s_img);
		//s_show.appendChild(s_plh);
		s_show.appendChild(s_siz);
		s_column1.appendChild(s_show);
		s_column2.appendChild(s_txt);
		s_column2.appendChild(s_btn);
		s_container.appendChild(s_column1);
		s_container.appendChild(s_column2);
		showSingleBox.appendChild(s_container);
	}
	function addResizedImageToDOM_ShowMultiple(fileItem, id) {
		// Add to multiple
		var m_container = document.createElement("div");
		var m_show = document.createElement("div");
		var m_siz = document.createElement("div");
		var m_img = document.createElement("img");
		var m_txt = document.createElement("p");
		var m_btn = document.createElement("button");
		m_container.classList.add("col-sm-3");
		m_container.classList.add("my-4");
		m_container.id = "m_div_" + id;
		m_show.classList.add("show-multiple-image");
		m_siz.id = "m_siz_" + id;
		m_siz.classList.add("show-size-tag");
		m_siz.innerHTML = "0x0";
		m_img.id = "m_img_" + id;
		m_img.className = "singleImage";
		m_img.src = URL.createObjectURL(fileItem.file);
		m_txt.innerHTML = "Image description";
		m_txt.id = "m_txt_" + id;
		m_btn.innerHTML = "<i class='bi bi-download bi-mr'></i> Download";
		m_btn.type = "button";
		m_btn.id = "m_btn_" + id;
		m_btn.onclick = function () {
			// TODO --> review download for iphone, should open image?
			let filename = "freeimageresizer_" + imageList[id].name;
			let url = imageList[id].url;
			var element = document.createElement('a');
			element.setAttribute('href', url);
			element.setAttribute('download', filename);
			document.body.appendChild(element);
			element.click();
			console.log("Download with name: ", filename);
		}
		m_btn.classList.add("btn");
		m_btn.classList.add("btn-download");
		m_show.appendChild(m_img);
		m_show.appendChild(m_siz);
		m_container.appendChild(m_show);
		m_container.appendChild(m_txt);
		m_container.appendChild(m_btn);
		showMultipleBox.appendChild(m_container);
		// TODO --> CONFIG TEXT
		// TODO --> CONFIG BUTTON
	}
	function addPrevImageToDOM(fileItem, id) {
		// Add hidden images to DOM
		var new_img = document.createElement("img");
		new_img.id = "img_pre_" + id;
		new_img.className = "singleImage";
		new_img.src = URL.createObjectURL(fileItem.file);
		imagePrevContainer.appendChild(new_img);
	}
	resizeMethod.addEventListener('click', (event) => {
		let button = event.target.nodeName === 'BUTTON';
		if (!button) { return; }
		resizeModeDisplay(event.target.id);
	})
	function resizeModeDisplay(mode) {
		let pre = "btn-mode-";
		let s = pre + "standard";
		let c = pre + "custom";
		let p = pre + "percentage";
		let sc = "btn-resize-mode-sel";
		let ac = "arr-resize-mode-sel";
		function modeClear() {
			document.getElementById(s).classList.remove(sc);
			document.getElementById(c).classList.remove(sc);
			document.getElementById(p).classList.remove(sc);
			document.getElementById(s + "-ar").classList.remove(ac);
			document.getElementById(c + "-ar").classList.remove(ac);
			document.getElementById(p + "-ar").classList.remove(ac);
			optionsBoxMode.style.display = "none";
			optionsBoxPreset.style.display = "none";
			optionsBoxCustomSize.style.display = "none";
			optionsBoxPrecentage.style.display = "none";
		}
		modeClear();
		if (mode == pre + "standard") {
			// Mode Standard
			document.getElementById(s).classList.add(sc);
			document.getElementById(s + "-ar").classList.add(ac);
			optionsBoxMode.style.display = "block";
			optionsBoxPreset.style.display = "block";
		} else if (mode == "btn-mode-custom") {
			// Mode Custom
			document.getElementById(c).classList.add(sc);
			document.getElementById(c + "-ar").classList.add(ac);
			optionsBoxMode.style.display = "block";
			optionsBoxCustomSize.style.display = "block";
		} else if (mode == "btn-mode-percentage") {
			// Mode Percentage
			document.getElementById(p).classList.add(sc);
			document.getElementById(p + "-ar").classList.add(ac);
			optionsBoxPrecentage.style.display = "block";
		};
	}
	updateCheckbox.onchange = function () {
		if (this.checked) {
			autoUpdate = true;
			updateButton.style.display = "none";
			updateImagesResize();
		}
		else {
			autoUpdate = false;
			updateButton.style.display = "block";
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
			inputType = "forced";
			forceMode = true;
		}
		else {
			inputType = "fixed";
			forceMode = false;
			//clearValues();
			//clearStyles();
		}
		if (updateCheckbox.checked) { updateImagesResize() };
	}
	updateButton.onclick = function () {
		// Resize all images when update button is clicked
		updateImagesResize();
	}
	inputSlider.onchange = function () {
		// Update values
		let i = this.value;
		clearValues();
		this.value = i;
		resizingFactor = i / 100;
		inputType = "percentage";

		// Update styles
		clearStyles();
		this.classList.add("selected"); // TODO --> Add to new style css

		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	};
	inputWidth.onchange = function () {
		// Check user input
		this.value = preventUserMinMax(this.value, "Width");

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
		this.classList.add("selected"); // TODO --> Update to css new style
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
		this.value = preventUserMinMax(this.value, "Height");

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
		this.classList.add("selected"); // TODO --> Update to new css style
		inputWidth.classList.add("selected");

		// Update values and styles if forced
		if (forceMode) {
			inputType = "forced";
		}

		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	};
	function inputButtonPresetUpdate(button_id) {
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
		element.classList.add("preset-size-selected");

		// Resize images update
		if (updateCheckbox.checked) { updateImagesResize() };
	}
	function preventUserMinMax(value, text) {
		if (isNaN(value)) {
			console.warn(text + " should be a numeric value."); // TODO --> Tell to the user
			return "";
		}
		if (value < minSizeValue) {
			console.warn(text + " of " + value + " px is too small, min value is " + minSizeValue + " px."); // TODO --> Tell to the user
			return "";
		}
		if (value > maxSizeValue) {
			console.warn(text + " of " + value + " px is too big, max value is " + maxSizeValue + " px."); // TODO --> Tell to the user
			return "";
		}
		return value;
	}


	// --------------------------------------------------- //
	// Resizer caller
	function resizeImage(id) {
		//console.log("Resize call id " + id, inputType);

		// Assign img to variable
		let img_old = document.getElementById("img_pre_" + id);
		let img_new = document.getElementById("img_res_" + id);
		let img_s = document.getElementById("s_img_" + id);
		let img_m = document.getElementById("m_img_" + id);

		// Call the resizer
		console.log("Resizing with:....", inputType, cropMode)
		let canvas = downScaleImage(img_old, inputType, cropMode, backColor, resizingFactor, resizingWidth, resizingHeight);

		// Prevent from error in downsampling
		if (canvas == undefined) {
			console.error("Downsample not possible, canvas undefined")
			return;
		}

		// Assign the image
		let type = "image/" + imageList[id].ext_old;
		let canvasData = canvas.toDataURL(type);
		img_new.src = canvasData;
		if (isNaN(img_s)) { img_s.src = canvasData };
		img_m.src = canvasData;
		imageList[id].url = img_new.src;

		// Update imagelist data and reload data displayed
		img_new.onload = function () {
			// Update imagelist data and reload data displayed
			imageList[id].res_old = img_old.width + " x " + img_old.height;
			imageList[id].res_new = img_new.width + " x " + img_new.height;

			// Update data displayed
			dataDisplay();

			// Placeholder
			let placeholder = img_s.parentElement.getElementsByClassName("placeholder");
			if (!placeholder) { placeholder.hidden = true };
			//console.log(placeholder);
		}

		// Update data displayed
		dataDisplay();

		// Ensure new resizer call when is loaded
		img_old.onload = function () { updateImagesResize(); };
	};
	function updateImagesResize() {
		for (let i in imageList) {
			if (imageList[i].valid == true) {
				let id = parseInt(i);
				//console.log("CALL", id)
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

		server: {
			//url: "http://127.0.0.1:5000/", // Local server configuration
		},


		// FUNCTIONS ------------
		// Call back when image is added
		onaddfile: (err, fileItem) => {
			console.log("FP Add File Function called");

			// Assign image to list
			let id = saveImageData(fileItem.file.name, URL.createObjectURL(fileItem.file), fileItem.fileSize, fileItem.fileExtension, fileItem.id);

			// Add images to DOM
			addPrevImageToDOM(fileItem, id);
			addResizedImageToDOM(fileItem, id);
			addResizedImageToDOM_ShowSingle(fileItem, id)
			addResizedImageToDOM_ShowMultiple(fileItem, id);
			//if (imageList.length == 1) { addResizedImageToDOM_ShowSingle(fileItem, id) };

			// Resize image and add to the list
			if (autoUpdate) { resizeImage(id); }

			// Add download button
			//addDownloadButton(id);

			// Update show status
			displayState(true);
		},
		// File has been removed
		onremovefile: function (error, fileItem) {
			console.log("FP Remove File Function called");

			// Remove item from list and remove download button
			removeImageData(fileItem.id);

			// Update show status
			let off = true;
			for (let i in imageList) { if (imageList[i].valid == true) { off = false; } }
			if (off) {
				displayState(false)
			} else {
				displayState(true);
			}

			// Update data display
			dataDisplay();
		},
	});

	pond.maxFiles = 10;
	pond.allowReorder = false;

	function uploadCustomFile(src) {
		pond.addFile(src);
	};


	// Initialize main functions and variables
	var autoUpdate = true;
	checkAutoUpdateMode();
	displayState(false);
	dataDisplay();
	resizingWidth = 900;
	resizingHeight = 600;
	resizeModeDisplay("btn-mode-standard"); // Define Resize Options first window


	// TEMP auto testing
	//uploadCustomFile("static/img/porsche.jpg");
	//uploadCustomFile("static/img/couple.jpg");


	// TODO --> General bug: when delete all image, for some reason user lost selected size (1x1 for example)
	// TODO --> Check metadata of the image in mobile and desktop
	// TODO --> HTML change sample images to thumb image (smaller)
	// TODO --> Filepond order invert

	
	// DOM info
	//console.log('DOM fully loaded and parsed');
});
