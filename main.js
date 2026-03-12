/* ===== CONTADOR ===== */
(function animarContador() {
  const el = document.getElementById('counter');
  if (!el) return;
  const target = 1250;
  let count = 0;
  const step = Math.ceil(target / 120);
  const interval = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count.toLocaleString('es-PE');
    if (count >= target) clearInterval(interval);
  }, 18);
})();

/* ===== CARRITO ===== */
let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
  // Feedback visual
  const btn = event.currentTarget;
  btn.textContent = '✓ Agregado';
  btn.style.background = '#0077cc';
  setTimeout(() => {
    btn.textContent = 'Agregar';
    btn.style.background = '';
  }, 1200);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('total');
  if (!container) return;

  let total = 0;
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p style="color:#aaa;text-align:center;padding:12px 0;">Tu carrito está vacío</p>';
  } else {
    cart.forEach((item, i) => {
      total += item.price;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.name}</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <strong>S/${item.price}</strong>
          <button onclick="removeFromCart(${i})" title="Eliminar">✕</button>
        </div>`;
      container.appendChild(div);
    });
  }

  totalEl.textContent = total;
}

/* ===== ENVÍO WHATSAPP ===== */
function sendOrder() {
  const nombre    = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono  = document.getElementById('telefono').value.trim();

  if (cart.length === 0) {
    alert('¡Agrega al menos un producto antes de enviar tu pedido!');
    return;
  }
  if (!nombre || !direccion) {
    alert('Por favor completa tu nombre y dirección.');
    return;
  }

  let pedidoTexto = '';
  let total = 0;
  cart.forEach(item => {
    pedidoTexto += `• ${item.name} - S/${item.price}\n`;
    total += item.price;
  });

  const msg = encodeURIComponent(
    `¡Hola! Quiero hacer un pedido 💧\n\n${pedidoTexto}\n*Total: S/${total}*\n\n📋 Mis datos:\n👤 Nombre: ${nombre}\n📍 Dirección: ${direccion}${telefono ? '\n📞 Teléfono: ' + telefono : ''}`
  );

  window.open(`https://wa.me/51968531996?text=${msg}`, '_blank');
}

/* ===== GEOLOCALIZACIÓN ===== */
function getLocation() {
  const el = document.getElementById('ubicacion');
  if (!navigator.geolocation) {
    el.textContent = 'Tu navegador no soporta geolocalización.';
    return;
  }
  el.textContent = 'Obteniendo ubicación…';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      const link = `https://maps.google.com/?q=${lat},${lon}`;
      el.innerHTML = `📍 Ubicación obtenida. <a href="${link}" target="_blank" style="color:#0077cc;font-weight:700;">Ver en Google Maps</a>`;
    },
    () => {
      el.textContent = 'No se pudo obtener la ubicación. Verifica los permisos.';
    }
  );
}

/* ===== CALIFICACIÓN ===== */
let ratingSeleccionado = 0;

document.querySelectorAll('.estrella').forEach((star, i) => {
  star.addEventListener('mouseenter', () => resaltarEstrellas(i + 1));
  star.addEventListener('mouseleave', () => resaltarEstrellas(ratingSeleccionado));
  star.addEventListener('click', () => {
    ratingSeleccionado = i + 1;
    resaltarEstrellas(ratingSeleccionado);
    document.getElementById('ratingText').textContent =
      `¡Gracias por calificarnos con ${ratingSeleccionado} estrella${ratingSeleccionado > 1 ? 's' : ''}! ⭐`;
  });
});

function resaltarEstrellas(n) {
  document.querySelectorAll('.estrella').forEach((star, i) => {
    star.classList.toggle('activa', i < n);
  });
}

/* ===== OPINIONES ===== */
function addReview() {
  const input = document.getElementById('reviewInput');
  const text = input.value.trim();
  if (!text) return;

  const stars = ratingSeleccionado || 5;
  const starsHtml = '⭐'.repeat(stars);

  const reviews = document.getElementById('reviews');
  const div = document.createElement('div');
  div.className = 'review-card';
  div.innerHTML = `<div class="stars">${starsHtml}</div><p>${text}</p>`;
  reviews.prepend(div);
  input.value = '';
}

/* ===== BIDÓN FLOTANTE — mostrar al hacer scroll ===== */
(function() {
  const bidon = document.getElementById('bidonFlotante');
  if (!bidon) return;

  // Al hacer click va al pedido
  bidon.addEventListener('click', () => {
    document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > 300) {
      bidon.style.display = 'block';
      // Posición Y sigue el scroll suavemente entre 20% y 80% del viewport
      const ratio = Math.min(scrolled / (document.body.scrollHeight - window.innerHeight), 1);
      const topPercent = 20 + ratio * 60; // va de 20% a 80%
      bidon.style.top = topPercent + '%';
      bidon.style.animation = 'bidonFlota 3s ease-in-out infinite';
    } else {
      bidon.style.display = 'none';
    }
  });
})();
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .beneficio-card, .review-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
