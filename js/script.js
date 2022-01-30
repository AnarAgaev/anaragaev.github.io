let timerIntervalId;

const normalizeDatetime = (data) => {
    const year = data.getFullYear(),
        day = data.getDate(),
        hour = data.getHours(),

        minutes = data.getMinutes() < 9
            ? `0${data.getMinutes()}`
            : data.getMinutes(),

        month = data.getMonth() < 10
            ? `0${data.getMonth() + 1}`
            : data.getMonth() + 1;

    return `${day}.${month}.${year} ${hour}:${minutes}`;
};

const timer = () => {
    const datetime = document
        .getElementById('currentNoteDatetime');

    datetime.innerText = normalizeDatetime(new Date());
};

const initTimer = () => {
    timer();
    timerIntervalId = setInterval(timer, 1000);
};

const clearTimer = () => {
    clearInterval(timerIntervalId);
};

const htmlNodeConstructor = (note) => {
    const htmlNode = document.createElement('li');

    htmlNode.classList.add('list__item', 'hide');

    htmlNode.dataset.id = note.id;
    htmlNode.dataset.description = note.description;
    htmlNode.dataset.datetime = note.datetime;

    htmlNode.innerHTML = `<h3 class="list__caption"><span class="list__title">${note.caption}</span>
            <button class="list__delete" type="button" data-id="${note.id}">
                <img src="img/ic_delete.svg" alt="" title="">
            </button>
        </h3>
        <p class="list__datetime">
            <img src="img/ic_calendar.svg" alt="" title="">
            ${note.datetime}
        </p>`;

    const delBtn = htmlNode.querySelector('.list__delete');

    delBtn.addEventListener('click', () => deleteNote(delBtn));
    htmlNode.addEventListener('click', () => selectNote(htmlNode));

    return htmlNode;
};

const addNoteToList = (note) => {
    const list = document.getElementById('noteList');
    const htmlNode = htmlNodeConstructor(note);

    list.prepend(htmlNode);

    cleanCurrentNote();
    hideCloseBtn();
    toggleBtn(document.getElementById('saveNoteBtn'), true);
    clearTimer();
    initTimer();

    setTimeout(
        () => htmlNode.classList.remove('hide'),
        100
    );
};

const saveNote = async () => {

    const form = document.getElementById('form');
    const formData = new FormData(form)

    const response = await fetch('https://quiz24.ru/portfolio/icon-scin/hendlers.php', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const result = await response.json();
        const id = formData.get('id')

        if (id) {
            const item = document.querySelector(`[data-id="${id}"]`);
            const caption = item.querySelector(`.list__title`);

            caption.innerText = result.note.caption;
            item.dataset.dataDescription = result.note.description;

        } else {
            addNoteToList(result.note);
            toggleBtn(document.getElementById('cleanNotesBtn'), false);
            console.log('Дабавили заметку:', result);
        }
    } else {
        alert("Ошибка HTTP запроса: " + response.status);
    }
};

const cleanCurrentNote = () => {
    document.getElementById('description').value = '';
};

const hideCloseBtn = () => {
    document
        .getElementById('clearNoteBtn')
        .classList
        .add('hide');
};

const showCloseBtn = () => {
    document
        .getElementById('clearNoteBtn')
        .classList
        .remove('hide');
};

const removeNote = (note, timeout= 1000) => {
    setTimeout(
        () => {
            note.parentNode.removeChild(note);
        },
        timeout
    );
};

const hideNote = (note, timeout) => {
    setTimeout(
        () => {
            note.classList.add('hide');
            removeNote(note);
        },
        timeout
    );
};

const toggleBtn = (btn, direction) => {
    btn.disabled = direction;
};

const removeNoteList = () => {
    const notes = document.getElementsByClassName('list__item'),
        arrNotes = Array.from(notes);

    toggleBtn(document.getElementById('cleanNotesBtn'), true);
    toggleBtn(document.getElementById('getNoteList'), false);
    toggleBtn(document.getElementById('deleteBtn'), true);

    document.getElementById('deleteBtn').dataset.id = '';

    removeCurrentNote();

    arrNotes.forEach(note => {
        note.classList.add('hide');
        removeNote(note, 300);
    });
};

