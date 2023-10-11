'use strict';

window.addEventListener('load', () => {
    // Life section Swipers
    const setCoutnSlides = (num, node) => {
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

    const lifeSwiperContennt = new Swiper('.life__content .swiper', {
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
                setCoutnSlides(count, nodeAll)
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
        grabCursor: true,
    });

    // Life section swipers mutual controlling
    lifeSwiperContennt.controller.control = lifeSwiperBillboard
    lifeSwiperBillboard.controller.control = lifeSwiperContennt

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
        speed: 3000,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        grabCursor: true,
        slideToClickedSlide: true,
        breakpoints: {
            768: {
                spaceBetween: 20,
                centeredSlides: true
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
        navigation: {
            prevEl: '.billboard__page_current',
            nextEl: '.billboard__page_all',
        },
        on: {
            init: function () {
                // Set values to the swiper navigation buttons
                const nodeAll = document.querySelector('.billboard__page_all')
                const nodeCurrent = document.querySelector('.billboard__page_current')
                const count = this.slides.length
                setCoutnSlides(count, nodeAll)
                setCurrentSlide(this.realIndex + 1, nodeCurrent)

                // Set video resources
                setBillboardVideoSource()
                const activeSlide = this.slides[this.activeIndex]
                const activeVideo = activeSlide.querySelector('video')
                activeVideo.classList.add('blockedPlay')


                setTimeout(() => document.querySelector('.billboard')
                    .classList.remove('inactive'), 100)
            },
            slideChange: function () {
                // Set values to the swiper navigation buttons
                const nodeCurrent = document.querySelector('.billboard__page_current')
                setTimeout(() => {
                    setCurrentSlide(this.realIndex + 1, nodeCurrent)
                }, 100)

                // Toggle vidoe plaing
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
    const addHandlerToBillboardVidoe = () => {
        billboardVideoContainers.forEach(el => {
            el.addEventListener('click', function() {
                const container = el.querySelector('.billboard__container')
                const video = el.querySelector('video')

                if (!video) return

                activeBillboardVideo(container)
                toggleBillboardVideo(video)
            })
        })
    }
    addHandlerToBillboardVidoe()










// // Видео в слайдере на главной странице -- START
// $(document).ready(() => {
//     $('.img-wrap_video .btn-play').on('click', function() {
//         $(this).closest('.img-wrap_video').addClass('played');
//         $(this).closest('.img-wrap_video').find('video')[0].play();
//     });

//     function setSliderVideoSrc() {
//         const winWidth = $(window).width();
        
//         $('.img-wrap_video video').each((i, el) => {
//             const imgClass = winWidth > 768 ? '.desc_img' : '.mob_img';

//             const poster = $(el).closest('.img-wrap_video')
//                 .find(imgClass)[0].dataset.src;

//             const src = winWidth > 768
//                 ? el.dataset.srcDesc
//                 : el.dataset.srcMob;

//             $(el).attr('src', src);
//             $(el).attr('poster', poster);
//         });
//     }

//     setSliderVideoSrc();
//     window.addEventListener('resize', setSliderVideoSrc);
// });
// // Видео в слайдере на главной странице -- FINISH








})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIC8vIExpZmUgc2VjdGlvbiBTd2lwZXJzXHJcbiAgICBjb25zdCBzZXRDb3V0blNsaWRlcyA9IChudW0sIG5vZGUpID0+IHtcclxuICAgICAgICBub2RlLmlubmVyVGV4dCA9IG51bVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEN1cnJlbnRTbGlkZSA9IChudW0sIG5vZGUpID0+IHtcclxuICAgICAgICBub2RlLmlubmVyVGV4dCA9IG51bVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJDb21tb25Qcm9wcyA9IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJDb250ZW5udCA9IG5ldyBTd2lwZXIoJy5saWZlX19jb250ZW50IC5zd2lwZXInLCB7XHJcbiAgICAgICAgLi4ubGlmZVN3aXBlckNvbW1vblByb3BzLFxyXG4gICAgICAgIHBhcmFsbGF4OiB0cnVlLFxyXG4gICAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxyXG4gICAgICAgICAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgIHByZXZFbDogJy5saWZlX19wYWdlX2N1cnJlbnQnLFxyXG4gICAgICAgICAgICBuZXh0RWw6ICcubGlmZV9fcGFnZV9hbGwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saWZlX19wYWdlX2FsbCcpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlQ3VycmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saWZlX19wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLnNsaWRlcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIHNldENvdXRuU2xpZGVzKGNvdW50LCBub2RlQWxsKVxyXG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudFNsaWRlKHRoaXMucmVhbEluZGV4ICsgMSwgbm9kZUN1cnJlbnQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNsaWRlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlQ3VycmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saWZlX19wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFNsaWRlKHRoaXMucmVhbEluZGV4ICsgMSwgbm9kZUN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICB9LCAxMDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBsaWZlU3dpcGVyQmlsbGJvYXJkID0gbmV3IFN3aXBlcignLmxpZmVfX2JpbGxib2FyZCAuc3dpcGVyJywge1xyXG4gICAgICAgIC4uLmxpZmVTd2lwZXJDb21tb25Qcm9wcyxcclxuICAgICAgICBncmFiQ3Vyc29yOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTGlmZSBzZWN0aW9uIHN3aXBlcnMgbXV0dWFsIGNvbnRyb2xsaW5nXHJcbiAgICBsaWZlU3dpcGVyQ29udGVubnQuY29udHJvbGxlci5jb250cm9sID0gbGlmZVN3aXBlckJpbGxib2FyZFxyXG4gICAgbGlmZVN3aXBlckJpbGxib2FyZC5jb250cm9sbGVyLmNvbnRyb2wgPSBsaWZlU3dpcGVyQ29udGVubnRcclxuXHJcbiAgICAvLyBCaWxsYm9hcmQgc2VjdGlvbiBTd2lwZXJzXHJcbiAgICBjb25zdCBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5iaWxsYm9hcmRfX3NsaWRlciAuc3dpcGVyLXNsaWRlJykpXHJcblxyXG4gICAgY29uc3QgYWN0aXZlQmlsbGJvYXJkVmlkZW8gPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2YXRlZCcpKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZhdGVkJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlQmlsbGJvYXJkVmlkZW8gPSAodmlkZW8pID0+IHtcclxuICAgICAgICBpZiAoIXZpZGVvLnBhdXNlZCkge1xyXG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmlkZW8ucGxheSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEJpbGxib2FyZFZpZGVvU291cmNlID0gKCkgPT4ge1xyXG4gICAgICAgIGJpbGxib2FyZFZpZGVvQ29udGFpbmVycy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2aWRlbyA9IG5vZGUucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG5cclxuICAgICAgICAgICAgaWYgKCF2aWRlbykgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcmMgPSB2aWRlby5kYXRhc2V0LnNyY1xyXG4gICAgICAgICAgICB2aWRlby5zcmMgPSBzcmNcclxuICAgICAgICAgICAgdmlkZW8ubG9hZCgpXHJcbiAgICAgICAgICAgIHZpZGVvLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmMnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN3aXBlckJpbGxib2FyZCA9IG5ldyBTd2lwZXIoJy5iaWxsYm9hcmRfX3NsaWRlciAuc3dpcGVyJywge1xyXG4gICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIHNwZWVkOiAzMDAwLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgZ3JhYkN1cnNvcjogdHJ1ZSxcclxuICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiB0cnVlLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAyMCxcclxuICAgICAgICAgICAgICAgIGNlbnRlcmVkU2xpZGVzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBhdXRvcGxheToge1xyXG4gICAgICAgIC8vICAgICBkZWxheTogNTAwMCxcclxuICAgICAgICAvLyAgICAgZGlzYWJsZU9uSW50ZXJhY3Rpb246IGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1wYWdpbmF0aW9uJyxcclxuICAgICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICBwcmV2RWw6ICcuYmlsbGJvYXJkX19wYWdlX2N1cnJlbnQnLFxyXG4gICAgICAgICAgICBuZXh0RWw6ICcuYmlsbGJvYXJkX19wYWdlX2FsbCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdmFsdWVzIHRvIHRoZSBzd2lwZXIgbmF2aWdhdGlvbiBidXR0b25zXHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlQWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZF9fcGFnZV9hbGwnKVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUN1cnJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkX19wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLnNsaWRlcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIHNldENvdXRuU2xpZGVzKGNvdW50LCBub2RlQWxsKVxyXG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudFNsaWRlKHRoaXMucmVhbEluZGV4ICsgMSwgbm9kZUN1cnJlbnQpXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IHZpZGVvIHJlc291cmNlc1xyXG4gICAgICAgICAgICAgICAgc2V0QmlsbGJvYXJkVmlkZW9Tb3VyY2UoKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlU2xpZGUgPSB0aGlzLnNsaWRlc1t0aGlzLmFjdGl2ZUluZGV4XVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlVmlkZW8gPSBhY3RpdmVTbGlkZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcbiAgICAgICAgICAgICAgICBhY3RpdmVWaWRlby5jbGFzc0xpc3QuYWRkKCdibG9ja2VkUGxheScpXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJyksIDEwMClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNldCB2YWx1ZXMgdG8gdGhlIHN3aXBlciBuYXZpZ2F0aW9uIGJ1dHRvbnNcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZF9fcGFnZV9jdXJyZW50JylcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRTbGlkZSh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB2aWRvZSBwbGFpbmdcclxuICAgICAgICAgICAgICAgIGJpbGxib2FyZFZpZGVvQ29udGFpbmVycy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZGVvID0gbm9kZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZGVvKSB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlU2xpZGUgPSB0aGlzLnNsaWRlc1t0aGlzLmFjdGl2ZUluZGV4XVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNvbnRhaW5lciA9IGFjdGl2ZVNsaWRlLnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmRfX2NvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlVmlkZW8gPSBhY3RpdmVTbGlkZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVWaWRlbyAmJiAhYWN0aXZlVmlkZW8uY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkUGxheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUJpbGxib2FyZFZpZGVvKGFjdGl2ZUNvbnRhaW5lcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVmlkZW8ucGxheSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVmlkZW8pIGFjdGl2ZVZpZGVvLmNsYXNzTGlzdC5yZW1vdmUoJ2Jsb2NrZWRQbGF5JylcclxuICAgICAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFjdGlvbnMgZm9yIHRoZSB2aWRlbyBjb250ZW50IGF0IHRoZSBCaWxsYm9hcmQgU3dpcGVyXHJcbiAgICBjb25zdCBhZGRIYW5kbGVyVG9CaWxsYm9hcmRWaWRvZSA9ICgpID0+IHtcclxuICAgICAgICBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBlbC5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkX19jb250YWluZXInKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlkZW8gPSBlbC5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF2aWRlbykgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAgICAgYWN0aXZlQmlsbGJvYXJkVmlkZW8oY29udGFpbmVyKVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlQmlsbGJvYXJkVmlkZW8odmlkZW8pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGFkZEhhbmRsZXJUb0JpbGxib2FyZFZpZG9lKClcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIC8vINCS0LjQtNC10L4g0LIg0YHQu9Cw0LnQtNC10YDQtSDQvdCwINCz0LvQsNCy0L3QvtC5INGB0YLRgNCw0L3QuNGG0LUgLS0gU1RBUlRcclxuLy8gJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4vLyAgICAgJCgnLmltZy13cmFwX3ZpZGVvIC5idG4tcGxheScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmltZy13cmFwX3ZpZGVvJykuYWRkQ2xhc3MoJ3BsYXllZCcpO1xyXG4vLyAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmltZy13cmFwX3ZpZGVvJykuZmluZCgndmlkZW8nKVswXS5wbGF5KCk7XHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICBmdW5jdGlvbiBzZXRTbGlkZXJWaWRlb1NyYygpIHtcclxuLy8gICAgICAgICBjb25zdCB3aW5XaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgIFxyXG4vLyAgICAgICAgICQoJy5pbWctd3JhcF92aWRlbyB2aWRlbycpLmVhY2goKGksIGVsKSA9PiB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGltZ0NsYXNzID0gd2luV2lkdGggPiA3NjggPyAnLmRlc2NfaW1nJyA6ICcubW9iX2ltZyc7XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBwb3N0ZXIgPSAkKGVsKS5jbG9zZXN0KCcuaW1nLXdyYXBfdmlkZW8nKVxyXG4vLyAgICAgICAgICAgICAgICAgLmZpbmQoaW1nQ2xhc3MpWzBdLmRhdGFzZXQuc3JjO1xyXG5cclxuLy8gICAgICAgICAgICAgY29uc3Qgc3JjID0gd2luV2lkdGggPiA3NjhcclxuLy8gICAgICAgICAgICAgICAgID8gZWwuZGF0YXNldC5zcmNEZXNjXHJcbi8vICAgICAgICAgICAgICAgICA6IGVsLmRhdGFzZXQuc3JjTW9iO1xyXG5cclxuLy8gICAgICAgICAgICAgJChlbCkuYXR0cignc3JjJywgc3JjKTtcclxuLy8gICAgICAgICAgICAgJChlbCkuYXR0cigncG9zdGVyJywgcG9zdGVyKTtcclxuLy8gICAgICAgICB9KTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBzZXRTbGlkZXJWaWRlb1NyYygpO1xyXG4vLyAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHNldFNsaWRlclZpZGVvU3JjKTtcclxuLy8gfSk7XHJcbi8vIC8vINCS0LjQtNC10L4g0LIg0YHQu9Cw0LnQtNC10YDQtSDQvdCwINCz0LvQsNCy0L3QvtC5INGB0YLRgNCw0L3QuNGG0LUgLS0gRklOSVNIXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxufSlcclxuIl0sImZpbGUiOiJob21lLmpzIn0=
