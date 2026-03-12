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

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl   = document.getElementById('total');
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

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

/* ===== SELECTOR DE COLOR ===== */
const colorSeleccionado = {};

function elegirColor(bidonId, nombreBase, precio, color, btn, imgSrc) {
  const selector = btn.closest('.color-selector');
  selector.querySelectorAll('.color-btn').forEach(b => b.classList.remove('seleccionado'));
  btn.classList.add('seleccionado');

  colorSeleccionado[bidonId] = color;

  const img = document.getElementById('img' + bidonId);
  if (img) {
    img.style.transition = 'opacity 0.3s';
    img.style.opacity = '0';
    setTimeout(() => { img.src = imgSrc; img.style.opacity = '1'; }, 300);
  }

  const btnAgregar = document.getElementById('btn' + bidonId);
  if (btnAgregar) {
    const c = color.charAt(0).toUpperCase() + color.slice(1);
    btnAgregar.innerHTML = '🛒 Agregar (' + c + ')';
  }
}

function addToCartColor(bidonId, nombreBase, precio, btn) {
  const color = colorSeleccionado[bidonId] || '';
  const colorNombre = color ? color.charAt(0).toUpperCase() + color.slice(1) : '';
  const nombre = colorNombre ? nombreBase + ' (' + colorNombre + ')' : nombreBase;

  cart.push({ name: nombre, price: precio });
  renderCart();

  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '✓ Agregado';
  btn.style.background = '#005fa3';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = textoOriginal;
    btn.style.background = '';
    btn.disabled = false;
  }, 1200);
}

/* ===== PROMO ===== */
function agregarProducto(nombre, precio, btn) {
  cart.push({ name: nombre, price: precio });
  renderCart();

  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '✓ Agregado';
  btn.style.background = '#c0392b';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = textoOriginal;
    btn.style.background = '';
    btn.disabled = false;
  }, 1200);
}

/* ===== UBICACIÓN EN FORMULARIO ===== */
let ubicacionCliente = null;

function obtenerUbicacion() {
  const box    = document.getElementById('ubicacionBox');
  const estado = document.getElementById('ubicacionEstado');
  const btn    = box.querySelector('.btn-ubicacion');

  btn.textContent = '⏳ Obteniendo ubicación...';
  btn.disabled = true;

  if (!navigator.geolocation) {
    estado.textContent = '❌ Tu navegador no soporta geolocalización.';
    btn.textContent = '📍 Compartir mi ubicación';
    btn.disabled = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      ubicacionCliente = { lat, lon };
      const mapsLink = 'https://maps.google.com/?q=' + lat + ',' + lon;
      box.classList.add('obtenida');
      estado.innerHTML = '✅ Ubicación obtenida · <a class="ubicacion-link" href="' + mapsLink + '" target="_blank">Ver en Google Maps</a>';
      btn.textContent = '✅ Ubicación guardada';
      btn.classList.add('obtenida');
      btn.disabled = false;
    },
    () => {
      estado.textContent = '❌ No se pudo obtener ubicación. Verifica los permisos.';
      btn.textContent = '📍 Intentar de nuevo';
      btn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
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
  cart.forEach(function(item) {
    pedidoTexto += '• ' + item.name + ' - S/' + item.price + '\n';
    total += item.price;
  });

  const ubicacionTexto = ubicacionCliente
    ? '\n📍 Ubicación exacta: https://maps.google.com/?q=' + ubicacionCliente.lat + ',' + ubicacionCliente.lon
    : '\n📍 Ubicación: (no compartida)';

  const msg = encodeURIComponent(
    '¡Hola! Quiero hacer un pedido 💧\n\n' + pedidoTexto +
    '\n*Total: S/' + total + '*\n\n📋 Mis datos:\n👤 Nombre: ' + nombre +
    '\n🏠 Dirección: ' + direccion +
    (telefono ? '\n📞 Teléfono: ' + telefono : '') +
    ubicacionTexto
  );

  window.open('https://wa.me/51968531996?text=' + msg, '_blank');
}

/* ===== GEOLOCALIZACIÓN SECCIÓN ===== */
function getLocation() {
  const el = document.getElementById('ubicacion');
  if (!navigator.geolocation) {
    el.textContent = 'Tu navegador no soporta geolocalización.';
    return;
  }
  el.textContent = 'Obteniendo ubicación…';
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      const lat  = pos.coords.latitude;
      const lon  = pos.coords.longitude;
      const link = 'https://maps.google.com/?q=' + lat + ',' + lon;
      el.innerHTML = '📍 Ubicación obtenida. <a href="' + link + '" target="_blank" style="color:#0077cc;font-weight:700;">Ver en Google Maps</a>';
    },
    function() { el.textContent = 'No se pudo obtener la ubicación. Verifica los permisos.'; }
  );
}

/* ===== CALIFICACIÓN ===== */
let ratingSeleccionado = 0;

document.querySelectorAll('.estrella').forEach(function(star, i) {
  star.addEventListener('mouseenter', function() { resaltarEstrellas(i + 1); });
  star.addEventListener('mouseleave', function() { resaltarEstrellas(ratingSeleccionado); });
  star.addEventListener('click', function() {
    ratingSeleccionado = i + 1;
    resaltarEstrellas(ratingSeleccionado);
    document.getElementById('ratingText').textContent =
      '¡Gracias por calificarnos con ' + ratingSeleccionado + ' estrella' + (ratingSeleccionado > 1 ? 's' : '') + '! ⭐';
  });
});

function resaltarEstrellas(n) {
  document.querySelectorAll('.estrella').forEach(function(star, i) {
    star.classList.toggle('activa', i < n);
  });
}

/* ===== OPINIONES ===== */
function addReview() {
  const input = document.getElementById('reviewInput');
  const text  = input.value.trim();
  if (!text) return;

  const starsHtml = '⭐'.repeat(ratingSeleccionado || 5);
  const reviews   = document.getElementById('reviews');
  const div       = document.createElement('div');
  div.className   = 'review-card';
  div.innerHTML   = '<div class="stars">' + starsHtml + '</div><p>' + text + '</p>';
  reviews.prepend(div);
  input.value = '';
}

/* ===== BIDÓN FLOTANTE ===== */
(function() {
  const bidon = document.getElementById('bidonFlotante');
  if (!bidon) return;

  bidon.addEventListener('click', function() {
    document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    if (scrolled > 300) {
      bidon.style.display = 'block';
      const ratio = Math.min(scrolled / (document.body.scrollHeight - window.innerHeight), 1);
      bidon.style.top = (20 + ratio * 60) + '%';
    } else {
      bidon.style.display = 'none';
    }
  });
})();

/* ===== SCROLL REVEAL ===== */
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .beneficio-card').forEach(function(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
