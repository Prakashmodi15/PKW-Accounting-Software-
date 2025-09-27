(function(){
  const items = document.querySelectorAll('.menu-item');

  items.forEach(it => {
    it.addEventListener('click', (e) => {
      // Sabhi menu items se active remove karo
      items.forEach(x => x.classList.remove('active'));
      it.classList.add('active');

      // Agar data-key="vouchers" hai → naya page khol do
      if(it.dataset.key === 'vouchers') {
        window.location.href = "vouchers.html";
      } else {
        // Scroll into view on same page for other items
        it.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Mobile menu toggle
  const toggle = document.getElementById('toggleMenu');
  const right = document.getElementById('rightPanel');
  toggle.addEventListener('click', () => {
    right.classList.toggle('show');
    right.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Keyboard shortcut - G to focus menu
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'g') {
      if (window.innerWidth < 900) toggle.click();
      else {
        const active = document.querySelector('.menu-item.active');
        if (active) active.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  });

  // Load company info dynamically from API
  async function loadCompany() {
    try {
      const res = await fetch('http://localhost:3000/company');
      const data = await res.json();

      const periodEl = document.querySelector('.period .value');
      const dateEl = document.querySelector('.date .value');
      const companyNameEl = document.querySelector('.company-name');
      const lastEntryEl = document.querySelector('.company .value');

      if (data) {
        periodEl.textContent = data.period || '';
        dateEl.textContent = data.date || '';
        companyNameEl.textContent = data.name || '';
        lastEntryEl.textContent = data.lastEntry || '';
      }
    } catch (err) {
      console.error('Error loading company data:', err);
    }
  }

  loadCompany();
})();
