// Открыть/Закрыть модальное окно
function toggleModal(e) {
    e.preventDefault();
    e.stopPropagation();

    const targetId = e.target.dataset.targetId;
    const direction = e.target.dataset.direction;

    switch (direction) {
        case 'show':
            showModal(targetId);
            break;
        case 'hide':
            hideModal(targetId);
            break;
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalClasses = modal.classList;
    const bodyClasses = document.body.classList;
    const scrollbarWidth = getScrollbarWidth();

    document.body.style.paddingRight = scrollbarWidth + 'px';
    bodyClasses.add('modal-open');
    modal.style.paddingRight = scrollbarWidth + 'px';
    modalClasses.add('show');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalClasses = modal.classList;
    const bodyClasses = document.body.classList;

    bodyClasses.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    modalClasses.remove('show');
    modal.style.removeProperty('padding-right');
}

// Получаем ширину скроллбара
window.getScrollbarWidth = function() {
    let div = document.createElement('div');
    let scrollWidth;

    if (!isScrollBarVisible()) {
        return 0;
    }

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.append(div);
    scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();

    return scrollWidth;
}

window.isScrollBarVisible = function () {
    return window.innerWidth
        !== document.documentElement.clientWidth;
}

window.addEventListener("load",
function(event) {

    // Открыть/Закрыть модальное окно
    const modalToggles = Array.from(document
        .querySelectorAll("[data-toggle='modal']"));

    modalToggles.forEach(function (el) {
        el.addEventListener('click', toggleModal);
    });
});


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











