// ==========================================================
// 1. SUPABASE OPSÆTNING
// ==========================================================
const minSupabaseUrl = "https://ljpgrgbwtefiivfpynkf.supabase.co";
const minSupabaseKey = "sb_publishable_ZBHtBc88hjDkz95dcCUMyQ_rXmo4XkF";
const minSupabase = window.supabase.createClient(minSupabaseUrl, minSupabaseKey);

// Gemmer det produkt, der bliver hentet fra databasen
let currentProduct = null;

// ==========================================================
// 2. HENT OG VIS DET ENKELTE PRODUKT
// ==========================================================
async function hentSingleProdukt() {
  const urlParams = new URLSearchParams(window.location.search);
  const produktId = urlParams.get("id");

  if (!produktId) {
    document.getElementById("single-navn").innerText = "Intet produkt valgt";
    return;
  }

  try {
    const { data, error } = await minSupabase.from("Products").select("*").eq("id", produktId).single();

    if (error) throw error;
    currentProduct = data;

    // Sæt tekster ind
    document.getElementById("single-navn").innerText = data.navn;
    document.getElementById("single-pris").innerText = data.price + " DKK";
    document.getElementById("single-size").innerText = "STR. " + (data.size || "Varierer");

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

    // Indsæt dem i containeren
    document.getElementById("single-billede-container").innerHTML = billederHTML;
  } catch (fejl) {
    console.error("Fejl ved hentning af produkt:", fejl);
    document.getElementById("single-navn").innerText = "Kunne ikke finde produktet.";
  }
}
// ==========================================================
// 3. TILFØJ PRODUKT TIL KURV
// ==========================================================
const addToCartBtn = document.querySelector("#addToCartBtn");

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    // Stopper hvis produktet ikke er hentet endnu
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
