'use strict';

// Life section Swipers
const setCoutnLifeSlides = (count) => {
    const node = document.querySelector('.life__page_all')
    node.innerText = count
}

const setCurrentLifeSlide = (current) => {
    const node = document.querySelector('.life__page_current')
    node.innerText = current
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
            const count = this.slides.length
            setCoutnLifeSlides(count)
            setCurrentLifeSlide(this.realIndex + 1)
        },
        slideChange: function () {
            setTimeout(() => {
                setCurrentLifeSlide(this.realIndex + 1)
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMaWZlIHNlY3Rpb24gU3dpcGVyc1xyXG5jb25zdCBzZXRDb3V0bkxpZmVTbGlkZXMgPSAoY291bnQpID0+IHtcclxuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlmZV9fcGFnZV9hbGwnKVxyXG4gICAgbm9kZS5pbm5lclRleHQgPSBjb3VudFxyXG59XHJcblxyXG5jb25zdCBzZXRDdXJyZW50TGlmZVNsaWRlID0gKGN1cnJlbnQpID0+IHtcclxuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlmZV9fcGFnZV9jdXJyZW50JylcclxuICAgIG5vZGUuaW5uZXJUZXh0ID0gY3VycmVudFxyXG59XHJcblxyXG5jb25zdCBsaWZlU3dpcGVyQ29tbW9uUHJvcHMgPSB7XHJcbiAgICBsb29wOiBmYWxzZSxcclxuICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbn1cclxuXHJcbmNvbnN0IGxpZmVTd2lwZXJDb250ZW5udCA9IG5ldyBTd2lwZXIoJy5saWZlX19jb250ZW50IC5zd2lwZXInLCB7XHJcbiAgICAuLi5saWZlU3dpcGVyQ29tbW9uUHJvcHMsXHJcbiAgICBwYXJhbGxheDogdHJ1ZSxcclxuICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICBwcmV2RWw6ICcubGlmZV9fcGFnZV9jdXJyZW50JyxcclxuICAgICAgICBuZXh0RWw6ICcubGlmZV9fcGFnZV9hbGwnLFxyXG4gICAgfSxcclxuICAgIG9uOiB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IHRoaXMuc2xpZGVzLmxlbmd0aFxyXG4gICAgICAgICAgICBzZXRDb3V0bkxpZmVTbGlkZXMoY291bnQpXHJcbiAgICAgICAgICAgIHNldEN1cnJlbnRMaWZlU2xpZGUodGhpcy5yZWFsSW5kZXggKyAxKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50TGlmZVNsaWRlKHRoaXMucmVhbEluZGV4ICsgMSlcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG5jb25zdCBsaWZlU3dpcGVyQmlsbGJvYXJkID0gbmV3IFN3aXBlcignLmxpZmVfX2JpbGxib2FyZCAuc3dpcGVyJywge1xyXG4gICAgLi4ubGlmZVN3aXBlckNvbW1vblByb3BzLFxyXG4gICAgZ3JhYkN1cnNvcjogdHJ1ZSxcclxufSk7XHJcblxyXG4vLyBMaWZlIHNlY3Rpb24gc3dpcGVycyBtdXR1YWwgY29udHJvbGxpbmdcclxubGlmZVN3aXBlckNvbnRlbm50LmNvbnRyb2xsZXIuY29udHJvbCA9IGxpZmVTd2lwZXJCaWxsYm9hcmRcclxubGlmZVN3aXBlckJpbGxib2FyZC5jb250cm9sbGVyLmNvbnRyb2wgPSBsaWZlU3dpcGVyQ29udGVubnRcclxuIl0sImZpbGUiOiJob21lLmpzIn0=
