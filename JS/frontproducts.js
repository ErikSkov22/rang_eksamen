const minSupabaseUrl = "https://ljpgrgbwtefiivfpynkf.supabase.co";
const minSupabaseKey = "sb_publishable_ZBHtBc88hjDkz95dcCUMyQ_rXmo4XkF";
const minSupabase = window.supabase.createClient(minSupabaseUrl, minSupabaseKey);

let frontProducts = [];
let frontIndex = 0;
const visibleProducts = 4;

async function hentForsideProdukter() {
  const container = document.querySelector("#frontProductSlider");
  if (!container) return;

  const { data, error } = await minSupabase.from("Products").select("*").ilike("category", "ring").limit(8);

  if (error) {
    console.error(error);
    return;
  }

  frontProducts = data;
  renderFrontProducts();
}

function renderFrontProducts() {
  const container = document.querySelector("#frontProductSlider");
  const basisUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/`;

  const shownProducts = frontProducts.slice(frontIndex, frontIndex + visibleProducts);

  container.innerHTML = shownProducts
    .map((produkt) => {
      return `
        <div class="front-product-item">
          <a href="singleproduct.html?id=${produkt.id}">
            <img src="${basisUrl}${produkt.image}" alt="${produkt.navn}">
          </a>

          <div class="front-product-text">
            <a href="singleproduct.html?id=${produkt.id}" class="front-product-name">
              ${produkt.navn}
            </a>
            <span>${produkt.price} DKK</span>
          </div>

          <a href="singleproduct.html?id=${produkt.id}" class="product-link">
            SE MERE
          </a>
        </div>
      `;
    })
    .join("");
}

document.querySelector("#frontNextBtn")?.addEventListener("click", () => {
  if (frontIndex < frontProducts.length - visibleProducts) {
    frontIndex++;
  } else {
    frontIndex = 0;
  }

  renderFrontProducts();
});

document.querySelector("#frontPrevBtn")?.addEventListener("click", () => {
  if (frontIndex > 0) {
    frontIndex--;
  } else {
    frontIndex = frontProducts.length - visibleProducts;
  }

  renderFrontProducts();
});

hentForsideProdukter();
