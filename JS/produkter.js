// ==========================================================
// 1. SUPABASE OPSÆTNING
// ==========================================================
const minSupabaseUrl = "https://ljpgrgbwtefiivfpynkf.supabase.co";
const minSupabaseKey = "sb_publishable_ZBHtBc88hjDkz95dcCUMyQ_rXmo4XkF";
const minSupabase = window.supabase.createClient(
  minSupabaseUrl,
  minSupabaseKey,
);

// Vi opretter en global variabel til at gemme alle produkter,
// så vi ikke belaster databasen hver gang vi trykker på et filter.
let alleProdukter = [];

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
      container.innerHTML = `<h2 style="color: red; text-align: center;">🚨 FEJL: ${error.message}</h2>`;
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `<h2 style='text-align:center; padding: 50px;'>📭 Fandt ingen produkter.</h2>`;
      return;
    }

    // HER ER DØRMANDEN
    alleProdukter = data.filter((produkt) => {
      return (
        produkt.category && produkt.category.toLowerCase() !== "accessories"
      );
    });

    // Vis produkterne (nu UDEN accessories) som det første
    visProdukter(alleProdukter);

    // Start med at lytte efter klik på filterknapperne
    opsætFiltrering();
  } catch (e) {
    console.error(e);
  }
}

// ==========================================================
// 3. TEGN PRODUKTER PÅ SKÆRMEN
// ==========================================================
function visProdukter(produkter) {
  const container = document.getElementById("produkt-container");
  container.innerHTML = ""; // Tøm skærmen før vi sætter nye ind

  produkter.forEach((produkt) => {
    let billedeIndhold = `<div class="product-placeholder"></div>`;

    if (produkt.image) {
      const imageUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/${produkt.image}`;
      billedeIndhold = `<img src="${imageUrl}" alt="${produkt.navn}" class="product-image">`;
    }

    // HER BYGGER VI DET DYNAMISKE LINK! 🔗
    const dynamiskLink = `singleproduct.html?id=${produkt.id}`;

    const produktHTML = `
      <div class="product-item">
        
        <div class="product-image-box">
          <a href="${dynamiskLink}" style="display: block; width: 100%; height: 100%;">
            ${billedeIndhold}
          </a>
          
          <svg data-save-id="${produkt.id}" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>
        </div>
        
        <div class="product-text-box">
          <div class="product-text-left">
            <a href="${dynamiskLink}" class="product-link-clean">${produkt.navn}</a>
            <span style="font-family: var(--inter-font); font-size: 0.9rem; font-weight: normal; text-transform: none; color: var(--black); margin-top: 4px;">STR. ${produkt.size || ""}</span>
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
  // GEMTE: Gør hjerterne klikbare
  // ==========================================================
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
// 4. HÅNDTER KATEGORI-FILTRERING
// ==========================================================
function opsætFiltrering() {
  const knapper = document.querySelectorAll(".filter-btn");

  knapper.forEach((knap) => {
    knap.addEventListener("click", () => {
      // 1. Fjern den røde farve fra alle knapper
      knapper.forEach((k) => k.classList.remove("active"));

      // 2. Sæt den røde farve på knappen vi lige har klikket på
      knap.classList.add("active");

      // 3. Hent usynlig kategori-data (data-category)
      const valgtKategori = knap.getAttribute("data-category");

      // 4. Vis rigtige produkter baseret på valg
      if (valgtKategori === "alle") {
        visProdukter(alleProdukter);
      } else {
        const filtreredeProdukter = alleProdukter.filter((produkt) => {
          return (
            produkt.category &&
            produkt.category.toLowerCase() === valgtKategori.toLowerCase()
          );
        });

        // Tjek om kategorien er tom
        if (filtreredeProdukter.length === 0) {
          document.getElementById("produkt-container").innerHTML =
            `<h2 style='text-align:center; grid-column: 1/-1; padding: 50px;'>📭 Der er ikke uploadet nogen produkter i denne kategori endnu.</h2>`;
        } else {
          visProdukter(filtreredeProdukter);
        }
      }
    });
  });
}

// ==========================================================
// 5. START PROGRAMMET
// ==========================================================
hentOgVisProdukter();
