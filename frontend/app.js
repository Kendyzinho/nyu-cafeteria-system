const API = 'http://localhost:3000';

// ─── TABS ────────────────────────────────────────────────
function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  event.target.classList.add('active');
}

// ─── MENÚ DEL DÍA ────────────────────────────────────────
async function loadMenu() {
  const date = document.getElementById('menu-date').value;
  const url = date ? `${API}/menu-items?date=${date}` : `${API}/menu-items`;
  const items = await fetchJSON(url);
  const grid = document.getElementById('menu-grid');

  if (!items.length) { grid.innerHTML = '<p class="empty">No hay ítems para esta fecha.</p>'; return; }

  grid.innerHTML = items.map(item => `
    <div class="card">
      <div class="category">${item.category?.name ?? '—'}</div>
      <h3>${item.name}</h3>
      <p style="font-size:0.8rem;color:#666;margin:4px 0">${item.description ?? ''}</p>
      <div class="price">$${Number(item.base_price).toFixed(2)}</div>
      <div class="stock">
        Stock: ${item.stock?.quantity ?? '?'} —
        ${item.is_blocked
          ? '<span class="badge-blocked">Agotado</span>'
          : '<span class="badge-ok">Disponible</span>'}
      </div>
    </div>
  `).join('');
}

// ─── PEDIDO ───────────────────────────────────────────────
let orderItemCount = 0;

function addOrderItem() {
  orderItemCount++;
  const div = document.createElement('div');
  div.className = 'order-item-row';
  div.id = `oi-${orderItemCount}`;
  div.innerHTML = `
    <input type="number" placeholder="Menu Item ID" min="1" class="oi-item-id" />
    <input type="number" placeholder="Cantidad" min="1" value="1" class="oi-quantity" />
    <button type="button" onclick="this.parentElement.remove()">✕</button>
  `;
  document.getElementById('order-items-list').appendChild(div);
}

document.getElementById('order-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = +document.getElementById('order-student-id').value;
  const pickupTime = document.getElementById('order-pickup').value;
  const itemRows = document.querySelectorAll('.order-item-row');

  const items = Array.from(itemRows).map(row => ({
    menu_item_id: +row.querySelector('.oi-item-id').value,
    quantity: +row.querySelector('.oi-quantity').value,
  })).filter(i => i.menu_item_id > 0);

  if (!items.length) { showResult('order-result', 'Agregá al menos un ítem.', true); return; }

  const body = { student_id: studentId, pickup_time: pickupTime, items };
  const result = await postJSON(`${API}/orders`, body);
  showResult('order-result', result);
});

async function loadStudentOrders() {
  const id = document.getElementById('orders-student-id').value;
  if (!id) return;
  const orders = await fetchJSON(`${API}/orders/student/${id}`);
  const container = document.getElementById('orders-list');
  if (!orders.length) { container.innerHTML = '<p class="empty">No hay pedidos.</p>'; return; }

  container.innerHTML = `
    <table>
      <thead><tr><th>#</th><th>Estado</th><th>Pago</th><th>Total</th><th>Descuento</th><th>Retiro</th></tr></thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td>#${o.id}</td>
            <td>${o.status}</td>
            <td>${o.payment_status}</td>
            <td>$${Number(o.total_price).toFixed(2)}</td>
            <td>${o.discount_applied ? '-$' + Number(o.discount_applied).toFixed(2) : '—'}</td>
            <td>${new Date(o.pickup_time).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ─── HISTORIAL ────────────────────────────────────────────
async function loadHistory() {
  const id = document.getElementById('history-student-id').value;
  if (!id) return;
  const records = await fetchJSON(`${API}/consumption-history/student/${id}`);
  const container = document.getElementById('history-table');
  if (!records.length) { container.innerHTML = '<p class="empty">Sin historial de consumo.</p>'; return; }

  container.innerHTML = `
    <table>
      <thead><tr><th>Fecha</th><th>Tipo</th><th>Total</th><th>Descuento</th><th>Final</th><th>Ref</th></tr></thead>
      <tbody>
        ${records.map(r => `
          <tr>
            <td>${new Date(r.consumed_at).toLocaleString()}</td>
            <td>${r.type}</td>
            <td>$${Number(r.total_amount).toFixed(2)}</td>
            <td>${r.discount_amount ? '-$' + Number(r.discount_amount).toFixed(2) : '—'}</td>
            <td><strong>$${Number(r.final_amount).toFixed(2)}</strong></td>
            <td>${r.order ? 'Pedido #' + r.order.id : r.meal_plan ? 'Plan #' + r.meal_plan.id : '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ─── PLANES ───────────────────────────────────────────────
async function loadPlans() {
  const id = document.getElementById('plans-student-id').value;
  if (!id) return;
  const plans = await fetchJSON(`${API}/meal-plans/student/${id}`);
  const container = document.getElementById('plans-result');
  if (!plans.length) { container.innerHTML = '<p class="empty">Sin planes.</p>'; return; }

  container.innerHTML = plans.map(p => `
    <div class="plan-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="plan-type">${p.plan_type.toUpperCase()}</span>
        <span class="${p.status === 'active' ? 'plan-badge-active' : 'plan-badge-pending'}">${p.status}</span>
      </div>
      <p style="margin:6px 0;font-size:0.85rem">📅 ${p.month}/${p.year} — $${p.price}</p>
      <p style="font-size:0.85rem;color:#555">Créditos restantes: <strong>${p.credits_remaining}</strong> / ${p.daily_credits * 30}</p>
    </div>
  `).join('');
}

document.getElementById('plan-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    student_id: +document.getElementById('plan-student-id').value,
    plan_type: document.getElementById('plan-type').value,
    month: +document.getElementById('plan-month').value,
    year: +document.getElementById('plan-year').value,
  };
  const result = await postJSON(`${API}/meal-plans`, body);
  showResult('plan-result', result);
});

// ─── UTILS ────────────────────────────────────────────────
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function postJSON(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

function showResult(elementId, data, isError = false) {
  const el = document.getElementById(elementId);
  el.classList.remove('hidden', 'error');
  if (isError || data?.statusCode >= 400 || data?.error) {
    el.classList.add('error');
    el.textContent = data?.message || data;
  } else {
    el.textContent = JSON.stringify(data, null, 2);
  }
}

// Cargar menú de hoy al iniciar
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('menu-date').value = today;
  loadMenu();
});
