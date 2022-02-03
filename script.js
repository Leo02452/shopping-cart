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

function cartItemClickListener(event) {
  const clickedItem = event.target;
  // Ideia do Nailton de usar um remove simples.
  clickedItem.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const showItems = async () => {
  const response = await fetchProducts('computador');
  const { results } = response;
  results.forEach((product) => {
    const { id, title, thumbnail } = product;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items')
      .appendChild(item);
  });
};
const ol = document.querySelector('.cart__items');

const addToCart = async (event) => {
  const clickedItem = event.target.parentNode;
  const productId = getSkuFromProductItem(clickedItem);
  const product = await fetchItem(productId);
  const { id, title, price } = product;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  ol.appendChild(cartItem);
  saveCartItems(ol.innerHTML);
};

const recreateElement = () => {
  ol.innerHTML = getSavedCartItems();
  ol.addEventListener('click', cartItemClickListener);
};

window.onload = async () => {
  await showItems();
  const addToCartButton = document.querySelectorAll('.item__add');
  addToCartButton.forEach((button) => button.addEventListener('click', addToCart));

  recreateElement();
};