function initRegistrationTabs() {
	const tabButtons = document.querySelectorAll('.registration-lk__tabs [data-target]')
	const tabTargets = document.querySelectorAll('.registration-lk__content')

	tabButtons.forEach(button => button.addEventListener('click', () => {
		tabButtons.forEach(btn => btn === button
			? btn.classList.add('active')
			: btn.classList.remove('active')
		)

		const targetId = button.dataset.target
		tabTargets.forEach(target => target.id === targetId
			? target.classList.add('active')
			: target.classList.remove('active')
		)
	}))
}

window.addEventListener('load', () => {
	initRegistrationTabs()
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWdpc3RyYXRpb24tbGsvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGluaXRSZWdpc3RyYXRpb25UYWJzKCkge1xyXG5cdGNvbnN0IHRhYkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVnaXN0cmF0aW9uLWxrX190YWJzIFtkYXRhLXRhcmdldF0nKVxyXG5cdGNvbnN0IHRhYlRhcmdldHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVnaXN0cmF0aW9uLWxrX19jb250ZW50JylcclxuXHJcblx0dGFiQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHR0YWJCdXR0b25zLmZvckVhY2goYnRuID0+IGJ0biA9PT0gYnV0dG9uXHJcblx0XHRcdD8gYnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblx0XHRcdDogYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcblx0XHQpXHJcblxyXG5cdFx0Y29uc3QgdGFyZ2V0SWQgPSBidXR0b24uZGF0YXNldC50YXJnZXRcclxuXHRcdHRhYlRhcmdldHMuZm9yRWFjaCh0YXJnZXQgPT4gdGFyZ2V0LmlkID09PSB0YXJnZXRJZFxyXG5cdFx0XHQ/IHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cdFx0XHQ6IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG5cdFx0KVxyXG5cdH0pKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuXHRpbml0UmVnaXN0cmF0aW9uVGFicygpXHJcbn0pIl0sImZpbGUiOiJyZWdpc3RyYXRpb24tbGsuanMifQ==
