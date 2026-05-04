const artModal = document.getElementById('artModal');

artModal.addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget;

  const title = button.getAttribute('data-title');
  const img = button.getAttribute('data-img');
  const text = button.getAttribute('data-text');

  document.getElementById('modalTitle').innerHTML = title;
  document.getElementById('modalImg').src = img;
  document.getElementById('modalText').innerHTML = text;
});




