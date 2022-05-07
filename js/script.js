// Получаем координаты элемента в контексте документа
window.getCoords = function (elem) {
    const box = elem.getBoundingClientRect();

    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

// Очищаем все элементы по клику вне его (селекты, модалки, ...)
window.hideEffects = function (e) {
    const _this = e.target;

    // Selects
    const isSelect = _this.closest('.select');
    if (!isSelect) collapseAllSelects();

    // Info popovers
    const isPopOver = _this.closest('.informer');
    if (!isPopOver) resetAllInfos();

    // Card infos
    const isCardInfo = _this.closest('.inform');
    if (!isCardInfo) resetAllCardInfos();

    // Card menu
    const isCardMenu = _this.closest('.dashboard__card-menu');
    if (!isCardMenu) resetAllCardMenu();

    // Card recommendations
    const isCardRecom = _this.closest('.dashboard__card-recommendation');
    if (!isCardRecom) resetAllCardRecom();

    // Filter information container
    const isFilterInfo = _this.closest('.filter-info-wrapper');
    if (!isFilterInfo) resetAllFilterInfo();

    // Selector lists showSelectorList
    const isSelectorList = _this.closest('.selector-list-toggle');

    if (!isSelectorList) {
        resetAllSelectorList();
    }
}

// Переклаывает html коллекцию в массив
window.nodeListToArray = function (nodeList) {
    const arr = [];

    for (let i = 0; i < nodeList.length; i++) {
        arr.push(nodeList[i]);
    }

    return arr;
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
        node.closest('.tabs-list')
            .querySelectorAll('.tabs-item .tabs-toggle'));

    removeActiveClassFromNodeList(siblings);
}

function hideSiblingsTabPanes (node) {
    let siblings = nodeListToArray(node
        .closest('.tabs-content').children);

    removeActiveClassFromNodeList(siblings);
}

function removeActiveClassFromNodeList(nodeList) {
    nodeList.forEach(function (el) {
        el.classList.remove('active');
    });
}

function showInfo(e) {
    const el = e.target;
    const popover = el.querySelector('.informer__body');
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;
    const distances = getDistances(el);
    const isTableChild = el.closest('.table');
    const topOffset = distances.top;
    const leftOffset = isTableChild
        ? distances.left - 60
        : distances.left;

    // Возможные классы для поповера
    // informer_tl, informer_tr,
    // informer_bl, informer_br
    let clazz = 'informer_'

    clazz += isTableChild
        ? 'b'
        : popoverHeight < topOffset
            ? 't' : 'b';

    clazz += popoverWidth < leftOffset
        ? 'l' : 'r'

    el.classList.add('show');

    setTimeout(function () {
        el.classList.add(clazz);
    }, 10);
}

function toggleInfo(e) {
    const isVisible = e.target
        .classList.contains('show');

    resetAllInfos();
    isVisible ? resetAllInfos() : showInfo(e);
}

function resetAllInfos() {
    const nodes = nodeListToArray(document
        .getElementsByClassName('informer'));

    nodes.forEach(function (el) {
        el.classList.remove(
            'show',
            'informer_tl',
            'informer_tr',
            'informer_br',
            'informer_bl'
        );
    });
}

function resetAllCardInfos() {
    const nodes = nodeListToArray(document
        .querySelectorAll('.dashboard__card-data .inform.show'));

    nodes.forEach(function (el) {
        el.classList.remove(
            'show'
        );
    });
}

function resetAllCardMenu() {
    const nodes = nodeListToArray(document
        .querySelectorAll('.dashboard__card-menu ul.show'));

    nodes.forEach(function (el) {
        el.classList.remove(
            'show'
        );
    });
}

function resetAllCardRecom() {
    const nodes = nodeListToArray(document
        .querySelectorAll('.dashboard__card-recommendation.show'));

    nodes.forEach(function (el) {
        el.classList.remove(
            'show'
        );
    });
}

function resetAllSelectorList() {
    const nodes = nodeListToArray(document
        .querySelectorAll('.selector-list-toggle .selectors'));

    nodes.forEach(function (el) {
        el.classList.remove(
            'show'
        );
    });
}

