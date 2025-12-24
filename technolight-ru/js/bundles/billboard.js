function initBillboardSlider() {

    const billboardVideoContainers = Array.from(document.querySelectorAll('.billboard__slider .swiper-slide'))

    const activeBillboardVideo = (node) => {
        if (!node.classList.contains('activated')) {
            node.classList.add('activated')
        }
    }

    const toggleBillboardVideo = (video) => {
        if (!video.paused) {
            video.pause()
        } else {
            video.play()
        }
    }

    const setBillboardVideoSource = () => {
        billboardVideoContainers.forEach(node => {

        });
    }

    const swiperBillboard = new Swiper('.billboard__slider .swiper', {
        loop: true,
        slidesPerView: 'auto',
        // speed: 3000,
        // observer: true,
        // observeParents: true,
        // observeSlideChildren: true,
        // watchOverflow: true,
        // grabCursor: true,
        // slideToClickedSlide: true,
        breakpoints: {
            768: {
                spaceBetween: 20,
                centeredSlides: true,
                // initialSlide: 1
            },
        },
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false
        // },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.billboard__page_current',
        //     nextEl: '.billboard__page_all',
        // },
        on: {
            init: function () {
                // Set values to the swiper navigation buttons
                // const nodeAll = document.querySelector('.billboard__page_all')
                // const nodeCurrent = document.querySelector('.billboard__page_current')
                // const count = this.slides.length

                // if (count > 1) {
                //     setCountSlides(count, nodeAll)
                //     setCurrentSlide(this.realIndex + 1, nodeCurrent)
                // }

                // Set video resources
                // setBillboardVideoSource()

                const activeSlide = this.slides[this.activeIndex]
                const activeVideo = activeSlide.querySelector('video')
                const activeContainer = activeSlide.querySelector('.billboard__container')
                if (activeVideo) {
                    activeVideo.classList.add('blockedPlay')
                    activeBillboardVideo(activeContainer)
                    activeVideo.muted = true;
                    activeVideo.play();
                }

                setTimeout(() => document.querySelector('.billboard')
                    .classList.remove('inactive'), 100)
            },
            slideChange: function () {
                // Set values to the swiper navigation buttons
                // const nodeCurrent = document.querySelector('.billboard__page_current')
                // setTimeout(() => {
                //     setCurrentSlide(this.realIndex + 1, nodeCurrent)
                // }, 100)

                // Toggle video playing
                billboardVideoContainers.forEach(node => {
                    const video = node.querySelector('video')
                    if (video) video.pause()
                })
                setTimeout(() => {
                    const activeSlide = this.slides[this.activeIndex]
                    const activeContainer = activeSlide.querySelector('.billboard__container')
                    const activeVideo = activeSlide.querySelector('video')
                    if (activeVideo) {
                        const src = activeVideo.dataset.src
                        if (src) {
                            activeVideo.src = src
                            // activeVideo.load()
                            activeVideo.removeAttribute('data-src')
                            activeVideo.play()
                        }
                        if (!activeVideo.classList.contains('blockedPlay')) {
                            activeBillboardVideo(activeContainer)
                            // activeVideo.play()
                        }
                    }
                    if (activeVideo) activeVideo.classList.remove('blockedPlay')
                }, 100)
            }
        }
    });

    // Actions for the video content at the Billboard Swiper
    const addHandlerToBillboardVideo = () => {
        billboardVideoContainers.forEach(el => {
            el.addEventListener('click', function () {
                const container = el.querySelector('.billboard__container')
                const video = el.querySelector('video')

                const isActiveSlide = container.closest('.swiper-slide')
                    .classList.contains('swiper-slide-active')

                if (!video || !isActiveSlide) return

                activeBillboardVideo(container)
                toggleBillboardVideo(video)
            })
        })
    }
    addHandlerToBillboardVideo()

    window.addEventListener('scroll', e => {
        const billboard = document.querySelector('.billboard')
        const videoArr = Array.from(billboard.querySelectorAll('video'))

        videoArr.forEach(video => video.pause())
    })
}

