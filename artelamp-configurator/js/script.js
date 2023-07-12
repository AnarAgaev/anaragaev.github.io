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
    
    const isModalsVisible = document
        .querySelectorAll(".modal.show")
        .length > 0;

    if (isModalsVisible) {
        resetAllModals();
    }
    
    setTimeout(() => {
        if (!isModalsVisible) {
            document.body.style
                .paddingRight = scrollbarWidth + 'px';
    
            document.querySelector('header.header').style
                .paddingRight = scrollbarWidth + 'px';
    
            document.querySelector('footer.footer').style
                .paddingRight = scrollbarWidth + 'px';
        }

        bodyClasses.add('modal-open');
        modal.style.paddingRight = scrollbarWidth + 'px';
        modalClasses.add('show');
    }, 100);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalClasses = modal.classList;
    const bodyClasses = document.body.classList;

    bodyClasses.remove('modal-open');
    modalClasses.remove('show');
    modal.style.removeProperty('padding-right');
    document.body.style.removeProperty('padding-right');
    document.querySelector('header.header')
        .style.removeProperty('padding-right');
    document.querySelector('footer.footer')
        .style.removeProperty('padding-right');
}

function resetAllModals() {
    const modals = document
        .querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.classList.remove('show');
        modal.style.paddingRight = '0px';
    });

    // document.body.style.paddingRight = '0';
    // document.body.classList.remove('modal-open');
}

function setNavPoint() {
    const width = this.offsetWidth;
    const leftOffset = this
        .getBoundingClientRect().left;
    
    document
        .getElementById('navPoint')
        .style.left = leftOffset + width/2 + 'px';
}

function resetNavPoint() {
    const point = document
        .getElementById('navPoint');
    
    const navItem = document.querySelector(
        '.header__navigation-item:first-child');

    const leftOffset = navItem
        .getBoundingClientRect()
        .left;
    
    const width = navItem.offsetWidth;
    
    point.classList.add('active');
    point.style.left = leftOffset + width/2 + 'px';
}

function initialNavPoint() {
    const navItems = Array.from(document
        .querySelectorAll('.header__navigation-item'));
    
    navItems.forEach(el => {
        el.addEventListener('mouseenter', setNavPoint);
        el.addEventListener('mouseleave', resetNavPoint);
    });
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
    // Инищиализируем ховер-точку на основном меню сайта
    initialNavPoint();
    resetNavPoint();
    
    // Открыть/Закрыть модальное окно
    document.addEventListener('click', evt => {
        const modalToggle = (evt.target)
            .closest("[data-toggle='modal']");
    
        if (modalToggle) toggleModal(evt);
    });
});
const navToggle = document.querySelector('.header__controllers .header__burger');
const headerNav = document.querySelector('.header__navigation');

navToggle.addEventListener('click', function () {
  this.classList.toggle('open');
  headerNav.classList.toggle('show');
});


const button = document.querySelector('#tooltipButton');
const tooltip = document.querySelector('#tooltipMessage');

if (button) {

// Каждый тултип нужно проинициализировать,
// с помощью метода Popper.createPopper
// передав в него два параметра
// 1. элемент на котором должен срабатывать тултип
// 2. сам тултип
// В момент инициализации в свойство placement
// передаем стартовую позицию тултипа
// Типы позиций можно посмотреть на главной странице в разделе PLACEMENT
    const popperInstance = Popper.createPopper(button, tooltip, {
        placement: 'bottom-start',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 12],
                },
            },
        ],
    });

// Функции show и hide можно переиспользовать
    function show() {
        // Make the tooltip visible
        tooltip.setAttribute('data-show', '');
        
        // Enable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                {name: 'eventListeners', enabled: true},
            ],
        }));
        
        // Update its position
        popperInstance.update();
    }
    
    function hide() {
        // Hide the tooltip
        tooltip.removeAttribute('data-show');
        
        // Disable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                {name: 'eventListeners', enabled: false},
            ],
        }));
    }

// Обработчики событий нужны свои
    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];
    
    showEvents.forEach((event) => {
        button.addEventListener(event, show);
    });
    
    hideEvents.forEach((event) => {
        button.addEventListener(event, hide);
    });
}
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

// Тоглим блок с выбором параметров
const confSelects = Array.from(document.querySelectorAll('.conf__selects-title'));

confSelects.forEach(el => {
    el.addEventListener('click', function(e) {
        e.stopPropagation();
        const wrap = el.parentNode;
        wrap.classList.toggle('open');
    });
});

// Блокируем всплытие с кнопки .helper и всего вложенного
const helperBtns = Array.from(document.querySelectorAll('.helper'));
const helperBtnsInner = Array.from(document.querySelectorAll('.helper *'));
const helperCombain = [...helperBtns, ...helperBtnsInner];

helperCombain.forEach(el => {
    el.addEventListener('click', e => e.preventDefault());
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
    
    Array.from(document.querySelectorAll(
        '.conf__data-side_custom .conf__data-btn'))
        .forEach(el => {
            el.addEventListener('click', function () {
                resetDataButtons();
                this.classList.add('active');
            });
        });
    
    function resetDataButtons() {
        Array.from(document.querySelectorAll(
            '.conf__data-side_custom .conf__data-btn'))
            .forEach(el => {
                el.classList.remove('active');
            });
    }
});

const confTabs = Array.from(document
        .querySelectorAll('.conf__tab-list li'));

const confTabsItems = Array.from(document
    .querySelectorAll('.conf__tab-item'));

const resetConfTabs = () => {   
    confTabs.forEach( 
        el => el.classList.remove('active')
    );
}

const resetConfTabsItems = () => {   
    confTabsItems.forEach( 
        el => el.classList.remove('active')
    );
}

