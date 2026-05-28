#  Rang – Eksamensprojekt (2. Semester)

Dette projekt er lavet som en del af vores 2. semester eksamen. Vi har lavet et dynamisk e-commerce website med HTML, CSS og Vanilla JavaScript, hvor al produktdata bliver hentet fra en Supabase database.

##  Funktioner på websitet
* Se en pagineret liste af produkter (smykker og accessories).
* Klikke sig videre til en dynamisk detaljeside.
* Bruge filtrering (kategorier) og sortering (pris, størrelse, A-Z).
* Tilføje produkter til en indkøbskurv og en "Gemte"-liste (favoritter).
* Udfylde en kontakt- og loginformular.

##  Links
* **GitHub repository:** https://github.com/ErikSkov22/rang_eksamen
* **GitHub Pages (Live site):** https://rangcph.netlify.app/
* **Figma:** https://www.figma.com/design/bPtfzuTNM18lFJ5EU9Qs8Z/Tema-10-EKSAMEN?node-id=30-73&t=9S6CRAEDnw9m2WoK-1
* **Trello:** https://trello.com/invite/b/69f07c0aa694a1229558d68e/ATTI924d7d4fb6e2b37a9f39edf48123fb9488D526DA/tema-10-eksamen

---

##  Projektstruktur
Projektet er opdelt i logiske mapper til HTML, CSS og JavaScript-filer.

```text
rang_eksamen/ 
├── index.html 
├── singleproduct.html 
├── smykker.html 
├── accessories.html 
├── om.html 
├── kontakt.html 
├── nyheder.html 
├── css/ 
│   ├── custom.css 
│   ├── global.css 
│   ├── index.css 
│   ├── singleproduct.css 
│   ├── productlist.css 
│   ├── om.css 
│   └── kontakt.css 
├── js/ 
│   ├── navigation.js 
│   ├── index.js 
│   ├── productlist.js 
│   ├── singleproduct.js 
│   └── panels.js
├── photos/ 
└── README.md
```

### Filbeskrivelser

| Fil / Mappe | Beskrivelse |
| :--- | :--- |
| **index.html** | Forsiden med slider til udvalgte produkter. |
| **smykker.html** | Viser en komplet liste med smykker (pagineret). |
| **accessories.html** | Viser en liste udelukkende med accessories. |
| **singleproduct.html** | Viser detaljer om et specifikt valgt produkt. |
| **kontakt.html** | Indeholder formularen. |
| **om.html / nyheder.html** | Statiske informationssider. |
| **global.css** | Styrer designet, der gælder for alle sider (header, footer, typografi). |
| **custom.css** | Indeholder vores CSS-variabler (farver, fonte). |
| **Øvrige css-filer** | Styrer designet specifikt på de tilhørende sider. |
| **js-mappen** | Modulopbygget logik, der styrer dynamisk indhold, API-kald og state management. |

---

##  Hvordan koden fungerer
Vi har opdelt vores JavaScript, så hver side har sin egen logik, og vi ikke loader unødig kode.

### `index.js`
Bruges på forsiden. Koden henter specifikke produkter (fx kategorien "ring") med `.limit(8)` fra Supabase og genererer en karrusel/slider, som brugeren kan navigere i.

### `productlist.js` (og `accessories.js`)
Henter data fra databasen og viser listerne med produkter. 

**Dataflow:**
1. Siden loader.
2. JavaScript kører og henter asynkront data fra Supabase.
3. Dataen gemmes i et array (`alleProdukter`).
4. Sorterings- og filtreringslogik afgør, hvad der skal vises i `visteProdukter`.
5. Paginering udregner start- og slut-index (maks 10 pr. side).
6. HTML genereres dynamisk i en loop (`forEach`) og indsættes i DOM'en.
7. Brugeren kan interagere, lægge i kurv eller klikke ind på produktet.

### `singleproduct.js`
Bruges til detaljesiden. Den læser et unikt id fra URL'en (`URLSearchParams`) og henter derefter præcis det produkt fra databasen. Dette gør det muligt at genbruge den samme HTML-side til hundredvis af produkter. Siden henter også "lignende produkter" ved at kigge på det første ord i produktnavnet (fx "STONE") og søge i databasen efter relaterede varer.

### Paneler og `localStorage` (Kurv/Gemte)
Vi har bygget slide-in paneler til indkøbskurv og favoritter. Data gemmes i brugerens browser via `localStorage`. Logikken forhindrer dubletter, udregner den samlede pris og lader brugeren flytte produkter direkte fra "Gemte" til "Kurven".

---

##  Kodepraksis & Struktur

### Navngivning
Vi har prøvet at navngive vores filer, variabler og funktioner så tydeligt som muligt, og vi bruger **camelCase** i JavaScript, fordi det gør koden mere ensartet og lettere at læse.

