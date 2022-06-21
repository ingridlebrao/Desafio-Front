const API_PRODUCTS = 'https://bootcamp--use.herokuapp.com/products';

async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.querySelector('input#name').value;
  const desc = document.querySelector('input#description').value;
  const price = document.querySelector('input#value').value;
  const category = document.querySelector('select#category').value;
  const serve = document.querySelector("input[name='pessoas']:checked").value;
  const disponibility = document.querySelector(
    "input[name='disponibilidade']:checked",
  ).value;

  const image = document.querySelector('#file').files[0];

  const formData = new FormData();

  formData.append('name', name);
  formData.append('description', desc);
  formData.append('value', price);
  formData.append('personCount', serve);
  formData.append('categoryId', category);
  formData.append('disponibility', disponibility);
  formData.append('image', image);

  await fetch(API_PRODUCTS, {
    method: 'POST',
    body: formData,
  }).then((res) => console.log(res.json()));
}

const form = document.querySelector('#main__form');
console.log(form);
form.addEventListener('submit', handleFormSubmit);

const dropArea = document.querySelector('.registro__drag-bigger'),
  dragText = dropArea.querySelector('.drag-text'),
  button = dropArea.querySelector('.drag-button'),
  input = dropArea.querySelector('#file');

button.addEventListener('click', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();

  input.click();
});

input.addEventListener('change', function (evt) {
  evt.preventDefault();
  evt.stopImmediatePropagation();
  const file = evt.target.files[0];
  showFile(file);
  dropArea.classList.add('active');
});

dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropArea.classList.add('active');
  dragText.textContent = 'Solte a imagem aqui';
});

dropArea.addEventListener('dragleave', (event) => {
  event.preventDefault();
  dropArea.classList.remove('active');
  dragText.textContent = 'Se preferir arraste e solte a foto.';
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  let dt = event.dataTransfer;
  let file = dt.files;
  showFile(file);
});

function showFile(file) {
  let fileType = file.type;
  let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      let imgTag = `
        <img class="image__cover"  src="${fileURL}" alt="">`;
      dropArea.insertAdjacentHTML('beforeend', imgTag);
    };
    fileReader.readAsDataURL(file);
  } else {
    alert('Não é um arquivo válido');
    dropArea.classList.remove('active');
    dragText.textContent = 'Se preferir arraste e solte a foto.';
  }
}

async function renderCategoryOption() {
  const select = document.querySelector('.form__registro#category');

  let options = '';

  const categories = await fetch(
    'https://bootcamp--use.herokuapp.com/categories',
  ).then((res) => res.json());

  if (!categories) {
    return;
  }

  categories.map((cat, index) => {
    if (index === 0) {
      options += `
        <option value="" selected >Selecione a categoria</option>
        <option value="${cat.id}">${cat.name}</option>
      `;
    } else {
      options += `<option value="${cat.id}">${cat.name}</option>`;
    }
  });

  select.insertAdjacentHTML('beforeend', options);
}

function init() {
  document.addEventListener('DOMContentLoaded', () => {
    renderCategoryOption();
  });
}

init();