document.addEventListener('DOMContentLoaded', initBillboardSlider)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJiaWxsYm9hcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaW5pdEJpbGxib2FyZFNsaWRlcigpIHtcclxuXHJcbiAgICBjb25zdCBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5iaWxsYm9hcmRfX3NsaWRlciAuc3dpcGVyLXNsaWRlJykpXHJcblxyXG4gICAgY29uc3QgYWN0aXZlQmlsbGJvYXJkVmlkZW8gPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2YXRlZCcpKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZhdGVkJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlQmlsbGJvYXJkVmlkZW8gPSAodmlkZW8pID0+IHtcclxuICAgICAgICBpZiAoIXZpZGVvLnBhdXNlZCkge1xyXG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmlkZW8ucGxheSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEJpbGxib2FyZFZpZGVvU291cmNlID0gKCkgPT4ge1xyXG4gICAgICAgIGJpbGxib2FyZFZpZGVvQ29udGFpbmVycy5mb3JFYWNoKG5vZGUgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzd2lwZXJCaWxsYm9hcmQgPSBuZXcgU3dpcGVyKCcuYmlsbGJvYXJkX19zbGlkZXIgLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICAvLyBzcGVlZDogMzAwMCxcclxuICAgICAgICAvLyBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICAvLyBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICAvLyBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICAvLyB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgIC8vIGdyYWJDdXJzb3I6IHRydWUsXHJcbiAgICAgICAgLy8gc2xpZGVUb0NsaWNrZWRTbGlkZTogdHJ1ZSxcclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMjAsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJlZFNsaWRlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxTbGlkZTogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gYXV0b3BsYXk6IHtcclxuICAgICAgICAvLyAgICAgZGVsYXk6IDUwMDAsXHJcbiAgICAgICAgLy8gICAgIGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIG5hdmlnYXRpb246IHtcclxuICAgICAgICAvLyAgICAgcHJldkVsOiAnLmJpbGxib2FyZF9fcGFnZV9jdXJyZW50JyxcclxuICAgICAgICAvLyAgICAgbmV4dEVsOiAnLmJpbGxib2FyZF9fcGFnZV9hbGwnLFxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IHZhbHVlcyB0byB0aGUgc3dpcGVyIG5hdmlnYXRpb24gYnV0dG9uc1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9kZUFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmRfX3BhZ2VfYWxsJylcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZF9fcGFnZV9jdXJyZW50JylcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGNvdW50ID0gdGhpcy5zbGlkZXMubGVuZ3RoXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgKGNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNldENvdW50U2xpZGVzKGNvdW50LCBub2RlQWxsKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNldEN1cnJlbnRTbGlkZSh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCB2aWRlbyByZXNvdXJjZXNcclxuICAgICAgICAgICAgICAgIC8vIHNldEJpbGxib2FyZFZpZGVvU291cmNlKClcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVTbGlkZSA9IHRoaXMuc2xpZGVzW3RoaXMuYWN0aXZlSW5kZXhdXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVWaWRlbyA9IGFjdGl2ZVNsaWRlLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNvbnRhaW5lciA9IGFjdGl2ZVNsaWRlLnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmRfX2NvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVmlkZW8pIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVWaWRlby5jbGFzc0xpc3QuYWRkKCdibG9ja2VkUGxheScpXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlQmlsbGJvYXJkVmlkZW8oYWN0aXZlQ29udGFpbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZVZpZGVvLm11dGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVWaWRlby5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkJylcclxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKSwgMTAwKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzbGlkZUNoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IHZhbHVlcyB0byB0aGUgc3dpcGVyIG5hdmlnYXRpb24gYnV0dG9uc1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9kZUN1cnJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkX19wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2V0Q3VycmVudFNsaWRlKHRoaXMucmVhbEluZGV4ICsgMSwgbm9kZUN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICAvLyB9LCAxMDApXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVG9nZ2xlIHZpZGVvIHBsYXlpbmdcclxuICAgICAgICAgICAgICAgIGJpbGxib2FyZFZpZGVvQ29udGFpbmVycy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZGVvID0gbm9kZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZGVvKSB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlU2xpZGUgPSB0aGlzLnNsaWRlc1t0aGlzLmFjdGl2ZUluZGV4XVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNvbnRhaW5lciA9IGFjdGl2ZVNsaWRlLnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmRfX2NvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlVmlkZW8gPSBhY3RpdmVTbGlkZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVZpZGVvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNyYyA9IGFjdGl2ZVZpZGVvLmRhdGFzZXQuc3JjXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVZpZGVvLnNyYyA9IHNyY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWN0aXZlVmlkZW8ubG9hZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVWaWRlby5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVZpZGVvLnBsYXkoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYWN0aXZlVmlkZW8uY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkUGxheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVCaWxsYm9hcmRWaWRlbyhhY3RpdmVDb250YWluZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhY3RpdmVWaWRlby5wbGF5KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVmlkZW8pIGFjdGl2ZVZpZGVvLmNsYXNzTGlzdC5yZW1vdmUoJ2Jsb2NrZWRQbGF5JylcclxuICAgICAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFjdGlvbnMgZm9yIHRoZSB2aWRlbyBjb250ZW50IGF0IHRoZSBCaWxsYm9hcmQgU3dpcGVyXHJcbiAgICBjb25zdCBhZGRIYW5kbGVyVG9CaWxsYm9hcmRWaWRlbyA9ICgpID0+IHtcclxuICAgICAgICBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZWwucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZF9fY29udGFpbmVyJylcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZpZGVvID0gZWwucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlU2xpZGUgPSBjb250YWluZXIuY2xvc2VzdCgnLnN3aXBlci1zbGlkZScpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5jb250YWlucygnc3dpcGVyLXNsaWRlLWFjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF2aWRlbyB8fCAhaXNBY3RpdmVTbGlkZSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAgICAgYWN0aXZlQmlsbGJvYXJkVmlkZW8oY29udGFpbmVyKVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlQmlsbGJvYXJkVmlkZW8odmlkZW8pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGFkZEhhbmRsZXJUb0JpbGxib2FyZFZpZGVvKClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgYmlsbGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZCcpXHJcbiAgICAgICAgY29uc3QgdmlkZW9BcnIgPSBBcnJheS5mcm9tKGJpbGxib2FyZC5xdWVyeVNlbGVjdG9yQWxsKCd2aWRlbycpKVxyXG5cclxuICAgICAgICB2aWRlb0Fyci5mb3JFYWNoKHZpZGVvID0+IHZpZGVvLnBhdXNlKCkpXHJcbiAgICB9KVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdEJpbGxib2FyZFNsaWRlcikiXSwiZmlsZSI6ImJpbGxib2FyZC5qcyJ9
