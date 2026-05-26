const burgerBtn = document.querySelector(".burger-btn");
const navMenu = document.querySelector(".nav-menu");

burgerBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Frivillig ekstra: Skift ikon til et X når den er åben
  if (navMenu.classList.contains("active")) {
    burgerBtn.textContent = "✕";
  } else {
    burgerBtn.textContent = "=";
  }
});

// Vi finder headeren på siden
const header = document.querySelector(".site-header");

// Vi lytter efter, om brugeren scroller
window.addEventListener("scroll", () => {
  // Hvis man scroller mere end 50 pixels ned...
  if (window.scrollY > 50) {
    header.classList.add("scrolled"); // ...bliver den hvid
  } else {
    header.classList.remove("scrolled"); // ...ellers bliver den gennemsigtig igen i toppen
  }
});
