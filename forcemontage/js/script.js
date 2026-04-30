// Блокируем зум экрана на IOS
document.addEventListener(
    'touchmove',
    function(event) {
        event = event.originalEvent || event;

        if (event.scale !== 1) {
            event.preventDefault();
        }
    },
    false
);

window.IS_DEBUGGING = true;

window.showLoader = () => {
    $('#loader').css('display', 'flex');

    setTimeout(
        () => $('#loader').addClass('show'),
        10
    );
};

window.hideLoader = () => {
    $('#loader').removeClass('show');

    setTimeout(
        () => $('#loader').css('display', 'none'),
        500
    );
};

window.getScrollWidth = () => {
    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.append(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;

    div.remove();

    return scrollWidth;
};

window.fixScrollModalOpen = () => {
    $('body')
        .addClass('modal-open')
        .css('padding-right', getScrollWidth() + 'px');

    $('#header')
        .css('padding-right', getScrollWidth() + 'px');
};

window.fixScrollModalClose = () =>  {
    $('body')
        .removeClass('modal-open')
        .css('padding-right', '0');

    $('#header')
        .css('padding-right', '0');
};

const showAnimationElements = () => {
    const scrollTop = window.pageYOffset,
        windowHeight = $(window).height(),
        windowScrollTop = scrollTop + windowHeight,
        animationElms = $('.animation');

    animationElms.each((idx, el) => {
        const elScrollTop = $(el).offset().top;

        if (windowScrollTop > elScrollTop) {
            $(el).removeClass('animation');
        }
    });
},

showFooterElements = () => {
    const bodyHeight = $('body').height(),
        scrollTop = window.pageYOffset,
        windowHeight = $(window).height(),
        windowScrollTop = scrollTop + windowHeight;

    if (windowScrollTop >= bodyHeight - 100) {
        $('.footer__copy').removeClass('animation');
    }
};

$(document).ready(() => {
    $(window).scroll(() => {
        // Показываем анимируемые элементы,
        // когда скролл доходит до него
        showAnimationElements();

        // Показываем скрывтые элементы
        // футера, когда проскролили
        // всю страницу,
        // showFooterElements();
    });
});
$(document).ready(() => {

    // // Слайдер с отзыывами
    // new Swiper('.swiper_feedback', {
    //     slidesPerView: 1,
    //     speed: 300,
    //     preloadImages: true,
    //     observer: true,
    //     observeParents: true,
    //     observeSlideChildren: true,
    //     autoHeight: false,
    //     pagination: {
    //         el: '.swiper-pagination-feedback',
    //         clickable: true,
    //         dynamicBullets: true,
    //     },
    //     breakpoints: {
    //         768: {
    //             centeredSlides: true,
    //             initialSlide: 1,
    //             slidesPerView: 3,
    //         }
    //     }
    // });
    //
    // // Слайдер с результатами
    // window.resultsSlider = undefined;
    //
    // const initResultSlider = () => {
    //     window.resultsSlider = new Swiper('.swiper_results', {
    //         slidesPerView: 1,
    //         speed: 300,
    //         preloadImages: true,
    //         observer: true,
    //         observeParents: true,
    //         observeSlideChildren: true,
    //         autoHeight: true,
    //         pagination: {
    //             el: '.swiper-pagination-results',
    //             clickable: true,
    //             dynamicBullets: true,
    //         },
    //         breakpoints: {
    //             768: {
    //                 spaceBetween: 20,
    //                 slidesPerView: 2,
    //             },
    //         }
    //     });
    // };
    //
    // const destroyResultsSlider = () => {
    //     if (resultsSlider !== undefined) {
    //         resultsSlider.length
    //             ? resultsSlider.forEach(slider => slider.destroy())
    //             : resultsSlider.destroy();
    //     }
    // };
    //
    // const checkResultsSlider = () => {
    //     const windowWidth = $(window).width(),
    //         breakPointXL = 1140;
    //
    //     if (windowWidth > breakPointXL) {
    //         destroyResultsSlider();
    //         window.resultsSlider = undefined;
    //     } else {
    //         if (window.resultsSlider === undefined) {
    //             initResultSlider();
    //         }
    //     }
    // };
    //
    // // Чекаем слайдер при первой загрузке
    // checkResultsSlider();
    //
    // $(window).resize(checkResultsSlider);
    //
    //
    // // Для десктопов при клике на Загрузить
    // // ещё, показываем оставшиеся слайды
    // $('#showMoreResultsItems').on(
    //     'click',
    //     e => {
    //         const arrInvisibleItems = getInvisibleItems();
    //
    //         for (let i = 0; i < 3; i++) {
    //             const item = $(arrInvisibleItems[i]);
    //
    //             item.show().addClass('hide');
    //
    //             setTimeout(() => item.removeClass('hide'), i * 300);
    //         }
    //
    //         checkShowMoreResultsBtn();
    //     }
    // );
    //
    // const getInvisibleItems = () => {
    //     const arrItems = $('#resultSliderList .swiper-slide').toArray();
    //
    //     return arrItems.filter(item => {
    //         return $(item).css('display') === 'none';
    //     });
    // };
    //
    // window.checkShowMoreResultsBtn = () => {
    //     if (getInvisibleItems().length === 0) {
    //         $('#showMoreResultsItems').hide();
    //     }
    // };
});
const validatePhone = (phone) => {
    let regular = /^(\+7)?(\d{3}?)?[\d]{11}$/;
    return regular.test(phone);
};

const validateEmail = (email) => {
    // Регулярка для email проверяет только наличие @ и точки
    let regular = /.+@.+\..+/i;
    return regular.test(email);
};

$(document).ready(() => {

    let phoneMask;

    const checkForm = (form) => {
        const submitBtn = $(form).find('[type="submit"]'),
            isPhoneValid = validatePhone(phoneMask.unmaskedValue);

        isPhoneValid
            ? submitBtn.prop({disabled: false})
            : submitBtn.prop({disabled: true});
    },

    // ******************** Обработка телефонного номера -- START

    elPhone = document.getElementById('phone'),

    // Маска для телефона
    phoneMaskOptions = {
        mask: '+{7} ({9}00) 000-00-00',
        lazy: true,
        placeholderChar: '_'
    },

    initialPhoneMasks = () => {
        phoneMask = IMask(elPhone, phoneMaskOptions)
    },

    handlerPhoneFocus = () => {
        phoneMask.updateOptions({ lazy: false });
    },

    handlerPhoneBlur = () => {
        phoneMask.updateOptions({ lazy: true });

        if (!validatePhone(phoneMask.unmaskedValue)) {
            phoneMask.unmaskedValue = '';
        }
    },

    handlerPhoneInput = evt => {
        const form = $(evt.target).closest('form')[0];
        checkForm(form);
    };

    $('[type="tel"]')
        .each(initialPhoneMasks)
        .on('focus', handlerPhoneFocus)
        .on('blur', handlerPhoneBlur)
        .on('input', handlerPhoneInput);

    // ******************** Обработка телефонного номера -- FINISH

    // ******************** Обработка емэйла -- START

    handlerEmailBlur = evt => {
        if (!validateEmail(evt.target.value)) {
            evt.target.value = '';
        }
    };

    $('[type="email"]').on('blur', handlerEmailBlur);

    // ******************** Обработка емэйла -- FINISH
});
$(document).ready(() => {
    $('[data-toggle="modal"]').click(e => {
        e.stopPropagation();
        showModal(e.target);
    });

    const showYoutubeIframe = el => {
        hideLoader();

        setTimeout(
            () => $(el)
                .closest('.modal__dialog')
                .removeClass('modal__dialog_hide'),
            500
        );
    }

    window.showModal = function (el) {
        let modal = $(el).data('target');

        if (!modal) {
            modal = $(el)
                .closest('[data-toggle="modal"]')
                .data('target');
        }

        $(modal).addClass('show');
        fixScrollModalOpen();

        const video = $(modal).find('video')[0];
        if (video) video.play();

        const iframe = $(modal).find('iframe')[0];
        if (iframe) {

            setTimeout(showLoader, 100);

            let src = $(el).data('youtubeSrc');

            if (!src) {
                src = $(el)
                    .closest('[data-toggle="modal"]')
                    .data('youtubeSrc');
            }
            iframe.src = src;

            iframe.onload = () => showYoutubeIframe(iframe);
        }
    };

    $('.modal').click(e => {
       if (isActionNode(e.target)) {
           hideModal(e.target);
       }
    });

    const hideModal = function (el) {
        let modal = $(el).closest('.modal'),
            video = $(modal).find('video')[0],
            iframe = $(modal).find('iframe')[0],
            dialogs = $(modal).find('.modal__dialog');

        if (video) {
            video.pause();
            video.currentTime = 0;
        }

        if (iframe) {
            iframe.src = '';

            setTimeout(
                () => $(dialogs).addClass('modal__dialog_hide'),
                1000
            )
        }

        modal.removeClass('show');
        fixScrollModalClose();

        // Если в модальном окне несколько диалоговых окно,
        // оставляем видимым только первое
        if (dialogs.length > 1) {

            setTimeout(e => {
                $(dialogs[0])
                    .removeClass('modal__dialog_hide hidden');

                dialogs
                    .filter(idx => idx > 0)
                    .addClass('modal__dialog_hide hidden');
            }, 500);
        }
    };

    const isActionNode = function (el) {
        return $(el).hasClass('modal') || $(el).hasClass('modalCloseBtn');
    };
});
$(document).ready(() => {
    const toggleNav = () => {
        $('#nav').toggleClass('hide');
    };

    $('.navToggler').on(
        'click',
        toggleNav
    );
});
$(document).ready(function () {
    let lastScrollTop = 0;

    $(window).scroll(() => {
        let scrollTop = $(window).scrollTop();

        scrollTop > 100 && scrollTop > lastScrollTop
            ? $('#header').addClass('hide')
            : $('#header').removeClass('hide');

        lastScrollTop = $(window).scrollTop();
    });
});

$(document).ready(() => {
    const firstScreenVideoLoaded = () => {
        setTimeout(
            () => $('#firstScreen').addClass('loaded'),
            500
        );
    };

    const video = $('#firstScreen video')[0],
        source = $(video).find('source')[0],
        src = video.dataset.startSrc;

    video.src = src;
    source.src = src;

    video.load(firstScreenVideoLoaded());
});
$(document).ready(() => {
    const  formSubmitHandler = evt => {
        evt.preventDefault();

        const form = evt.target,
            isPolicyChecked = $(form).find('[name="policy"]').prop('checked'),
            checker = $(form).find('.checker');

        if (isPolicyChecked) {
            showLoader();

            const request = $.ajax({
                method: 'post',
                url: 'https://quiz24.ru/portfolio/forcemontage/forms-handler.php',
                data: $(form).serialize(),
                dataType: 'json'
            });

            request.done(response => {
                if (IS_DEBUGGING) console.log(response);

                hideLoader();

                if (response.error) {
                    setTimeout(
                        () => showModal($(form).find('[type="submit"]')[0]),
                        300
                    );

                } else {
                    console.log('Ошибка отправки сообщения в обработчике формы!')
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                hideLoader();
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        } else {
            $(checker).addClass('checker_error');
        }
    };

    $('form').on('submit', formSubmitHandler);

    $('[name="policy"]').on(
        'input',
        evt => $(evt.target)
            .next('.checker')
            .removeClass('checker_error')
    );
});
const togglePosVisibleGoToNextPageBtn = direction => {
    direction
        ? $('#goToNextPageBtn').addClass('pos-relative')
        : $('#goToNextPageBtn').removeClass('pos-relative');

},

toggleStickyGoToNextPageBtn = direction => {
    const show = () => {
            $('#goToNextPageBtn')
                .addClass('sticky show');
        };

    const hide = () => {
        if ($('#goToNextPageBtn').hasClass('show')) {
            $('#goToNextPageBtn').removeClass('show');

            setTimeout(
                () => $('#goToNextPageBtn')
                    .removeClass('sticky'),
                500);
        }
    };

    direction ? show() : hide();
},

checkPosVisibleGoToNextPageBtn = () => {
    const scrollTop = $(window).scrollTop(),

        placeOffset = $('#nextPageBtnRelativePlace')
            .offset().top,

        showPlace = $(window).height() - 100,

        placeTop = placeOffset - scrollTop;

    placeTop < showPlace
        ? togglePosVisibleGoToNextPageBtn(true)
        : togglePosVisibleGoToNextPageBtn(false);
},

checkStickyGoToNextPageBtn = () => {
    const scrollTop = $(window).scrollTop(),

        placeOffset = $('#nextPageBtnShowPlace')
            .offset().top,

        showPlace = $(window).height(),

        placeTop = placeOffset - scrollTop;

    placeTop < showPlace
        ? toggleStickyGoToNextPageBtn(true)
        : toggleStickyGoToNextPageBtn(false);
};

$(document).ready(() => {
    $(window).scroll(() => {
        checkPosVisibleGoToNextPageBtn();
        checkStickyGoToNextPageBtn();
    });
});

$(document).ready(() => {

    const toggleStageCardText = evt => {
        $(evt.target)
            .closest('.stages__card')
            .toggleClass('open');
    },

    showStageCard = () => {

        const scrollTop = window.pageYOffset,
            windowHeight = $(window).height(),
            windowScrollTop = scrollTop + windowHeight,
            stageCards = $('.stages__card.hide');


        if (stageCards.length > 0) {
            stageCards.each((idx, el) => {
                const elScrollTop = $(el).offset().top;

                if (windowScrollTop > elScrollTop) {
                    const arrHeight = $(el).data('arr-height');
                    $(el).removeClass('hide');
                    $('#stagesArr').css('height', arrHeight);
                }
            });
        }
    };

    $('.stages__card').on(
        'click',
        toggleStageCardText
    );

    $(window).scroll(() => {
        // Показываем анимируемые карточки,
        // этапов работ над проектом
        showStageCard();
    });
});
const scrollToPlace = e => {
    e.preventDefault();

    const delta = $(window).width() > 768 ? 100 : 50;

    const _this = e.target,
        targetId = $(_this).attr('href'),
        top = $(targetId).offset().top - delta;

    $('body,html').animate(
    { scrollTop: top },
    1000
    );
};

$(document).ready(() => {
    $('.anchors__link').on(
        'click',
        scrollToPlace
    );
});

const toggleFoolScreenDescs = (wrap) => {
    const active = $(wrap)
        .find('.team__element')
        .filter('.active'),

        hidden = $(wrap)
            .find('.team__element')
            .not('.active');

        active.removeClass('active');
        hidden.addClass('active');
},

toggleMobScreenDescs = (wrap) => {
    const items = $(wrap)
        .find('.team__text-list li'),

        activeIdx = $(wrap)
            .find('.team__text-list li.active')
            .index();

    if (activeIdx === -1) {
        startActiveItem(wrap);
        return;
    }

    if (activeIdx === items.length - 1) {
        resetActiveItem(wrap);
        return;
    }

    plusActiveItem(wrap);
},

startActiveItem = (wrap) => {
    const card = $(wrap).find('.team__card'),
        item = $(wrap).find('.team__text-list li')[0];

    card.addClass('open');
    $(item).addClass('active');
},

resetActiveItem = (wrap) => {
    const card = $(wrap).find('.team__card'),
        itemActive = $(wrap).find('.team__text-list .active');

    card.removeClass('open');
    itemActive.removeClass('active');
},

plusActiveItem = (wrap) => {
    const items = $(wrap).find('.team__text-list li'),
        itemActiveIdx = items.filter('.active').index();

    $(items[itemActiveIdx]).removeClass('active');
    $(items[itemActiveIdx + 1]).addClass('active');
},

toggleDesc = evt => {
    const _this = $(evt.target),
        wrap = _this.closest('.team'),
        arrow = wrap.find('button');

    arrow.toggleClass('rotated');

    $(window).width() < 1200
        ? toggleMobScreenDescs(wrap)
        : toggleFoolScreenDescs(wrap);
},

showTeamGallery = (evt) => {
    evt.stopPropagation();

    const _this = evt.target;

    let galleryId = $(_this).data('gallery-id');

    if (!galleryId) {
        galleryId = $(_this).closest('[data-gallery-id]').data('gallery-id')
    }

    $(galleryId).find('a:first-child img').click();
};

$(document).ready(() => {
    $('.team__item')
        .toArray()
        .forEach(
            el => $(el).click(toggleDesc)
        );

    // Показываем галерея одного из членов команды
    $('.team__pics')
        .toArray()
        .forEach(
            el => $(el).click(showTeamGallery)
        );
});

Fancybox.bind('[data-fancybox="gallery-design"]', {
    Thumbs: false,
    Toolbar: false,
    Image: {
        wheel: false, // Disable zoom on scroll event
        click: false, // Disable zoom on image click
    }
});

Fancybox.bind('[data-fancybox="gallery-equipment"]', {
    Thumbs: false,
    Toolbar: false,
    Image: {
        wheel: false, // Disable zoom on scroll event
        click: false, // Disable zoom on image click
    }
});

Fancybox.bind('[data-fancybox="gallery-realization"]', {
    Thumbs: false,
    Toolbar: false,
    Image: {
        wheel: false, // Disable zoom on scroll event
        click: false, // Disable zoom on image click
    }
});

const animationLine = $('#line'),
    animationPointsCount = $('.animation-line-point').length,
    animationLineDelimiter = 100 / animationPointsCount,

showAnimationLine = () => {
    const scrollTop = window.pageYOffset,
        windowHeight = $(window).height(),
        windowScrollTop = scrollTop + windowHeight,
        point = $('.animation-line-point');

    point.each((idx, el) => {
        const elScrollTop = $(el).offset().top,
            elIdx = $(el).index();

        if (windowScrollTop > elScrollTop) {
            $(el).removeClass('animation-line-point');
            animationLine.css('height', animationLineDelimiter * elIdx + '%');
        }
    });
};

$(document).ready(() => {
    $(window).scroll(() => {
        // Показываем анимированную линию по мере
        // продвижения пользователя по экрану
        showAnimationLine();
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzbGlkZXJzLmpzIiwibWFza3MuanMiLCJtb2RhbHMuanMiLCJuYXYuanMiLCJoZWFkZXIuanMiLCJmb290ZXIuanMiLCJjb21wb25lbnRzL2ZpcnN0LXNjcmVlbi9maXJzdC1zY3JlZW4uanMiLCJjb21wb25lbnRzL2Zvcm0vZm9ybS5qcyIsImNvbXBvbmVudHMvbmV4dC1wYWdlLWJ1dHRvbi9uZXh0LXBhZ2UtYnV0dG9uLmpzIiwiY29tcG9uZW50cy9wcm9qZWN0cy9wcm9qZWN0cy5qcyIsImtvbWFuZGEvc3RhZ2VzL3N0YWdlcy5qcyIsImluZGV4L2FuY2hvcnMvYW5jaG9ycy5qcyIsImluZGV4L2F0dGFpbm1lbnQvYXR0YWlubWVudC5qcyIsImluZGV4L3RlYW0vdGVhbS5qcyIsImluZGV4L3ZpZGVvL3ZpZGVvLmpzIiwib3R6eXZ5LW8tbmFzL3Jldmlld3MvcmV2aWV3cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUhBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8g0JHQu9C+0LrQuNGA0YPQtdC8INC30YPQvCDRjdC60YDQsNC90LAg0L3QsCBJT1NcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICd0b3VjaG1vdmUnLFxyXG4gICAgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgfHwgZXZlbnQ7XHJcblxyXG4gICAgICAgIGlmIChldmVudC5zY2FsZSAhPT0gMSkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBmYWxzZVxyXG4pO1xyXG5cclxud2luZG93LklTX0RFQlVHR0lORyA9IHRydWU7XHJcblxyXG53aW5kb3cuc2hvd0xvYWRlciA9ICgpID0+IHtcclxuICAgICQoJyNsb2FkZXInKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgKCkgPT4gJCgnI2xvYWRlcicpLmFkZENsYXNzKCdzaG93JyksXHJcbiAgICAgICAgMTBcclxuICAgICk7XHJcbn07XHJcblxyXG53aW5kb3cuaGlkZUxvYWRlciA9ICgpID0+IHtcclxuICAgICQoJyNsb2FkZXInKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgKCkgPT4gJCgnI2xvYWRlcicpLmNzcygnZGlzcGxheScsICdub25lJyksXHJcbiAgICAgICAgNTAwXHJcbiAgICApO1xyXG59O1xyXG5cclxud2luZG93LmdldFNjcm9sbFdpZHRoID0gKCkgPT4ge1xyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuICAgIGRpdi5zdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJztcclxuICAgIGRpdi5zdHlsZS53aWR0aCA9ICc1MHB4JztcclxuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSAnNTBweCc7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGl2KTtcclxuICAgIGxldCBzY3JvbGxXaWR0aCA9IGRpdi5vZmZzZXRXaWR0aCAtIGRpdi5jbGllbnRXaWR0aDtcclxuXHJcbiAgICBkaXYucmVtb3ZlKCk7XHJcblxyXG4gICAgcmV0dXJuIHNjcm9sbFdpZHRoO1xyXG59O1xyXG5cclxud2luZG93LmZpeFNjcm9sbE1vZGFsT3BlbiA9ICgpID0+IHtcclxuICAgICQoJ2JvZHknKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgLmNzcygncGFkZGluZy1yaWdodCcsIGdldFNjcm9sbFdpZHRoKCkgKyAncHgnKTtcclxuXHJcbiAgICAkKCcjaGVhZGVyJylcclxuICAgICAgICAuY3NzKCdwYWRkaW5nLXJpZ2h0JywgZ2V0U2Nyb2xsV2lkdGgoKSArICdweCcpO1xyXG59O1xyXG5cclxud2luZG93LmZpeFNjcm9sbE1vZGFsQ2xvc2UgPSAoKSA9PiAge1xyXG4gICAgJCgnYm9keScpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJylcclxuICAgICAgICAuY3NzKCdwYWRkaW5nLXJpZ2h0JywgJzAnKTtcclxuXHJcbiAgICAkKCcjaGVhZGVyJylcclxuICAgICAgICAuY3NzKCdwYWRkaW5nLXJpZ2h0JywgJzAnKTtcclxufTtcclxuXHJcbmNvbnN0IHNob3dBbmltYXRpb25FbGVtZW50cyA9ICgpID0+IHtcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCxcclxuICAgICAgICB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCksXHJcbiAgICAgICAgd2luZG93U2Nyb2xsVG9wID0gc2Nyb2xsVG9wICsgd2luZG93SGVpZ2h0LFxyXG4gICAgICAgIGFuaW1hdGlvbkVsbXMgPSAkKCcuYW5pbWF0aW9uJyk7XHJcblxyXG4gICAgYW5pbWF0aW9uRWxtcy5lYWNoKChpZHgsIGVsKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZWxTY3JvbGxUb3AgPSAkKGVsKS5vZmZzZXQoKS50b3A7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3dTY3JvbGxUb3AgPiBlbFNjcm9sbFRvcCkge1xyXG4gICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnYW5pbWF0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0sXHJcblxyXG5zaG93Rm9vdGVyRWxlbWVudHMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpLFxyXG4gICAgICAgIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCxcclxuICAgICAgICB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCksXHJcbiAgICAgICAgd2luZG93U2Nyb2xsVG9wID0gc2Nyb2xsVG9wICsgd2luZG93SGVpZ2h0O1xyXG5cclxuICAgIGlmICh3aW5kb3dTY3JvbGxUb3AgPj0gYm9keUhlaWdodCAtIDEwMCkge1xyXG4gICAgICAgICQoJy5mb290ZXJfX2NvcHknKS5yZW1vdmVDbGFzcygnYW5pbWF0aW9uJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgICAkKHdpbmRvdykuc2Nyb2xsKCgpID0+IHtcclxuICAgICAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQsNC90LjQvNC40YDRg9C10LzRi9C1INGN0LvQtdC80LXQvdGC0YssXHJcbiAgICAgICAgLy8g0LrQvtCz0LTQsCDRgdC60YDQvtC70Lsg0LTQvtGF0L7QtNC40YIg0LTQviDQvdC10LPQvlxyXG4gICAgICAgIHNob3dBbmltYXRpb25FbGVtZW50cygpO1xyXG5cclxuICAgICAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDRgdC60YDRi9Cy0YLRi9C1INGN0LvQtdC80LXQvdGC0YtcclxuICAgICAgICAvLyDRhNGD0YLQtdGA0LAsINC60L7Qs9C00LAg0L/RgNC+0YHQutGA0L7Qu9C40LvQuFxyXG4gICAgICAgIC8vINCy0YHRjiDRgdGC0YDQsNC90LjRhtGDLFxyXG4gICAgICAgIC8vIHNob3dGb290ZXJFbGVtZW50cygpO1xyXG4gICAgfSk7XHJcbn0pOyIsIiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuXHJcbiAgICAvLyAvLyDQodC70LDQudC00LXRgCDRgSDQvtGC0LfRi9GL0LLQsNC80LhcclxuICAgIC8vIG5ldyBTd2lwZXIoJy5zd2lwZXJfZmVlZGJhY2snLCB7XHJcbiAgICAvLyAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgIC8vICAgICBzcGVlZDogMzAwLFxyXG4gICAgLy8gICAgIHByZWxvYWRJbWFnZXM6IHRydWUsXHJcbiAgICAvLyAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAvLyAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAvLyAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAvLyAgICAgYXV0b0hlaWdodDogZmFsc2UsXHJcbiAgICAvLyAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgLy8gICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbi1mZWVkYmFjaycsXHJcbiAgICAvLyAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgIC8vICAgICAgICAgZHluYW1pY0J1bGxldHM6IHRydWUsXHJcbiAgICAvLyAgICAgfSxcclxuICAgIC8vICAgICBicmVha3BvaW50czoge1xyXG4gICAgLy8gICAgICAgICA3Njg6IHtcclxuICAgIC8vICAgICAgICAgICAgIGNlbnRlcmVkU2xpZGVzOiB0cnVlLFxyXG4gICAgLy8gICAgICAgICAgICAgaW5pdGlhbFNsaWRlOiAxLFxyXG4gICAgLy8gICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH0pO1xyXG4gICAgLy9cclxuICAgIC8vIC8vINCh0LvQsNC50LTQtdGAINGBINGA0LXQt9GD0LvRjNGC0LDRgtCw0LzQuFxyXG4gICAgLy8gd2luZG93LnJlc3VsdHNTbGlkZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAvL1xyXG4gICAgLy8gY29uc3QgaW5pdFJlc3VsdFNsaWRlciA9ICgpID0+IHtcclxuICAgIC8vICAgICB3aW5kb3cucmVzdWx0c1NsaWRlciA9IG5ldyBTd2lwZXIoJy5zd2lwZXJfcmVzdWx0cycsIHtcclxuICAgIC8vICAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgIC8vICAgICAgICAgc3BlZWQ6IDMwMCxcclxuICAgIC8vICAgICAgICAgcHJlbG9hZEltYWdlczogdHJ1ZSxcclxuICAgIC8vICAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAvLyAgICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgLy8gICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgIC8vICAgICAgICAgYXV0b0hlaWdodDogdHJ1ZSxcclxuICAgIC8vICAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24tcmVzdWx0cycsXHJcbiAgICAvLyAgICAgICAgICAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgICAvLyAgICAgICAgICAgICBkeW5hbWljQnVsbGV0czogdHJ1ZSxcclxuICAgIC8vICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgIC8vICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMjAsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgIC8vICAgICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vIH07XHJcbiAgICAvL1xyXG4gICAgLy8gY29uc3QgZGVzdHJveVJlc3VsdHNTbGlkZXIgPSAoKSA9PiB7XHJcbiAgICAvLyAgICAgaWYgKHJlc3VsdHNTbGlkZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgLy8gICAgICAgICByZXN1bHRzU2xpZGVyLmxlbmd0aFxyXG4gICAgLy8gICAgICAgICAgICAgPyByZXN1bHRzU2xpZGVyLmZvckVhY2goc2xpZGVyID0+IHNsaWRlci5kZXN0cm95KCkpXHJcbiAgICAvLyAgICAgICAgICAgICA6IHJlc3VsdHNTbGlkZXIuZGVzdHJveSgpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH07XHJcbiAgICAvL1xyXG4gICAgLy8gY29uc3QgY2hlY2tSZXN1bHRzU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgLy8gICAgIGNvbnN0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICAvLyAgICAgICAgIGJyZWFrUG9pbnRYTCA9IDExNDA7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmICh3aW5kb3dXaWR0aCA+IGJyZWFrUG9pbnRYTCkge1xyXG4gICAgLy8gICAgICAgICBkZXN0cm95UmVzdWx0c1NsaWRlcigpO1xyXG4gICAgLy8gICAgICAgICB3aW5kb3cucmVzdWx0c1NsaWRlciA9IHVuZGVmaW5lZDtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBpZiAod2luZG93LnJlc3VsdHNTbGlkZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgLy8gICAgICAgICAgICAgaW5pdFJlc3VsdFNsaWRlcigpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfTtcclxuICAgIC8vXHJcbiAgICAvLyAvLyDQp9C10LrQsNC10Lwg0YHQu9Cw0LnQtNC10YAg0L/RgNC4INC/0LXRgNCy0L7QuSDQt9Cw0LPRgNGD0LfQutC1XHJcbiAgICAvLyBjaGVja1Jlc3VsdHNTbGlkZXIoKTtcclxuICAgIC8vXHJcbiAgICAvLyAkKHdpbmRvdykucmVzaXplKGNoZWNrUmVzdWx0c1NsaWRlcik7XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vIC8vINCU0LvRjyDQtNC10YHQutGC0L7Qv9C+0LIg0L/RgNC4INC60LvQuNC60LUg0L3QsCDQl9Cw0LPRgNGD0LfQuNGC0YxcclxuICAgIC8vIC8vINC10YnRkSwg0L/QvtC60LDQt9GL0LLQsNC10Lwg0L7RgdGC0LDQstGI0LjQtdGB0Y8g0YHQu9Cw0LnQtNGLXHJcbiAgICAvLyAkKCcjc2hvd01vcmVSZXN1bHRzSXRlbXMnKS5vbihcclxuICAgIC8vICAgICAnY2xpY2snLFxyXG4gICAgLy8gICAgIGUgPT4ge1xyXG4gICAgLy8gICAgICAgICBjb25zdCBhcnJJbnZpc2libGVJdGVtcyA9IGdldEludmlzaWJsZUl0ZW1zKCk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgLy8gICAgICAgICAgICAgY29uc3QgaXRlbSA9ICQoYXJySW52aXNpYmxlSXRlbXNbaV0pO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGl0ZW0uc2hvdygpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBpdGVtLnJlbW92ZUNsYXNzKCdoaWRlJyksIGkgKiAzMDApO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBjaGVja1Nob3dNb3JlUmVzdWx0c0J0bigpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICk7XHJcbiAgICAvL1xyXG4gICAgLy8gY29uc3QgZ2V0SW52aXNpYmxlSXRlbXMgPSAoKSA9PiB7XHJcbiAgICAvLyAgICAgY29uc3QgYXJySXRlbXMgPSAkKCcjcmVzdWx0U2xpZGVyTGlzdCAuc3dpcGVyLXNsaWRlJykudG9BcnJheSgpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICByZXR1cm4gYXJySXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gJChpdGVtKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfTtcclxuICAgIC8vXHJcbiAgICAvLyB3aW5kb3cuY2hlY2tTaG93TW9yZVJlc3VsdHNCdG4gPSAoKSA9PiB7XHJcbiAgICAvLyAgICAgaWYgKGdldEludmlzaWJsZUl0ZW1zKCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAvLyAgICAgICAgICQoJyNzaG93TW9yZVJlc3VsdHNJdGVtcycpLmhpZGUoKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9O1xyXG59KTsiLCJjb25zdCB2YWxpZGF0ZVBob25lID0gKHBob25lKSA9PiB7XHJcbiAgICBsZXQgcmVndWxhciA9IC9eKFxcKzcpPyhcXGR7M30/KT9bXFxkXXsxMX0kLztcclxuICAgIHJldHVybiByZWd1bGFyLnRlc3QocGhvbmUpO1xyXG59O1xyXG5cclxuY29uc3QgdmFsaWRhdGVFbWFpbCA9IChlbWFpbCkgPT4ge1xyXG4gICAgLy8g0KDQtdCz0YPQu9GP0YDQutCwINC00LvRjyBlbWFpbCDQv9GA0L7QstC10YDRj9C10YIg0YLQvtC70YzQutC+INC90LDQu9C40YfQuNC1IEAg0Lgg0YLQvtGH0LrQuFxyXG4gICAgbGV0IHJlZ3VsYXIgPSAvLitALitcXC4uKy9pO1xyXG4gICAgcmV0dXJuIHJlZ3VsYXIudGVzdChlbWFpbCk7XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcblxyXG4gICAgbGV0IHBob25lTWFzaztcclxuXHJcbiAgICBjb25zdCBjaGVja0Zvcm0gPSAoZm9ybSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHN1Ym1pdEJ0biA9ICQoZm9ybSkuZmluZCgnW3R5cGU9XCJzdWJtaXRcIl0nKSxcclxuICAgICAgICAgICAgaXNQaG9uZVZhbGlkID0gdmFsaWRhdGVQaG9uZShwaG9uZU1hc2sudW5tYXNrZWRWYWx1ZSk7XHJcblxyXG4gICAgICAgIGlzUGhvbmVWYWxpZFxyXG4gICAgICAgICAgICA/IHN1Ym1pdEJ0bi5wcm9wKHtkaXNhYmxlZDogZmFsc2V9KVxyXG4gICAgICAgICAgICA6IHN1Ym1pdEJ0bi5wcm9wKHtkaXNhYmxlZDogdHJ1ZX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKiDQntCx0YDQsNCx0L7RgtC60LAg0YLQtdC70LXRhNC+0L3QvdC+0LPQviDQvdC+0LzQtdGA0LAgLS0gU1RBUlRcclxuXHJcbiAgICBlbFBob25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob25lJyksXHJcblxyXG4gICAgLy8g0JzQsNGB0LrQsCDQtNC70Y8g0YLQtdC70LXRhNC+0L3QsFxyXG4gICAgcGhvbmVNYXNrT3B0aW9ucyA9IHtcclxuICAgICAgICBtYXNrOiAnK3s3fSAoezl9MDApIDAwMC0wMC0wMCcsXHJcbiAgICAgICAgbGF6eTogdHJ1ZSxcclxuICAgICAgICBwbGFjZWhvbGRlckNoYXI6ICdfJ1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0aWFsUGhvbmVNYXNrcyA9ICgpID0+IHtcclxuICAgICAgICBwaG9uZU1hc2sgPSBJTWFzayhlbFBob25lLCBwaG9uZU1hc2tPcHRpb25zKVxyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVyUGhvbmVGb2N1cyA9ICgpID0+IHtcclxuICAgICAgICBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7IGxhenk6IGZhbHNlIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVyUGhvbmVCbHVyID0gKCkgPT4ge1xyXG4gICAgICAgIHBob25lTWFzay51cGRhdGVPcHRpb25zKHsgbGF6eTogdHJ1ZSB9KTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWxpZGF0ZVBob25lKHBob25lTWFzay51bm1hc2tlZFZhbHVlKSkge1xyXG4gICAgICAgICAgICBwaG9uZU1hc2sudW5tYXNrZWRWYWx1ZSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlclBob25lSW5wdXQgPSBldnQgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZvcm0gPSAkKGV2dC50YXJnZXQpLmNsb3Nlc3QoJ2Zvcm0nKVswXTtcclxuICAgICAgICBjaGVja0Zvcm0oZm9ybSk7XHJcbiAgICB9O1xyXG5cclxuICAgICQoJ1t0eXBlPVwidGVsXCJdJylcclxuICAgICAgICAuZWFjaChpbml0aWFsUGhvbmVNYXNrcylcclxuICAgICAgICAub24oJ2ZvY3VzJywgaGFuZGxlclBob25lRm9jdXMpXHJcbiAgICAgICAgLm9uKCdibHVyJywgaGFuZGxlclBob25lQmx1cilcclxuICAgICAgICAub24oJ2lucHV0JywgaGFuZGxlclBob25lSW5wdXQpO1xyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqINCe0LHRgNCw0LHQvtGC0LrQsCDRgtC10LvQtdGE0L7QvdC90L7Qs9C+INC90L7QvNC10YDQsCAtLSBGSU5JU0hcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKiDQntCx0YDQsNCx0L7RgtC60LAg0LXQvNGN0LnQu9CwIC0tIFNUQVJUXHJcblxyXG4gICAgaGFuZGxlckVtYWlsQmx1ciA9IGV2dCA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWxpZGF0ZUVtYWlsKGV2dC50YXJnZXQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGV2dC50YXJnZXQudmFsdWUgPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICQoJ1t0eXBlPVwiZW1haWxcIl0nKS5vbignYmx1cicsIGhhbmRsZXJFbWFpbEJsdXIpO1xyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqINCe0LHRgNCw0LHQvtGC0LrQsCDQtdC80Y3QudC70LAgLS0gRklOSVNIXHJcbn0pOyIsIiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgICQoJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJykuY2xpY2soZSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBzaG93TW9kYWwoZS50YXJnZXQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2hvd1lvdXR1YmVJZnJhbWUgPSBlbCA9PiB7XHJcbiAgICAgICAgaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiAkKGVsKVxyXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5tb2RhbF9fZGlhbG9nJylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbW9kYWxfX2RpYWxvZ19oaWRlJyksXHJcbiAgICAgICAgICAgIDUwMFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LnNob3dNb2RhbCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGxldCBtb2RhbCA9ICQoZWwpLmRhdGEoJ3RhcmdldCcpO1xyXG5cclxuICAgICAgICBpZiAoIW1vZGFsKSB7XHJcbiAgICAgICAgICAgIG1vZGFsID0gJChlbClcclxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScpXHJcbiAgICAgICAgICAgICAgICAuZGF0YSgndGFyZ2V0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKG1vZGFsKS5hZGRDbGFzcygnc2hvdycpO1xyXG4gICAgICAgIGZpeFNjcm9sbE1vZGFsT3BlbigpO1xyXG5cclxuICAgICAgICBjb25zdCB2aWRlbyA9ICQobW9kYWwpLmZpbmQoJ3ZpZGVvJylbMF07XHJcbiAgICAgICAgaWYgKHZpZGVvKSB2aWRlby5wbGF5KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlmcmFtZSA9ICQobW9kYWwpLmZpbmQoJ2lmcmFtZScpWzBdO1xyXG4gICAgICAgIGlmIChpZnJhbWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoc2hvd0xvYWRlciwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcmMgPSAkKGVsKS5kYXRhKCd5b3V0dWJlU3JjJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNyYykge1xyXG4gICAgICAgICAgICAgICAgc3JjID0gJChlbClcclxuICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKCd5b3V0dWJlU3JjJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWZyYW1lLnNyYyA9IHNyYztcclxuXHJcbiAgICAgICAgICAgIGlmcmFtZS5vbmxvYWQgPSAoKSA9PiBzaG93WW91dHViZUlmcmFtZShpZnJhbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJCgnLm1vZGFsJykuY2xpY2soZSA9PiB7XHJcbiAgICAgICBpZiAoaXNBY3Rpb25Ob2RlKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgIGhpZGVNb2RhbChlLnRhcmdldCk7XHJcbiAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBoaWRlTW9kYWwgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBsZXQgbW9kYWwgPSAkKGVsKS5jbG9zZXN0KCcubW9kYWwnKSxcclxuICAgICAgICAgICAgdmlkZW8gPSAkKG1vZGFsKS5maW5kKCd2aWRlbycpWzBdLFxyXG4gICAgICAgICAgICBpZnJhbWUgPSAkKG1vZGFsKS5maW5kKCdpZnJhbWUnKVswXSxcclxuICAgICAgICAgICAgZGlhbG9ncyA9ICQobW9kYWwpLmZpbmQoJy5tb2RhbF9fZGlhbG9nJyk7XHJcblxyXG4gICAgICAgIGlmICh2aWRlbykge1xyXG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpO1xyXG4gICAgICAgICAgICB2aWRlby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaWZyYW1lKSB7XHJcbiAgICAgICAgICAgIGlmcmFtZS5zcmMgPSAnJztcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICAgICAoKSA9PiAkKGRpYWxvZ3MpLmFkZENsYXNzKCdtb2RhbF9fZGlhbG9nX2hpZGUnKSxcclxuICAgICAgICAgICAgICAgIDEwMDBcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9kYWwucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuICAgICAgICBmaXhTY3JvbGxNb2RhbENsb3NlKCk7XHJcblxyXG4gICAgICAgIC8vINCV0YHQu9C4INCyINC80L7QtNCw0LvRjNC90L7QvCDQvtC60L3QtSDQvdC10YHQutC+0LvRjNC60L4g0LTQuNCw0LvQvtCz0L7QstGL0YUg0L7QutC90L4sXHJcbiAgICAgICAgLy8g0L7RgdGC0LDQstC70Y/QtdC8INCy0LjQtNC40LzRi9C8INGC0L7Qu9GM0LrQviDQv9C10YDQstC+0LVcclxuICAgICAgICBpZiAoZGlhbG9ncy5sZW5ndGggPiAxKSB7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChkaWFsb2dzWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbW9kYWxfX2RpYWxvZ19oaWRlIGhpZGRlbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpYWxvZ3NcclxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGlkeCA9PiBpZHggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnbW9kYWxfX2RpYWxvZ19oaWRlIGhpZGRlbicpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaXNBY3Rpb25Ob2RlID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgcmV0dXJuICQoZWwpLmhhc0NsYXNzKCdtb2RhbCcpIHx8ICQoZWwpLmhhc0NsYXNzKCdtb2RhbENsb3NlQnRuJyk7XHJcbiAgICB9O1xyXG59KTsiLCIkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgICBjb25zdCB0b2dnbGVOYXYgPSAoKSA9PiB7XHJcbiAgICAgICAgJCgnI25hdicpLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9O1xyXG5cclxuICAgICQoJy5uYXZUb2dnbGVyJykub24oXHJcbiAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICB0b2dnbGVOYXZcclxuICAgICk7XHJcbn0pOyIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBsYXN0U2Nyb2xsVG9wID0gMDtcclxuXHJcbiAgICAkKHdpbmRvdykuc2Nyb2xsKCgpID0+IHtcclxuICAgICAgICBsZXQgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICBzY3JvbGxUb3AgPiAxMDAgJiYgc2Nyb2xsVG9wID4gbGFzdFNjcm9sbFRvcFxyXG4gICAgICAgICAgICA/ICQoJyNoZWFkZXInKS5hZGRDbGFzcygnaGlkZScpXHJcbiAgICAgICAgICAgIDogJCgnI2hlYWRlcicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgIGxhc3RTY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcbiAgICB9KTtcclxufSk7IiwiIiwiJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICAgIGNvbnN0IGZpcnN0U2NyZWVuVmlkZW9Mb2FkZWQgPSAoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAoKSA9PiAkKCcjZmlyc3RTY3JlZW4nKS5hZGRDbGFzcygnbG9hZGVkJyksXG4gICAgICAgICAgICA1MDBcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdmlkZW8gPSAkKCcjZmlyc3RTY3JlZW4gdmlkZW8nKVswXSxcbiAgICAgICAgc291cmNlID0gJCh2aWRlbykuZmluZCgnc291cmNlJylbMF0sXG4gICAgICAgIHNyYyA9IHZpZGVvLmRhdGFzZXQuc3RhcnRTcmM7XG5cbiAgICB2aWRlby5zcmMgPSBzcmM7XG4gICAgc291cmNlLnNyYyA9IHNyYztcblxuICAgIHZpZGVvLmxvYWQoZmlyc3RTY3JlZW5WaWRlb0xvYWRlZCgpKTtcbn0pOyIsIiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGNvbnN0ICBmb3JtU3VibWl0SGFuZGxlciA9IGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcm0gPSBldnQudGFyZ2V0LFxyXG4gICAgICAgICAgICBpc1BvbGljeUNoZWNrZWQgPSAkKGZvcm0pLmZpbmQoJ1tuYW1lPVwicG9saWN5XCJdJykucHJvcCgnY2hlY2tlZCcpLFxyXG4gICAgICAgICAgICBjaGVja2VyID0gJChmb3JtKS5maW5kKCcuY2hlY2tlcicpO1xyXG5cclxuICAgICAgICBpZiAoaXNQb2xpY3lDaGVja2VkKSB7XHJcbiAgICAgICAgICAgIHNob3dMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL3F1aXoyNC5ydS9wb3J0Zm9saW8vZm9yY2Vtb250YWdlL2Zvcm1zLWhhbmRsZXIucGhwJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6ICQoZm9ybSkuc2VyaWFsaXplKCksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChJU19ERUJVR0dJTkcpIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBoaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4gc2hvd01vZGFsKCQoZm9ybSkuZmluZCgnW3R5cGU9XCJzdWJtaXRcIl0nKVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDMwMFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J7RiNC40LHQutCwINC+0YLQv9GA0LDQstC60Lgg0YHQvtC+0LHRidC10L3QuNGPINCyINC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YTQvtGA0LzRiyEnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbChmdW5jdGlvbigganFYSFIsIHRleHRTdGF0dXMgKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3QgZmFpbGVkOiBcIiArIGpxWEhSICsgXCIgLS0tIFwiICsgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoY2hlY2tlcikuYWRkQ2xhc3MoJ2NoZWNrZXJfZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICQoJ2Zvcm0nKS5vbignc3VibWl0JywgZm9ybVN1Ym1pdEhhbmRsZXIpO1xyXG5cclxuICAgICQoJ1tuYW1lPVwicG9saWN5XCJdJykub24oXHJcbiAgICAgICAgJ2lucHV0JyxcclxuICAgICAgICBldnQgPT4gJChldnQudGFyZ2V0KVxyXG4gICAgICAgICAgICAubmV4dCgnLmNoZWNrZXInKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NoZWNrZXJfZXJyb3InKVxyXG4gICAgKTtcclxufSk7IiwiY29uc3QgdG9nZ2xlUG9zVmlzaWJsZUdvVG9OZXh0UGFnZUJ0biA9IGRpcmVjdGlvbiA9PiB7XHJcbiAgICBkaXJlY3Rpb25cclxuICAgICAgICA/ICQoJyNnb1RvTmV4dFBhZ2VCdG4nKS5hZGRDbGFzcygncG9zLXJlbGF0aXZlJylcclxuICAgICAgICA6ICQoJyNnb1RvTmV4dFBhZ2VCdG4nKS5yZW1vdmVDbGFzcygncG9zLXJlbGF0aXZlJyk7XHJcblxyXG59LFxyXG5cclxudG9nZ2xlU3RpY2t5R29Ub05leHRQYWdlQnRuID0gZGlyZWN0aW9uID0+IHtcclxuICAgIGNvbnN0IHNob3cgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoJyNnb1RvTmV4dFBhZ2VCdG4nKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzdGlja3kgc2hvdycpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgY29uc3QgaGlkZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAoJCgnI2dvVG9OZXh0UGFnZUJ0bicpLmhhc0NsYXNzKCdzaG93JykpIHtcclxuICAgICAgICAgICAgJCgnI2dvVG9OZXh0UGFnZUJ0bicpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAgICAgKCkgPT4gJCgnI2dvVG9OZXh0UGFnZUJ0bicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzdGlja3knKSxcclxuICAgICAgICAgICAgICAgIDUwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBkaXJlY3Rpb24gPyBzaG93KCkgOiBoaWRlKCk7XHJcbn0sXHJcblxyXG5jaGVja1Bvc1Zpc2libGVHb1RvTmV4dFBhZ2VCdG4gPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcblxyXG4gICAgICAgIHBsYWNlT2Zmc2V0ID0gJCgnI25leHRQYWdlQnRuUmVsYXRpdmVQbGFjZScpXHJcbiAgICAgICAgICAgIC5vZmZzZXQoKS50b3AsXHJcblxyXG4gICAgICAgIHNob3dQbGFjZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDEwMCxcclxuXHJcbiAgICAgICAgcGxhY2VUb3AgPSBwbGFjZU9mZnNldCAtIHNjcm9sbFRvcDtcclxuXHJcbiAgICBwbGFjZVRvcCA8IHNob3dQbGFjZVxyXG4gICAgICAgID8gdG9nZ2xlUG9zVmlzaWJsZUdvVG9OZXh0UGFnZUJ0bih0cnVlKVxyXG4gICAgICAgIDogdG9nZ2xlUG9zVmlzaWJsZUdvVG9OZXh0UGFnZUJ0bihmYWxzZSk7XHJcbn0sXHJcblxyXG5jaGVja1N0aWNreUdvVG9OZXh0UGFnZUJ0biA9ICgpID0+IHtcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcclxuXHJcbiAgICAgICAgcGxhY2VPZmZzZXQgPSAkKCcjbmV4dFBhZ2VCdG5TaG93UGxhY2UnKVxyXG4gICAgICAgICAgICAub2Zmc2V0KCkudG9wLFxyXG5cclxuICAgICAgICBzaG93UGxhY2UgPSAkKHdpbmRvdykuaGVpZ2h0KCksXHJcblxyXG4gICAgICAgIHBsYWNlVG9wID0gcGxhY2VPZmZzZXQgLSBzY3JvbGxUb3A7XHJcblxyXG4gICAgcGxhY2VUb3AgPCBzaG93UGxhY2VcclxuICAgICAgICA/IHRvZ2dsZVN0aWNreUdvVG9OZXh0UGFnZUJ0bih0cnVlKVxyXG4gICAgICAgIDogdG9nZ2xlU3RpY2t5R29Ub05leHRQYWdlQnRuKGZhbHNlKTtcclxufTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgICQod2luZG93KS5zY3JvbGwoKCkgPT4ge1xyXG4gICAgICAgIGNoZWNrUG9zVmlzaWJsZUdvVG9OZXh0UGFnZUJ0bigpO1xyXG4gICAgICAgIGNoZWNrU3RpY2t5R29Ub05leHRQYWdlQnRuKCk7XHJcbiAgICB9KTtcclxufSk7IiwiIiwiJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuXG4gICAgY29uc3QgdG9nZ2xlU3RhZ2VDYXJkVGV4dCA9IGV2dCA9PiB7XG4gICAgICAgICQoZXZ0LnRhcmdldClcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuc3RhZ2VzX19jYXJkJylcbiAgICAgICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH0sXG5cbiAgICBzaG93U3RhZ2VDYXJkID0gKCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSxcbiAgICAgICAgICAgIHdpbmRvd1Njcm9sbFRvcCA9IHNjcm9sbFRvcCArIHdpbmRvd0hlaWdodCxcbiAgICAgICAgICAgIHN0YWdlQ2FyZHMgPSAkKCcuc3RhZ2VzX19jYXJkLmhpZGUnKTtcblxuXG4gICAgICAgIGlmIChzdGFnZUNhcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHN0YWdlQ2FyZHMuZWFjaCgoaWR4LCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsU2Nyb2xsVG9wID0gJChlbCkub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbFRvcCA+IGVsU2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyckhlaWdodCA9ICQoZWwpLmRhdGEoJ2Fyci1oZWlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3N0YWdlc0FycicpLmNzcygnaGVpZ2h0JywgYXJySGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkKCcuc3RhZ2VzX19jYXJkJykub24oXG4gICAgICAgICdjbGljaycsXG4gICAgICAgIHRvZ2dsZVN0YWdlQ2FyZFRleHRcbiAgICApO1xuXG4gICAgJCh3aW5kb3cpLnNjcm9sbCgoKSA9PiB7XG4gICAgICAgIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INCw0L3QuNC80LjRgNGD0LXQvNGL0LUg0LrQsNGA0YLQvtGH0LrQuCxcbiAgICAgICAgLy8g0Y3RgtCw0L/QvtCyINGA0LDQsdC+0YIg0L3QsNC0INC/0YDQvtC10LrRgtC+0LxcbiAgICAgICAgc2hvd1N0YWdlQ2FyZCgpO1xuICAgIH0pO1xufSk7IiwiY29uc3Qgc2Nyb2xsVG9QbGFjZSA9IGUgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IGRlbHRhID0gJCh3aW5kb3cpLndpZHRoKCkgPiA3NjggPyAxMDAgOiA1MDtcclxuXHJcbiAgICBjb25zdCBfdGhpcyA9IGUudGFyZ2V0LFxyXG4gICAgICAgIHRhcmdldElkID0gJChfdGhpcykuYXR0cignaHJlZicpLFxyXG4gICAgICAgIHRvcCA9ICQodGFyZ2V0SWQpLm9mZnNldCgpLnRvcCAtIGRlbHRhO1xyXG5cclxuICAgICQoJ2JvZHksaHRtbCcpLmFuaW1hdGUoXHJcbiAgICB7IHNjcm9sbFRvcDogdG9wIH0sXHJcbiAgICAxMDAwXHJcbiAgICApO1xyXG59O1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgJCgnLmFuY2hvcnNfX2xpbmsnKS5vbihcclxuICAgICAgICAnY2xpY2snLFxyXG4gICAgICAgIHNjcm9sbFRvUGxhY2VcclxuICAgICk7XHJcbn0pOyIsIiIsImNvbnN0IHRvZ2dsZUZvb2xTY3JlZW5EZXNjcyA9ICh3cmFwKSA9PiB7XHJcbiAgICBjb25zdCBhY3RpdmUgPSAkKHdyYXApXHJcbiAgICAgICAgLmZpbmQoJy50ZWFtX19lbGVtZW50JylcclxuICAgICAgICAuZmlsdGVyKCcuYWN0aXZlJyksXHJcblxyXG4gICAgICAgIGhpZGRlbiA9ICQod3JhcClcclxuICAgICAgICAgICAgLmZpbmQoJy50ZWFtX19lbGVtZW50JylcclxuICAgICAgICAgICAgLm5vdCgnLmFjdGl2ZScpO1xyXG5cclxuICAgICAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGhpZGRlbi5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbn0sXHJcblxyXG50b2dnbGVNb2JTY3JlZW5EZXNjcyA9ICh3cmFwKSA9PiB7XHJcbiAgICBjb25zdCBpdGVtcyA9ICQod3JhcClcclxuICAgICAgICAuZmluZCgnLnRlYW1fX3RleHQtbGlzdCBsaScpLFxyXG5cclxuICAgICAgICBhY3RpdmVJZHggPSAkKHdyYXApXHJcbiAgICAgICAgICAgIC5maW5kKCcudGVhbV9fdGV4dC1saXN0IGxpLmFjdGl2ZScpXHJcbiAgICAgICAgICAgIC5pbmRleCgpO1xyXG5cclxuICAgIGlmIChhY3RpdmVJZHggPT09IC0xKSB7XHJcbiAgICAgICAgc3RhcnRBY3RpdmVJdGVtKHdyYXApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWN0aXZlSWR4ID09PSBpdGVtcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgcmVzZXRBY3RpdmVJdGVtKHdyYXApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBwbHVzQWN0aXZlSXRlbSh3cmFwKTtcclxufSxcclxuXHJcbnN0YXJ0QWN0aXZlSXRlbSA9ICh3cmFwKSA9PiB7XHJcbiAgICBjb25zdCBjYXJkID0gJCh3cmFwKS5maW5kKCcudGVhbV9fY2FyZCcpLFxyXG4gICAgICAgIGl0ZW0gPSAkKHdyYXApLmZpbmQoJy50ZWFtX190ZXh0LWxpc3QgbGknKVswXTtcclxuXHJcbiAgICBjYXJkLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgICAkKGl0ZW0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxufSxcclxuXHJcbnJlc2V0QWN0aXZlSXRlbSA9ICh3cmFwKSA9PiB7XHJcbiAgICBjb25zdCBjYXJkID0gJCh3cmFwKS5maW5kKCcudGVhbV9fY2FyZCcpLFxyXG4gICAgICAgIGl0ZW1BY3RpdmUgPSAkKHdyYXApLmZpbmQoJy50ZWFtX190ZXh0LWxpc3QgLmFjdGl2ZScpO1xyXG5cclxuICAgIGNhcmQucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgIGl0ZW1BY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG59LFxyXG5cclxucGx1c0FjdGl2ZUl0ZW0gPSAod3JhcCkgPT4ge1xyXG4gICAgY29uc3QgaXRlbXMgPSAkKHdyYXApLmZpbmQoJy50ZWFtX190ZXh0LWxpc3QgbGknKSxcclxuICAgICAgICBpdGVtQWN0aXZlSWR4ID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJykuaW5kZXgoKTtcclxuXHJcbiAgICAkKGl0ZW1zW2l0ZW1BY3RpdmVJZHhdKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKGl0ZW1zW2l0ZW1BY3RpdmVJZHggKyAxXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG59LFxyXG5cclxudG9nZ2xlRGVzYyA9IGV2dCA9PiB7XHJcbiAgICBjb25zdCBfdGhpcyA9ICQoZXZ0LnRhcmdldCksXHJcbiAgICAgICAgd3JhcCA9IF90aGlzLmNsb3Nlc3QoJy50ZWFtJyksXHJcbiAgICAgICAgYXJyb3cgPSB3cmFwLmZpbmQoJ2J1dHRvbicpO1xyXG5cclxuICAgIGFycm93LnRvZ2dsZUNsYXNzKCdyb3RhdGVkJyk7XHJcblxyXG4gICAgJCh3aW5kb3cpLndpZHRoKCkgPCAxMjAwXHJcbiAgICAgICAgPyB0b2dnbGVNb2JTY3JlZW5EZXNjcyh3cmFwKVxyXG4gICAgICAgIDogdG9nZ2xlRm9vbFNjcmVlbkRlc2NzKHdyYXApO1xyXG59LFxyXG5cclxuc2hvd1RlYW1HYWxsZXJ5ID0gKGV2dCkgPT4ge1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgIGNvbnN0IF90aGlzID0gZXZ0LnRhcmdldDtcclxuXHJcbiAgICBsZXQgZ2FsbGVyeUlkID0gJChfdGhpcykuZGF0YSgnZ2FsbGVyeS1pZCcpO1xyXG5cclxuICAgIGlmICghZ2FsbGVyeUlkKSB7XHJcbiAgICAgICAgZ2FsbGVyeUlkID0gJChfdGhpcykuY2xvc2VzdCgnW2RhdGEtZ2FsbGVyeS1pZF0nKS5kYXRhKCdnYWxsZXJ5LWlkJylcclxuICAgIH1cclxuXHJcbiAgICAkKGdhbGxlcnlJZCkuZmluZCgnYTpmaXJzdC1jaGlsZCBpbWcnKS5jbGljaygpO1xyXG59O1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgJCgnLnRlYW1fX2l0ZW0nKVxyXG4gICAgICAgIC50b0FycmF5KClcclxuICAgICAgICAuZm9yRWFjaChcclxuICAgICAgICAgICAgZWwgPT4gJChlbCkuY2xpY2sodG9nZ2xlRGVzYylcclxuICAgICAgICApO1xyXG5cclxuICAgIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INCz0LDQu9C10YDQtdGPINC+0LTQvdC+0LPQviDQuNC3INGH0LvQtdC90L7QsiDQutC+0LzQsNC90LTRi1xyXG4gICAgJCgnLnRlYW1fX3BpY3MnKVxyXG4gICAgICAgIC50b0FycmF5KClcclxuICAgICAgICAuZm9yRWFjaChcclxuICAgICAgICAgICAgZWwgPT4gJChlbCkuY2xpY2soc2hvd1RlYW1HYWxsZXJ5KVxyXG4gICAgICAgICk7XHJcbn0pO1xyXG5cclxuRmFuY3lib3guYmluZCgnW2RhdGEtZmFuY3lib3g9XCJnYWxsZXJ5LWRlc2lnblwiXScsIHtcclxuICAgIFRodW1iczogZmFsc2UsXHJcbiAgICBUb29sYmFyOiBmYWxzZSxcclxuICAgIEltYWdlOiB7XHJcbiAgICAgICAgd2hlZWw6IGZhbHNlLCAvLyBEaXNhYmxlIHpvb20gb24gc2Nyb2xsIGV2ZW50XHJcbiAgICAgICAgY2xpY2s6IGZhbHNlLCAvLyBEaXNhYmxlIHpvb20gb24gaW1hZ2UgY2xpY2tcclxuICAgIH1cclxufSk7XHJcblxyXG5GYW5jeWJveC5iaW5kKCdbZGF0YS1mYW5jeWJveD1cImdhbGxlcnktZXF1aXBtZW50XCJdJywge1xyXG4gICAgVGh1bWJzOiBmYWxzZSxcclxuICAgIFRvb2xiYXI6IGZhbHNlLFxyXG4gICAgSW1hZ2U6IHtcclxuICAgICAgICB3aGVlbDogZmFsc2UsIC8vIERpc2FibGUgem9vbSBvbiBzY3JvbGwgZXZlbnRcclxuICAgICAgICBjbGljazogZmFsc2UsIC8vIERpc2FibGUgem9vbSBvbiBpbWFnZSBjbGlja1xyXG4gICAgfVxyXG59KTtcclxuXHJcbkZhbmN5Ym94LmJpbmQoJ1tkYXRhLWZhbmN5Ym94PVwiZ2FsbGVyeS1yZWFsaXphdGlvblwiXScsIHtcclxuICAgIFRodW1iczogZmFsc2UsXHJcbiAgICBUb29sYmFyOiBmYWxzZSxcclxuICAgIEltYWdlOiB7XHJcbiAgICAgICAgd2hlZWw6IGZhbHNlLCAvLyBEaXNhYmxlIHpvb20gb24gc2Nyb2xsIGV2ZW50XHJcbiAgICAgICAgY2xpY2s6IGZhbHNlLCAvLyBEaXNhYmxlIHpvb20gb24gaW1hZ2UgY2xpY2tcclxuICAgIH1cclxufSk7IiwiIiwiY29uc3QgYW5pbWF0aW9uTGluZSA9ICQoJyNsaW5lJyksXG4gICAgYW5pbWF0aW9uUG9pbnRzQ291bnQgPSAkKCcuYW5pbWF0aW9uLWxpbmUtcG9pbnQnKS5sZW5ndGgsXG4gICAgYW5pbWF0aW9uTGluZURlbGltaXRlciA9IDEwMCAvIGFuaW1hdGlvblBvaW50c0NvdW50LFxuXG5zaG93QW5pbWF0aW9uTGluZSA9ICgpID0+IHtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSxcbiAgICAgICAgd2luZG93U2Nyb2xsVG9wID0gc2Nyb2xsVG9wICsgd2luZG93SGVpZ2h0LFxuICAgICAgICBwb2ludCA9ICQoJy5hbmltYXRpb24tbGluZS1wb2ludCcpO1xuXG4gICAgcG9pbnQuZWFjaCgoaWR4LCBlbCkgPT4ge1xuICAgICAgICBjb25zdCBlbFNjcm9sbFRvcCA9ICQoZWwpLm9mZnNldCgpLnRvcCxcbiAgICAgICAgICAgIGVsSWR4ID0gJChlbCkuaW5kZXgoKTtcblxuICAgICAgICBpZiAod2luZG93U2Nyb2xsVG9wID4gZWxTY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICQoZWwpLnJlbW92ZUNsYXNzKCdhbmltYXRpb24tbGluZS1wb2ludCcpO1xuICAgICAgICAgICAgYW5pbWF0aW9uTGluZS5jc3MoJ2hlaWdodCcsIGFuaW1hdGlvbkxpbmVEZWxpbWl0ZXIgKiBlbElkeCArICclJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKCgpID0+IHtcbiAgICAgICAgLy8g0J/QvtC60LDQt9GL0LLQsNC10Lwg0LDQvdC40LzQuNGA0L7QstCw0L3QvdGD0Y4g0LvQuNC90LjRjiDQv9C+INC80LXRgNC1XG4gICAgICAgIC8vINC/0YDQvtC00LLQuNC20LXQvdC40Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC/0L4g0Y3QutGA0LDQvdGDXG4gICAgICAgIHNob3dBbmltYXRpb25MaW5lKCk7XG4gICAgfSk7XG59KTsiXX0=
