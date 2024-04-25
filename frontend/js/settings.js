function openTab(evt, tabName) {
    var i, tabcontent, navLinks;
    tabcontent = document.getElementsByClassName("main-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    navLinks = document.getElementsByClassName("nav-link");
    for (i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// Get the element with class="nav-link" and add click event listeners to them
var navLinks = document.getElementsByClassName("nav-link");
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function(event) {
        openTab(event, this.getAttribute("href").substring(1)); // Pass tab ID without '#'
    });
}

// Initially show the first tab
document.querySelector(".nav-link").click();

// Change to dark mode when the user selects 'Dark Mode' from the theme dropdown
document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('theme');

    // Function to set a cookie
    function setCookie(name, value) {
        document.cookie = name + '=' + value + ';path=/';
    }

    // Function to read cookie
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    // Event listener for theme change
    themeSelect.addEventListener('change', function() {
        let selectedTheme = this.value;

        if (selectedTheme === 'Dark Mode') {
            document.body.classList.add('bg-dark', 'text-white');
            setCookie('theme', 'dark');
        } else if (selectedTheme === 'Light Mode') {
            document.body.classList.remove('bg-dark', 'text-white');
            document.body.classList.add('bg-light', 'text-dark');
            setCookie('theme', 'light');
        } else {
            document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
            setCookie('theme', 'default');
        }
    });

    // Check if a theme cookie exists and set the theme accordingly
    const savedTheme = getCookie('theme');
    if (savedTheme) {
        themeSelect.value = savedTheme === 'dark' ? 'Dark Mode' : savedTheme === 'light' ? 'Light Mode' : 'Default';
        themeSelect.dispatchEvent(new Event('change')); // Trigger change event to apply saved theme
    }
});
