// Stránka Přidat kávu – validace formuláře a drobné interakce

const form = document.getElementById('coffeeForm');
const rating = document.getElementById('rating');
const review = document.getElementById('review');

rating.addEventListener('input', () => {
  document.getElementById('ratingValue').textContent = rating.value;
});

review.addEventListener('input', () => {
  document.getElementById('reviewCount').textContent = review.value.length;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    form.querySelector(':invalid').focus();
    return;
  }

  // Ukázkový projekt bez backendu – data se nikam neodesílají
  document.getElementById('saveToastName').textContent = form.nazev.value;
  bootstrap.Toast.getOrCreateInstance(document.getElementById('saveToast')).show();
  form.reset();
});

form.addEventListener('reset', () => {
  form.classList.remove('was-validated');
  // hodnoty se po resetu obnoví až po dokončení události
  setTimeout(() => {
    document.getElementById('ratingValue').textContent = rating.value;
    document.getElementById('reviewCount').textContent = review.value.length;
  });
});
