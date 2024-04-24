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

document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('theme');

    themeSelect.addEventListener('change', function() {
        if (this.value === 'Dark Mode') {
            document.body.classList.add('bg-dark', 'text-white');
        } else if (this.value === 'Light Mode') {
            document.body.classList.remove('bg-dark', 'text-white');
            document.body.classList.add('bg-light', 'text-dark');
        } else {
            document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
        }
    });
});