const checkDescription = () => {
    const val = document
        .getElementById('description')
        .value;

    const btnSave = document
        .getElementById('saveNoteBtn');

    const btnClear = document
        .getElementById('clearNoteBtn');

    btnSave.disabled = val === '';

    val === ''
        ? btnClear.classList.add('hide')
        : btnClear.classList.remove('hide');
};

const removeCurrentNote = () => {
    cleanCurrentNote();
    hideCloseBtn();
    clearTimer();
    initTimer();
    unselectNote();
    toggleBtn(document.getElementById('saveNoteBtn'), true);
    toggleBtn(document.getElementById('deleteBtn'), true);

    document.getElementById('currentNoteId').value = '';
};

const buildNoteList = (arrItems) => {
    const list = document.getElementById('noteList');

    arrItems.forEach((note, idx) => {
        const htmlNode = htmlNodeConstructor(note);

        list.append(htmlNode);

        setTimeout(
            () => htmlNode.classList.remove('hide'),
            idx * 100
        );
    });
};

const getNoteList = async () => {

    const formData = new FormData();

    toggleBtn(document.getElementById('getNoteList'), true);
    toggleBtn(document.getElementById('cleanNotesBtn'), false);

    formData.append('action', 'get');

    const response = await fetch('https://quiz24.ru/portfolio/icon-scin//hendlers.php', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const result = await response.json();
        buildNoteList(result.notes);
        toggleBtn(document.getElementById('cleanNotesBtn'), false);
        console.log('Запросили списсок заматое:', result);
    } else {
        alert("Ошибка HTTP запроса: " + response.status);
    }
};

const selectNote = note => {
    const currentSelectedNote = document.querySelector('.list__item_selected');
    const deleteBtn = document.getElementById('deleteBtn');
    const desc = document.getElementById('description');
    const datetime = document.getElementById('currentNoteDatetime');
    const currentNoteId = document.getElementById('currentNoteId');

    toggleBtn(deleteBtn, false);
    deleteBtn.dataset.id = note.dataset.id;

    desc.value = note.dataset.description;
    datetime.innerText = note.dataset.datetime;

    clearTimer();
    showCloseBtn();

    toggleBtn(document.getElementById('saveNoteBtn'), false);

    currentNoteId.value = note.dataset.id;

    if (currentSelectedNote) {
        currentSelectedNote.classList.remove('list__item_selected');
    }

    note.classList.add('list__item_selected')
};

const unselectNote = () => {
    const selectedNote =  document
        .querySelector('.list__item_selected');

    if (selectedNote) {
        selectedNote
            .classList
            .remove('list__item_selected');
    }
};

const deleteNote = async (htmlNode) => {
    const deleteNoteId = htmlNode.dataset.id;
    const formData = new FormData();

    formData.append('action', 'delete');
    formData.append('id', deleteNoteId);

    const response = await fetch('https://quiz24.ru/portfolio/icon-scin/hendlers.php', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const result = await response.json();
        const node = document.querySelector(`.list__item[data-id="${result.note}"]`)

        removeCurrentNote();
        hideNote(node, 0);
        node.classList.add('collapsed');

        console.log('Удалили заметку с ИД:', deleteNoteId);
    } else {
        alert("Ошибка HTTP запроса: " + response.status);
    }
};

