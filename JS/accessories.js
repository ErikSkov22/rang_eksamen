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
  container.innerHTML = "<p>Indlæser accessories...</p>";

  try {
    // HER VAR FEJLEN! Nu beder vi om 'category' i stedet for 'kategori'
    const { data, error } = await minSupabase
      .from("Products")
      .select("*")
      .eq("category", "Accessories");

    if (error) throw error;

    if (data.length === 0) {
      container.innerHTML =
        "<p>Der er ingen accessories på lager i øjeblikket.</p>";
      return;
    }

    container.innerHTML = "";

    data.forEach((produkt) => {
      const imageUrl = produkt.image
        ? `${minSupabaseUrl}/storage/v1/object/public/RangImages/${produkt.image}`
        : "";

      const displaySize =
        produkt.size && produkt.size !== "null" && produkt.size !== ""
          ? produkt.size
          : "One-size";

      const html = `
        <div class="product-item">
          <a href="singleproduct.html?id=${produkt.id}" class="product-link-clean">
            <div class="product-image-box">
              <img src="${imageUrl}" alt="${produkt.navn}" class="product-image">
            </div>
            
            <div class="product-text-box">
              <div class="product-text-left">
                <span>${produkt.navn}</span>
                <span style="font-family: var(--inter-font); font-size: 0.9rem; text-transform: none; color: var(--black); margin-top: 4px;">
                  STR. ${displaySize}
                </span>
              </div>
              <span>${produkt.price} DKK</span>
            </div>
          </a>
        </div>
      `;

      container.innerHTML += html;
    });
  } catch (fejl) {
    console.error("Fejl ved hentning af accessories:", fejl);
    container.innerHTML =
      "<p>Der opstod en fejl. Kunne ikke hente produkterne.</p>";
  }
}

hentAccessories();