function resetAllFilterInfo() {
    const nodes = nodeListToArray(document
        .querySelectorAll('.filter-info-wrapper .container.show'));

    nodes.forEach(function (el) {
        el.classList.remove(
            'show'
        );
    });
}

// Возвращает объект расстояний от элемента до краёв окна
const getDistances = (el) => {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const elWidth = el.getBoundingClientRect().width;
    const elHeight= el.getBoundingClientRect().height;
    const top = el.getBoundingClientRect().top;
    const left = el.getBoundingClientRect().left;

    return {
        top,
        left,
        bottom: winHeight - top - elHeight,
        right: winWidth - left - elWidth
    }
}

// Показать отдельный tab при инициализации страницы
function showTabPane(tabPaneId) {
    const tabPane = document.getElementById(tabPaneId);

    if (tabPane) {
        const tab = document.querySelector(
            '[data-target-id="' + tabPaneId + '"]');

        hideSiblingTabs(tab);
        hideSiblingsTabPanes(tabPane);

        tab.classList.add('active');
        tabPane.classList.add('active');
    }
}

function checkSwitcher (el) {
    const containerClasses = el.target
        .closest('.switcher')
        .classList;

    const isChecked = el.target.checked;

    isChecked
        ? containerClasses.remove('not-checked')
        : containerClasses.add('not-checked');
}

window.addEventListener("load",
function(event) {
    document.addEventListener('click', hideEffects);

    const tabs = nodeListToArray(document
        .getElementsByClassName('tabs-toggle'));

    tabs.forEach(function (el) {
        el.addEventListener('click', handleTabClick);
    });

    // Показываем информ тултип
    const informers = nodeListToArray(document
        .getElementsByClassName('informer'));

    informers.forEach(function (el) {
        el.addEventListener('click', toggleInfo);
    });

    // Переключаем калссы на контейнера свитчера
    const switchers = nodeListToArray(document
        .querySelectorAll('.switcher input'));

    switchers.forEach(function (el) {
        el.addEventListener('input', checkSwitcher);
    });
})
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
    const scrollbarWidth = getScrollbarWidth();
    const aside = document.getElementById('aside');

    bodyClasses.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
    modalClasses.add('show');
    modal.style.paddingRight = scrollbarWidth + 'px';
    aside.style.marginLeft = '-' + scrollbarWidth/2 + 'px';

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
    const aside = document.getElementById('aside');

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
    document.body.style.removeProperty('padding-right');
    modalClasses.remove('show');
    modal.style.removeProperty('padding-right');
    aside.style.removeProperty('margin-left');
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

const event = new CustomEvent("optionEventClick");

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

    input.dispatchEvent(event);
}

