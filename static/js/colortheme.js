document.addEventListener('DOMContentLoaded', () => {

    // Elements
    var root = document.querySelector(':root');
    let navbar = document.getElementById("navbar");
    let body = document.getElementsByTagName("body")[0];
    let graphicsLight = document.getElementsByClassName("graphic-light");
    let graphicsDark = document.getElementsByClassName("graphic-dark");
    let toggleSwitch = document.getElementsByClassName("toggle-switch")[0];
    let labelLightSpan = document.getElementsByClassName("label-light")[0];
    let labelDarkSpan = document.getElementsByClassName("label-dark")[0];

    // Basic color pallette
    function assignColor(theme) {
        if (theme == "dark") {
            // Color theme Dark
            root.style.setProperty('--color-theme-0', 'black');
            root.style.setProperty('--color-theme-1', 'hsl(0, 0%, 10%)');
            root.style.setProperty('--color-theme-2', 'hsl(0, 0%, 20%)');
            root.style.setProperty('--color-theme-3', 'hsl(0, 0%, 30%)');
            root.style.setProperty('--color-theme-4', 'hsl(0, 0%, 40%)');
            root.style.setProperty('--color-theme-5', 'hsl(0, 0%, 50%)');
            root.style.setProperty('--color-theme-6', 'hsl(0, 0%, 60%)');
            root.style.setProperty('--color-theme-7', 'hsl(0, 0%, 70%)');
            root.style.setProperty('--color-theme-8', 'hsl(0, 0%, 80%)');
            root.style.setProperty('--color-theme-9', 'hsl(0, 0%, 90%)');
            root.style.setProperty('--color-theme-10', 'white');
            // Nav Dark
            navbar.classList.remove("navbar-light");
            navbar.classList.add("navbar-dark");
            // Graphics Dark
            for (let e of graphicsLight ) { e.style.opacity = 0; }
            for (let e of graphicsDark ) { e.style.opacity = 1; }
        } else if (theme == "light") {
            // Color theme Light
            root.style.setProperty('--color-theme-0', 'white');
            root.style.setProperty('--color-theme-1', 'hsl(0, 0%, 95%)');
            root.style.setProperty('--color-theme-2', 'hsl(0, 0%, 90%)');
            root.style.setProperty('--color-theme-3', 'hsl(0, 0%, 85%)');
            root.style.setProperty('--color-theme-4', 'hsl(0, 0%, 70%)');
            root.style.setProperty('--color-theme-5', 'hsl(0, 0%, 50%)');
            root.style.setProperty('--color-theme-6', 'hsl(0, 0%, 40%)');
            root.style.setProperty('--color-theme-7', 'hsl(0, 0%, 30%)');
            root.style.setProperty('--color-theme-8', 'hsl(0, 0%, 20%)');
            root.style.setProperty('--color-theme-9', 'hsl(0, 0%, 10%)');
            root.style.setProperty('--color-theme-10', 'black');
            // Nav Light
            navbar.classList.remove("navbar-dark");
            navbar.classList.add("navbar-light");
            // Graphics Light
            for (let e of graphicsLight ) { e.style.opacity = 1; }
            for (let e of graphicsDark ) { e.style.opacity = 0; }
        }
    }
    
    // Get dark mode info from System or User Storage
    var darkmodeactive = localStorage.getItem("darkmode");
    if(!darkmodeactive) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // System Dark Mode
            darkmodeactive = true;
            goDark();
        }
    }

    // Light and Dark functions
    function labelDark() {
        //$(".toggle-switch").attr("alt", "Go light");
        //$(".toggle-switch").attr("title", "Go light");
        toggleSwitch.alt = "Go light";
        toggleSwitch.title = "Go light";
        
        // TODO review if functional
    }
    function goDark() {
        labelDark();
        body.classList.add("dark");
        refreshFavicon();
        assignColor("dark");

        // TODO review if functional
    }
    function stayDark() {
        goDark();
        localStorage.setItem("darkmode", true);
        darkmodeactive = localStorage.getItem("darkmode");
        //console.log("Dark mode is: " + darkmodeactive + " and it will stay dark");
    }
    function labelLight() {
        toggleSwitch.alt = "Go dark";
        toggleSwitch.title = "Go dark";
    }
    function goLight() {
        //console.log("Light mode is active");
        labelLight();
        body.classList.remove("dark");
        refreshFavicon();
        assignColor("light");
    }
    function stayLight() {
        goLight();
        localStorage.setItem("darkmode", false);
        darkmodeactive = localStorage.getItem("darkmode");
        //console.log("Dark mode is: " + darkmodeactive + " and it will stay light");
    }

    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && stayDark());
    window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && stayLight());

    // User Actions
    
    checkDarkLight = function () {
        if (body.classList.contains("dark")) {
            stayLight();
        } else {
            stayDark();
        }
    }
    toggleSwitch.onclick = checkDarkLight;
    labelLightSpan.onclick = checkDarkLight;
    labelDarkSpan.onclick = checkDarkLight;
    
    window.onload = function () {
        if (localStorage.darkmode == "true") {
            //console.log("User manually selected dark mode from a past session");
            goDark();
        } else if (localStorage.darkmode == "false") {
            //console.log("User manually selected light mode from a past session");
            goLight();
        } else {
            //console.log("User hasn't selected dark or light mode from a past session, dark mode has been served by default and OS-level changes will automatically reflect");
            if (body.classList.contains("dark")) {
                labelDark();
            } else {
                labelLight();
            }
        }
    };

    // Animation disable functions
    function tempDisableAnim() {
        /*
        $("*").addClass("disableEasingTemporarily");
        setTimeout(function () {
            $("*").removeClass("disableEasingTemporarily");
        }, 20);
        */

        // TODO convert query selector All to vanilla js
        //example 
        //document.querySelectorAll('.item').forEach(item => {
        //    item.style.display = 'none';
        //});
    }
    setTimeout(function () {
        tempDisableAnim();
    }, 20);

    // Icon animated update
    function refreshFavicon() {
        let link;
        if (matchMedia('(prefers-color-scheme: dark)').matches) {
            link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = 'static/assets/favicon-dark.svg';
            document.getElementsByTagName('head')[0].appendChild(link);
        } else {
            link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = 'static/assets/favicon.svg';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }
});