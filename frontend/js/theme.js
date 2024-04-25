document.addEventListener('DOMContentLoaded', function() {
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

    // Check if a theme cookie exists and set the theme accordingly
    const savedTheme = getCookie('theme');
    console.log(savedTheme);

    if (savedTheme == 'dark') {
        document.body.classList.add('bg-dark', 'text-white');
    } else if (savedTheme == 'light') {
        document.body.classList.remove('bg-dark', 'text-white');
        document.body.classList.add('bg-light', 'text-dark');
    } else {
        document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
    }
});
