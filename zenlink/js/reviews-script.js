// Очищаем все элементы по клику вне его (селекты, модалки, ...)
window.hideEffects = function (e) {
    const _this = e.target;

    // Selects
    const isSelect = _this.closest('.custom-select');
    if (!isSelect) collapseAllSelects();
}

window.collapseAllSelects = function () {
    const selects = nodeListToArray(document
        .querySelectorAll('.custom-select'));
    selects.forEach(function (el) {
        el.classList.remove('selected');
    });
}

// Переклаывает html коллекцию в массив
window.nodeListToArray = function (nodeList) {
    const arr = [];

    for (let i = 0; i < nodeList.length; i++) {
        arr.push(nodeList[i]);
    }

    return arr;
}

// Получаем координаты относительно документа
window.getCoords = function (elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

// Показываем анимируемые элементы, когда доскролили до них
window.showAnimationLoadingElements = function () {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const windowScrollTop = scrollTop + windowHeight;

    const animationElms = nodeListToArray(document
        .getElementsByClassName('animatedLoading'));

    animationElms.forEach(function (el) {
        const elScrollTop = getCoords(el).top;

        if (windowScrollTop > elScrollTop) {
            el.classList
                .remove('animatedLoading')
        }
    });
};
showAnimationLoadingElements();

window.addEventListener("load",
function(event) {
    document.addEventListener('click', hideEffects);

    window.addEventListener('scroll',
        showAnimationLoadingElements);
});

function showCasesTabs () {
    const container = this
        .closest('.cases__tabs');
    container.classList.add('show');
}

function switchCases () {
    const container = this.closest('.cases__tabs');
    const button = container.querySelector('span');
    const targetId = this.dataset.targetId;
    const target = document.getElementById(targetId);

    resetCasesTabs();
    this.classList.add('active');

    resetCasesTargets();
    target.classList.add('active');

    button.innerText = this.innerText;
    container.classList.remove('show');
}

function resetCasesTabs () {
    const tabs = nodeListToArray(document
        .querySelectorAll('.cases__tabs li'));

    tabs.forEach(function (el) {
        el.classList.remove('active');
    });
}

function resetCasesTargets () {
    const targets = nodeListToArray(document
        .querySelectorAll('.cases__content'));

    targets.forEach(function (el) {
        el.classList.remove('active');
    });
}

window.addEventListener("load",
function(event) {

    // Показываем табы кейсов
    const casesButton = document
        .querySelector('.cases__tabs span');
    if (casesButton) {
        casesButton.addEventListener('click', showCasesTabs);
    }

    // Переключаем табы кейсов
    const casesTabs = nodeListToArray(document
        .querySelectorAll('.cases__tabs li'));
    casesTabs.forEach(function (el) {
        el.addEventListener('click', switchCases);
    });

    new Swiper('.swiper_cases', {
        loop: true,
        slidesPerView: 1,
        speed: 300,
        preloadImages: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        autoHeight: false,

        navigation: {
            prevEl: '.swiper-controller-cases_prev',
            nextEl: '.swiper-controller-cases_next',
        },
    });
});

function toggleFaq () {
    const target = this.closest('.faq__item');
    target.classList.toggle('show');
}

window.addEventListener("load",
function(event) {
    // Переключаем факи
    const faqСaptions = nodeListToArray(document
        .getElementsByClassName('faq__caption'));
    faqСaptions.forEach(function (el) {
        el.addEventListener('click', toggleFaq);
    });
});

window.addEventListener("load",
function(event) {
    new Swiper('.swiper_feedback', {
        loop: true,
        slidesPerView: 1,
        speed: 300,
        preloadImages: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        autoHeight: false,

        pagination: {
            el: '.feedback__swiper-pagination',
            clickable: true,
        },

        breakpoints: {
            768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: -60
            },
            1024: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 0
            },
            1311: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 0
            }
        },
    });
});
window.RATES = {
    10: {
        1: {
            oldPrice: '4 030',
            salePrice: '3 829'
        },
        2: {
            oldPrice: '8 060',
            salePrice: '7 576'
        },
        3: {
            oldPrice: '12 090',
            salePrice: '11 244'
        }
    },
    20: {
        1: {
            oldPrice: '7 760',
            salePrice: '7 217'
        },
        2: {
            oldPrice: '15 520',
            salePrice: '14 278'
        },
        3: {
            oldPrice: '23 280',
            salePrice: '21 185'
        }
    },
    30: {
        1: {
            oldPrice: '11 190',
            salePrice: '10 183'
        },
        2: {
            oldPrice: '22 380',
            salePrice: '20 142'
        },
        3: {
            oldPrice: '33 570',
            salePrice: '29 877'
        }
    },
    40: {
        1: {
            oldPrice: '14 320',
            salePrice: '12 745'
        },
        2: {
            oldPrice: '28 640',
            salePrice: '25 203'
        },
        3: {
            oldPrice: '42 960',
            salePrice: '37 375'
        }
    },
    50: {
        1: {
            oldPrice: '17 150',
            salePrice: '14 921'
        },
        2: {
            oldPrice: '34 300',
            salePrice: '29 498'
        },
        3: {
            oldPrice: '51 450',
            salePrice: '43 733'
        }
    }
};

function toggleSelect () {
    const container = this.closest('.custom-select');
    const isClosed = !container.classList.contains('selected');

    collapseAllSelects();
    if (isClosed) {
        container.classList.toggle('selected');
    }
}

function setSelectedValue () {
    const input = this
        .closest('.custom-select')
        .querySelector('input');
    const value = this.dataset.value;

    collapseAllSelects();
    resetSelectedOptions(this);
    this.classList.add('active');
    input.value = value;
    setRates();
}

function resetSelectedOptions (option) {
    const options = nodeListToArray(option
        .closest('.custom-select')
        .querySelectorAll('li'));

    options.forEach(function (el) {
        el.classList.remove('active');
    });
}

function setRates () {
    const count = document
        .querySelector('#reviewsCount input')
        .value;
    const duration = document
        .querySelector('#reviewsDuration input')
        .value;

    if (count && duration) {
        const oldPrice = RATES[count][duration].oldPrice;
        const salePrice = RATES[count][duration].salePrice;
        const currentPrice = document.getElementById('currentPrice');
        const specialPrice = document.getElementById('specialPrice');

        currentPrice.innerText = oldPrice + ' Р';
        specialPrice.innerText = salePrice + ' Р';
    }
}

window.addEventListener("load",
function(event) {
    // Открываем/закрываем селекты
    const selects = nodeListToArray(document
        .querySelectorAll('.custom-select .input'));
    selects.forEach(function (el) {
        el.addEventListener('click', toggleSelect);
    });

    //Активируем выбранный селект
    const options = nodeListToArray(document
        .querySelectorAll('.custom-select li'));
    options.forEach(function (el) {
        el.addEventListener('click', setSelectedValue);
    });
});