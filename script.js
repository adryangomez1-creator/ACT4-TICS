const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const refreshButton = document.querySelector("#refresh-button");
const statusMessage = document.querySelector("#status-message");
const currencyFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
});

const productNames = {
  1: "Mochila Fjallraven Foldsack n.º 1 para laptops de 15 pulgadas",
  2: "Camiseta casual premium de corte ajustado para hombre",
  3: "Chaqueta de algodón para hombre",
  4: "Conjunto casual de corte ajustado para hombre",
  5: "Pulsera Naga de cadena con dragón en oro y plata, John Hardy",
  6: "Joya delicada de oro macizo con pavé",
  7: "Joya estilo princesa chapada en oro blanco",
  8: "Joya de acero inoxidable chapada en oro rosa, Pierced Owl",
  9: "Disco duro externo portátil WD Elements de 2 TB",
  10: "Unidad SSD interna SanDisk SSD PLUS de 1 TB",
  11: "Unidad SSD SATA III Silicon Power de 256 GB",
  12: "Disco duro externo portátil WD Gaming de 4 TB para PlayStation 4",
  13: "Monitor Acer Full HD IPS de 21.5 pulgadas",
  14: "Monitor curvo Samsung CHG90 de 49 pulgadas y 144 Hz",
  15: "Chaqueta de snowboard 3 en 1 para mujer, BIYLACLESEN",
  16: "Chaqueta biker de cuero sintético con capucha desmontable para mujer",
  17: "Chaqueta impermeable cortaviento a rayas para mujer",
  18: "Blusa de manga corta y cuello barco para mujer, MBJ",
  19: "Camiseta deportiva de manga corta para mujer, Opna",
  20: "Camiseta casual de algodón de manga corta para mujer, DANVOUY",
};

const productCategories = {
  "men's clothing": "Ropa para hombre",
  jewelery: "Joyería",
  electronics: "Electrónica",
  "women's clothing": "Ropa para mujer",
};

let products = [];
let quetzalExchangeRate = 0;

function renderProducts(items) {
  productGrid.replaceChildren();

  if (items.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "No se encontraron productos.";
    productGrid.append(emptyMessage);
    return;
  }

  items.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = productNames[product.id] ?? "Producto";
    image.loading = "lazy";

    const details = document.createElement("div");
    details.className = "product-details";

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = productCategories[product.category] ?? "Otros productos";

    const title = document.createElement("h2");
    title.className = "product-title";
    title.textContent = productNames[product.id] ?? "Producto";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = currencyFormatter.format(product.price * quetzalExchangeRate);

    details.append(category, title, price);
    card.append(image, details);
    productGrid.append(card);
  });
}

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    `${productNames[product.id] ?? "Producto"} ${productCategories[product.category] ?? "Otros productos"}`
      .toLowerCase()
      .includes(query),
  );

  statusMessage.textContent = `Mostrando ${filteredProducts.length} de ${products.length} productos`;
  renderProducts(filteredProducts);
}

async function loadProducts() {
  refreshButton.disabled = true;
  statusMessage.textContent = "Cargando productos...";
  productGrid.setAttribute("aria-busy", "true");

  try {
    const [productsResponse, exchangeRateResponse] = await Promise.all([
      fetch("https://fakestoreapi.com/products"),
      fetch("https://open.er-api.com/v6/latest/USD"),
    ]);

    if (!productsResponse.ok || !exchangeRateResponse.ok) {
      throw new Error("No se pudieron cargar los productos o la tasa de cambio.");
    }

    const [productData, exchangeRateData] = await Promise.all([
      productsResponse.json(),
      exchangeRateResponse.json(),
    ]);

    if (typeof exchangeRateData.rates?.GTQ !== "number") {
      throw new Error("No se encontró la tasa de cambio a quetzales.");
    }

    products = productData;
    quetzalExchangeRate = exchangeRateData.rates.GTQ;
    filterProducts();
  } catch {
    products = [];
    productGrid.replaceChildren();
    statusMessage.textContent = "No fue posible cargar los productos o la tasa de cambio. Inténtalo de nuevo.";
  } finally {
    refreshButton.disabled = false;
    productGrid.removeAttribute("aria-busy");
  }
}

searchInput.addEventListener("input", filterProducts);
refreshButton.addEventListener("click", loadProducts);

loadProducts();