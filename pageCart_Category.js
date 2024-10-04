document.addEventListener('DOMContentLoaded', (event) => {
    const aoNamMenu = document.getElementById('dropdownAoNamMenu');
    const quanNamMenu = document.getElementById('dropdownQuanNamMenu');

    document.getElementById('navbardropdownAoNam').addEventListener('click', function (event) {
        event.stopPropagation();
        aoNamMenu.classList.toggle('show');
        quanNamMenu.classList.remove('show');
    });

    document.getElementById('navbardropdownQuanNam').addEventListener('click', function (event) {
        event.stopPropagation();
        quanNamMenu.classList.toggle('show');
        aoNamMenu.classList.remove('show');
    });

    document.addEventListener('click', function (event) {
        if (!aoNamMenu.contains(event.target) && !quanNamMenu.contains(event.target)) {
            aoNamMenu.classList.remove('show');
            quanNamMenu.classList.remove('show');
        }
    });

    aoNamMenu.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    quanNamMenu.addEventListener('click', function (event) {
        event.stopPropagation();
    });
});