function addFormSubmitListener() {
  const form = document.getElementById('form');
  form.addEventListener('submit', handleSubmit);
}
async function handleSubmit(event) {
  event.preventDefault();
  const apiKey = document.getElementById('api-key').value;
  const email = document.getElementById('email').value;
  await chrome.storage.sync.set({ apiKey: apiKey, email: email});
  document.getElementById('success').style.display = 'block';
}

function init() {
  chrome.storage.sync.get(['apiKey'], (data) => {
    document.getElementById('api-key').value = data.apiKey || '';
  });
  chrome.storage.sync.get(['email'], (data) => {
    document.getElementById('email').value = data.email || '';
  });
  addFormSubmitListener();
}

init();