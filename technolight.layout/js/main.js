'use strict';


// Open and close mobile navigation
const navClose = Array.from(document.querySelectorAll('.header__nav-close'))
const navToggler = document.querySelector('.footer__nav-link_menu')
const headerNav = document.querySelector('.header__nav')
const modalBack = document.querySelector('.modal-back')
const navProdLink = document.querySelector('.header__nav-link_product')
const navItems = Array.from(document.querySelectorAll('.header__nav-item_with-inner'))
const navLinks = Array.from(document.querySelectorAll('.header__nav-link'))
const navCollapses = Array.from(document.querySelectorAll('.header__nav-collapse'))

const toggleNav = (direction) => {
    if (direction) {
        navToggler.classList.add('active')
        headerNav.classList.add('open')
        modalBack.classList.add('show')

        setTimeout(() => {
            navProdLink.click()
        }, 100)

        return
    }

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci9zY3JpcHQuanMiLCJoZWFkZXIvc2NyaXB0LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIiwiLy8gT3BlbiBhbmQgY2xvc2UgbW9iaWxlIG5hdmlnYXRpb25cclxuY29uc3QgbmF2Q2xvc2UgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jbG9zZScpKVxyXG5jb25zdCBuYXZUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlcl9fbmF2LWxpbmtfbWVudScpXHJcbmNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpXHJcbmNvbnN0IG1vZGFsQmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1iYWNrJylcclxuY29uc3QgbmF2UHJvZExpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtbGlua19wcm9kdWN0JylcclxuY29uc3QgbmF2SXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKSlcclxuY29uc3QgbmF2TGlua3MgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1saW5rJykpXHJcbmNvbnN0IG5hdkNvbGxhcHNlcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNvbGxhcHNlJykpXHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSAoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBuYXZQcm9kTGluay5jbGljaygpXHJcbiAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICBtb2RhbEJhY2suY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcblxyXG4gICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG59XHJcblxyXG4vLyBDbGljayBvbiBuYXZpZ2F0aW9uIGJ1cmdlclxyXG5uYXZUb2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZU5hdih0cnVlKVxyXG59KVxyXG5cclxuLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBjbG9zZSBidXR0b25cclxubmF2Q2xvc2UuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT50b2dnbGVOYXYoZmFsc2UpKVxyXG59KVxyXG5cclxubW9kYWxCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG59KVxyXG5cclxuLy8gT3BlbiBhbmQgY2xvc2UgTmF2aWdhdGlvbiBpdGVtc1xyXG5jb25zdCBjb2xsYXBzQWxsTmF2SXRlbSA9ICgpID0+IHtcclxuICAgIG5hdkl0ZW1zLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKSlcclxuICAgIG5hdkxpbmtzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG4gICAgbmF2Q29sbGFwc2VzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKSlcclxufVxyXG5cclxuY29uc3QgdG9nZ2xlTmF2SXRlbSA9IChidG4pID0+IHtcclxuICAgIGNvbnN0IGlzQWN0aXZlID0gYnRuLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuXHJcbiAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcblxyXG4gICAgaWYgKCFpc0FjdGl2ZSkge1xyXG4gICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICBjb25zdCBuYXZJdGVtID0gYnRuLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKVxyXG5cclxuICAgICAgICBpZiAobmF2SXRlbSkge1xyXG4gICAgICAgICAgICBjb25zdCBuYXZDb2xsYXBzZSA9IG5hdkl0ZW0ucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LWNvbGxhcHNlJylcclxuXHJcbiAgICAgICAgICAgIG5hdkl0ZW0uY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIG5hdkNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5uYXZMaW5rcy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0b2dnbGVOYXZJdGVtKHRoaXMpXHJcbiAgICB9KVxyXG59KSIsIiJdfQ==
