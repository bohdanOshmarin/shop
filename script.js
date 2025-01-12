// Взято з вашого коду
function getProductHtml(product) {
  return `
    <div class="card">
    <img src=${product.image} class="card-img-top" alt="...">
    <div class="card-body">
      <p class="card-title">${product.title}</p>
      <p class="card-text">${product.description}</p>
      <p>${product.price}₴</p>
      <button class="btn btn-primary cart-btn" data-product='${JSON.stringify(product)}'>Купити</button>
    </div>
  </div>
  `;
}

// Взято з вашого коду
async function getProducts() {
  const response = await fetch('products.json');
  return await response.json();
}

// Завантаження продуктів у каталог
getProducts().then(function (products) {
  const productsContainer = document.querySelector('.catalog');

  if (products) {
      products.forEach(function (product) {
          productsContainer.innerHTML += getProductHtml(product);
      });
  }

  // Прив’язка кнопок Купити до івента
  let buyButtons = document.querySelectorAll('.cart-btn');
  if (buyButtons.length > 0) {
      buyButtons.forEach(function (button) {
          button.addEventListener('click', addToCart);
      });
  }
});

// Клас корзини для управління товарами
class Cart {
  constructor() {
      this.items = {}; // Об’єкт товарів
      this.total = 0;
      this.loadCartToCookies(); // Ініціалізація з cookies
      this.updateCartView(); // Оновлення відображення
  }

  addItem(item) {
      if (this.items[item.title]) {
          this.items[item.title].quantity += 1;
      } else {
          this.items[item.title] = item;
          this.items[item.title].quantity = 1;
      }
      this.saveCartToCookies();
      this.updateCartView();
  }

  removeItem(title) {
      if (this.items[title]) {
          delete this.items[title];
          this.saveCartToCookies();
          this.updateCartView();
      }
  }

  saveCartToCookies() {
      let cartJSON = JSON.stringify(this.items);
      document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
  }

  loadCartToCookies() {
      let cartCookies = getCookieValue('cart');
      if (cartCookies && cartCookies !== '') {
          this.items = JSON.parse(cartCookies);
      }
  }

  // Відображення товарів у модальній корзині
  updateCartView() {
      const cartItemsContainer = document.querySelector('.cart-items');
      cartItemsContainer.innerHTML = ''; // Очищення елементів корзини

      Object.values(this.items).forEach(item => {
          cartItemsContainer.innerHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.title} (x${item.quantity})
            <button class="btn btn-danger btn-sm remove-btn" data-title="${item.title}">Видалити</button>
          </li>
        `;
      });

      // Прив’язка до кнопки видалення
      document.querySelectorAll('.remove-btn').forEach(button => {
          button.addEventListener('click', (event) => {
              const title = event.target.getAttribute('data-title');
              this.removeItem(title);
          });
      });
  }
}

// Ініціалізація корзини
let cart = new Cart();

// Функція додавання у корзину
function addToCart(event) {
  const productData = event.target.getAttribute('data-product');
  const product = JSON.parse(productData);
  cart.addItem(product);

}

// Витяг значення печива за ім'ям
function getCookieValue(cookieName) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === cookieName) {
          return decodeURIComponent(value);
      }
  }
  return null;
}