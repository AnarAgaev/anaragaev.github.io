const navClasses = document
        .getElementById('nav') // получаем блок с навигацией
        .classList; // список всех классов

function toggleNav () {
    navClasses.toggle('show'); // убираем или добавляем класс в зависиомсти от того есть он или нет
}

function closeNav () {
   navClasses.remove('show'); // убираем класс для того чтобы скрыть навигацию
}

window.addEventListener('load', () => {
    const navItems = Array.from(document
        .querySelectorAll('.nav__item a')); // Выбираем все ссылки и сразу перкладываем в массив

    navItems.forEach(function (navItem) {
        navItem.addEventListener('click', closeNav); // Вешаем обработчик на каждый элемент списка в отдельности
    });

    document
        .getElementById('navOpen') // получаем кнопку открыт навигацию
        .addEventListener('click', toggleNav); // вешаем на кнопку обработчик клика - вызываем функцию toggleNav

    document
        .getElementById('navClose') // получаем кнопку закрыть навигацию
        .addEventListener('click', toggleNav); // вешаем на кнопку обработчик клика - вызываем функцию toggleNav
});