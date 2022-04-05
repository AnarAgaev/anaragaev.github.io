// Очищаем все элементы по клику вне его (селекты, модалки, ...)
window.hideEffects = function (e) {
    const _this = e.target;

    // Selects
    const isSelect = _this.closest('.select');
    if (!isSelect) collapseAllSelects();
}

// Переклаывает html коллекцию в массив
window.nodeListToArray = function (nodeList) {
    const arr = [];

    for (let i = 0; i < nodeList.length; i++) {
        arr.push(nodeList[i]);
    }

    return arr;
}

function handleTabClick (e) {
    const node =  e.target;
    const id = node.dataset.targetId;
    const target = document.getElementById(id);

    if (node.classList.contains('active')) {
        return;
    }

    hideSiblingTabs(node);
    node.classList.add('active');

    hideSiblingsTabPanes(target);
    target.classList.add('active');
}

function hideSiblingTabs (node) {
    const siblings = nodeListToArray(
        node.closest('.tabs__list')
            .querySelectorAll('.tabs__item .tabs__toggle'));

    removeActiveClassFromNodeList(siblings);
}

function hideSiblingsTabPanes (node) {
    const siblings = nodeListToArray(
        node.closest('.tabs__content')
            .getElementsByClassName('tabs__pane'));

    removeActiveClassFromNodeList(siblings);
}

function removeActiveClassFromNodeList(nodeList) {
    nodeList.forEach(function (el) {
        el.classList.remove('active');
    });
}

window.addEventListener("load",
function(event) {
    document.addEventListener('click', hideEffects);

    const tabs = nodeListToArray(document
        .getElementsByClassName('tabs__toggle'));

    tabs.forEach(function (el) {
        el.addEventListener('click', handleTabClick);
    });
});
// Стики хедер
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    const header = document
        .getElementById('header').classList;

    let scrollTop = window.pageYOffset;

    scrollTop > 0
        ? header.add('shadow')
        : header.remove('shadow');

    scrollTop > 50 && scrollTop > lastScrollTop
        ? header.add('hide')
        : header.remove('hide');

    lastScrollTop = window.pageYOffset;
});

