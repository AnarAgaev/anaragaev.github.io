'use strict';


// Open and close mobile navigation
document.addEventListener("DOMContentLoaded", () => {
    const navClose = Array.from(document.querySelectorAll('.header__nav-close'))
    const navToggler = document.querySelector('.footer__nav-link_menu')
    const headerNav = document.querySelector('.header__nav')
    const modalBack = document.querySelector('.header__modal-back')
    const navProdLink = document.querySelector('.header__nav-link_product')
    const navItems = Array.from(document.querySelectorAll('.header__nav-item_with-inner'))
    const navLinks = Array.from(document.querySelectorAll('.header__nav-link'))
    const navCollapses = Array.from(document.querySelectorAll('.header__nav-collapse'))

    const toggleNav = (direction) => {
        if (direction) {
            document.body.classList.add('modal-open')
            navToggler.classList.add('active')
            headerNav.classList.add('open')
            // modalBack.classList.add('show')

            setTimeout(() => {
                navProdLink.click()
            }, 100)

            return
        }

        document.body.classList.remove('modal-open')
        navToggler.classList.remove('active')
        headerNav.classList.remove('open')
        modalBack.classList.remove('show')

        collapsAllNavItem()
    }

    // Click on navigation burger
    navToggler.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            toggleNav(false)
            return
        }

        toggleNav(true)
    })

    // Click on navigation close button
    navClose.forEach(btn => {
        btn.addEventListener('click', () =>toggleNav(false))
    })

    modalBack.addEventListener('click', () => {
        toggleNav(false)
    })

    // Open and close Navigation items
    const collapsAllNavItem = () => {
        navItems.forEach(i => i.classList.remove('dropped'))
        navLinks.forEach(i => i.classList.remove('active'))
        navCollapses.forEach(i => i.classList.remove('open'))
    }

    const toggleNavItem = (btn) => {
        const isActive = btn.classList.contains('active')

        collapsAllNavItem()

        if (!isActive) {
            btn.classList.add('active')

            const navItem = btn.closest('.header__nav-item_with-inner')

            if (navItem) {
                const navCollapse = navItem.querySelector('.header__nav-collapse')

                navItem.classList.add('dropped')
                navCollapse.classList.add('open')
                modalBack.classList.add('show')
            }
        }
    }

    navLinks.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleNavItem(this)
        })
    })
})

// Searching and Sticky header
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header')
    const searchToggler = document.querySelector('.header__buttons-link_search')
    const searchClose = document.querySelector('.header__search-close')
    const searchPanel = document.querySelector('.header__search')
    const searchInput = document.querySelector('.header__search-input')
    const searchReset = document.querySelector('.header__search-reset')
    const searchHints = document.querySelector('.header__search-hints')

    const toggleSearchPanel = (hide = false) => {
        const isVisible = searchPanel.classList.contains('visible')
        const timeout = window.innerWidth > 991 ? 100 : 500

        if (!isVisible && !hide) {
            searchPanel.classList.remove('disable')
            header.classList.add('header_with-search-panel')
            searchToggler.classList.add('active')

            setTimeout(() => {
                searchPanel.classList.add('visible')
            }, timeout)

            return
        }

        searchToggler.classList.remove('active')
        searchPanel.classList.remove('visible')

        if (window.innerWidth < 992) {
            searchHints.classList.remove('visible')
            searchReset.click()
            resetHandlerFormHelpers()
        }

        setTimeout(() => {
            searchPanel.classList.add('disable')
            header.classList.remove('header_with-search-panel')
        }, 200)
    }

    searchToggler.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    searchClose.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    searchInput.addEventListener('input', function() {
        if (this.value === '' ) {
            searchReset.classList.remove('visible')
            searchHints.classList.remove('visible')
            return
        }

        searchReset.classList.add('visible')
        resetHandlerFormHelpers()

        // *** Fetching search requests and show results --- START
        // After the fetching it needs do methods below
        console.log('Fetching search results');

        setHandlerToHelpers()
        searchHints.classList.add('visible')

        if (window.innerWidth < 992) {
            document.body.classList.add('modal-open')
        }
        // *** Fetching search requests and show results --- FINISH
    })

    searchReset.addEventListener('click', (e) => {
        e.stopPropagation()
        searchReset.classList.remove('visible')
        searchHints.classList.remove('visible')
        resetHandlerFormHelpers()
        document.body.classList.remove('modal-open')
    })

    document.addEventListener('click', e => {
        const isSearchToggle = e.target
            .closest('.header__buttons-link_search')

        const isSearchPanel = e.target
            .closest('.header__search')

        const isTuchDevice = window.innerWidth < 992

        if (!isTuchDevice && !isSearchPanel && !isSearchToggle) {
            toggleSearchPanel(true)
        }
    })

    // Set help text from helper button under the search input to the search value
    const requestCompletion = (e) => {
        const additionValue = e.target.innerText
        searchInput.value = `${searchInput.value} ${additionValue}`
    }

    const setHandlerToHelpers = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => btn
            .addEventListener('click', requestCompletion))
    }

    const resetHandlerFormHelpers = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => {
            btn.removeEventListener('click', requestCompletion)
        })
    }

    // Sticky header
    let boforeScrollTop = 0

    window.addEventListener('scroll', () => {

        if (window.innerWidth > 991) return

        const header = document.getElementById("header")
        const heightHeight = header.clientHeight
        const delay = '.7s'

        let currentScrollTop = window.pageYOffset

        if (currentScrollTop > 100 && currentScrollTop > boforeScrollTop) {
            const isVisibleSearch = searchPanel
                .classList.contains('visible')

            let intervalId

            if (isVisibleSearch) {
                header.style.transitionDelay = delay
                toggleSearchPanel(true)
                intervalId = setInterval(() => {
                    header.style.transitionDelay = '0s'
                    clearInterval(intervalId)
                }, 1000)
            }

            header.style.top = `-${heightHeight}px`
        } else {
            header.style.top = 0
        }

        boforeScrollTop = window.pageYOffset
    });
})

