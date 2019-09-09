'use strict'

let selector = document.querySelectorAll('.parameter-item__content .button_action'),
	orgNames = $.getJSON('orgs.json', function (data) {
		return data;
	}),
	parameter = {
		'persons': {},
		'positions': {},
		'orgs': {},
		'subs': {},		

		/** Читает JSON в объект и выводим внутри модального окна */
		'parseJson': function(path, title, sortName) {
			$.getJSON(path, function (data) {
				let sorted = parameter.sort(data, sortName),
					list = document.getElementsByClassName('modal__list'),
					parameterName = path.split('.')[0];

				parameter.createModal(title);
				
				for (let i = 0; i < sorted.length; i++) { // Внешний цикл собирает строки таблицы выбора
					let line = document.createElement('tr');
					line.setAttribute('data-item-name', 'id');
					line.setAttribute('data-item-value', sorted[i]['id']),
					line.setAttribute('data-parametr-name', parameterName);
					
					if (parameter[parameterName].id == sorted[i]['id']) {
						line.classList.add('selected');	
					}

					// Обработчик клика по строке
					line.addEventListener('click', function() {
						parameter.checkItem(this, parameterName);
					});

					for (let key in sorted[i]) { // Внутренний цикл собирает столбцы таблицы выбора
						let column = document.createElement('td');
						column.setAttribute('data-item-name', key);

						if (key != 'id') {
							if (path != 'subs.json') {
								column.textContent = sorted[i][key];
								line.appendChild(column);
							} else {

								if (key == 'org_id') {
									for (let index in orgNames.responseJSON) {
										if (sorted[i][key] == orgNames.responseJSON[index].id) {
											column.textContent = sorted[i][key] = orgNames.responseJSON[index].name;
										}
									}
									line.appendChild(column);
								} else {
									column.textContent = sorted[i][key];
									line.appendChild(column);
								}
							}
						}
					}
					list[0].appendChild(line);
				}
			});
		},


		/** Создаёт модальное окно */
		'createModal': function(title) {
			let body 			= document.getElementsByTagName('body'),
				buttonClose 	= document.createElement('button'),
				buttonReset 	= document.createElement('button'),
				buttonOk 		= document.createElement('button'),
				list 			= document.createElement('table'),
				modal 			= document.createElement('div'),
				modalContent 	= document.createElement('div'),
				listContainer 	= document.createElement('div'),
				buttonContainer = document.createElement('div'),
				header 			= document.createElement('h3');

			// Добавляем классы и атрибуты
			buttonContainer.classList.add('modal__button-container');
			buttonReset.classList.add('button');
			buttonReset.classList.add('button_action');
			listContainer.classList.add('modal__list-container');
			buttonClose.classList.add('button');
			buttonClose.classList.add('button_close');
			buttonOk.classList.add('button');
			buttonOk.classList.add('button_action');
			modalContent.classList.add('modal__content');
			buttonReset.setAttribute('type', 'button');
			buttonReset.setAttribute('type', 'button');
			buttonClose.setAttribute('type', 'button');
			buttonOk.setAttribute('type', 'button');
			header.classList.add('modal__title');
			buttonReset.textContent = 'Отмена';
			list.classList.add('modal__list');
			modal.classList.add('modal');
			buttonOk.textContent = 'OK';
			header.textContent = title;

			// Собирем модальное окно
			modalContent.appendChild(header);
			modalContent.appendChild(buttonClose);
			listContainer.appendChild(list);
			modalContent.appendChild(listContainer);
			buttonContainer.appendChild(buttonOk);
			buttonContainer.appendChild(buttonReset);
			modalContent.appendChild(buttonContainer);
			modal.appendChild(modalContent);

			// Пушим в боди
			document.body.appendChild(modal);
			
			// Показываем окно с задержкой, что бы успела отработать анимация
			setTimeout(function() {
				body[0].classList.add('modal-open');
				modal.classList.add('visible');
			}, 100);

			// Закрываем окно крестиком
			buttonClose.addEventListener('click', resetNode);

			// Закрываем окно кнопкой Отмена
			buttonReset.addEventListener('click', resetNode);

			function resetNode() {
				body[0].classList.remove('modal-open');
				modal.classList.remove('visible');

				setTimeout(function () {
					modal.remove();
				}, 300);
			}

			buttonOk.addEventListener('click', parameter.saveSelected);
		},


		/** Метод для сортировки.
		 * Принимает сортируемый объект и имя поля по которому сортировать
		 * Возвращает отсортированный объект */
		'sort': function(obj, sortName) {
			let sorted = obj.slice(0);
			
			sorted.sort(function (a, b) {
				var x = a[sortName].toLowerCase();
				var y = b[sortName].toLowerCase();
				return x < y ? -1 : x > y ? 1 : 0;
			});

			return sorted;
		},


		/** Выбор конкретного значения */
		'checkItem': function(item, parameterName) {
			let items = document.querySelectorAll('.modal__list tr');
			
			for (let i = 0; i < items.length; i++) {
				items[i].classList.remove('selected');
			}

			item.classList.add('selected');
		},


		/** Сохраняем выбранное значение */
		'saveSelected': function() {
			let person 			= document.getElementById('persons'),
				position 		= document.getElementById('positions'),
				org 			= document.getElementById('orgs'),
				suborg 			= document.getElementById('subs'),
				body 			= document.getElementsByTagName('body'),
				modal 			= document.getElementsByClassName('modal'),
				selectedItem 	= document.querySelector('.selected'),
				index 			= selectedItem.getAttribute('data-item-name'),
				value 			= selectedItem.getAttribute('data-item-value'),
				parameterName 	= selectedItem.getAttribute('data-parametr-name'),
				minAge 			= parameter.positions.min_age,
				maxAge 			= parameter.positions.max_age;

			switch (parameterName) {
				case 'persons':
					let itemBirth = selectedItem.childNodes[3].textContent,
						age = parameter.getAge(itemBirth);

					if (typeof minAge == 'undefined' && typeof maxAge == 'undefined') {
						addParametrs(parameterName);
						person.textContent = parameter.persons.lastname;
						person.textContent += ' ' + parameter.persons.middlename;
						person.textContent += ' ' + parameter.persons.firstname + '\u00A0';
						addDeleteBtn(person, parameterName);
						hideModal(body[0], modal[0]);
					} else {
						if (age >= minAge && age <= maxAge) {
							addParametrs(parameterName);
							person.textContent = parameter.persons.lastname;
							person.textContent += ' ' + parameter.persons.middlename;
							person.textContent += ' ' + parameter.persons.firstname + '\u00A0';
							addDeleteBtn(person, parameterName);
							hideModal(body[0], modal[0]);
						} else {
							let btns = parameter.createMessage('Выбранный сотрудник не подходит по возрасту. Вы уверены, что хотите выбрать этого сотрудника?');

							btns[0].addEventListener('click', function () {
								body[0].classList.remove('modal-open');
								btns[2].classList.remove('visible');

								setTimeout(function () {
									btns[2].remove();
								}, 300);
							});

							btns[1].addEventListener('click', function () {
								addParametrs(parameterName);
								person.textContent = parameter.persons.lastname;
								person.textContent += ' ' + parameter.persons.middlename;
								person.textContent += ' ' + parameter.persons.firstname + '\u00A0';
								addDeleteBtn(person, parameterName);
								hideModal(body[0], btns[2]);
							});
						}
					}
					break;

				case 'positions':
					let birth = parameter.persons.birthday,
					years;

					minAge = selectedItem.childNodes[1].textContent,
					maxAge = selectedItem.childNodes[2].textContent;
					
					if (typeof birth == 'undefined') {
						addParametrs(parameterName);
						position.textContent = parameter.positions.name + '\u00A0';
						addDeleteBtn(position, parameterName);
						hideModal(body[0], modal[0]);
					} else {
						years = parameter.getAge(birth);

						if (years >= minAge && years <= maxAge) {
							addParametrs(parameterName);
							position.textContent = parameter.positions.name + '\u00A0';
							addDeleteBtn(position, parameterName);
							hideModal(body[0], modal[0]);
						} else {
							let btns = parameter.createMessage('Выбранная должность не подходит по возрасту сотруднику. Вы уверены, что хотите выбрать эту должность?');
							
							btns[0].addEventListener('click', function () {
								body[0].classList.remove('modal-open');
								btns[2].classList.remove('visible');

								setTimeout(function () {
									btns[2].remove();
								}, 300);
							});

							btns[1].addEventListener('click', function () {
								addParametrs(parameterName);
								position.textContent = parameter.positions.name + '\u00A0';
								addDeleteBtn(position, parameterName);
								hideModal(body[0], btns[2]);
							});
						}
					}
					break;

				case 'orgs':
					addParametrs(parameterName);
					org.textContent = parameter.orgs.name + '\u00A0';
					addDeleteBtn(org, parameterName);
					hideModal(body[0], modal[0]);
					break;

				case 'subs':
					addParametrs(parameterName);
					suborg.textContent = parameter.subs.name + '\u00A0';
					addDeleteBtn(suborg, parameterName);
					hideModal(body[0], modal[0]);
					break;
			}

			function addParametrs(parameterName) {
				parameter[parameterName][index] = value;

				for (var i = 0; i < selectedItem.childNodes.length; i++) {
					index = selectedItem.childNodes[i].getAttribute('data-item-name');
					value = selectedItem.childNodes[i].textContent;
					parameter[parameterName][index] = value;
				}
			}

			function addDeleteBtn(node, parameterName) {
				let buttonDelete = document.createElement('button');

				buttonDelete.classList.add('button');
				buttonDelete.classList.add('button_close');
				buttonDelete.setAttribute('type', 'button');

				buttonDelete.setAttribute('data-parametr-name', parameterName);
				node.appendChild(buttonDelete);
				buttonDelete.addEventListener('click', parameter.deleteItem);
			}

			// Убиваем модальное окно
			function hideModal(body, modal) {
				body.classList.remove('modal-open');
				modal.classList.remove('visible');

				setTimeout(function () {
					modal.remove();
				}, 300);			
			}
		},


		// Получает возраст из даты рождения
		'getAge': function(date) {
			let d = date.split('.');
			if (typeof d[2] !== "undefined") {
				date = d[2] + '.' + d[1] + '.' + d[0];
				return ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
			}
			return 0;
		},


		// Удаляет выбранное значение
		'deleteItem': function() {
			let item = this.getAttribute('data-parametr-name');
			parameter[item] = {};
			this.parentElement.textContent = '';
		},


		// Создаёт модальное окно с вопросом Да/Нет
		'createMessage': function(msg) {
			let modal 			= document.querySelector('.modal'),
				modal__content 	= document.querySelector('.modal__content'),
				askModal 		= document.createElement('div'),
				meesage 		= document.createElement('p'),
				btnContainer 	= document.createElement('div'),
				buttonTure 		= document.createElement('button'),
				buttonFalse 	= document.createElement('button');

			askModal.classList.add('ask-modal');
			btnContainer.classList.add('btn-container');
			buttonTure.classList.add('button');
			buttonTure.classList.add('button_action');
			buttonFalse.classList.add('button');
			buttonFalse.classList.add('button_action');
			buttonTure.setAttribute('type', 'button');
			buttonFalse.setAttribute('type', 'button');
			buttonTure.textContent = 'Да';
			buttonFalse.textContent = 'Нет';
			meesage.textContent = msg;

			askModal.appendChild(meesage);
			askModal.appendChild(btnContainer);
			btnContainer.appendChild(buttonTure);
			btnContainer.appendChild(buttonFalse);

			modal__content.style.left = '-200vw';
			modal__content.style.position = 'absolute';
			modal__content.style.height = '100px';
			modal__content.style.overflow = 'hidden';
			modal.appendChild(askModal);

			return [buttonFalse, buttonTure, modal];
		},
	};

// Вешаем события на каждой кнопке выбрать
for (let i = 0; i < selector.length; i++) {
	selector[i].addEventListener('click', function() {
		
		let path = this.getAttribute('data-path-json'),
			title = this.getAttribute('data-modal-title'),
			sortName = this.getAttribute('data-sort-name');

		parameter.parseJson(path, title, sortName);
	});
}

// remove() для ie
if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function () {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};
}