window.addEventListener("load",
function(event) {
    // Блокируем активную ссылку меню в хедере
    const headerNavLinksActive = document
        .querySelector('.header__nav .active');
    headerNavLinksActive.addEventListener(
        'click',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
});



window.collapseAllSelects = function() {
    const selects = nodeListToArray(document
        .getElementsByClassName('select'));

    selects.forEach(function (el) {
        const options = el.querySelector('.options');
        el.classList.remove('open');
        options.style.maxHeight = '0';
    });
}

// Открыть/Закрыть модальное окно
function toggleModal(e) {
    e.preventDefault();
    e.stopPropagation();

    const targetId = e.target.dataset.targetId;
    const dialogId = e.target.dataset.dialogShowId;
    const direction = e.target.dataset.direction;

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

    bodyClasses.add('modal-open');
    modalClasses.add('show');

    switch (modalId) {
        case 'modalArticles':
            initialModalArticles();
            break;
        case 'modalPromo':
            initialModalPromo();
            break;
    }

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

    const dialogs = nodeListToArray(document.getElementById(modalId)
        .getElementsByClassName('modal__dialog'));

    if (dialogs.length > 1) {
        setTimeout(function () {
            dialogs.forEach(function (el) {
                el.classList.add('hidden', 'hide');
            });
        }, 500);
    }

    bodyClasses.remove('modal-open');
    modalClasses.remove('show');
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

    const otherDialogs = nodeListToArray(
        modal.getElementsByClassName('modal__dialog'))
        .filter(function (el) { return  el.id !== dialogId; });

    const DURATION = 300; // Get the property in css from .modal-dialog styles.

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

// Изменение размеров контенера для модальных окон со слайдерами
function setModalContainerHeight(container) {
    const activeElHeight = container
        .querySelector('.active')
        .clientHeight;

    container.style.maxHeight = activeElHeight + 'px';
}

function setModalContainerWidth(container) {
    const activeElWidth = container
        .querySelector('.active')
        .clientWidth + 60;

    const modal = container
        .closest('.modal__dialog');

    modal.style.width = activeElWidth + 'px';
}

function getCurrentModalElIdx(arr) {
    let activeIdx;

    arr.find(function (el, idx) {
        if (el.classList.contains('active')) {
            activeIdx = idx;
            el.classList.remove('active');
            return true;
        }
        return false;
    });

    return activeIdx;
}

function getNextModalElIdx(direction, current, count) {
    let newIdx;

    if (direction === 'next') {
        newIdx = current + 1;

        newIdx = newIdx === count
            ? 0 : newIdx;
    } else {
        newIdx = current - 1;
        newIdx = newIdx === -1
            ? count - 1 : newIdx;
    }

    return newIdx;
}

function initialModalArticles() {
    const articlesContainer = document
        .getElementById('modalArticlesContainer');

    setModalContainerHeight(articlesContainer);
}

function toggleModalArticle (e) {
    e.stopPropagation();

    const direction = e.target.dataset.direction;

    const articles = nodeListToArray(document
        .querySelectorAll('#modalArticlesContainer li'));

    const currentActiveIdx = getCurrentModalElIdx(articles);
    const newActiveIdx = getNextModalElIdx(direction, currentActiveIdx, articles.length);

    articles[newActiveIdx].classList.add('active');
    initialModalArticles();
}

function initialModalPromo() {
    const promoContainer = document
        .getElementById('modalPromoContainer');

    setModalContainerHeight(promoContainer);
    setModalContainerWidth(promoContainer);
}

function toggleModalPromo (e) {
    e.stopPropagation();

    const direction = e.target.dataset.direction;

    const promos = nodeListToArray(document
        .querySelectorAll('#modalPromoContainer li'));

    const currentActiveIdx = getCurrentModalElIdx(promos);
    const newActiveIdx = getNextModalElIdx(direction, currentActiveIdx, promos.length);

    promos[newActiveIdx].classList.add('active');
    initialModalPromo();
}

function toggleVisiblePassword(e) {
    const input = e.target.closest('.label_password')
        .querySelector('input');

    input.type = input.type=== 'password'
        ? 'text'
        : 'password';
}

function handlerFormPasswordCreate(e) {
    e.preventDefault();

    const controllers = e.target
        .getElementsByTagName('input');

    if(controllers[0].value === ''
        && controllers[1].value === '') {
        return;
    }

    if (controllers[0].value !== controllers[1].value) {

        controllers[0].closest('.label_password')
            .classList.add('error');

        controllers[1].closest('.label_password')
            .classList.add('error');

        return;
    }


    // Здесь должна быть обработка данных формы!
    console.log('Здесь должна быть обработка данных формы!');
}

function dropSelect(select) {
    const container = select.querySelector('.options');
    const options = select.querySelectorAll('.options span');
    const height = options[0].clientHeight;

    container.style.maxHeight = options.length * height + 'px';
    select.classList.add('open');
}

function toggleSelect(e) {
    const select = e.target.closest('.select');

    select.classList.contains('open')
        ? collapseAllSelects()
        : dropSelect(select)
}

function handleSelectClick(e) {
    const otherOptions = nodeListToArray(e.target
        .closest('.options')
        .getElementsByTagName('span'));

    const value = e.target.innerText;

    const input = e.target.closest('.select')
        .querySelector('input');

    input.value = value;

    otherOptions.forEach(function (el) {
        el.classList.remove('active');
    });

    e.target.classList.add('active');
}

window.addEventListener("load",
function(event) {

    // Открыть/Закрыть модальное окно
    const modalToggles = nodeListToArray(document
        .querySelectorAll("[data-toggle='modal']"));

    modalToggles.forEach(function (el) {
        el.addEventListener('click', toggleModal);
    });

    // Модальное окно с промо статьями
    const modalArticlesControllers = nodeListToArray(document
        .querySelectorAll('#modalArticles .modal__controller'));

    modalArticlesControllers.forEach(function (el) {
        el.addEventListener('click', toggleModalArticle);
    });

    // Модальное окно с другими промо материалами
    const modalPromoControllers = nodeListToArray(document
        .querySelectorAll('#modalPromo .modal__controller'));

    modalPromoControllers.forEach(function (el) {
        el.addEventListener('click', toggleModalPromo);
    });

    // Показываем/скрываем пароль
    const toggleVisiblePass = nodeListToArray(document
        .getElementsByClassName('modal__show-password'));

    toggleVisiblePass.forEach(function (el) {
        el.addEventListener('click', toggleVisiblePassword);
    });

    // Валидация совпадения пароленй на Форме создания пароля
    const formPasswordCreate = document
        .querySelector('#modalPasswordCreate form');

    formPasswordCreate.addEventListener('submit',
        handlerFormPasswordCreate);

    // Кастомные селекты
    const selectInputs = nodeListToArray(document
        .querySelectorAll('.select input'));

    selectInputs.forEach(function (el) {
        el.addEventListener('click', toggleSelect);
    });

    const selects = nodeListToArray(document
        .querySelectorAll('.select .options span'));

    selects.forEach(function (el) {
        el.addEventListener('click', handleSelectClick);
    });
});

