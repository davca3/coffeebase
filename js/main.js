// Společné skripty pro všechny stránky coffeeBase

// Bootstrap tooltipy
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

// Tlačítko „Zpět nahoru“
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 400));
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Přihlášení k newsletteru (pouze ukázka – nic se neodesílá)
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    newsletterForm.reset();
    bootstrap.Toast.getOrCreateInstance(document.getElementById('newsletterToast')).show();
  });
}
