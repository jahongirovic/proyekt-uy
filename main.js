const sampleHouses = [
    {
      id: 1,
      title: 'Светлый коттедж в пригороде',
      city: 'Ташкент',
      address: 'ул. Садовая, 12',
      price: 95000,
      beds: 3,
      baths: 2,
      sqft: 180,
      img: 'https://images.unsplash.com/photo-1560184897-6bfe4b0b5c3a?auto=format&fit=crop&w=1000&q=60',
      description: 'Уютный дом с большим садом, 15 минут до центра.'
    },
    {
      id: 2,
      title: 'Модерн-хаус с панорамными окнами',
      city: 'Самарканд',
      address: 'пр. Независимости, 7',
      price: 210000,
      beds: 4,
      baths: 3,
      sqft: 320,
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=60',
      description: 'Современный дизайн, большая кухня и гараж.'
    },
    {
      id: 3,
      title: 'Тихий дом у реки',
      city: 'Бухара',
      address: 'р-н Речной, 3',
      price: 68000,
      beds: 2,
      baths: 1,
      sqft: 120,
      img: 'https://images.unsplash.com/photo-1505691723518-36a3b6f7b1f6?auto=format&fit=crop&w=1000&q=60',
      description: 'Экономичный вариант для семьи, недалеко от природной зоны.'
    }
  ];
  
  let houses = [...sampleHouses];
  const el = id => document.getElementById(id);
  
  function currency(n) {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD' }).format(n);
  }
  
  function renderList() {
    const container = el('listContainer');
    const empty = el('empty');
    container.innerHTML = '';
  
    const q = el('search').value.trim().toLowerCase();
    const beds = el('beds').value;
    const sort = el('sort').value;
  
    let filtered = houses.filter(h => {
      const textMatch = (h.title + ' ' + h.city + ' ' + h.address).toLowerCase().includes(q);
      const bedsMatch = beds === 'any' ? true : h.beds >= Number(beds);
      return textMatch && bedsMatch;
    });
  
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);
  
    if (filtered.length === 0) empty.classList.remove('hidden');
    else empty.classList.add('hidden');
  
    filtered.forEach(h => {
      const card = document.createElement('article');
      card.className = 'bg-white rounded shadow overflow-hidden';
      card.innerHTML = `
        <img class="w-full h-48 object-cover" src="${h.img}" alt="${h.title}" />
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-lg">${h.title}</h3>
            <div class="text-indigo-600 font-bold ml-2">${currency(h.price)}</div>
          </div>
          <p class="text-sm text-gray-500 mt-1">${h.city} • ${h.address}</p>
          <div class="mt-3 text-sm text-gray-600">${h.beds} спал, ${h.baths} ванных • ${h.sqft} м²</div>
          <div class="mt-4 flex gap-2">
            <button class="viewBtn px-3 py-1 bg-indigo-600 text-white rounded" data-id="${h.id}">Подробнее</button>
            <button class="contactBtn px-3 py-1 border rounded" data-id="${h.id}">Связаться</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  
    document.querySelectorAll('.viewBtn').forEach(b => b.addEventListener('click', e => openModal(Number(e.currentTarget.dataset.id))));
    document.querySelectorAll('.contactBtn').forEach(b => b.addEventListener('click', e => prefillContact(Number(e.currentTarget.dataset.id))));
  }
  
  function openModal(id) {
    const house = houses.find(h => h.id === id);
    if (!house) return;
    el('modalBody').innerHTML = `
      <img class="w-full h-64 object-cover rounded" src="${house.img}" alt="${house.title}" />
      <h3 class="text-2xl font-bold mt-3">${house.title} — ${currency(house.price)}</h3>
      <p class="mt-2 text-gray-600">${house.city}, ${house.address}</p>
      <p class="mt-3">${house.description}</p>
      <div class="mt-4 text-sm text-gray-700">${house.beds} спал • ${house.baths} ванн • ${house.sqft} м²</div>
    `;
    el('modal').classList.remove('hidden');
    el('modal').classList.add('flex');
  }
  
  function prefillContact(id) {
    const house = houses.find(h => h.id === id);
    if (!house) return;
    const form = el('contactForm');
    form.message.value = `Интересуюсь объектом: ${house.title} (${house.city}, ${house.address}) — ${currency(house.price)}`;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    form.name.focus();
  }
  
  el('openAddSample').addEventListener('click', () => {
    const id = houses.length ? Math.max(...houses.map(h => h.id)) + 1 : 1;
    houses.push({
      id,
      title: 'Новый объект (demo)',
      city: 'TBD',
      address: 'ул. Demo',
      price: Math.floor(50000 + Math.random() * 200000),
      beds: 2,
      baths: 1,
      sqft: 140,
      img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=60',
      description: 'Автоматически добавлен демо-объект.'
    });
    renderList();
  });
  
  el('closeModal').addEventListener('click', () => {
    el('modal').classList.add('hidden');
    el('modal').classList.remove('flex');
  });
  
  el('modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      el('modal').classList.add('hidden');
      el('modal').classList.remove('flex');
    }
  });
  
  ['search', 'beds', 'sort'].forEach(id => el(id).addEventListener('input', renderList));
  
  el('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    alert('Спасибо, сообщение отправлено (демо).\\n' + data.get('message'));
    e.currentTarget.reset();
  });
  
  renderList();

  
  // Меню для мобильных
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('hidden');
});

// --- остальной код как раньше ---
/* Вставь сюда предыдущий main.js полностью */
