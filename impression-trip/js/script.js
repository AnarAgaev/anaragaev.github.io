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

const screenSliderParams = {
    speed: 1000,
    
    // Amount slides on one screen
    slidesPerView: 1,
    
    // Amount slides on one scroll
    slidesPerGroup: 1,

    // Navigation by hash
    // hashNavigation: {
    //     watchState: true
    // },

    // Pagination
    pagination: {
        el: '.screens__pagination',
        clickable: true
    },
    
    // Enable/Disable touchable scroll on desktop
    simulateTouch: false,
    
    // Swiping by mouse wheel
    mousewheel: {
        sensitivity: 1,
        // eventsTarget: "#main",
    },

    // Update slider when DOM is changing
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    
    // Hide modals on change slider event
    on: {
        slideChange: function () {
            console.log('Hide all modals')
        }
    },
};

// Handler change window width from MOBILE to TABLET for rebuild screens sliders
const breakpointTablet = window.matchMedia ('(min-width: 768px)');

let screensSlider;

function enableScreensSlider() {
    screensSlider = new Swiper('#screensSlider', screenSliderParams);
}

// Checkin window width function
function breakpointChecker() {
    if ( breakpointTablet.matches === true ) {
        enableScreensSlider();
    } else if ( breakpointTablet.matches === false ) {
        if ( screensSlider !== undefined ) {
            screensSlider.destroy(true, true);
        }
    }
}

// Start initial screen slider
breakpointChecker();

// Here are listening breakpoint for tablet screen and initial check
breakpointTablet.addListener(breakpointChecker);



// Scroll to some screen
// setTimeout(() => {
//     screensSlider.slideTo(1, 1500);
// }, 10000);














// // Get element coordinates into document
// window.getCoords = (elem) => {
//     let box = elem.getBoundingClientRect();
//
//     return {
//         top: box.top + window.pageYOffset,
//         right: box.right + window.pageXOffset,
//         bottom: box.bottom + window.pageYOffset,
//         left: box.left + window.pageXOffset
//     };
// }
//
// // Get scrollbar width
// window.getScrollbarWidth = function() {
//     let div = document.createElement('div');
//     let scrollWidth;
//
//     if (!isScrollBarVisible()) {
//         return 0;
//     }
//
//     div.style.overflowY = 'scroll';
//     div.style.width = '50px';
//     div.style.height = '50px';
//
//     document.body.append(div);
//     scrollWidth = div.offsetWidth - div.clientWidth;
//     div.remove();
//
//     return scrollWidth;
// }
//
// window.isScrollBarVisible = function () {
//     return window.innerWidth
//         !== document.documentElement.clientWidth;
// }
//
// window.addEventListener('load', () => {
//
//     const showAnimationElements = () => {
//         const scrollTop = window.pageYOffset;
//         const windowHeight = window.innerHeight;
//         const windowScrollTop = scrollTop + windowHeight;
//
//         const animationElms = Array.from(document
//             .getElementsByClassName('withShowAnimation'));
//
//         animationElms.forEach((el) => {
//             const elScrollTop = getCoords(el).top;
//
//             if (windowScrollTop > elScrollTop) {
//                 el.classList
//                     .remove('withShowAnimation')
//             }
//         });
//     };
//
//     // Initial show animation elements after loaded page
//     showAnimationElements();
//
//     window.addEventListener('scroll', showAnimationElements);
// });




// window.addEventListener('load', () => {
//
//     // Плавный сролл экранов
//     const wheelHandler = debounce(screenSlider, 700);
//     const dragHandler = debounce(drugSlider, 700);
//
//     // Обработка скрола мыши
//     window.addEventListener("wheel", evt => {
//         const direction = Math.sign(evt.deltaY) > 0;
//         wheelHandler(direction);
//     });
//
//     const mouseMoveListener = function (e) {
//         const direction = e.movementX < 0;
//         wheelHandler(direction);
//     };
//
//     window.addEventListener('mousedown', function() {
//         dragHandler();
//         setTimeout(() => {
//             window.removeEventListener('mousemove', mouseMoveListener );
//         }, 150);
//     });
//
//     function drugSlider() {
//         window.addEventListener('mousedown', function() {
//             window.addEventListener('mousemove', mouseMoveListener);
//         });
//     }
// });
//
// function screenSlider(direction) {
//     const slider = document.getElementById('main');
//     const position = parseInt(window.getComputedStyle(slider).left);
//     const offset = window.innerWidth;
//     let newPosition = direction
//         ? position - offset
//         : position + offset;
//
//     newPosition = checkNewPosition(slider, newPosition);
//
//     slider.style.left = newPosition + 'px';
// }
//
// function checkNewPosition(slider, position) {
//     console.log()
//
//     if (position > 0 || window.innerWidth < SLIDER_BREAKPOINT) return 0;
//
//     if (position > -slider.clientWidth) {
//         return position;
//     }
// }







