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
  
  // Function to apply the theme based on the cookie value
  function applyTheme() {
    const savedTheme = getCookie('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('bg-dark', 'text-dark');
    } else if (savedTheme === 'light') {
      document.body.classList.remove('bg-dark', 'text-white');
      document.body.classList.add('bg-light', 'text-dark');
    } else {
      document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
    }
  }
  
  // Apply the theme on page load
  document.addEventListener('DOMContentLoaded', function() {
    applyTheme();
  });