window.addEventListener("load",
function(event) {

    // Открыть/Закрыть модальное окно
    const modalToggles = nodeListToArray(document
        .querySelectorAll("[data-toggle='modal']"));

    modalToggles.forEach(function (el) {
        el.addEventListener('click', toggleModal);
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

    if (formPasswordCreate) {
        formPasswordCreate.addEventListener('submit',
            handlerFormPasswordCreate);
    }

    // // Кастомные селекты
    // const selectInputs = nodeListToArray(document
    //     .querySelectorAll('.select input'));
    //
    // selectInputs.forEach(function (el) {
    //     el.addEventListener('click', toggleSelect);
    // });
    //
    // const selects = nodeListToArray(document
    //     .querySelectorAll('.select .options span'));
    //
    // selects.forEach(function (el) {
    //     el.addEventListener('click', handleSelectClick);
    // });
});

function handleClicOnViewButton(e) {
    const btn = e.target
        .closest('.protection__view');

    clearSiblingsViewBtn(btn);
    btn.classList.add('active');

    const isToList = btn.id === 'showAsList';
    const accountsWrapperClases = btn.closest('.tabs-pane')
        .querySelector('.accounts__wrap')
        .classList;

    isToList
        ? accountsWrapperClases.add('list')
        : accountsWrapperClases.remove('list');
}

function clearSiblingsViewBtn(el) {
    const siblings = nodeListToArray(el
        .closest('.protection__view-btns')
        .children);

    siblings.forEach(function (el) {
        el.classList.remove('active');
    });
}

function toggleFilterInfo(e) {
    const container = e.target
        .closest('.filter-info-wrapper')
        .querySelector('.filter-info');

    container.classList.toggle('show');
}

function showSelectorList(e) {
    let el = e.target;

    if (!el.classList.contains('selector-list-toggle')) {
        el = el.closest('.selector-list-toggle');
    }

    nodeListToArray(document
        .querySelectorAll('.selector-list-toggle .selectors'))
        .forEach(function (el) {
        el.classList.remove('show');
    });

    el.querySelector('.selectors')
        .classList.add('show');
}

// Удалем аакунт из списка аккаунтов
// Принималет либо htmlElement
// либо id удаляемого аккаунта строкой,
// без #, только значение идентификатора
function deleteAccountFromList(account) {
    if (typeof account === 'string') {
        account = document.getElementById(account);
    }
    account.parentNode.removeChild(account);
}

// Удалем слова исключения из списка иключений
function deleteExceptionFromList(el) {
    let node = el.target;

    if (node.classList.contains('close')) {
        node = node.closest('li')
    }

    node.parentNode.removeChild(node);
}

function countSelectedFilterParams(e) {
    const container = e.target.closest('.modal');
    const checks = nodeListToArray(container
        .querySelectorAll('input[type="checkbox"]'));
    const id = container.id;
    const counter = document
        .querySelector('[data-target-id='+id+']')
        .querySelector('.filter-counter');
    let selectedCount;

    selectedCount = checks.filter(function (el) {
        return el.checked;
    });

    if (selectedCount.length > 0) {
        counter.classList.add('show');
        counter.innerText = selectedCount.length;
    } else {
        counter.classList.remove('show');
    }
}

// Открываем/закрываем ячейки табилцы
function handleClickTableControllers(e) {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        const container = e.target.closest('td');
        container.classList.toggle('show');
    }
}

function initialChartProtection (dataArr, labelsArr) {
    const ctx = document.getElementById('chartProtection');

    const chartProtection = new Chart(ctx,
        {
            type: 'line',
            data: {
                labels: labelsArr,
                datasets: dataArr
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: 20
                },
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: false } }
                }
            }
        }
    );
}

function expandChartProtectionArr(arr) {
    let expandedArr = [];

    for (let i = 0; i < arr.length; i++) {
        expandedArr.push({
            data: arr[i].data,
            backgroundColor: [arr[i].color],
            borderColor: [arr[i].color],
            borderWidth: 2
        });
    }

    return expandedArr;

    // const chartFollowers = {
    //     data: [0, 0, 5, 0, 0, 0, 10],
    //     backgroundColor: ['#EB4545'],
    //     borderColor: ['#EB4545'],
    //     borderWidth: 2
    // };
}

