const currentPath = window.location.pathname; // e.g., "/about"
const links = document.querySelectorAll('a'); // Select all anchor tags

links.forEach(link => {
    if (link.pathname === currentPath) {
        // Do something with the matching link
        console.log(`Found: ${link.href}`);
        console.log(link.pathname)
        console.log(currentPath)
        link.classList.add('active'); // Example: Add 'active' class
    }
});