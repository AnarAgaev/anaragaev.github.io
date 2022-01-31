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

    const response = await fetch('http://rushfitnes.develop.masterhost.tech/hendlers.php', {
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

    cohort = await document.interestCohort();
    url = new URL("http://rushfitnes.develop.masterhost.tech/hendlers.php");
    url.searchParams.append("cohort", cohort);
    creative = await fetch(url);

    console.log(creative);

    const response = await fetch('http://rushfitnes.develop.masterhost.tech/hendlers.php', {
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

    const response = await fetch('http://rushfitnes.develop.masterhost.tech/hendlers.php', {
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