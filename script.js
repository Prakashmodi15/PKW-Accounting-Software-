(function(){
  const items = document.querySelectorAll('.menu-item');
  const right = document.getElementById('rightPanel');

  // Function to load saved HTML
  const loadHTML = (key) => localStorage.getItem('tally_html_' + key) || null;
  const saveHTML = (key, html) => localStorage.setItem('tally_html_' + key, html);

  items.forEach(it => {
    it.addEventListener('click', (e) => {
      // Sabhi menu items se active remove karo
      items.forEach(x => x.classList.remove('active'));
      it.classList.add('active');

      const key = it.dataset.key;

      if(key === 'vouchers') {
        // Agar data-key="vouchers" hai → naya page khol do
        window.location.href = "vouchers-home/voucher.html";
      } else {
        // Scroll into view on same page for other items
        it.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Check if saved HTML exists
        const savedHTML = loadHTML(key);
        if(savedHTML) {
          right.innerHTML = `<div id="dynamicContent">${savedHTML}</div>`;
        } else {
          // Show "Add HTML" button
          right.innerHTML = `
            <button id="addHtmlBtn">Add HTML</button>
            <div id="htmlContainer" style="margin-top:10px;"></div>
          `;
          const addBtn = document.getElementById('addHtmlBtn');
          const container = document.getElementById('htmlContainer');

          addBtn.addEventListener('click', () => {
            const filename = prompt("File Name:");
            if(!filename) return;

            container.innerHTML = `
              <div style="margin-bottom:6px;">Enter HTML for <strong>${filename}</strong>:</div>
              <textarea id="htmlInput" rows="8" style="width:100%;"></textarea>
              <button id="runHtmlBtn" style="margin-top:6px;">Run HTML</button>
              <div id="output" style="margin-top:10px; border:1px solid #ccc; padding:8px;"></div>
            `;

            const runBtn = document.getElementById('runHtmlBtn');
            const htmlInput = document.getElementById('htmlInput');
            const output = document.getElementById('output');

            runBtn.addEventListener('click', () => {
              const code = htmlInput.value;
              output.innerHTML = code;
              saveHTML(key, code); // Save to localStorage
            });
          });
        }
      }
    });
  });

  // Mobile menu toggle
  const toggle = document.getElementById('toggleMenu');
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
