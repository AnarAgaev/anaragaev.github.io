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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci9zY3JpcHQuanMiLCJoZWFkZXIvc2NyaXB0LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEZBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XHJcblxyXG4gICAgLy8gT3BlbiBhbmQgY2xvc2UgbW9iaWxlIG5hdmlnYXRpb25cclxuICAgIGNvbnN0IG5hdkNsb3NlID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY2xvc2UnKSlcclxuICAgIGNvbnN0IG5hdlRvZ2dsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyX19uYXYtbGlua19tZW51JylcclxuICAgIGNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpXHJcbiAgICBjb25zdCBtb2RhbEJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtYmFjaycpXHJcbiAgICBjb25zdCBuYXZQcm9kTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1saW5rX3Byb2R1Y3QnKVxyXG4gICAgY29uc3QgbmF2SXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKSlcclxuICAgIGNvbnN0IG5hdkxpbmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtbGluaycpKVxyXG4gICAgY29uc3QgbmF2Q29sbGFwc2VzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKSlcclxuXHJcbiAgICBjb25zdCB0b2dnbGVOYXYgPSAoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuYXZQcm9kTGluay5jbGljaygpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJylcclxuICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGJ1cmdlclxyXG4gICAgbmF2VG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvZ2dsZU5hdih0cnVlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGNsb3NlIGJ1dHRvblxyXG4gICAgbmF2Q2xvc2UuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+dG9nZ2xlTmF2KGZhbHNlKSlcclxuICAgIH0pXHJcblxyXG4gICAgbW9kYWxCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gT3BlbiBhbmQgY2xvc2UgTmF2aWdhdGlvbiBpdGVtc1xyXG4gICAgY29uc3QgY29sbGFwc0FsbE5hdkl0ZW0gPSAoKSA9PiB7XHJcbiAgICAgICAgbmF2SXRlbXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpKVxyXG4gICAgICAgIG5hdkxpbmtzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG4gICAgICAgIG5hdkNvbGxhcHNlcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJykpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTmF2SXRlbSA9IChidG4pID0+IHtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuXHJcbiAgICAgICAgaWYgKCFpc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5hdkl0ZW0gPSBidG4uY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWl0ZW1fd2l0aC1pbm5lcicpXHJcblxyXG4gICAgICAgICAgICBpZiAobmF2SXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF2Q29sbGFwc2UgPSBuYXZJdGVtLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1jb2xsYXBzZScpXHJcblxyXG4gICAgICAgICAgICAgICAgbmF2SXRlbS5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgICAgIG5hdkNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hdkxpbmtzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2SXRlbSh0aGlzKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KTtcclxuIiwiIl19
