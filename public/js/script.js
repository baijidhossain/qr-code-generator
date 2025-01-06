

const currentPath = window.location.pathname; // e.g., "/about"
const links = document.querySelectorAll('a'); // Select all anchor tags

links.forEach(link => {
    if (link.pathname === currentPath) {
        const parentHeader = link.closest('header'); // Find the closest parent <header>
        if (parentHeader) {
            const parentLi = link.closest('li'); // Find the closest parent <li> inside <header>
            if (parentLi) {
                parentLi.classList.add('active'); // Add 'active' class to the <li>
            }
        }
    }
});


// header sticky Toggle the visibility of the menu
function toggleMenu(button) {
  const mobileMenu = document.getElementById("mobile-menu");

  // Toggle the 'hidden' class on the mobile menu
  if (mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.remove("hidden");
  } else {
    mobileMenu.classList.add("hidden");
  }

  // Toggle the button icon if applicable
  if (button) {
    const icon = button.querySelector("i"); // Select the icon inside the button
    if (icon) {
      icon.classList.toggle("fa-bars"); // Replace with your current icon class
      icon.classList.toggle("fa-xmark"); // Replace with the class for the close icon
    }
  }
}

// Add dynamic shadow and smooth appearance on scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 70) {
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
  if (window.scrollY > 70) {
    // If already scrolled, add the header class
    header.classList.add('header');
  }
});


function toggleFAQ(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector("svg");
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    icon.classList.remove("rotate-180");
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    icon.classList.add("rotate-180");
  }
}

function toggleFAQ(button) {
  // Close all other FAQ items
  const allFAQs = document.querySelectorAll(".grid .max-h-0");
  const allIcons = document.querySelectorAll(".grid svg");
  allFAQs.forEach((faq) => {
    faq.style.maxHeight = null;
  });
  allIcons.forEach((icon) => {
    icon.classList.remove("rotate-180");
  });
  // Toggle the clicked FAQ item
  const content = button.nextElementSibling;
  const icon = button.querySelector("svg");
  if (!content.style.maxHeight) {
    content.style.maxHeight = content.scrollHeight + "px";
    icon.classList.add("rotate-180");
  }
}
