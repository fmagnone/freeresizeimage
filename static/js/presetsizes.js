// Base options sizes Class Constructor
class presetSizeData {
    constructor(category, name, tag, prop, width, height) {
        this.category = category;
        this.name = name;
        this.tag = tag;
        this.prop = prop;
        this.width = width;
        this.height = height;
    }
}

// Variables
var presetSizeDataList = [];

// Add data
presetSizeDataList.push(new presetSizeData(
    "Instagram", 
    "instagram_landscape", 
    "Landscape",  
    "1.91:1", 
    1080, 566
));
presetSizeDataList.push(new presetSizeData(
    "Instagram", 
    "instagram_portrait", 
    "Portrait",  
    "4:5", 
    1080, 1350
));
presetSizeDataList.push(new presetSizeData(
    "Instagram", 
    "instagram_story", 
    "Story", 
    "9:16", 
    1080, 1920
));
presetSizeDataList.push(new presetSizeData(
    "Instagram", 
    "instagram_square", 
    "Square", 
    "1:1", 
    1080, 1080
));
presetSizeDataList.push(new presetSizeData(
    "Instagram", 
    "instagram_profile", 
    "Profile", 
    "1:1", 
    320, 320
));

presetSizeDataList.push(new presetSizeData(
    "Snapchat", 
    "snapchat_story", 
    "Story",  
    "9:16", 
    1080, 1920
));
presetSizeDataList.push(new presetSizeData(
    "Facebook", 
    "facebook_post", 
    "Post",  
    "1.91:1", 
    1200, 628
));
presetSizeDataList.push(new presetSizeData(
    "Twitter", 
    "twitter_post", 
    "Post",  
    "16:9", 
    1200, 670
));
presetSizeDataList.push(new presetSizeData(
    "Twitter", 
    "twitter_header", 
    "Header", 
    "3:1", 
    1500, 500
));
presetSizeDataList.push(new presetSizeData(
    "Twitter", 
    "twitter_instream", 
    "In-Stream", 
    "16:19", 
    1600, 1900
));
presetSizeDataList.push(new presetSizeData(
    "Twitter", 
    "twitter_profile", 
    "Profile", 
    "1:1", 
    400, 400
));
presetSizeDataList.push(new presetSizeData(
    "YouTube", 
    "youtube_thumbnail", 
    "Thumbnail",  
    "16:9", 
    1280, 720
));
presetSizeDataList.push(new presetSizeData(
    "LinkedIn", 
    "linkedin_sharedimage", 
    "Shared Image",  
    "1.91:1", 
    1200, 628
));
presetSizeDataList.push(new presetSizeData(
    "LinkedIn", 
    "linkedin_profile", 
    "Profile",  
    "1:1", 
    400, 400
));
presetSizeDataList.push(new presetSizeData(
    "Open Graph", 
    "opengraph_facebook", 
    "Facebook",
    "1.91:1",
    1640, 856
));
presetSizeDataList.push(new presetSizeData(
    "Open Graph", 
    "opengraph_twitter", 
    "Twitter",
    "2:1",
    1600, 800
));



presetSizeDataList.push(new presetSizeData(
    "Standard", 
    "standard_widescreen", 
    "Widescreen", 
    "16:9",
    1600, 900
));
presetSizeDataList.push(new presetSizeData(
    "Standard", 
    "standard_presentation", 
    "Presentation", 
    "4:3",
    1200, 900
));
presetSizeDataList.push(new presetSizeData(
    "Standard", 
    "standard_landscape", 
    "Landscape", 
    "3:2",
    1350, 900
));
presetSizeDataList.push(new presetSizeData(
    "Standard", 
    "standard_portrait", 
    "Portrait", 
    "2:3",
    900, 1350
));
presetSizeDataList.push(new presetSizeData(
    "Standard", 
    "standard_iphone", 
    "iPhone", 
    "9:16",
    900, 1600
));
presetSizeDataList.push(new presetSizeData(
    "Standard", 
    "standard_square", 
    "Square", 
    "1:1",
    1080, 1080
));
presetSizeDataList.push(new presetSizeData(
    "Standard", 
    "standard_thumb", 
    "Thumb", 
    "1:1",
    400, 400
));


// Console info
//console.log("Preset size data loaded");
