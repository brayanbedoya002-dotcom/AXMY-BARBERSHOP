// Variable global para almacenar todo el catálogo obtenido de MongoDB
let catalogoGlobal = [];

// ==========================================
// 1. INICIALIZACIÓN Y SEGURIDAD AL CARGAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Proteger la vista: si no hay token, redirigir al login
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Cargar el catálogo completo al iniciar
    cargarCatalogo();
    // Cargar las citas del cliente autenticado al abrir la página
    cargarMisCitas();
});

// ==========================================
// 2. GESTIÓN DEL CATÁLOGO Y PESTAÑAS
// ==========================================
async function cargarCatalogo() {
    try {
        const response = await fetch('/api/estilos');
        const data = await response.json();

        if (data.success) {
            // Soportar diferentes estructuras de respuesta del backend
            catalogoGlobal = Array.isArray(data.estilos) ? data.estilos : (data.data || []);
            // Mostrar por defecto la pestaña de cortes
            filtrarCatalogo('cortes');
        } else {
            const grid = document.getElementById('servicesGrid');
            if (grid) grid.innerHTML = '<p style="text-align:center; color:#888; grid-column: 1/-1;">No hay elementos disponibles en este momento.</p>';
        }
    } catch (error) {
        console.error('Error cargando el catálogo:', error);
    }
}

function filtrarCatalogo(categoriaSeleccionada, event) {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    // Actualizar estilos activos de los botones de pestañas si se pasa el evento
    if (event) {
        document.querySelectorAll('.btn-cat-tab').forEach(btn => {
            btn.style.background = '#0a0a0a';
            btn.style.color = '#d4af37';
            btn.classList.remove('active');
        });
        event.target.style.background = '#d4af37';
        event.target.style.color = '#000';
        event.target.classList.add('active');
    }

    // Filtrar elementos que coincidan con la categoría (cortes, cabello, barberos)
    const filtrados = catalogoGlobal.filter(item => item.categoria === categoriaSeleccionada);

    grid.innerHTML = '';

    if (filtrados.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 30px;">No hay elementos disponibles en esta sección por el momento.</p>`;
        return;
    }

    filtrados.forEach((estilo, index) => {
        const numeroTarjeta = String(index + 1).padStart(2, '0');
        
        const card = document.createElement('article');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="card-header">${numeroTarjeta}.</div>
            <div class="card-body">
                <div class="card-image-wrapper">
                    <img src="${estilo.imagenUrl}" alt="${estilo.titulo}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px;">
                </div>
                <div class="card-details" style="margin-top: 15px;">
                    <h2 class="service-name" style="color: #d4af37; font-size: 1.2rem; margin-bottom: 8px;">${estilo.titulo}</h2>
                    <p class="service-desc" style="color: #ccc; font-size: 0.9rem; margin-bottom: 12px;">${estilo.descripcion}</p>
                    <div class="price-time" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span class="price" style="color: #fff; font-weight: bold; font-size: 1.1rem;">$${estilo.precio}</span>
                        <span class="duration" style="color: #aaa; font-size: 0.9rem;">⏱️ ${estilo.duracion || 'N/A'}</span>
                    </div>
                    <button class="btn-card-reserve" onclick="reservarServicio('${estilo.titulo}')" style="width: 100%; background: #d4af37; color: #000; border: none; padding: 10px; border-radius: 4px; font-weight: bold; cursor: pointer;">RESERVAR / COMPRAR</button>
                </div>
            </div>
            <div class="card-footer" style="margin-top: 10px; font-size: 0.8rem; color: #777; text-align: right;">AXMY Luxury</div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// 3. MODAL DE RESERVAS Y CITAS
// ==========================================
function reservarServicio(nombreServicio) {
    const inputServicio = document.getElementById('reservaServicio');
    const modal = document.getElementById('modalReserva');
    if (inputServicio && modal) {
        inputServicio.value = nombreServicio;
        modal.classList.remove('hidden');
    }
}

function cerrarModal() {
    const modal = document.getElementById('modalReserva');
    if (modal) modal.classList.add('hidden');
}

// Envío de la reserva al backend con token de autenticación
document.getElementById('formReserva')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datosReserva = {
        servicio: document.getElementById('reservaServicio').value,
        nombre: document.getElementById('reservaNombre').value,
        telefono: document.getElementById('reservaTelefono').value,
        fecha: document.getElementById('reservaFecha').value,
        hora: document.getElementById('reservaHora').value
    };

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para agendar una cita.');
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/api/citas', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosReserva)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert(`💈 ¡Excelente! Cita confirmada para ${datosReserva.nombre}. Te esperamos en AXMY Barber Shop.`);
            document.getElementById('formReserva').reset();
            cerrarModal();
            cargarMisCitas(); // Refresca y pinta inmediatamente la nueva cita en pantalla
        } else {
            alert('Ocurrió un problema: ' + (data.error || data.mensaje || 'Intente nuevamente'));
        }
    } catch (error) {
        console.error('Error enviando reserva:', error);
        alert('No se pudo conectar con el servidor.');
    }
});