window.addEventListener("load",
function(event) {
    const proViewBtns = nodeListToArray(document
        .getElementsByClassName('protection__view'));

    proViewBtns.forEach(function (el) {
        el.addEventListener('click', handleClicOnViewButton);
    });

    const filterToggles = nodeListToArray(document
        .getElementsByClassName('toggle-filter-info'));

    filterToggles.forEach(function (el) {
        el.addEventListener('click', toggleFilterInfo);
    });

    const selectorListToggle = nodeListToArray(document
        .getElementsByClassName('selector-list-toggle'));

    selectorListToggle.forEach(function (el) {
        el.addEventListener('click', showSelectorList);
    });

    const selectorListCloseBtn = nodeListToArray(document
        .getElementsByClassName('close-sorting'));

    selectorListCloseBtn.forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.stopPropagation();
            resetAllSelectorList();
        });
    });

    const deleteAccountFromListBtn = nodeListToArray(document
        .querySelectorAll('.accounts__item .delete'));

    deleteAccountFromListBtn.forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.stopPropagation();

            const item = e.target
                .closest('.accounts__item');

            deleteAccountFromList(item);
        })
    });

    const modalCheckboxes = nodeListToArray(document
        .querySelectorAll(".modal__checks input[type='checkbox']"));

    modalCheckboxes.forEach(function (el) {
        el.addEventListener('input', countSelectedFilterParams);
    });

    const exceptionList = nodeListToArray(document
        .querySelectorAll(".rt-protection__tags-words .tags-list li"));

    exceptionList.forEach(function (el) {
        el.addEventListener('click', deleteExceptionFromList);
    });

    // Открываем/закрываем ячейки табилцы
    const tblCtrs = nodeListToArray(document
        .querySelectorAll(".rt-protection__table .controller"));

    tblCtrs.forEach(function (el) {
        el.addEventListener('click', handleClickTableControllers);
    });

    // const arr = [
    //     { data: [0, 0, 5, 0, 0, 0, 10], color: '#EB4545' },
    //     { data: [0, 0, 17, 6, 0, 0, 0], color: '#FEAB5A' },
    //     { data: [0, 3, 0, 8, 0, 5, 0], color: '#41C79E' },
    //     { data: [0, 0, 0, 0, 3, 0, 0], color: '#45A3EF' },
    // ];

    //['11.02', '12.02', '13.02', '14.02', '15.02', '16.02', '17.02']

    const chartEl = document
        .querySelector('[data-chart-params]');

    if (chartEl) {
        try {
            const chartData = chartEl.dataset.chartParams;
            const arrData = JSON.parse(chartData);
            const chartLabels = chartEl.dataset.chartLabels;
            const arrLabels = JSON.parse(chartLabels);

            initialChartProtection (
                expandChartProtectionArr(arrData),
                arrLabels
            );
        }
        catch (e) {
            console.warn("График не построен. Не корректный формат JSON строки.")
        }
    }
});
/*
 * Создает круговую диаграмму с секторами
 * @param container {DOMElement}
 * @param chartData {Array.<{value: Number, color: String}>}
 * @param config {{strokeWidth: Number, radius: Number, start: String}}
 */
function createPie(container, chartData, config = {}) {
    const svgns = "http://www.w3.org/2000/svg";
    const offsetRatio = {
        top: 0.25,
        right: 0,
        left: 0.5,
        bottom: -0.25,
    }

    const strokeWidth = config.strokeWidth || 5;
    const radiusValue = config.radius || 100;
    const radius = radiusValue - strokeWidth / 2;
    const fullSize = 2 * radiusValue;

    // длина окружности
    const length = 2 * Math.PI * radius;

    // смещение начальной точки
    let startPoint = config.start in offsetRatio ? config.start : 'top';
    const chartOffset = length * offsetRatio[startPoint];

    // расчетные данные для построения секторов
    const sectors = [];
    chartData.forEach((sectorData, sectorIndex) => {
        // Длина сектора
        const width = length * sectorData.value / 100;
        // Смещение сектора от начальной точки
        let offset = chartOffset;

        if (sectorIndex > 0) {
            let prevSector = sectors[sectorIndex - 1];
            offset = prevSector.offset - prevSector.width;
        }

        sectors.push({
            ...sectorData,
            width,
            offset,
        })
    });

    const svg = createSvgElement('svg', {
        'viewBox': `0 0 ${fullSize} ${fullSize}`,
        'fill': 'none',
        'width': fullSize,
        'height': fullSize,
    });

    sectors.forEach(sector => {
        const circle = createSvgElement('circle', {
            cx: radius + strokeWidth / 2,
            cy: radius + strokeWidth / 2,
            r: radius,
            'stroke-dasharray': `${sector.width} ${length - sector.width}`,
            'stroke-dashoffset': sector.offset,
            'stroke': sector.color,
            'stroke-width': strokeWidth
        })

        svg.appendChild(circle);
    })

    container.appendChild(svg);

    function createSvgElement(elementName, attrs = {}) {
        const el = document.createElementNS(svgns, elementName);
        Object.entries(attrs).forEach(([attrName, attrValue]) => {
            el.setAttributeNS(null, attrName, attrValue)
        });
        return el;
    }
}

