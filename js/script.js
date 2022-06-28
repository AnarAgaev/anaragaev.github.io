


window.addEventListener('load', () => {
    Array.from(document.querySelectorAll('.conf__data-toggle'))
        .forEach(el => {
            el.addEventListener('click', e => {
                e.target.closest('.conf__data-side')
                    .classList
                    .toggle('show');
            });
        });
});










