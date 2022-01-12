document.addEventListener("DOMContentLoaded", () => {
  
  const name = document.getElementById('name');
    vacancy = document.getElementById('vacancy');

  const removeNodes = () => {
    name.remove();
    vacancy.remove();
  };

  const showDeleteMessage = () => {
    const target = document.getElementById('wrapper');

    target.innerHTML = '<p class="text-center">Name and vacancy was deleted! &#128125;</p>';
  };

  // Hide name after hover it
  name.addEventListener(
    'click',
    () => name.classList.add('hidden')
  );

  // Hide vacancy after hover it
  vacancy.addEventListener(
    'click',
    () => vacancy.classList.add('hidden')
  );

  // Delete name and vacancy after tap on space
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      removeNodes();
      showDeleteMessage();
    }
  });
});