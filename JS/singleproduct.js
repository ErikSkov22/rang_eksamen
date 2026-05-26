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
    const { data, error } = await minSupabase
      .from("Products")
      .select("*")
      .eq("id", produktId)
      .single();

    if (error) throw error;

    // Sæt de grundlæggende tekster ind
    document.getElementById("single-navn").innerText = data.navn;
    document.getElementById("single-pris").innerText = data.price + " DKK";
    document.getElementById("single-size").innerText =
      "STR. " + (data.size || "Varierer");

    // Sæt tekster ind i harmonika-menuen (Beskrivelse, Size Guide, Pleje)
    document.getElementById("single-desc").innerText =
      data.description || "Ingen beskrivelse tilgængelig.";

    // HER ER RETTELSEN: Vi bruger ["sizing guide"] fordi der er mellemrum i navnet
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

hentSingleProdukt();
