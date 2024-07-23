window.addEventListener('load', () => {
    // Life section Swipers
    const setCountSlides = (num, node) => {
        node.innerText = num
    }

    const setCurrentSlide = (num, node) => {
        node.innerText = num
    }

    const lifeSwiperCommonProps = {
        loop: false,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
    }

    const lifeSwiperContent = new Swiper('.life__content .swiper', {
        ...lifeSwiperCommonProps,
        parallax: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            prevEl: '.life__page_current',
            nextEl: '.life__page_all',
        },
        on: {
            init: function () {
                const nodeAll = document.querySelector('.life__page_all')
                const nodeCurrent = document.querySelector('.life__page_current')
                const count = this.slides.length
                setCountSlides(count, nodeAll)
                setCurrentSlide(this.realIndex + 1, nodeCurrent)
            },
            slideChange: function () {
                const nodeCurrent = document.querySelector('.life__page_current')
                setTimeout(() => {
                    setCurrentSlide(this.realIndex + 1, nodeCurrent)
                }, 100)
            }
        }
    });

    const lifeSwiperBillboard = new Swiper('.life__billboard .swiper', {
        ...lifeSwiperCommonProps,
        // grabCursor: true,
    });

    // Life section swipers mutual controlling
    lifeSwiperContent.controller.control = lifeSwiperBillboard
    lifeSwiperBillboard.controller.control = lifeSwiperContent

    // Billboard section Swipers
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
            const video = node.querySelector('video')

            if (!video) return

            const src = video.dataset.src
            video.src = src
            video.load()
            video.removeAttribute('data-src')
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
                setBillboardVideoSource()

                const activeSlide = this.slides[this.activeIndex]
                const activeVideo = activeSlide.querySelector('video')
                if (activeVideo) activeVideo.classList.add('blockedPlay')

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

                    if (activeVideo && !activeVideo.classList.contains('blockedPlay')) {
                        activeBillboardVideo(activeContainer)
                        activeVideo.play()
                    }

                    if (activeVideo) activeVideo.classList.remove('blockedPlay')
                }, 100)
            }
        }
    });

    // Actions for the video content at the Billboard Swiper
    const addHandlerToBillboardVideo = () => {
        billboardVideoContainers.forEach(el => {
            el.addEventListener('click', function() {
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
})

window.addEventListener('scroll', e => {
    const billboard = document.querySelector('.billboard')
    const videoArr = Array.from(billboard.querySelectorAll('video'))

    videoArr.forEach(video => video.pause())
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIC8vIExpZmUgc2VjdGlvbiBTd2lwZXJzXHJcbiAgICBjb25zdCBzZXRDb3VudFNsaWRlcyA9IChudW0sIG5vZGUpID0+IHtcclxuICAgICAgICBub2RlLmlubmVyVGV4dCA9IG51bVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEN1cnJlbnRTbGlkZSA9IChudW0sIG5vZGUpID0+IHtcclxuICAgICAgICBub2RlLmlubmVyVGV4dCA9IG51bVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJDb21tb25Qcm9wcyA9IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJDb250ZW50ID0gbmV3IFN3aXBlcignLmxpZmVfX2NvbnRlbnQgLnN3aXBlcicsIHtcclxuICAgICAgICAuLi5saWZlU3dpcGVyQ29tbW9uUHJvcHMsXHJcbiAgICAgICAgcGFyYWxsYXg6IHRydWUsXHJcbiAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgcHJldkVsOiAnLmxpZmVfX3BhZ2VfY3VycmVudCcsXHJcbiAgICAgICAgICAgIG5leHRFbDogJy5saWZlX19wYWdlX2FsbCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlQWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZmVfX3BhZ2VfYWxsJylcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZmVfX3BhZ2VfY3VycmVudCcpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudCA9IHRoaXMuc2xpZGVzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgc2V0Q291bnRTbGlkZXMoY291bnQsIG5vZGVBbGwpXHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50U2xpZGUodGhpcy5yZWFsSW5kZXggKyAxLCBub2RlQ3VycmVudClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZmVfX3BhZ2VfY3VycmVudCcpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50U2xpZGUodGhpcy5yZWFsSW5kZXggKyAxLCBub2RlQ3VycmVudClcclxuICAgICAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJCaWxsYm9hcmQgPSBuZXcgU3dpcGVyKCcubGlmZV9fYmlsbGJvYXJkIC5zd2lwZXInLCB7XHJcbiAgICAgICAgLi4ubGlmZVN3aXBlckNvbW1vblByb3BzLFxyXG4gICAgICAgIC8vIGdyYWJDdXJzb3I6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMaWZlIHNlY3Rpb24gc3dpcGVycyBtdXR1YWwgY29udHJvbGxpbmdcclxuICAgIGxpZmVTd2lwZXJDb250ZW50LmNvbnRyb2xsZXIuY29udHJvbCA9IGxpZmVTd2lwZXJCaWxsYm9hcmRcclxuICAgIGxpZmVTd2lwZXJCaWxsYm9hcmQuY29udHJvbGxlci5jb250cm9sID0gbGlmZVN3aXBlckNvbnRlbnRcclxuXHJcbiAgICAvLyBCaWxsYm9hcmQgc2VjdGlvbiBTd2lwZXJzXHJcbiAgICBjb25zdCBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5iaWxsYm9hcmRfX3NsaWRlciAuc3dpcGVyLXNsaWRlJykpXHJcblxyXG4gICAgY29uc3QgYWN0aXZlQmlsbGJvYXJkVmlkZW8gPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2YXRlZCcpKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZhdGVkJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlQmlsbGJvYXJkVmlkZW8gPSAodmlkZW8pID0+IHtcclxuICAgICAgICBpZiAoIXZpZGVvLnBhdXNlZCkge1xyXG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmlkZW8ucGxheSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEJpbGxib2FyZFZpZGVvU291cmNlID0gKCkgPT4ge1xyXG4gICAgICAgIGJpbGxib2FyZFZpZGVvQ29udGFpbmVycy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2aWRlbyA9IG5vZGUucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG5cclxuICAgICAgICAgICAgaWYgKCF2aWRlbykgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcmMgPSB2aWRlby5kYXRhc2V0LnNyY1xyXG4gICAgICAgICAgICB2aWRlby5zcmMgPSBzcmNcclxuICAgICAgICAgICAgdmlkZW8ubG9hZCgpXHJcbiAgICAgICAgICAgIHZpZGVvLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmMnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN3aXBlckJpbGxib2FyZCA9IG5ldyBTd2lwZXIoJy5iaWxsYm9hcmRfX3NsaWRlciAuc3dpcGVyJywge1xyXG4gICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIC8vIHNwZWVkOiAzMDAwLFxyXG4gICAgICAgIC8vIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIC8vIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIC8vIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIC8vIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgLy8gZ3JhYkN1cnNvcjogdHJ1ZSxcclxuICAgICAgICAvLyBzbGlkZVRvQ2xpY2tlZFNsaWRlOiB0cnVlLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAyMCxcclxuICAgICAgICAgICAgICAgIGNlbnRlcmVkU2xpZGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbFNsaWRlOiAxXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBhdXRvcGxheToge1xyXG4gICAgICAgIC8vICAgICBkZWxheTogNTAwMCxcclxuICAgICAgICAvLyAgICAgZGlzYWJsZU9uSW50ZXJhY3Rpb246IGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1wYWdpbmF0aW9uJyxcclxuICAgICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gbmF2aWdhdGlvbjoge1xyXG4gICAgICAgIC8vICAgICBwcmV2RWw6ICcuYmlsbGJvYXJkX19wYWdlX2N1cnJlbnQnLFxyXG4gICAgICAgIC8vICAgICBuZXh0RWw6ICcuYmlsbGJvYXJkX19wYWdlX2FsbCcsXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdmFsdWVzIHRvIHRoZSBzd2lwZXIgbmF2aWdhdGlvbiBidXR0b25zXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBub2RlQWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZF9fcGFnZV9hbGwnKVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9kZUN1cnJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkX19wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgY291bnQgPSB0aGlzLnNsaWRlcy5sZW5ndGhcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoY291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2V0Q291bnRTbGlkZXMoY291bnQsIG5vZGVBbGwpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2V0Q3VycmVudFNsaWRlKHRoaXMucmVhbEluZGV4ICsgMSwgbm9kZUN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IHZpZGVvIHJlc291cmNlc1xyXG4gICAgICAgICAgICAgICAgc2V0QmlsbGJvYXJkVmlkZW9Tb3VyY2UoKVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVNsaWRlID0gdGhpcy5zbGlkZXNbdGhpcy5hY3RpdmVJbmRleF1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVZpZGVvID0gYWN0aXZlU2xpZGUucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVZpZGVvKSBhY3RpdmVWaWRlby5jbGFzc0xpc3QuYWRkKCdibG9ja2VkUGxheScpXHJcblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkJylcclxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKSwgMTAwKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzbGlkZUNoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IHZhbHVlcyB0byB0aGUgc3dpcGVyIG5hdmlnYXRpb24gYnV0dG9uc1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9kZUN1cnJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkX19wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2V0Q3VycmVudFNsaWRlKHRoaXMucmVhbEluZGV4ICsgMSwgbm9kZUN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICAvLyB9LCAxMDApXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVG9nZ2xlIHZpZGVvIHBsYXlpbmdcclxuICAgICAgICAgICAgICAgIGJpbGxib2FyZFZpZGVvQ29udGFpbmVycy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZGVvID0gbm9kZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZGVvKSB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlU2xpZGUgPSB0aGlzLnNsaWRlc1t0aGlzLmFjdGl2ZUluZGV4XVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNvbnRhaW5lciA9IGFjdGl2ZVNsaWRlLnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmRfX2NvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlVmlkZW8gPSBhY3RpdmVTbGlkZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVWaWRlbyAmJiAhYWN0aXZlVmlkZW8uY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkUGxheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUJpbGxib2FyZFZpZGVvKGFjdGl2ZUNvbnRhaW5lcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVmlkZW8ucGxheSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVmlkZW8pIGFjdGl2ZVZpZGVvLmNsYXNzTGlzdC5yZW1vdmUoJ2Jsb2NrZWRQbGF5JylcclxuICAgICAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFjdGlvbnMgZm9yIHRoZSB2aWRlbyBjb250ZW50IGF0IHRoZSBCaWxsYm9hcmQgU3dpcGVyXHJcbiAgICBjb25zdCBhZGRIYW5kbGVyVG9CaWxsYm9hcmRWaWRlbyA9ICgpID0+IHtcclxuICAgICAgICBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBlbC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkX19jb250YWluZXInKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlkZW8gPSBlbC5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmVTbGlkZSA9IGNvbnRhaW5lci5jbG9zZXN0KCcuc3dpcGVyLXNsaWRlJylcclxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKCdzd2lwZXItc2xpZGUtYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXZpZGVvIHx8ICFpc0FjdGl2ZVNsaWRlKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgICAgICBhY3RpdmVCaWxsYm9hcmRWaWRlbyhjb250YWluZXIpXHJcbiAgICAgICAgICAgICAgICB0b2dnbGVCaWxsYm9hcmRWaWRlbyh2aWRlbylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgYWRkSGFuZGxlclRvQmlsbGJvYXJkVmlkZW8oKVxyXG59KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGUgPT4ge1xyXG4gICAgY29uc3QgYmlsbGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZCcpXHJcbiAgICBjb25zdCB2aWRlb0FyciA9IEFycmF5LmZyb20oYmlsbGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3ZpZGVvJykpXHJcblxyXG4gICAgdmlkZW9BcnIuZm9yRWFjaCh2aWRlbyA9PiB2aWRlby5wYXVzZSgpKVxyXG59KVxyXG4iXSwiZmlsZSI6ImhvbWUuanMifQ==
