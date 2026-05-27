// ==========================================================
// 1. SUPABASE OPSÆTNING
// ==========================================================
const minSupabaseUrl = "https://ljpgrgbwtefiivfpynkf.supabase.co";
const minSupabaseKey = "sb_publishable_ZBHtBc88hjDkz95dcCUMyQ_rXmo4XkF";
const minSupabase = window.supabase.createClient(minSupabaseUrl, minSupabaseKey);

let alleProdukter = [];
let visteProdukter = [];
let currentPage = 1;
const productsPerPage = 10;
let currentCategory = "alle";
// ==========================================================
// 2. HENT DATA FRA DATABASEN
// ==========================================================
async function hentOgVisProdukter() {
  const container = document.getElementById("produkt-container");
  if (!container) return;

  try {
    const { data, error } = await minSupabase.from("Products").select("*");

    if (error) {
      console.error(error);
      container.innerHTML = `<h2 class="empty-msg error-msg">FEJL: ${error.message}</h2>`;
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `<h2 class="empty-msg">Fandt ingen produkter.</h2>`;
      return;
    }

    alleProdukter = data.filter((produkt) => {
      return produkt.category && produkt.category.toLowerCase() !== "accessories";
    });

    // visProdukter(alleProdukter);
    visteProdukter = alleProdukter;
    renderPage();

    opsætFiltrering();
  } catch (e) {
    console.error(e);
  }
}

//** */
function renderPage() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;

  const produkterPåSide = visteProdukter.slice(start, end);

  visProdukter(produkterPåSide);
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(visteProdukter.length / productsPerPage) || 1;

  document.querySelector("#pageInfo").textContent = `${currentPage}/${totalPages}`;
}

document.querySelector("#prevPageBtn")?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

document.querySelector("#nextPageBtn")?.addEventListener("click", () => {
  const totalPages = Math.ceil(visteProdukter.length / productsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});
// ==========================================================
// TEGN PRODUKTER PÅ SKÆRMEN
// ==========================================================
function visProdukter(produkter) {
  const container = document.getElementById("produkt-container");
  container.innerHTML = "";

  container.classList.remove("layout-small", "layout-full");

  if (produkter.length <= 4) {
    container.classList.add("layout-small");
  } else if (produkter.length === 10) {
    container.classList.add("layout-full");
  }

  produkter.forEach((produkt) => {
    let billedeIndhold = `<div class="product-placeholder"></div>`;

    if (produkt.image) {
      const imageUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/${produkt.image}`;

      billedeIndhold = `<img src="${imageUrl}" alt="${produkt.navn}" class="product-image main-img">`;

      // ==========================================================
      // VÆLG RANDOM MELLEM DRENG (image2) OG PIGE (image3)
      // ==========================================================
      let tilgaengeligeModeller = [];

      if (produkt.image2) tilgaengeligeModeller.push(produkt.image2);
      if (produkt.image3) tilgaengeligeModeller.push(produkt.image3);

      if (tilgaengeligeModeller.length > 0) {
        const randomModel = tilgaengeligeModeller[Math.floor(Math.random() * tilgaengeligeModeller.length)];
        const hoverUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/${randomModel}`;

        billedeIndhold += `<img src="${hoverUrl}" alt="${produkt.navn} på model" class="product-image hover-img">`;
      } else {
        billedeIndhold += `<img src="${imageUrl}" alt="${produkt.navn}" class="product-image hover-img">`;
      }
    }

    const dynamiskLink = `singleproduct.html?id=${produkt.id}`;

    const produktHTML = `
      <div class="product-item">
        <div class="product-image-box">
          <a href="${dynamiskLink}">
            ${billedeIndhold}
          </a>
          
          <svg data-save-id="${produkt.id}" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        
        <div class="product-text-box">
          <div class="product-text-left">
            <a href="${dynamiskLink}" class="product-link-clean">${produkt.navn}</a>
            <span class="product-size">STR. ${produkt.size || ""}</span>
          </div>
          <div>
            <span>${produkt.price} DKK</span>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += produktHTML;
  });
  // ==========================================================
  // EGNE BILLEDER I GRID
  // ==========================================================
  if (produkter.length <= 4) {
    container.innerHTML += `
    <div class="editorial-img editorial-big">
      <img src="photos/necklaceBig.webp" alt="Styling billede">
    </div>
  `;
  }

  if (produkter.length === 10) {
    container.innerHTML += `
    <div class="editorial-img editorial-large">
      <img src="photos/hole1Style.webp" alt="Styling billede">
    </div>

    <div class="editorial-img editorial-small">
      <img src="photos/RingBig2.webp" alt="Detail billede">
    </div>
  `;
  }
  // Gør hjerterne klikbare
  document.querySelectorAll(".heart-icon").forEach((heart) => {
    heart.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = heart.dataset.saveId;
      const product = produkter.find((p) => String(p.id) === String(id));
      if (!product) return;

      const basisUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/`;

      addToSaved({
        id: product.id,
        name: product.navn,
        price: product.price,
        size: product.size,
        color: product.color,
        image: product.image ? basisUrl + product.image : "",
      });
      heart.classList.toggle("liked");
    });
  });
}

// ==========================================================
// HÅNDTER KATEGORI-FILTRERING
// ==========================================================
function opsætFiltrering() {
  const knapper = document.querySelectorAll(".filter-btn");

  knapper.forEach((knap) => {
    knap.addEventListener("click", () => {
      knapper.forEach((k) => k.classList.remove("active"));
      knap.classList.add("active");
      const valgtKategori = knap.getAttribute("data-category");

      if (valgtKategori === "alle") {
        // visProdukter(alleProdukter);
        visteProdukter = alleProdukter;
        currentPage = 1;
        renderPage();
      } else {
        const filtreredeProdukter = alleProdukter.filter((produkt) => {
          return produkt.category && produkt.category.toLowerCase() === valgtKategori.toLowerCase();
        });

        if (filtreredeProdukter.length === 0) {
          document.getElementById("produkt-container").innerHTML = `<h2 class="empty-msg">📭 Der er ikke uploadet nogen produkter i denne kategori endnu.</h2>`;
        } else {
          // visProdukter(filtreredeProdukter);
          visteProdukter = filtreredeProdukter;
          currentPage = 1;
          renderPage();
        }
      }
    });
  });
}

hentOgVisProdukter();
