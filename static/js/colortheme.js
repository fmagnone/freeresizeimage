document.addEventListener('DOMContentLoaded', (event) => {

    // Elements
    var root = document.querySelector(':root');
    let navbar = document.getElementById("navbar");
    let graphicsLight = document.getElementsByClassName("graphic-light");
    let graphicsDark = document.getElementsByClassName("graphic-dark");

    // Basic color pallette
    function assignColor(theme) {
        if (theme == "dark") {
            // Color theme Black
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
            navbar.classList.remove("navbar-light");
            navbar.classList.add("navbar-dark");
            for (let e of graphicsLight ) { e.style.opacity = 0 };
            for (let e of graphicsDark ) { e.style.opacity = 1 };
        } else if (theme == "light") {
            // Color theme White
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
            navbar.classList.remove("navbar-dark");
            navbar.classList.add("navbar-light");
            for (let e of graphicsLight ) { e.style.opacity = 1 };
            for (let e of graphicsDark ) { e.style.opacity = 0 };
        }
    }
    
    // Get dark mode info from System or from Storage
    var darkmodeactive = localStorage.getItem("darkmode");
    if(!darkmodeactive) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // System Dark Mode
            darkmodeactive = true;
            goDark()
        }
    }
    //console.log("Dark mode is: " + darkmodeactive);
    
    // OTHER
    // TODO --> Organize Code
    function labelDark() {
        $(".toggle-switch").attr("alt", "Go light");
        $(".toggle-switch").attr("title", "Go light");
    }
    function goDark() {
        // console.log("Dark mode is active");  // TODO --> Delete
        labelDark();
        $("body").addClass("dark");
        refreshFavicon();
        assignColor("dark");
    }
    function stayDark() {
        goDark();
        localStorage.setItem("darkmode", true);
        darkmodeactive = localStorage.getItem("darkmode");
        console.log("Dark mode is: " + darkmodeactive + " and it will stay dark");
    }
    function labelLight() {
        $(".toggle-switch").attr("alt", "Go dark");
        $(".toggle-switch").attr("title", "Go dark");
    }
    function goLight() {
        console.log("Light mode is active");
        labelLight();
        $("body").removeClass("dark");
        refreshFavicon();
        assignColor("light");
    }
    function stayLight() {
        goLight();
        localStorage.setItem("darkmode", false);
        darkmodeactive = localStorage.getItem("darkmode");
        console.log("Dark mode is: " + darkmodeactive + " and it will stay light");
    }
    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && stayDark());
    window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && stayLight());
    $(".toggle-switch").click(function () {
        if ($("body").hasClass("dark")) {
            stayLight();
        } else {
            stayDark();
        }
    });
    $(".label-light").click(function () {
        if ($("body").hasClass("dark")) {
            stayLight();
        }
    });
    $(".label-dark").click(function () {
        if (!$("body").hasClass("dark")) {
            stayDark();
        }
    });
    window.onload = function () {
        if (localStorage.darkmode == "true") {
            //console.log("User manually selected dark mode from a past session");
            goDark();
        } else if (localStorage.darkmode == "false") {
            //console.log("User manually selected light mode from a past session");
            goLight();
        } else {
            //console.log("User hasn't selected dark or light mode from a past session, dark mode has been served by default and OS-level changes will automatically reflect");
            if ($("body").hasClass("dark")) {
                labelDark();
            } else {
                labelLight();
            }
        }
    };
    function tempDisableAnim() {
        $("*").addClass("disableEasingTemporarily");
        setTimeout(function () {
            $("*").removeClass("disableEasingTemporarily");
        }, 20);
    }
    setTimeout(function () {
        $(".load-flash").css("display", "none");
        $(".load-flash").css("visibility", "hidden");
        tempDisableAnim();
    }, 20);
    $(window).resize(function () {
        tempDisableAnim();
        setTimeout(function () {
            tempDisableAnim();
        }, 0);
    });
    function refreshFavicon() {
        if (matchMedia('(prefers-color-scheme: dark)').matches) {
            var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = 'static/assets/favicon-dark.svg';
            document.getElementsByTagName('head')[0].appendChild(link);
        } else {
            var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = 'static/assets/favicon.svg';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }
});