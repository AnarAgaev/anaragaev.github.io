// Debounce decorator
window.debounce = function (f, ms) {
    let isCooldown = false;

    return function() {
        if (isCooldown) return;

        f.apply(this, arguments);

        isCooldown = true;

        setTimeout(() => isCooldown = false, ms);
    };
}

// Get element coordinates into document
window.getCoords = (elem) => {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

// Get scrollbar width
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

window.addEventListener('load', () => {

    const showAnimationElements = () => {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const windowScrollTop = scrollTop + windowHeight;

        const animationElms = Array.from(document
            .getElementsByClassName('withShowAnimation'));

        animationElms.forEach((el) => {
            const elScrollTop = getCoords(el).top;

            if (windowScrollTop > elScrollTop) {
                el.classList
                    .remove('withShowAnimation')
            }
        });
    };

    // Initial show animation elements after loaded page
    showAnimationElements();

    window.addEventListener('scroll', showAnimationElements);
});
window.addEventListener('load', () => {
    const gridLinesColumns = Array.from(document
        .querySelectorAll('.grid-lines .collapsed')) ;

    gridLinesColumns.forEach(el => {
        el.classList.remove('collapsed');
    });
});
function toggleNavigation () {
    const isNavOpen = nav.classList.contains('visible');

    isNavOpen
        ? body.classList.remove('modal-open')
        : body.classList.add('modal-open');

    nav.classList.toggle('visible');
}

function toggleNavItem () {
    resetAllNavItems();
    this.classList.add('active');
    nav.classList.remove('visible');
    body.classList.remove('modal-open');

    setTimeout(() => header.classList.add('hide'), 70);
}

function resetAllNavItems () {
    const navItems = Array.from(document
        .getElementsByClassName('nav__item'));

    navItems.forEach(el => el.classList.remove('active'));
}

let lastScrollTop = 0;

function stickyHeader () {
    const header = document
        .getElementById('header').classList;

    let scrollTop = window.pageYOffset;

    scrollTop > 100 && scrollTop > lastScrollTop
        ? header.add('hide')
        : header.remove('hide');

    lastScrollTop = window.pageYOffset;

    // Paint header
    scrollTop > 30
        ? header.add('paint')
        : header.remove('paint');
}

window.addEventListener('load', () => {
    window.addEventListener('scroll', stickyHeader);

    const toggleNavigationButtons = Array.from(document
        .querySelectorAll('.toggleNavigation')) ;

    toggleNavigationButtons.forEach(el => {
        el.addEventListener('click', toggleNavigation);
    });

    const navItems = Array.from(document
        .getElementsByClassName('nav__item'));

    navItems.forEach(el => {
        el.addEventListener('click', toggleNavItem);
    });

    (function setHeaderTransition () {
        const header = document.getElementById('header');
        header.style.transition = 'all .2s linear, padding 0s linear 0s';
    })();

    const logotypes = Array.from(document
        .getElementsByClassName('goToStart'));

    logotypes.forEach(el => el
        .addEventListener('click', resetAllNavItems));

    (function checkHeaderBackground () {
        const header = document
            .getElementById('header');

        if (window.pageYOffset > 30) {
            header.classList.add('paint')
        }
    })();
});

const PHRASES = [
    'на 50% дешевле разработки ',
    'от 5 рабочих дней ',
    'рост конверсии до 2% ',
    'с гарантией в договоре '
];

let intervalPrintPhrase;
let intervalClearPhrase;

const printPhrase = (phrase) => {
    const container = document
        .getElementById('actionText');

    let i = -1;

    intervalPrintPhrase = setInterval(() => {
        if (i >= phrase.length - 1) {
            clearInterval(intervalPrintPhrase);
            return;
        }
        container.innerText += phrase[++i];
    }, 75);
};

const clearPhrase = () => {
    const container = document
        .getElementById('actionText');

    intervalClearPhrase = setInterval(() => {
        if (container.innerText.length === 0) {
            clearInterval(intervalClearPhrase);
            return;
        }
        container.innerText = container.innerText.slice(0, -1);
    }, 30);
};

window.addEventListener('load', () => {

    // Animation add phrase
    let phrasePosition = 0;

    setInterval(() => {
        printPhrase(PHRASES[phrasePosition]);
        setTimeout(clearPhrase, 4500);

        ++phrasePosition;

        if (phrasePosition >= PHRASES.length) {
            phrasePosition = 0;
        }
    }, 5500);
});
function toggleFaq () {
    const container = this.closest('.faq__item');
    const isDropped = container.classList.contains('dropped');
    const wrapper = container.querySelector('.faq__body');
    const TRANSITION = 'all .17s ease-out';
    let descHeight;

    if (isDropped) {
        wrapper.style.transition = TRANSITION;
        wrapper.style.maxHeight = '0px';
        container.classList.toggle('dropped');
        return;
    }

    wrapper.style.transition = '';
    wrapper.style.maxHeight = 'none';
    descHeight = wrapper.clientHeight;
    wrapper.style.maxHeight = '0px';

    setTimeout(() => {
        wrapper.style.transition = TRANSITION;
        wrapper.style.maxHeight = descHeight + 'px';
        container.classList.toggle('dropped');
    }, 10);
}

window.addEventListener('load', () => {
    const faqControllers = Array.from(document
        .getElementsByClassName('faq__caption'));

    faqControllers.forEach(el =>
        el.addEventListener('click', toggleFaq));
});
function toggleModal() {
    const targetId = this.dataset.targetId;
    const dialogId = this.dataset.dialogShowId;
    const direction = this.dataset.direction;

    switch (direction) {
        case 'show':
            dialogId
                ? showModal(targetId, dialogId)
                : showModal(targetId);
            break;
        case 'hide':
            hideModal(targetId);
            break;
        case 'toggle':
            switchDialog(targetId);
            break;
    }
}

function showModal(modalId, dialogId = undefined) {
    const modal = document.getElementById(modalId);
    const bodyClasses = document.body.classList;
    const modalClasses = modal.classList;
    const header = document.getElementById('header');
    const gridLines = document.getElementById('gridLines');
    const nav = document.getElementById('nav');
    const scrollbarWidth = getScrollbarWidth();


    bodyClasses.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
    header.style.paddingRight = scrollbarWidth + 'px';
    gridLines.style.paddingRight = scrollbarWidth + 'px';
    modalClasses.add('show');
    modal.style.paddingRight = scrollbarWidth + 'px';
    nav.classList.remove('visible');

    if (dialogId) {
        const dialog = document.getElementById(dialogId);
        dialog.classList.remove('hidden');

        setTimeout(function () {
            dialog.classList.remove('hide');
        }, 10);
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const bodyClasses = document.body.classList;
    const modalClasses = modal.classList;
    const header = document.getElementById('header');
    const gridLines = document.getElementById('gridLines');

    const dialogs = Array.from(document.getElementById(modalId)
        .getElementsByClassName('modal__dialog'));

    if (dialogs.length > 1) {
        setTimeout(function () {
            dialogs.forEach(function (el) {
                el.classList.add('hidden', 'hide');
            });
        }, 500);
    }

    bodyClasses.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    header.style.removeProperty('padding-right');
    gridLines.style.removeProperty('padding-right');
    modalClasses.remove('show');
    modal.style.removeProperty('padding-right');
}

function switchDialog(dialogId, modalId = undefined) {
    const dialog = document.getElementById(dialogId);

    let modal;

    if (modalId) {
        modal = document.getElementById(modalId);
    } else {
        modal = document.getElementById(dialogId)
            .closest('.modal');
    }

    if (!modal.classList.contains('show')) {
        modal.classList.add('show');
    }

    const otherDialogs = Array.from(
        modal.getElementsByClassName('modal__dialog'))
        .filter(function (el) { return  el.id !== dialogId; });

    const DURATION = 300; // Get the property in css from .modal-dialog styles

    otherDialogs.forEach(function (el) {
        el.classList.add('hide');
    });

    setTimeout(function () {
        otherDialogs.forEach(function (el) {
            el.classList.add('hidden');
        });
        dialog.classList.remove('hidden');
    }, DURATION);

    setTimeout(function () {
        dialog.classList.remove('hide');
    }, DURATION + 50);
}

window.addEventListener("load",() => {
    // Toggle modal
    const modalToggles = Array.from(document
        .querySelectorAll("[data-toggle='modal']"));

    modalToggles.forEach(el => {
        el.addEventListener('click', toggleModal);
    });
});
function togglePortfolio () {
    const elements = Array.from(document
        .querySelectorAll('.portfolio__description'));
    let index = elements.indexOf(document
        .querySelector('.portfolio__description.active'));
    const count = elements.length;
    const direction = this.dataset.direction;
    const timeout = 1150; // get this value from styles

    direction === 'next' ? ++index : --index;
    if (index < 0) index = count - 1;
    else if(index === count) index = 0;

    resetActivePortfolioElements(timeout);

    setTimeout(
        () => setActivePortfolioElements(index),
        timeout
    );
}

function resetActivePortfolioElements (timeout) {
    const descriptionActive = document
        .querySelector('.portfolio__description.active');
    const imageActive = document
        .querySelector('.portfolio__image.active');
    const linkActive = document
        .querySelector('.portfolio__link a.active');

    descriptionActive.classList.add('collapsed');
    imageActive.classList.add('collapsed');
    linkActive.classList.add('collapsed');

    setTimeout(() => {
        descriptionActive.classList.remove('active', 'collapsed');
        imageActive.classList.remove('active', 'collapsed');
        linkActive.classList.remove('active', 'collapsed');
    }, timeout);
}

function setActivePortfolioElements (idx) {
    const descriptions = document
        .querySelectorAll('.portfolio__description');
    const images = document
        .querySelectorAll('.portfolio__image');
    const links = document
        .querySelectorAll('.portfolio__link a');

    descriptions[idx].classList.add('active', 'collapsed');
    images[idx].classList.add('active', 'collapsed');
    links[idx].classList.add('active', 'collapsed');

    setTimeout(() => {
        descriptions[idx].classList.remove('collapsed');
        images[idx].classList.remove('collapsed');
        links[idx].classList.remove('collapsed');
    }, 100);
}

window.addEventListener('load', () => {
    const sliderControllers = Array.from(document
        .getElementsByClassName('portfolio__controller'));
    sliderControllers.forEach(el =>
        el.addEventListener('click', debounce(togglePortfolio, 2500)));
});