**Eksempler på navngivning:**
* Variabler: `const alleProdukter;`, `let visteProdukter;`, `const productsPerPage;`
* Funktioner: `hentOgVisProdukter();`, `hentSingleProdukt();`, `addToCart();`, `renderPage();`

### Kommentarer i koden
Vi har kommenteret de steder i koden, hvor det giver mening. Fx ved funktioner, fetch-kald, og hvor der foregår avanceret logik. Vi har undgået at kommentere helt åbenlyse ting for at holde koden ren.

---

##  Data og JSON-struktur
Vi henter vores produktdata fra et Supabase REST API i JSON-format. 

**Felter vi bruger:**
* **`id`** – bruges til at sende brugeren videre til den rigtige detaljeside.
* **`navn`** – produktets navn.
* **`category`** – bruges til filtrering.
* **`price`** – produktets pris (bruges også til total-udregning i kurven).
* **`size`** – størrelse (vi håndterer også "null" eller tomme felter ved at skrive "One-size").
* **`image` / `image2` / `image3`** – Billeder af produktet. Vi har lavet logik, der skifter tilfældigt mellem mandlig/kvindelig model ved hover.

---

##  Formular og validering
Vi har lavet en formular (login/kontakt), hvor brugeren kan indtaste oplysninger. 

**HTML & JS validering:**
* `required` – feltet skal udfyldes.
* `type="email"` – validerer korrekt e-mail format.
* JavaScript-validering forhindrer default-submit (`e.preventDefault()`) og udskriver fejlmeddelelser direkte i DOM'en, hvis betingelserne ikke er opfyldt.
* Dette sikrer, at brugeren ikke kan sende formularen ved fejl, hvilket øger brugervenligheden.

---

##  Git og branches
Vi har brugt GitHub til at samarbejde om projektet for at undgå kodekonflikter, når vi arbejdede i samme filer. Vi navngav vores branches med feature først, og navnet på den, der udviklede, til sidst (fx `feature-forside-slider-steen`, `feature-kurv-localstorage-pia`).

**Vores Workflow:**
1. Lave en branch ud fra `main`.
2. Kode featuren.
3. Committe ændringer med beskrivende tekster.
4. Pushe til GitHub.
5. Merge ind i `main`, når featuren virkede og var testet.

---

##  Bæredygtighed
Vi har tænkt digital bæredygtighed ind i projektet ved at holde løsningen effektiv og mindske unødig dataoverførsel. Et lettere website kræver færre ressourcer at loade og køre på brugerens enhed.

**Konkrete tiltag:**
* **Undgået tunge frameworks:** Vi har bygget det i Vanilla JS/CSS for at mindske ressourceforbruget.
* **Databaselimits:** På forsiden henter vi kun 8 produkter (`.limit(8)`) i stedet for hele databasen, hvilket sparer load-tid og serverkraft.
* **Genbrug af kode:** Vores `singleproduct.html` fungerer som en skabelon for alle produkter i stedet for at have en HTML-fil pr. produkt.
* **Lokal opbevaring:** Kurv og favoritter gemmes i `localStorage`, så vi ikke behøver at lave konstante server-forespørgsler, når brugeren skifter side.
* **Hentning af data med Supabase-klienten:** I starten af projektet forsøgte vi at hente vores produktdata ved hjælp af JavaScripts almindelige `fetch()`-metode. Det var ustabilt, specielt ved filtrering. Vi skiftede til Supabases egen JavaScript-klient, hvilket gjorde koden renere og datahentningen markant mere effektiv.

---

##  Udfordringer og Forbedringer

### Udfordringer undervejs
En af de største udfordringer var at håndtere asynkront data fra Supabase og sikre os, at DOM'en (HTML'en) ikke forsøgte at loade, før dataen var klar. Det var også en teknisk udfordring at få id'et med via URL'en, og at bygge logikken til `localStorage` for indkøbskurven (især at flytte elementer fra én lokal liste til en anden).

**Løsninger:**
* Brug af `async/await` for at styre datastrømmen.
* `console.log()` data systematisk undervejs for at forstå JSON-strukturen.
* Bruge `URLSearchParams` til ID-håndtering.
* Løse problemer i fællesskab og dele opgaverne tydeligt op i gruppen.

### Mulige forbedringer
Hvis vi skulle arbejde videre med projektet, kunne vi forbedre det ved at tilføje:
* En søgefunktion (Search bar).
* Flere filtreringsmuligheder på tværs (fx filtrér på både størrelse og kategori på én gang).
* En rigtig checkout-proces med betalingsgateway (frem for kun visning af kurv).
* Bedre loading states (fx skeleton loaders mens Supabase henter data).
* Fejlhåndtering, hvor brugeren får en pæn 404-side, hvis et produkt-ID i URL'en ikke findes.

---

##  Gruppemedlemmer
* Caroline Lindqvist
* Frederikke Rosenbom
* Erik Skov
* Mikkel Storm
