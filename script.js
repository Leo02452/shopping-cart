function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;

  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const olContainer = document.querySelector('.cart__items');

// Ajuda do Imar Mendes pra montar a lógica da função
const updateCartPrice = () => {
  const totalPrice = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart__item');
  let counter = 0;
  cartItems.forEach((cartItem) => {
    const itemPrice = parseFloat(cartItem.innerText.split('$')[1]);
    counter += itemPrice;
  });
  totalPrice.innerText = counter;
};

function cartItemClickListener(event) {
  const clickedItem = event.target;
  // Ideia do Nailton de usar um remove simples.
  clickedItem.remove();
  saveCartItems(olContainer.innerHTML);
  updateCartPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const showWaitingMessage = () => {
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'carregando...';
  const container = document.querySelector('.container');
  container.appendChild(span);
};

const endingWaitingMessage = () => {
  const loadingSpan = document.querySelector('.container span');
  loadingSpan.remove();
};

const showItems = async () => {
  showWaitingMessage();
  const response = await fetchProducts('computador');
  endingWaitingMessage();
  const { results } = response;
  results.forEach((product) => {
    const { id, title, thumbnail } = product;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items')
      .appendChild(item);
  });
};

const addToCart = async (event) => {
  const clickedItem = event.target.parentElement;
  const itemId = getSkuFromProductItem(clickedItem);
  const item = await fetchItem(itemId);
  const { id, title, price } = item;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  olContainer.appendChild(cartItem);
  saveCartItems(olContainer.innerHTML);
  updateCartPrice();
};

const recreateCart = () => {
  olContainer.innerHTML = getSavedCartItems();
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((cartItem) => cartItem.addEventListener('click', cartItemClickListener));
};

const emptyButton = document.querySelector('.empty-cart');
emptyButton.addEventListener('click', () => {
  olContainer.innerHTML = '';
  updateCartPrice();
  saveCartItems(olContainer.innerHTML);
});

window.onload = async () => {
  await showItems();

  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach((button) => button.addEventListener('click', addToCart));

  recreateCart();
  updateCartPrice();
};