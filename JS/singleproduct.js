// ==========================================================
// SUPABASE OPSÆTNING
// ==========================================================
const minSupabaseUrl = "https://ljpgrgbwtefiivfpynkf.supabase.co";
const minSupabaseKey = "sb_publishable_ZBHtBc88hjDkz95dcCUMyQ_rXmo4XkF";
const minSupabase = window.supabase.createClient(
  minSupabaseUrl,
  minSupabaseKey,
);

let currentProduct = null;

// ==========================================================
// HENT OG VIS LIGNENDE PRODUKTER
// ==========================================================
async function hentLignendeProdukter(produkt) {
  const container = document.querySelector("#similarProducts");
  if (!container) return;

  const basisUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/`;

  // Finder første ord i navnet, fx "STONE" fra "STONE RING 9"
  const førsteOrd = produkt.navn.split(" ")[0];

  const { data, error } = await minSupabase
    .from("Products")
    .select("*")
    .neq("id", produkt.id)
    .ilike("navn", `${førsteOrd}%`)
    .limit(4);

  if (error) {
    console.error("Fejl ved lignende produkter:", error);
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>Ingen lignende produkter fundet.</p>";
    return;
  }

  container.innerHTML = data
    .map((item) => {
      return `
        <div class="similar-product-card">
          <a href="singleproduct.html?id=${item.id}">
            <img src="${basisUrl}${item.image}" alt="${item.navn}">
          </a>

          <div class="similar-product-text">
            <strong>${item.navn}</strong>
            <span>${item.price} DKK</span>
          </div>

          <a href="singleproduct.html?id=${item.id}" class="product-link">
            SE MERE
          </a>
        </div>
      `;
    })
    .join("");
}
// ==========================================================
// HENT OG VIS DET ENKELTE PRODUKT
// ==========================================================
async function hentSingleProdukt() {
  const urlParams = new URLSearchParams(window.location.search);
  const produktId = urlParams.get("id");

  if (!produktId) {
    document.getElementById("single-navn").innerText = "Intet produkt valgt";
    return;
  }

  try {
    const { data, error } = await minSupabase
      .from("Products")
      .select("*")
      .eq("id", produktId)
      .single();

    if (error) throw error;
    currentProduct = data;
    hentLignendeProdukter(data);

    // Sæt de grundlæggende tekster ind
    document.getElementById("single-navn").innerText = data.navn;
    document.getElementById("single-pris").innerText = data.price + " DKK";
    document.getElementById("single-size").innerText =
      "STR. " + (data.size || "Varierer");

    document.getElementById("single-desc").innerText =
      data.description || "Ingen beskrivelse tilgængelig.";

    // Vi bruger ["sizing guide"] fordi der er mellemrum i navnet
    document.getElementById("single-size-guide").innerText =
      data["sizing guide"] || "Ingen størrelsesguide tilgængelig.";

    document.getElementById("single-care").innerText =
      data.care || "Ingen plejevejledning tilgængelig.";

    // Byg op til 4 billeder dynamisk
    let billederHTML = "";
    const basisUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/`;

    if (data.image) {
      billederHTML += `<div><img src="${basisUrl}${data.image}" alt="${data.navn} 1"></div>`;
    }
    if (data.image2) {
      billederHTML += `<div><img src="${basisUrl}${data.image2}" alt="${data.navn} 2"></div>`;
    }
    if (data.image3) {
      billederHTML += `<div><img src="${basisUrl}${data.image3}" alt="${data.navn} 3"></div>`;
    }
    if (data.image4) {
      billederHTML += `<div><img src="${basisUrl}${data.image4}" alt="${data.navn} 4"></div>`;
    }

    // Indsæt billederne i containeren
    document.getElementById("single-billede-container").innerHTML =
      billederHTML;
  } catch (fejl) {
    console.error("Fejl ved hentning af produkt:", fejl);
    document.getElementById("single-navn").innerText =
      "Kunne ikke finde produktet.";
  }
}
// ==========================================================
// TILFØJ TIL KURV
// ==========================================================
const addToCartBtn = document.querySelector("#addToCartBtn");

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    const basisUrl = `${minSupabaseUrl}/storage/v1/object/public/RangImages/`;

    addToCart({
      id: currentProduct.id,
      name: currentProduct.navn,
      price: currentProduct.price,
      size: currentProduct.size,
      color: currentProduct.color,
      image: currentProduct.image ? basisUrl + currentProduct.image : "",
    });
  });
}

hentSingleProdukt();
