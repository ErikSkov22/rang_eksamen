// ==========================================================
// 1. SUPABASE OPSÆTNING
// ==========================================================
const minSupabaseUrl = "https://ljpgrgbwtefiivfpynkf.supabase.co";
const minSupabaseKey = "sb_publishable_ZBHtBc88hjDkz95dcCUMyQ_rXmo4XkF";
const minSupabase = window.supabase.createClient(
  minSupabaseUrl,
  minSupabaseKey,
);

// ==========================================================
// 2. HENT OG VIS ACCESSORIES
// ==========================================================
async function hentAccessories() {
  const container = document.getElementById("produkt-liste");
  container.innerHTML = "<p class='empty-msg'>Indlæser accessories...</p>";

  try {
    const { data, error } = await minSupabase
      .from("Products")
      .select("*")
      .eq("category", "Accessories");

    if (error) throw error;

    if (data.length === 0) {
      container.innerHTML =
        "<p class='empty-msg'>Der er ingen accessories på lager i øjeblikket.</p>";
      return;
    }

    container.innerHTML = "";

    data.forEach((produkt) => {
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
          const randomModel =
            tilgaengeligeModeller[
              Math.floor(Math.random() * tilgaengeligeModeller.length)
            ];
          const hoverUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/${randomModel}`;

          billedeIndhold += `<img src="${hoverUrl}" alt="${produkt.navn} på model" class="product-image hover-img">`;
        } else {
          billedeIndhold += `<img src="${imageUrl}" alt="${produkt.navn}" class="product-image hover-img">`;
        }
      }

      const displaySize =
        produkt.size && produkt.size !== "null" && produkt.size !== ""
          ? produkt.size
          : "One-size";

      const html = `
        <div class="product-item">
          
          <div class="product-image-box">
            <a href="singleproduct.html?id=${produkt.id}">
              ${billedeIndhold}
            </a>
            
            <svg data-save-id="${produkt.id}" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          
          <div class="product-text-box">
            <div class="product-text-left">
              <a href="singleproduct.html?id=${produkt.id}" class="product-link-clean">${produkt.navn}</a>
              <span class="product-size">
                STR. ${displaySize}
              </span>
            </div>
            <span>${produkt.price} DKK</span>
          </div>

        </div>
      `;

      container.innerHTML += html;
    });

    // ==========================================================
    // 3. GEMTE: Gør hjerterne klikbare
    // ==========================================================
    document.querySelectorAll(".heart-icon").forEach((heart) => {
      heart.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = heart.dataset.saveId;
        const product = data.find((p) => String(p.id) === String(id));

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
  } catch (fejl) {
    console.error("Fejl ved hentning af accessories:", fejl);
    container.innerHTML =
      "<p class='empty-msg error-msg'>Der opstod en fejl. Kunne ikke hente produkterne.</p>";
  }
}

hentAccessories();