// ==========================================
// 4. GESTIÓN DE "MIS CITAS" (CLIENTE)
// ==========================================
async function cargarMisCitas() {
    try {
        const token = localStorage.getItem('token');
        const contenedor = document.getElementById('listaMisCitas');
        if (!contenedor) return;

        if (!token) {
            contenedor.innerHTML = `<p style="color: #888; text-align: center;">Inicia sesión para ver tus citas agendadas.</p>`;
            return;
        }

        const res = await fetch('/api/citas/mis-citas', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.citas && data.citas.length > 0) {
            contenedor.innerHTML = '';
            data.citas.forEach(cita => {
                // Soportamos tanto nombre como nombreCliente según el esquema de MongoDB
                const clienteNombre = cita.nombreCliente || cita.nombre || 'Cliente';
                contenedor.innerHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: #0a0a0a; border: 1px solid #333; padding: 12px; margin-bottom: 10px; border-radius: 6px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <strong style="color: #d4af37; font-size: 1rem;">Servicio: ${cita.servicio}</strong><br>
                            <span style="color: #fff; font-size: 0.9rem;">👤 A nombre de: ${clienteNombre}</span><br>
                            <span style="color: #ccc; font-size: 0.85rem;">📅 Fecha: ${cita.fecha} | ⏰ Hora: ${cita.hora}</span>
                        </div>
                        <button onclick="cancelarMiCita('${cita._id}')" style="background: #ff4d4d; color: #fff; border: none; padding: 6px 12px; cursor: pointer; border-radius: 4px; font-weight: bold; font-size: 0.85rem;">Cancelar Cita</button>
                    </div>
                `;
            });
        } else {
            contenedor.innerHTML = `<p style="color: #888; text-align: center;">No tienes citas agendadas actualmente.</p>`;
        }
    } catch (error) {
        console.error('Error al cargar mis citas:', error);
    }
}

async function cancelarMiCita(id) {
    if (!confirm('¿Estás seguro de que deseas cancelar tu cita?')) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/citas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
            alert('Cita cancelada con éxito.');
            cargarMisCitas(); // Actualizar la lista en pantalla instantáneamente
        } else {
            alert('Error: ' + (data.error || 'No se pudo cancelar'));
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con el servidor.');
    }
}

// ==========================================
// 5. ASISTENTE VIRTUAL (CHAT)
// ==========================================
function toggleChat(forceOpen) {
    const chatWidget = document.getElementById('chatWidget');
    if (!chatWidget) return;
    
    if (forceOpen !== undefined) {
        if (forceOpen) chatWidget.classList.remove('hidden');
        else chatWidget.classList.add('hidden');
    } else {
        chatWidget.classList.toggle('hidden');
    }
}

document.getElementById('chatForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = document.getElementById('userInput');
    const mensajeTexto = userInput.value.trim();
    if (!mensajeTexto) return;

    // 1. Mostrar mensaje del usuario
    appendMessage(mensajeTexto, 'user-message');
    userInput.value = '';
    scrollToBottom();

    // 2. Mostrar estado temporal de respuesta
    const loadingId = appendMessage('Escribiendo...', 'bot-message');
    scrollToBottom();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensajeUsuario: mensajeTexto })
        });

        const data = await response.json();
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        if (data.success) {
            appendMessage(data.respuesta, 'bot-message');
        } else {
            appendMessage('Lo siento, ocurrió un error al procesar tu solicitud.', 'bot-message');
        }
    } catch (error) {
        console.error('Error de red:', error);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();
        appendMessage('No se pudo conectar con el servidor de la barbería.', 'bot-message');
    }

    scrollToBottom();
});

function appendMessage(text, className) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerText = text;
    const id = 'msg-' + Date.now() + Math.random();
    messageDiv.id = id;
    chatMessages.appendChild(messageDiv);
    return id;
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}