confTabs.forEach((el, num) => {
    const handler = (num) => {
        resetConfTabs();
        resetConfTabsItems();
        el.classList.add('active');
        confTabsItems[num].classList.add('active');      
    }

    el.addEventListener('click', e => handler(num));
});


// Табы
const confFilterSelectsContainers = Array.from(document.querySelectorAll('.conf__select'));
const confFilterSelects = Array.from(document.querySelectorAll('.conf__select-wrap'));

const resetConfSelects = () => {
    confFilterSelectsContainers.forEach(el => el.classList.remove('dropped'));
}

const resetConfSelectsValue = (el) => {
    const options = el.closest('.conf__select-options');
    const values = Array.from(options.querySelectorAll('.value'));

    values.forEach(el => {
        el.classList.remove('active')
    });    
}

confFilterSelects.forEach(el => {
    el.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        const select = this.closest('.conf__select');
        isDropped = select.classList.contains('dropped');

        if (isDropped) {
            resetConfSelects();
            
            if (e.target.classList.contains('value')) {
                const value = e.target.textContent;
                const wrap = this.closest('.conf__select-wrap');
                const input = wrap.querySelector('.conf__select-value span');

                resetConfSelectsValue(e.target);
                input.innerText = value;
                e.target.classList.add('active');                
            }

        } else {
            resetConfSelects();
            select.classList.add('dropped');
        }
    });
});

const sideBtns = Array.from(document.querySelectorAll('.conf__sides-item button'));
const modulSides = Array.from(document.querySelectorAll('.conf__modules-side'));

const resetSideBtns = () => {
    sideBtns.forEach(el => el.classList.remove('active'));
}

const resetModulSides = () => {
    modulSides.forEach(el => el.classList.remove('active'))
}

const handleSideBtnsClick = (e, i) => {
    const _this = e.target;
    const btn = _this.closest('button');


    resetSideBtns();
    resetModulSides();
    btn.classList.add('active');
    modulSides[i].classList.add('active');
}

sideBtns.forEach((el, i) => {
    el.addEventListener('click', (e) => handleSideBtnsClick(e, i));
});


// const confTabs = Array.from(document
//         .querySelectorAll('.conf__tab-list li'));

// const confTabsItems = Array.from(document
//     .querySelectorAll('.conf__tab-item'));

// const resetConfTabs = () => {   
//     confTabs.forEach( 
//         el => el.classList.remove('active')
//     );
// }

//     confTabsItems.forEach( 
//         el => el.classList.remove('active')
//     );
// }

// confTabs.forEach((el, num) => {
//     const handler = (num) => {
//         resetConfTabs();
//         resetConfTabsItems();
//         el.classList.add('active');
//         confTabsItems[num].classList.add('active');      
//     }

//     el.addEventListener('click', e => handler(num));
// });


// // Табы
// const confFilterSelectsContainers = Array.from(document.querySelectorAll('.conf__select'));
// const confFilterSelects = Array.from(document.querySelectorAll('.conf__select-wrap'));

// const resetConfSelects = () => {
//     confFilterSelectsContainers.forEach(el => el.classList.remove('dropped'));
// }

// const resetConfSelectsValue = (el) => {
//     const options = el.closest('.conf__select-options');
//     const values = Array.from(options.querySelectorAll('.value'));

//     values.forEach(el => {
//         el.classList.remove('active')
//     });    
// }

// confFilterSelects.forEach(el => {
//     el.addEventListener('click', function(e) {
//         e.stopPropagation();
//         e.preventDefault();

//         const select = this.closest('.conf__select');
//         isDropped = select.classList.contains('dropped');

//         if (isDropped) {
//             resetConfSelects();
            
//             if (e.target.classList.contains('value')) {
//                 const value = e.target.textContent;
//                 const wrap = this.closest('.conf__select-wrap');
//                 const input = wrap.querySelector('.conf__select-value span');

//                 resetConfSelectsValue(e.target);
//                 input.innerText = value;
//                 e.target.classList.add('active');                
//             }

//         } else {
//             resetConfSelects();
//             select.classList.add('dropped');
//         }
//     });
// });

// const sideBtns = Array.from(document.querySelectorAll('.conf__sides-item button'));
// const modulSides = Array.from(document.querySelectorAll('.conf__modules-side'));

// const resetSideBtns = () => {
//     sideBtns.forEach(el => el.classList.remove('active'));
// }

// const resetModulSides = () => {
//     modulSides.forEach(el => el.classList.remove('active'))
// }

// const handleSideBtnsClick = (e, i) => {
//     const _this = e.target;
//     const btn = _this.closest('button');


//     resetSideBtns();
//     resetModulSides();
//     btn.classList.add('active');
//     modulSides[i].classList.add('active');
// }

// sideBtns.forEach((el, i) => {
//     el.addEventListener('click', (e) => handleSideBtnsClick(e, i));
// });



// window.addEventListener('load', () => {
//     Array.from(document.querySelectorAll('.conf__data-toggle'))
//         .forEach(el => {
//             el.addEventListener('click', e => {
//                 e.target.closest('.conf__data-side')
//                     .classList
//                     .toggle('show');
//             });
//         });
    
//     Array.from(document.querySelectorAll(
//         '.conf__data-side_custom .conf__data-btn'))
//         .forEach(el => {
//             el.addEventListener('click', function () {
//                 resetDataButtons();
//                 this.classList.add('active');
//             });
//         });
    
//     function resetDataButtons() {
//         Array.from(document.querySelectorAll(
//             '.conf__data-side_custom .conf__data-btn'))
//             .forEach(el => {
//                 el.classList.remove('active');
//             });
//     }
// });