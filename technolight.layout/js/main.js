'use strict';

document.addEventListener("DOMContentLoaded", () => {

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
});


// Deleting blocking of all animation for fix animation artefacts
const removeAnimationBlocker = () => {
    Array.from(document.querySelectorAll('.transition-blocker'))
        .forEach(el => el.classList.remove('transition-blocker'))
}
window.addEventListener('load', removeAnimationBlocker)
document.addEventListener('DOMContentLoaded', removeAnimationBlocker)

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci9zY3JpcHQuanMiLCJmb290ZXIvc2NyaXB0LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BGQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuXHJcbiAgICAvLyBPcGVuIGFuZCBjbG9zZSBtb2JpbGUgbmF2aWdhdGlvblxyXG4gICAgY29uc3QgbmF2Q2xvc2UgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jbG9zZScpKVxyXG4gICAgY29uc3QgbmF2VG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXJfX25hdi1saW5rX21lbnUnKVxyXG4gICAgY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2JylcclxuICAgIGNvbnN0IG1vZGFsQmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1iYWNrJylcclxuICAgIGNvbnN0IG5hdlByb2RMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LWxpbmtfcHJvZHVjdCcpXHJcbiAgICBjb25zdCBuYXZJdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWl0ZW1fd2l0aC1pbm5lcicpKVxyXG4gICAgY29uc3QgbmF2TGlua3MgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1saW5rJykpXHJcbiAgICBjb25zdCBuYXZDb2xsYXBzZXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jb2xsYXBzZScpKVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdiA9IChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5hdlByb2RMaW5rLmNsaWNrKClcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG4gICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuXHJcbiAgICAgICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENsaWNrIG9uIG5hdmlnYXRpb24gYnVyZ2VyXHJcbiAgICBuYXZUb2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9nZ2xlTmF2KHRydWUpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIENsaWNrIG9uIG5hdmlnYXRpb24gY2xvc2UgYnV0dG9uXHJcbiAgICBuYXZDbG9zZS5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT50b2dnbGVOYXYoZmFsc2UpKVxyXG4gICAgfSlcclxuXHJcbiAgICBtb2RhbEJhY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBPcGVuIGFuZCBjbG9zZSBOYXZpZ2F0aW9uIGl0ZW1zXHJcbiAgICBjb25zdCBjb2xsYXBzQWxsTmF2SXRlbSA9ICgpID0+IHtcclxuICAgICAgICBuYXZJdGVtcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJykpXHJcbiAgICAgICAgbmF2TGlua3MuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbiAgICAgICAgbmF2Q29sbGFwc2VzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0b2dnbGVOYXZJdGVtID0gKGJ0bikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gYnRuLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuXHJcbiAgICAgICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG5cclxuICAgICAgICBpZiAoIWlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmF2SXRlbSA9IGJ0bi5jbG9zZXN0KCcuaGVhZGVyX19uYXYtaXRlbV93aXRoLWlubmVyJylcclxuXHJcbiAgICAgICAgICAgIGlmIChuYXZJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYXZDb2xsYXBzZSA9IG5hdkl0ZW0ucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LWNvbGxhcHNlJylcclxuXHJcbiAgICAgICAgICAgICAgICBuYXZJdGVtLmNsYXNzTGlzdC5hZGQoJ2Ryb3BwZWQnKVxyXG4gICAgICAgICAgICAgICAgbmF2Q29sbGFwc2UuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmF2TGlua3MuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0b2dnbGVOYXZJdGVtKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pO1xyXG4iLCIiLCIvLyBEZWxldGluZyBibG9ja2luZyBvZiBhbGwgYW5pbWF0aW9uIGZvciBmaXggYW5pbWF0aW9uIGFydGVmYWN0c1xyXG5jb25zdCByZW1vdmVBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbiAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgndHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbn1cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZW1vdmVBbmltYXRpb25CbG9ja2VyKVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlcilcclxuIl19