// Deleting blocking of all animation for fix animation artefacts
const removeAnimationBlocker = () => {
    Array.from(document.querySelectorAll('.transition-blocker'))
        .forEach(el => el.classList.remove('transition-blocker'))
}
window.addEventListener('load', removeAnimationBlocker)

// Blocking all animation at the window resizing process
const addAnimationBlocker = () => {
    document.body.classList.add('transition-blocker')
}

let blockAnimationTimer

window.addEventListener("resize", () => {
    clearTimeout(blockAnimationTimer)
    addAnimationBlocker()

    blockAnimationTimer = setTimeout(() => {
        removeAnimationBlocker()
    }, 300)
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci9zY3JpcHQuanMiLCJoZWFkZXIvc2NyaXB0LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIiwiLy8gT3BlbiBhbmQgY2xvc2UgbW9iaWxlIG5hdmlnYXRpb25cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgbmF2Q2xvc2UgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jbG9zZScpKVxyXG4gICAgY29uc3QgbmF2VG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXJfX25hdi1saW5rX21lbnUnKVxyXG4gICAgY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2JylcclxuICAgIGNvbnN0IG1vZGFsQmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21vZGFsLWJhY2snKVxyXG4gICAgY29uc3QgbmF2UHJvZExpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtbGlua19wcm9kdWN0JylcclxuICAgIGNvbnN0IG5hdkl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtaXRlbV93aXRoLWlubmVyJykpXHJcbiAgICBjb25zdCBuYXZMaW5rcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWxpbmsnKSlcclxuICAgIGNvbnN0IG5hdkNvbGxhcHNlcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNvbGxhcHNlJykpXHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTmF2ID0gKGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgICAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgICAgIC8vIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmF2UHJvZExpbmsuY2xpY2soKVxyXG4gICAgICAgICAgICB9LCAxMDApXHJcblxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJylcclxuICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGJ1cmdlclxyXG4gICAgbmF2VG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvZ2dsZU5hdih0cnVlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGNsb3NlIGJ1dHRvblxyXG4gICAgbmF2Q2xvc2UuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+dG9nZ2xlTmF2KGZhbHNlKSlcclxuICAgIH0pXHJcblxyXG4gICAgbW9kYWxCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gT3BlbiBhbmQgY2xvc2UgTmF2aWdhdGlvbiBpdGVtc1xyXG4gICAgY29uc3QgY29sbGFwc0FsbE5hdkl0ZW0gPSAoKSA9PiB7XHJcbiAgICAgICAgbmF2SXRlbXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpKVxyXG4gICAgICAgIG5hdkxpbmtzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG4gICAgICAgIG5hdkNvbGxhcHNlcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJykpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTmF2SXRlbSA9IChidG4pID0+IHtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuXHJcbiAgICAgICAgaWYgKCFpc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5hdkl0ZW0gPSBidG4uY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWl0ZW1fd2l0aC1pbm5lcicpXHJcblxyXG4gICAgICAgICAgICBpZiAobmF2SXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF2Q29sbGFwc2UgPSBuYXZJdGVtLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1jb2xsYXBzZScpXHJcblxyXG4gICAgICAgICAgICAgICAgbmF2SXRlbS5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgICAgIG5hdkNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hdkxpbmtzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2SXRlbSh0aGlzKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gU2VhcmNoaW5nIGFuZCBTdGlja3kgaGVhZGVyXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxyXG4gICAgY29uc3Qgc2VhcmNoVG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2J1dHRvbnMtbGlua19zZWFyY2gnKVxyXG4gICAgY29uc3Qgc2VhcmNoQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtY2xvc2UnKVxyXG4gICAgY29uc3Qgc2VhcmNoUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gnKVxyXG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtaW5wdXQnKVxyXG4gICAgY29uc3Qgc2VhcmNoUmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtcmVzZXQnKVxyXG4gICAgY29uc3Qgc2VhcmNoSGludHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtaGludHMnKVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZVNlYXJjaFBhbmVsID0gKGhpZGUgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpXHJcbiAgICAgICAgY29uc3QgdGltZW91dCA9IHdpbmRvdy5pbm5lcldpZHRoID4gOTkxID8gMTAwIDogNTAwXHJcblxyXG4gICAgICAgIGlmICghaXNWaXNpYmxlICYmICFoaWRlKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGUnKVxyXG4gICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX3dpdGgtc2VhcmNoLXBhbmVsJylcclxuICAgICAgICAgICAgc2VhcmNoVG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgfSwgdGltZW91dClcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoVG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsaWNrKClcclxuICAgICAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnMoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKVxyXG4gICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX3dpdGgtc2VhcmNoLXBhbmVsJylcclxuICAgICAgICB9LCAyMDApXHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoVG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICB9KVxyXG5cclxuICAgIHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKClcclxuICAgIH0pXHJcblxyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gJycgKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hSZXNldC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgICAgICByZXNldEhhbmRsZXJGb3JtSGVscGVycygpXHJcblxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gU1RBUlRcclxuICAgICAgICAvLyBBZnRlciB0aGUgZmV0Y2hpbmcgaXQgbmVlZHMgZG8gbWV0aG9kcyBiZWxvd1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyBzZWFyY2ggcmVzdWx0cycpO1xyXG5cclxuICAgICAgICBzZXRIYW5kbGVyVG9IZWxwZXJzKClcclxuICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gRklOSVNIXHJcbiAgICB9KVxyXG5cclxuICAgIHNlYXJjaFJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnMoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hUb2dnbGUgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcblxyXG4gICAgICAgIGNvbnN0IGlzU2VhcmNoUGFuZWwgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNUdWNoRGV2aWNlID0gd2luZG93LmlubmVyV2lkdGggPCA5OTJcclxuXHJcbiAgICAgICAgaWYgKCFpc1R1Y2hEZXZpY2UgJiYgIWlzU2VhcmNoUGFuZWwgJiYgIWlzU2VhcmNoVG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBTZXQgaGVscCB0ZXh0IGZyb20gaGVscGVyIGJ1dHRvbiB1bmRlciB0aGUgc2VhcmNoIGlucHV0IHRvIHRoZSBzZWFyY2ggdmFsdWVcclxuICAgIGNvbnN0IHJlcXVlc3RDb21wbGV0aW9uID0gKGUpID0+IHtcclxuICAgICAgICBjb25zdCBhZGRpdGlvblZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0XHJcbiAgICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSBgJHtzZWFyY2hJbnB1dC52YWx1ZX0gJHthZGRpdGlvblZhbHVlfWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZXRIYW5kbGVyVG9IZWxwZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IGJ0blxyXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXF1ZXN0Q29tcGxldGlvbikpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoSGVscGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX3NlYXJjaC1oZWxwcyBzcGFuJykpXHJcblxyXG4gICAgICAgIHNlYXJjaEhlbHBlcnMuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgICAgICBidG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXF1ZXN0Q29tcGxldGlvbilcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0aWNreSBoZWFkZXJcclxuICAgIGxldCBib2ZvcmVTY3JvbGxUb3AgPSAwXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTkxKSByZXR1cm5cclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkZXJcIilcclxuICAgICAgICBjb25zdCBoZWlnaHRIZWlnaHQgPSBoZWFkZXIuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgY29uc3QgZGVsYXkgPSAnLjdzJ1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IDEwMCAmJiBjdXJyZW50U2Nyb2xsVG9wID4gYm9mb3JlU2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZVNlYXJjaCA9IHNlYXJjaFBhbmVsXHJcbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbElkXHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWaXNpYmxlU2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXlcclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSAnMHMnXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IGAtJHtoZWlnaHRIZWlnaHR9cHhgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJvZm9yZVNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgfSk7XHJcbn0pXHJcbiIsIi8vIERlbGV0aW5nIGJsb2NraW5nIG9mIGFsbCBhbmltYXRpb24gZm9yIGZpeCBhbmltYXRpb24gYXJ0ZWZhY3RzXHJcbmNvbnN0IHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIgPSAoKSA9PiB7XHJcbiAgICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmFuc2l0aW9uLWJsb2NrZXInKSlcclxuICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc2l0aW9uLWJsb2NrZXInKSlcclxufVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIpXHJcblxyXG4vLyBCbG9ja2luZyBhbGwgYW5pbWF0aW9uIGF0IHRoZSB3aW5kb3cgcmVzaXppbmcgcHJvY2Vzc1xyXG5jb25zdCBhZGRBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0cmFuc2l0aW9uLWJsb2NrZXInKVxyXG59XHJcblxyXG5sZXQgYmxvY2tBbmltYXRpb25UaW1lclxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KGJsb2NrQW5pbWF0aW9uVGltZXIpXHJcbiAgICBhZGRBbmltYXRpb25CbG9ja2VyKClcclxuXHJcbiAgICBibG9ja0FuaW1hdGlvblRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlcigpXHJcbiAgICB9LCAzMDApXHJcbn0pXHJcbiJdfQ==
