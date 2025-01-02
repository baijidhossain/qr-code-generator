

const currentPath = window.location.pathname; // e.g., "/about"
const links = document.querySelectorAll('a'); // Select all anchor tags

links.forEach(link => {
    if (link.pathname === currentPath) {
        const parentLi = link.closest('li'); // Find the closest parent <li>
        if (parentLi) {
            parentLi.classList.add('active'); // Add 'active' class to the parent <li>
        }
    }
});



// header sticky Toggle the visibility of the menu

 function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('hidden');
}

// Add dynamic shadow and smooth appearance on scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    // Make the header visible smoothly
    header.classList.add('header');
  } else {
    // Hide the header smoothly
    header.classList.remove('header');
  }
});

// Check the scroll position when the page loads
window.addEventListener('load', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    // If already scrolled, add the header class
    header.classList.add('header');
  }
});