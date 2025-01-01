

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