document.addEventListener("DOMContentLoaded", () => {

    // Иницифлизируем таймер текущего
    // времени при первой загрузке
    // страницы
    initTimer();

    // Прверяем текс заметки на вилаидность
    document
        .getElementById('description')
        .addEventListener('input', checkDescription);

    // Сохраняем заметку в БД
    document
        .getElementById('saveNoteBtn')
        .addEventListener('click', () => {
            const isText = document
                .querySelector('#form textarea')
                .value !== '';

            if (isText) saveNote();
        });

    // Очищаем списов заметок
    document
        .getElementById('cleanNotesBtn')
        .addEventListener('click', removeNoteList);

    // Загружаем список элементов
    document
        .getElementById('getNoteList')
        .addEventListener('click', getNoteList);

    // Закрываем заметку, если передумали
    document
        .getElementById('clearNoteBtn')
        .addEventListener('click', removeCurrentNote);

    // Удаляем заметку
    document
        .getElementById('deleteBtn')
        .addEventListener(
            'click',
                e => deleteNote(e.target));
});
// $(document).ready(() => {
//     $('[data-toggle="modal"]').click(e => {
//         showModal(e.target);
//     });
//
//     window.showModal = function (el) {
//         let modal = $(el).data('target');
//
//         if (!modal) {
//             modal = $(el)
//                 .closest('[data-toggle="modal"]')
//                 .data('target');
//         }
//
//         const video = $(modal).find('video')[0];
//
//         $(modal).addClass('show');
//         if (video) video.play();
//     };
//
//     $('.modal').click(e => {
//        if (isActionNode(e.target)) {
//            hideModal(e.target);
//        }
//     });
//
//     const hideModal = function (el) {
//         let modal = $(el).closest('.modal'),
//             video = $(modal).find('video')[0],
//             dialogs = $(modal).find('.modal__dialog');
//
//         if (video) {
//             video.pause();
//             video.currentTime = 0;
//         }
//
//         modal.removeClass('show');
//
//         // Если в модальном окне несколько диалоговых окно,
//         // оставляем видимым только первое
//         if (dialogs.length > 1) {
//
//             setTimeout(e => {
//                 $(dialogs[0])
//                     .removeClass('modal__dialog_hide hidden');
//
//                 dialogs
//                     .filter(idx => idx > 0)
//                     .addClass('modal__dialog_hide hidden');
//             }, 500);
//         }
//     };
//
//     const isActionNode = function (el) {
//         return $(el).hasClass('modal') || $(el).hasClass('modalCloseBtn');
//     };
// });
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtb2RhbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpbWVySW50ZXJ2YWxJZDtcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZURhdGV0aW1lID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRhLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgICAgZGF5ID0gZGF0YS5nZXREYXRlKCksXHJcbiAgICAgICAgaG91ciA9IGRhdGEuZ2V0SG91cnMoKSxcclxuXHJcbiAgICAgICAgbWludXRlcyA9IGRhdGEuZ2V0TWludXRlcygpIDwgOVxyXG4gICAgICAgICAgICA/IGAwJHtkYXRhLmdldE1pbnV0ZXMoKX1gXHJcbiAgICAgICAgICAgIDogZGF0YS5nZXRNaW51dGVzKCksXHJcblxyXG4gICAgICAgIG1vbnRoID0gZGF0YS5nZXRNb250aCgpIDwgMTBcclxuICAgICAgICAgICAgPyBgMCR7ZGF0YS5nZXRNb250aCgpICsgMX1gXHJcbiAgICAgICAgICAgIDogZGF0YS5nZXRNb250aCgpICsgMTtcclxuXHJcbiAgICByZXR1cm4gYCR7ZGF5fS4ke21vbnRofS4ke3llYXJ9ICR7aG91cn06JHttaW51dGVzfWA7XHJcbn07XHJcblxyXG5jb25zdCB0aW1lciA9ICgpID0+IHtcclxuICAgIGNvbnN0IGRhdGV0aW1lID0gZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoJ2N1cnJlbnROb3RlRGF0ZXRpbWUnKTtcclxuXHJcbiAgICBkYXRldGltZS5pbm5lclRleHQgPSBub3JtYWxpemVEYXRldGltZShuZXcgRGF0ZSgpKTtcclxufTtcclxuXHJcbmNvbnN0IGluaXRUaW1lciA9ICgpID0+IHtcclxuICAgIHRpbWVyKCk7XHJcbiAgICB0aW1lckludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aW1lciwgMTAwMCk7XHJcbn07XHJcblxyXG5jb25zdCBjbGVhclRpbWVyID0gKCkgPT4ge1xyXG4gICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFsSWQpO1xyXG59O1xyXG5cclxuY29uc3QgaHRtbE5vZGVDb25zdHJ1Y3RvciA9IChub3RlKSA9PiB7XHJcbiAgICBjb25zdCBodG1sTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcblxyXG4gICAgaHRtbE5vZGUuY2xhc3NMaXN0LmFkZCgnbGlzdF9faXRlbScsICdoaWRlJyk7XHJcblxyXG4gICAgaHRtbE5vZGUuZGF0YXNldC5pZCA9IG5vdGUuaWQ7XHJcbiAgICBodG1sTm9kZS5kYXRhc2V0LmRlc2NyaXB0aW9uID0gbm90ZS5kZXNjcmlwdGlvbjtcclxuICAgIGh0bWxOb2RlLmRhdGFzZXQuZGF0ZXRpbWUgPSBub3RlLmRhdGV0aW1lO1xyXG5cclxuICAgIGh0bWxOb2RlLmlubmVySFRNTCA9IGA8aDMgY2xhc3M9XCJsaXN0X19jYXB0aW9uXCI+PHNwYW4gY2xhc3M9XCJsaXN0X190aXRsZVwiPiR7bm90ZS5jYXB0aW9ufTwvc3Bhbj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImxpc3RfX2RlbGV0ZVwiIHR5cGU9XCJidXR0b25cIiBkYXRhLWlkPVwiJHtub3RlLmlkfVwiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCJpbWcvaWNfZGVsZXRlLnN2Z1wiIGFsdD1cIlwiIHRpdGxlPVwiXCI+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvaDM+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJsaXN0X19kYXRldGltZVwiPlxyXG4gICAgICAgICAgICA8aW1nIHNyYz1cImltZy9pY19jYWxlbmRhci5zdmdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiPlxyXG4gICAgICAgICAgICAke25vdGUuZGF0ZXRpbWV9XHJcbiAgICAgICAgPC9wPmA7XHJcblxyXG4gICAgY29uc3QgZGVsQnRuID0gaHRtbE5vZGUucXVlcnlTZWxlY3RvcignLmxpc3RfX2RlbGV0ZScpO1xyXG5cclxuICAgIGRlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGRlbGV0ZU5vdGUoZGVsQnRuKSk7XHJcbiAgICBodG1sTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbGVjdE5vdGUoaHRtbE5vZGUpKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbE5vZGU7XHJcbn07XHJcblxyXG5jb25zdCBhZGROb3RlVG9MaXN0ID0gKG5vdGUpID0+IHtcclxuICAgIGNvbnN0IGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm90ZUxpc3QnKTtcclxuICAgIGNvbnN0IGh0bWxOb2RlID0gaHRtbE5vZGVDb25zdHJ1Y3Rvcihub3RlKTtcclxuXHJcbiAgICBsaXN0LnByZXBlbmQoaHRtbE5vZGUpO1xyXG5cclxuICAgIGNsZWFuQ3VycmVudE5vdGUoKTtcclxuICAgIGhpZGVDbG9zZUJ0bigpO1xyXG4gICAgdG9nZ2xlQnRuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlTm90ZUJ0bicpLCB0cnVlKTtcclxuICAgIGNsZWFyVGltZXIoKTtcclxuICAgIGluaXRUaW1lcigpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgKCkgPT4gaHRtbE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpLFxyXG4gICAgICAgIDEwMFxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IHNhdmVOb3RlID0gYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybScpO1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSlcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwczovL3F1aXoyNC5ydS9wb3J0Zm9saW8vaWNvbi1zY2luL2hlbmRsZXJzLnBocCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGNvbnN0IGlkID0gZm9ybURhdGEuZ2V0KCdpZCcpXHJcblxyXG4gICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG4gICAgICAgICAgICBjb25zdCBjYXB0aW9uID0gaXRlbS5xdWVyeVNlbGVjdG9yKGAubGlzdF9fdGl0bGVgKTtcclxuXHJcbiAgICAgICAgICAgIGNhcHRpb24uaW5uZXJUZXh0ID0gcmVzdWx0Lm5vdGUuY2FwdGlvbjtcclxuICAgICAgICAgICAgaXRlbS5kYXRhc2V0LmRhdGFEZXNjcmlwdGlvbiA9IHJlc3VsdC5ub3RlLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhZGROb3RlVG9MaXN0KHJlc3VsdC5ub3RlKTtcclxuICAgICAgICAgICAgdG9nZ2xlQnRuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhbk5vdGVzQnRuJyksIGZhbHNlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ9CU0LDQsdCw0LLQuNC70Lgg0LfQsNC80LXRgtC60YM6JywgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwIEhUVFAg0LfQsNC/0YDQvtGB0LA6IFwiICsgcmVzcG9uc2Uuc3RhdHVzKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGNsZWFuQ3VycmVudE5vdGUgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24nKS52YWx1ZSA9ICcnO1xyXG59O1xyXG5cclxuY29uc3QgaGlkZUNsb3NlQnRuID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyTm90ZUJ0bicpXHJcbiAgICAgICAgLmNsYXNzTGlzdFxyXG4gICAgICAgIC5hZGQoJ2hpZGUnKTtcclxufTtcclxuXHJcbmNvbnN0IHNob3dDbG9zZUJ0biA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50XHJcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKCdjbGVhck5vdGVCdG4nKVxyXG4gICAgICAgIC5jbGFzc0xpc3RcclxuICAgICAgICAucmVtb3ZlKCdoaWRlJyk7XHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVOb3RlID0gKG5vdGUsIHRpbWVvdXQ9IDEwMDApID0+IHtcclxuICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICBub3RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm90ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aW1lb3V0XHJcbiAgICApO1xyXG59O1xyXG5cclxuY29uc3QgaGlkZU5vdGUgPSAobm90ZSwgdGltZW91dCkgPT4ge1xyXG4gICAgc2V0VGltZW91dChcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIG5vdGUuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xyXG4gICAgICAgICAgICByZW1vdmVOb3RlKG5vdGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGltZW91dFxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IHRvZ2dsZUJ0biA9IChidG4sIGRpcmVjdGlvbikgPT4ge1xyXG4gICAgYnRuLmRpc2FibGVkID0gZGlyZWN0aW9uO1xyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlTm90ZUxpc3QgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBub3RlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2xpc3RfX2l0ZW0nKSxcclxuICAgICAgICBhcnJOb3RlcyA9IEFycmF5LmZyb20obm90ZXMpO1xyXG5cclxuICAgIHRvZ2dsZUJ0bihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYW5Ob3Rlc0J0bicpLCB0cnVlKTtcclxuICAgIHRvZ2dsZUJ0bihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2V0Tm90ZUxpc3QnKSwgZmFsc2UpO1xyXG4gICAgdG9nZ2xlQnRuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGVCdG4nKSwgdHJ1ZSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZUJ0bicpLmRhdGFzZXQuaWQgPSAnJztcclxuXHJcbiAgICByZW1vdmVDdXJyZW50Tm90ZSgpO1xyXG5cclxuICAgIGFyck5vdGVzLmZvckVhY2gobm90ZSA9PiB7XHJcbiAgICAgICAgbm90ZS5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XHJcbiAgICAgICAgcmVtb3ZlTm90ZShub3RlLCAzMDApO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0Rlc2NyaXB0aW9uID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdmFsID0gZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2NyaXB0aW9uJylcclxuICAgICAgICAudmFsdWU7XHJcblxyXG4gICAgY29uc3QgYnRuU2F2ZSA9IGRvY3VtZW50XHJcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKCdzYXZlTm90ZUJ0bicpO1xyXG5cclxuICAgIGNvbnN0IGJ0bkNsZWFyID0gZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyTm90ZUJ0bicpO1xyXG5cclxuICAgIGJ0blNhdmUuZGlzYWJsZWQgPSB2YWwgPT09ICcnO1xyXG5cclxuICAgIHZhbCA9PT0gJydcclxuICAgICAgICA/IGJ0bkNsZWFyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgIDogYnRuQ2xlYXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQ3VycmVudE5vdGUgPSAoKSA9PiB7XHJcbiAgICBjbGVhbkN1cnJlbnROb3RlKCk7XHJcbiAgICBoaWRlQ2xvc2VCdG4oKTtcclxuICAgIGNsZWFyVGltZXIoKTtcclxuICAgIGluaXRUaW1lcigpO1xyXG4gICAgdW5zZWxlY3ROb3RlKCk7XHJcbiAgICB0b2dnbGVCdG4oZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmVOb3RlQnRuJyksIHRydWUpO1xyXG4gICAgdG9nZ2xlQnRuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGVCdG4nKSwgdHJ1ZSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1cnJlbnROb3RlSWQnKS52YWx1ZSA9ICcnO1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGROb3RlTGlzdCA9IChhcnJJdGVtcykgPT4ge1xyXG4gICAgY29uc3QgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub3RlTGlzdCcpO1xyXG5cclxuICAgIGFyckl0ZW1zLmZvckVhY2goKG5vdGUsIGlkeCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGh0bWxOb2RlID0gaHRtbE5vZGVDb25zdHJ1Y3Rvcihub3RlKTtcclxuXHJcbiAgICAgICAgbGlzdC5hcHBlbmQoaHRtbE5vZGUpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiBodG1sTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyksXHJcbiAgICAgICAgICAgIGlkeCAqIDEwMFxyXG4gICAgICAgICk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldE5vdGVMaXN0ID0gYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblxyXG4gICAgdG9nZ2xlQnRuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZXROb3RlTGlzdCcpLCB0cnVlKTtcclxuICAgIHRvZ2dsZUJ0bihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYW5Ob3Rlc0J0bicpLCBmYWxzZSk7XHJcblxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnZ2V0Jyk7XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9xdWl6MjQucnUvcG9ydGZvbGlvL2ljb24tc2Npbi8vaGVuZGxlcnMucGhwJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgYnVpbGROb3RlTGlzdChyZXN1bHQubm90ZXMpO1xyXG4gICAgICAgIHRvZ2dsZUJ0bihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYW5Ob3Rlc0J0bicpLCBmYWxzZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ9CX0LDQv9GA0L7RgdC40LvQuCDRgdC/0LjRgdGB0L7QuiDQt9Cw0LzQsNGC0L7QtTonLCByZXN1bHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCBIVFRQINC30LDQv9GA0L7RgdCwOiBcIiArIHJlc3BvbnNlLnN0YXR1cyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBzZWxlY3ROb3RlID0gbm90ZSA9PiB7XHJcbiAgICBjb25zdCBjdXJyZW50U2VsZWN0ZWROb3RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpc3RfX2l0ZW1fc2VsZWN0ZWQnKTtcclxuICAgIGNvbnN0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGVCdG4nKTtcclxuICAgIGNvbnN0IGRlc2MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24nKTtcclxuICAgIGNvbnN0IGRhdGV0aW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1cnJlbnROb3RlRGF0ZXRpbWUnKTtcclxuICAgIGNvbnN0IGN1cnJlbnROb3RlSWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudE5vdGVJZCcpO1xyXG5cclxuICAgIHRvZ2dsZUJ0bihkZWxldGVCdG4sIGZhbHNlKTtcclxuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LmlkID0gbm90ZS5kYXRhc2V0LmlkO1xyXG5cclxuICAgIGRlc2MudmFsdWUgPSBub3RlLmRhdGFzZXQuZGVzY3JpcHRpb247XHJcbiAgICBkYXRldGltZS5pbm5lclRleHQgPSBub3RlLmRhdGFzZXQuZGF0ZXRpbWU7XHJcblxyXG4gICAgY2xlYXJUaW1lcigpO1xyXG4gICAgc2hvd0Nsb3NlQnRuKCk7XHJcblxyXG4gICAgdG9nZ2xlQnRuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlTm90ZUJ0bicpLCBmYWxzZSk7XHJcblxyXG4gICAgY3VycmVudE5vdGVJZC52YWx1ZSA9IG5vdGUuZGF0YXNldC5pZDtcclxuXHJcbiAgICBpZiAoY3VycmVudFNlbGVjdGVkTm90ZSkge1xyXG4gICAgICAgIGN1cnJlbnRTZWxlY3RlZE5vdGUuY2xhc3NMaXN0LnJlbW92ZSgnbGlzdF9faXRlbV9zZWxlY3RlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vdGUuY2xhc3NMaXN0LmFkZCgnbGlzdF9faXRlbV9zZWxlY3RlZCcpXHJcbn07XHJcblxyXG5jb25zdCB1bnNlbGVjdE5vdGUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vdGUgPSAgZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvcignLmxpc3RfX2l0ZW1fc2VsZWN0ZWQnKTtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWROb3RlKSB7XHJcbiAgICAgICAgc2VsZWN0ZWROb3RlXHJcbiAgICAgICAgICAgIC5jbGFzc0xpc3RcclxuICAgICAgICAgICAgLnJlbW92ZSgnbGlzdF9faXRlbV9zZWxlY3RlZCcpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgZGVsZXRlTm90ZSA9IGFzeW5jIChodG1sTm9kZSkgPT4ge1xyXG4gICAgY29uc3QgZGVsZXRlTm90ZUlkID0gaHRtbE5vZGUuZGF0YXNldC5pZDtcclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnZGVsZXRlJyk7XHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2lkJywgZGVsZXRlTm90ZUlkKTtcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwczovL3F1aXoyNC5ydS9wb3J0Zm9saW8vaWNvbi1zY2luL2hlbmRsZXJzLnBocCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAubGlzdF9faXRlbVtkYXRhLWlkPVwiJHtyZXN1bHQubm90ZX1cIl1gKVxyXG5cclxuICAgICAgICByZW1vdmVDdXJyZW50Tm90ZSgpO1xyXG4gICAgICAgIGhpZGVOb3RlKG5vZGUsIDApO1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCfQo9C00LDQu9C40LvQuCDQt9Cw0LzQtdGC0LrRgyDRgSDQmNCUOicsIGRlbGV0ZU5vdGVJZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwIEhUVFAg0LfQsNC/0YDQvtGB0LA6IFwiICsgcmVzcG9uc2Uuc3RhdHVzKTtcclxuICAgIH1cclxufTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuXHJcbiAgICAvLyDQmNC90LjRhtC40YTQu9C40LfQuNGA0YPQtdC8INGC0LDQudC80LXRgCDRgtC10LrRg9GJ0LXQs9C+XHJcbiAgICAvLyDQstGA0LXQvNC10L3QuCDQv9GA0Lgg0L/QtdGA0LLQvtC5INC30LDQs9GA0YPQt9C60LVcclxuICAgIC8vINGB0YLRgNCw0L3QuNGG0YtcclxuICAgIGluaXRUaW1lcigpO1xyXG5cclxuICAgIC8vINCf0YDQstC10YDRj9C10Lwg0YLQtdC60YEg0LfQsNC80LXRgtC60Lgg0L3QsCDQstC40LvQsNC40LTQvdC+0YHRgtGMXHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAgIC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24nKVxyXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGNoZWNrRGVzY3JpcHRpb24pO1xyXG5cclxuICAgIC8vINCh0L7RhdGA0LDQvdGP0LXQvCDQt9Cw0LzQtdGC0LrRgyDQsiDQkdCUXHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAgIC5nZXRFbGVtZW50QnlJZCgnc2F2ZU5vdGVCdG4nKVxyXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaXNUZXh0ID0gZG9jdW1lbnRcclxuICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCcjZm9ybSB0ZXh0YXJlYScpXHJcbiAgICAgICAgICAgICAgICAudmFsdWUgIT09ICcnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzVGV4dCkgc2F2ZU5vdGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAvLyDQntGH0LjRidCw0LXQvCDRgdC/0LjRgdC+0LIg0LfQsNC80LXRgtC+0LpcclxuICAgIGRvY3VtZW50XHJcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKCdjbGVhbk5vdGVzQnRuJylcclxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVOb3RlTGlzdCk7XHJcblxyXG4gICAgLy8g0JfQsNCz0YDRg9C20LDQtdC8INGB0L/QuNGB0L7QuiDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIGRvY3VtZW50XHJcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKCdnZXROb3RlTGlzdCcpXHJcbiAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2V0Tm90ZUxpc3QpO1xyXG5cclxuICAgIC8vINCX0LDQutGA0YvQstCw0LXQvCDQt9Cw0LzQtdGC0LrRgywg0LXRgdC70Lgg0L/QtdGA0LXQtNGD0LzQsNC70LhcclxuICAgIGRvY3VtZW50XHJcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKCdjbGVhck5vdGVCdG4nKVxyXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUN1cnJlbnROb3RlKTtcclxuXHJcbiAgICAvLyDQo9C00LDQu9GP0LXQvCDQt9Cw0LzQtdGC0LrRg1xyXG4gICAgZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZUJ0bicpXHJcbiAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgICdjbGljaycsXHJcbiAgICAgICAgICAgICAgICBlID0+IGRlbGV0ZU5vdGUoZS50YXJnZXQpKTtcclxufSk7IiwiLy8gJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4vLyAgICAgJCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKS5jbGljayhlID0+IHtcclxuLy8gICAgICAgICBzaG93TW9kYWwoZS50YXJnZXQpO1xyXG4vLyAgICAgfSk7XHJcbi8vXHJcbi8vICAgICB3aW5kb3cuc2hvd01vZGFsID0gZnVuY3Rpb24gKGVsKSB7XHJcbi8vICAgICAgICAgbGV0IG1vZGFsID0gJChlbCkuZGF0YSgndGFyZ2V0Jyk7XHJcbi8vXHJcbi8vICAgICAgICAgaWYgKCFtb2RhbCkge1xyXG4vLyAgICAgICAgICAgICBtb2RhbCA9ICQoZWwpXHJcbi8vICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKVxyXG4vLyAgICAgICAgICAgICAgICAgLmRhdGEoJ3RhcmdldCcpO1xyXG4vLyAgICAgICAgIH1cclxuLy9cclxuLy8gICAgICAgICBjb25zdCB2aWRlbyA9ICQobW9kYWwpLmZpbmQoJ3ZpZGVvJylbMF07XHJcbi8vXHJcbi8vICAgICAgICAgJChtb2RhbCkuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuLy8gICAgICAgICBpZiAodmlkZW8pIHZpZGVvLnBsYXkoKTtcclxuLy8gICAgIH07XHJcbi8vXHJcbi8vICAgICAkKCcubW9kYWwnKS5jbGljayhlID0+IHtcclxuLy8gICAgICAgIGlmIChpc0FjdGlvbk5vZGUoZS50YXJnZXQpKSB7XHJcbi8vICAgICAgICAgICAgaGlkZU1vZGFsKGUudGFyZ2V0KTtcclxuLy8gICAgICAgIH1cclxuLy8gICAgIH0pO1xyXG4vL1xyXG4vLyAgICAgY29uc3QgaGlkZU1vZGFsID0gZnVuY3Rpb24gKGVsKSB7XHJcbi8vICAgICAgICAgbGV0IG1vZGFsID0gJChlbCkuY2xvc2VzdCgnLm1vZGFsJyksXHJcbi8vICAgICAgICAgICAgIHZpZGVvID0gJChtb2RhbCkuZmluZCgndmlkZW8nKVswXSxcclxuLy8gICAgICAgICAgICAgZGlhbG9ncyA9ICQobW9kYWwpLmZpbmQoJy5tb2RhbF9fZGlhbG9nJyk7XHJcbi8vXHJcbi8vICAgICAgICAgaWYgKHZpZGVvKSB7XHJcbi8vICAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XHJcbi8vICAgICAgICAgICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gMDtcclxuLy8gICAgICAgICB9XHJcbi8vXHJcbi8vICAgICAgICAgbW9kYWwucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuLy9cclxuLy8gICAgICAgICAvLyDQldGB0LvQuCDQsiDQvNC+0LTQsNC70YzQvdC+0Lwg0L7QutC90LUg0L3QtdGB0LrQvtC70YzQutC+INC00LjQsNC70L7Qs9C+0LLRi9GFINC+0LrQvdC+LFxyXG4vLyAgICAgICAgIC8vINC+0YHRgtCw0LLQu9GP0LXQvCDQstC40LTQuNC80YvQvCDRgtC+0LvRjNC60L4g0L/QtdGA0LLQvtC1XHJcbi8vICAgICAgICAgaWYgKGRpYWxvZ3MubGVuZ3RoID4gMSkge1xyXG4vL1xyXG4vLyAgICAgICAgICAgICBzZXRUaW1lb3V0KGUgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgJChkaWFsb2dzWzBdKVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbW9kYWxfX2RpYWxvZ19oaWRlIGhpZGRlbicpO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgZGlhbG9nc1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaWR4ID0+IGlkeCA+IDApXHJcbi8vICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdtb2RhbF9fZGlhbG9nX2hpZGUgaGlkZGVuJyk7XHJcbi8vICAgICAgICAgICAgIH0sIDUwMCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfTtcclxuLy9cclxuLy8gICAgIGNvbnN0IGlzQWN0aW9uTm9kZSA9IGZ1bmN0aW9uIChlbCkge1xyXG4vLyAgICAgICAgIHJldHVybiAkKGVsKS5oYXNDbGFzcygnbW9kYWwnKSB8fCAkKGVsKS5oYXNDbGFzcygnbW9kYWxDbG9zZUJ0bicpO1xyXG4vLyAgICAgfTtcclxuLy8gfSk7Il19
