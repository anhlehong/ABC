document.addEventListener("DOMContentLoaded", function() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.classList.add('show');
            this.querySelector('.dropdown-menu').classList.add('show');
        });

        dropdown.addEventListener('mouseleave', function() {
            this.classList.remove('show');
            this.querySelector('.dropdown-menu').classList.remove('show');
        });
    });
});
