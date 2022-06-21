const API_PRODUCTS = 'https://bootcamp--use.herokuapp.com/products';
const API_CATEGORIES = 'https://bootcamp--use.herokuapp.com/categories';

// getProducts(API_PRODUCTS);

async function getProducts() {
  const data = await fetch(API_PRODUCTS).then((response) => response.json());

  return data;
}

function createCards(products) {
  const productsList = document.querySelector('.main__card');

  productsList.innerHTML = '';
  const productsHtmlArray = products.map((product) => {
    return `
    <div class="main__cards"> 
    <div class="card__container"> 
    <div class="main__cards--image">
    <img src="${API_PRODUCTS}/img/${product.image}" alt="${product.name}" class="main__cards--img">
  </div>

  <div class="main__cards--info">
    <h1 class="main__cards--name">
      ${product.name}
    </h1>

    <h3 class="main__cards--serving">
      Serve ${product.personCount} pessoa(s)
    </h3>

    <div class="main__cards--description">
      ${product.description}
    </div>

    <h4 class="main__cards--price">
      R$${product.value}
    </h4>
  </div>

  <div class="main__cards--actions">
        <button data-id="${product.id}" class="main__cards-edit">
          <img src="/assets/images/Edit.svg" alt="" class="main__cards--actions-img">
          <span class="main__cards-text">
            Editar
          </span>
        </button>

        <button data-id="${product.id}" class="main__cards-delete">
          <img src="/assets/images/Delete.svg" alt="" class="main__cards--actions-img">
          <span class="main__cards-text">
            Excluir
          </span>
        </button>
      </div>
      </div>
      </div>
    `;
  });
  const productsHtml = productsHtmlArray.join(' ');
  productsList.insertAdjacentHTML('beforeend', productsHtml);

  bindDeleteBtnAction();
}

function bindDeleteBtnAction() {
  const btns = document.querySelectorAll('.main__cards-delete');

  [...btns].forEach((btn) =>
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-id'));
    }),
  );
}

function openModal(productId) {
  document.body.style.overflow = 'hidden';
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="modal">
      <div class="modal__container">
        <h4 class="modal__title">Apagar produto</h4>
        <p class="modal__text">Deseja realmente apagar este produto?</p>
        <div class="modal__buttons">
          <button class="modal__button confirm">Sim, apagar</button>
          <button class="modal__button deny">Não</button>
        </div>
      </div>
    </div>
  `,
  );

  const denyBtn = document.querySelector('.modal__button.deny');

  denyBtn.addEventListener('click', () => {
    document.body.style.overflow = 'auto';
    document.querySelector('.modal').remove();
  });

  const confirmBtn = document.querySelector('.modal__button.confirm');

  confirmBtn.addEventListener('click', async () => {
    await fetch(`${API_PRODUCTS}/${productId}`, {
      method: 'DELETE',
    });
    document.querySelector('.modal').remove();

    const products = await getProducts();
    createCards(products);
  });
}

async function filterProducts(catId) {
  const products = await getProducts();

  const filteredProducts = products.filter(
    (product) => product.categoryId === catId,
  );

  createCards(filteredProducts);
}

async function populateButtons() {
  const btns = document.querySelector('.options');
  const categories = await fetch(API_CATEGORIES).then((res) => res.json());
  const categoriesHtmlArray = categories.map((cat) => {
    return `
      <button type="checkbox" data-id="${cat.id}" class="options__button">${cat.name}</button>
    `;
  });

  const categoriesHtml = categoriesHtmlArray.join(' ');
  btns.insertAdjacentHTML('beforeend', categoriesHtml);

  const btnsToBind = document.querySelectorAll('.options__button');

  [...btnsToBind].forEach((btn) =>
    btn.addEventListener('click', () => {
      filterProducts(btn.getAttribute('data-id'));
    }),
  );
}

async function searchBar() {
  const input = document.querySelector('.search__bar-input');

  const products = await getProducts();

  input.addEventListener('input', (evt) => {
    const {
      target: { value },
    } = evt;

    if (!value) {
      return createCards(products);
    }

    if (value.length < 3) {
      return;
    }

    const filteredProducts = products.filter((product) => {
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      const lowerText = value.toLowerCase();

      if (name.includes(lowerText) || description.includes(lowerText)) {
        return products;
      }
    });

    createCards(filteredProducts);
  });
}

async function orderBy() {
  const select = document.querySelector('.search__orderBy');

  const products = await getProducts();

  select.addEventListener('change', (evt) => {
    const {
      target: { value },
    } = evt;

    if (value === 'lower') {
      const sortProducts = products.sort((a, b) =>
        a.value > b.value ? 1 : -1,
      );

      return createCards(sortProducts);
    }

    const sortProducts = products.sort((a, b) => (a.value > b.value ? -1 : 1));

    return createCards(sortProducts);
  });
}

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    const products = await getProducts();
    createCards(products);
    populateButtons();
    searchBar();
    orderBy();
  });
}

init();
