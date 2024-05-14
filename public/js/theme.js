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