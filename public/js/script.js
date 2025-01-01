document.querySelector(`a[href="${window.location.pathname}"]`)?.closest('li')?.classList.add('active');
