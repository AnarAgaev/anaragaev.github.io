// Открыть/Закрыть модальное окно
function toggleModal(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const el = e.target.closest("[data-toggle='modal']");

    const targetId = el.dataset.targetId;
    const direction = el.dataset.direction;

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
    document.addEventListener('click', evt => {
        const modalToggle = (evt.target)
            .closest("[data-toggle='modal']");
    
        if (modalToggle) toggleModal(evt);
    });
});



// Показываем/скрываем тултип для хелпера
const helpers = Array.from(document.querySelectorAll(
    '.conf__selects-controller .helper'));

const helpersCloseButtons = Array.from(document.querySelectorAll(
    '.conf__selects-controller .close'));

const helpersCloseContents = Array.from(document.querySelectorAll(
    '.conf__selects-controller .content'));

helpers.forEach(el => {
    el.addEventListener('click', function (e) {
        const isVisible = this.classList.contains('visible');
        e.stopPropagation();
        resetAllHelpers();
        if (!isVisible) this.classList.add('visible');
    })
});

helpersCloseButtons.forEach(el => {
    el.addEventListener('click', function (e) {
        e.stopPropagation();
        resetAllHelpers();
    })
});

helpersCloseContents.forEach(el => {
    el.addEventListener('click', function (e) {
        e.stopPropagation();
    })
});

function resetAllHelpers() {
    helpers.forEach(el => {
        el.classList.remove('visible');
    });
}

// Выбираем терк
const tracks = Array.from(document.querySelectorAll(
    '.conf__selects-img'));

tracks.forEach(el => {
    el.addEventListener('click', e => {
        const _this = e.target.closest('.conf__selects-img');
        
        const container = e.target
            .closest('.conf__selects-list');
        
        const siblings = Array.from(container
            .querySelectorAll('.conf__selects-img'));
        
        siblings.forEach(item => item.classList.add('inactive'));
    
        _this.classList.remove('inactive');
    });
});




const elementsBtns = Array.from(document
    .querySelectorAll('.conf__elements-btn.selected'));

elementsBtns.forEach(el => {
    el.addEventListener('click', function () {
        resetAllElementsBtns();
        this.classList.add('active');
        
        const side = this.querySelector('.conf__elements-letter').innerText;
        const block = document.querySelector(`.conf__elements-block-${side}`);
    
        resetAllElementsBlock();
        block.classList.add('active');
    });
});

function resetAllElementsBtns() {
    elementsBtns.forEach(el =>
        el.classList.remove('active'));
}

function resetAllElementsBlock() {
    Array.from(document
        .querySelectorAll('.conf__elements-block'))
        .forEach(el => el.classList.remove('active'));
}





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