const STROKE_WIDTH = 100;
const RADIUS = 200;
const START = 'top'; // top|left|right|bottom
const PIE_CHART_CONFIG = {
    strokeWidth: STROKE_WIDTH,
    radius: RADIUS,
    start: START,
};

function initialPieCharts(el) {
    let pieArr;
    let pieData = [];

    try {
        pieArr = JSON.parse(el.dataset.pieChart);

        for (let i = 0; i < pieArr.length; i++) {
            pieData.push({
                value: pieArr[i][0],
                color: pieArr[i][1]
            });
        }
    } catch (e) {
        console.error('Не корректный форма JSON данных для построения груговой диаграммы.');
    }

    if (pieData.length > 0) {
        // Заменяем значения на проценты
        pieData = updateValueToPercent(pieData, getSum(pieData));

        // Строим круговую диаграмму
        createPie(el, pieData, PIE_CHART_CONFIG);
    }

    function getSum(arr) {
        let store = 0;

        for (let i = 0; i < arr.length; i++) {
            store += parseInt(arr[i].value);
        }
        return store;
    }

    function updateValueToPercent(arr, total) {
        let newArr = [];

        for (let i = 0; i < arr.length ; i++) {
            const value = parseInt(arr[i].value) / total * 100;
            const color = arr[i].color;
            newArr.push({ value, color });
        }

        return newArr;
    }
}

window.addEventListener("load",
    function(event) {

    // Инициализируем все круговые диаграммы
    const pieCharts = nodeListToArray(document
        .getElementsByClassName('pie-chart'));

    pieCharts.forEach(initialPieCharts);
})

function handlerMenuTogglesClick(e) {
    const parent = e.target.closest('.dashboard__card-menu');
    const list = parent.querySelector('ul');

    list.classList.toggle('show');
}

function handlerAvatarTogglesClick(e) {
    const container = e.target
        .closest('.dashboard__card-recommendation');

    container.classList.toggle('show');
}

function handlerInformTogglesClick(e) {
    const classes = e.target.classList;
    const isShown = classes.contains('show');
    const inform = e.target.closest('.inform');
    const isInformShow = inform.classList.contains('show');

    if (isShown || isInformShow) {
        classes.remove('show');
        inform.classList.remove('show');
    } else {
        clearAllInfos();
        classes.add('show');
    }
}

function clearAllInfos() {
    const nodes = nodeListToArray(document
        .querySelectorAll('.dashboard__card-data .inform'));

    nodes.forEach(function (el) {
        el.classList.remove(
            'show'
        );
    });
}

window.addEventListener("load",
    function(event) {
    const cardMenuToggles = nodeListToArray(document
        .querySelectorAll('.dashboard__card-menu button'));

    cardMenuToggles.forEach(function (el) {
        el.addEventListener('click', handlerMenuTogglesClick);
    });

    const cardAvatarToggles = nodeListToArray(document
        .querySelectorAll('.dashboard__card-recommendation button'));

        cardAvatarToggles.forEach(function (el) {
        el.addEventListener('click', handlerAvatarTogglesClick);
    });

    const cardInformToggles = nodeListToArray(document
        .querySelectorAll('.dashboard__card-data .inform'));

        cardInformToggles.forEach(function (el) {
        el.addEventListener('click', handlerInformTogglesClick);
    });


})
function scrollToManageArticle (e) {
    e.preventDefault();
    const w = window.pageYOffset;
    const hash = this.href.replace(/[^#]*(.*)/, '$1');
    const top = document.querySelector(hash).getBoundingClientRect().top;
    const speed = 0.3;
    let start = null;

    requestAnimationFrame(step);

    function step(time) {
        if (start === null) start = time;

        const progress = time - start;
        const r = (top < 0
            ? Math.max(w - progress/speed, w + top)
            : Math.min(w + progress/speed, w + top));

        window.scrollTo(0,r);

        if (r != w + top) {
            requestAnimationFrame(step)
        }
    }
}

window.addEventListener("load",
    function(event) {
        const manageLinks = nodeListToArray(document
            .querySelectorAll('[href^="#"]'));

        manageLinks.forEach(function (el) {
            el.addEventListener('click', scrollToManageArticle);
        });
    })
