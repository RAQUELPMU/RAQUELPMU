// ===== SÓ FIREBASE - NADA DE JSON =====
let services = [];
let professionals = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== CARREGAR DADOS =====
async function carregarDados() {
    try {
        console.log('Carregando...');
        
        const snap = await db.collection('professionals').get();
        professionals = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const snap2 = await db.collection('services').get();
        services = snap2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        renderServices();
        renderProfessionals();
        if (isLoggedIn) renderAdminTables();
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro: ' + erro.message);
    }
}

// ===== RENDERIZAR =====
function renderServices() {
    const el = document.getElementById('services-list');
    if (!el) return;
    
    el.innerHTML = services.map(s => {
        const msg = `Olá! Quero agendar ${s.name}`;
        const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
        return `
            <div class="service-card">
                <div class="service-img" style="background-image: url('${s.image}')"></div>
                <div class="service-content">
                    <h3>${s.name}</h3>
                    <p class="service-price">R$ ${s.price}</p>
                    <p>${s.duration} min</p>
                    <a href="${link}" target="_blank" class="btn whatsapp-btn">Agendar</a>
                </div>
            </div>
        `;
    }).join('');
}

function renderProfessionals() {
    const el = document.getElementById('professionals-list');
    if (!el) return;
    
    el.innerHTML = professionals.map(p => `
        <div class="professional-card">
            <div class="professional-img" style="background-image: url('${p.image}')"></div>
            <h3>${p.name}</h3>
            <p>${p.specialty}</p>
        </div>
    `).join('');
}

function renderAdminTables() {
    const el1 = document.getElementById('professionals-admin-list');
    if (el1) {
        el1.innerHTML = professionals.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.specialty}</td>
                <td>
                    <button onclick="editProfessional('${p.id}')">Editar</button>
                    <button onclick="deleteProfessional('${p.id}')">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
    
    const el2 = document.getElementById('services-admin-list');
    if (el2) {
        el2.innerHTML = services.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>R$ ${s.price}</td>
                <td>${s.duration} min</td>
                <td>
                    <button onclick="editService('${s.id}')">Editar</button>
                    <button onclick="deleteService('${s.id}')">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
}

// ===== LOGIN =====
function checkPassword() {
    if (document.getElementById('admin-password').value === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        renderAdminTables();
    } else alert('Senha errada');
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    event.target.classList.add('active');
}

// ===== PROFISSIONAIS =====
function openProfessionalModal(p = null) {
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveProfessional(event, ${p ? `'${p.id}'` : 'null'})">
            <input type="text" id="prof-name" value="${p ? p.name : ''}" placeholder="Nome" required>
            <input type="text" id="prof-spec" value="${p ? p.specialty : ''}" placeholder="Especialidade" required>
            <input type="url" id="prof-img" value="${p ? p.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'}" placeholder="URL da imagem">
            <button type="submit">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = p ? 'Editar' : 'Novo Profissional';
    document.getElementById('modal').classList.add('active');
}

async function saveProfessional(event, id) {
    event.preventDefault();
    const data = {
        name: document.getElementById('prof-name').value,
        specialty: document.getElementById('prof-spec').value,
        image: document.getElementById('prof-img').value
    };
    try {
        if (id && id !== 'null') await db.collection('professionals').doc(id).update(data);
        else await db.collection('professionals').add(data);
        alert('Salvo!');
        closeModal();
        carregarDados();
    } catch (e) { alert('Erro: ' + e.message); }
}

async function deleteProfessional(id) {
    if (confirm('Excluir?')) {
        await db.collection('professionals').doc(id).delete();
        carregarDados();
    }
}

// ===== SERVIÇOS =====
function openServiceModal(s = null) {
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveService(event, ${s ? `'${s.id}'` : 'null'})">
            <input type="text" id="serv-name" value="${s ? s.name : ''}" placeholder="Nome" required>
            <input type="number" id="serv-price" value="${s ? s.price : ''}" placeholder="Preço" required>
            <input type="number" id="serv-dur" value="${s ? s.duration : ''}" placeholder="Duração (min)" required>
            <input type="url" id="serv-img" value="${s ? s.image : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'}" placeholder="URL da imagem">
            <button type="submit">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = s ? 'Editar' : 'Novo Serviço';
    document.getElementById('modal').classList.add('active');
}

async function saveService(event, id) {
    event.preventDefault();
    const data = {
        name: document.getElementById('serv-name').value,
        price: Number(document.getElementById('serv-price').value),
        duration: Number(document.getElementById('serv-dur').value),
        image: document.getElementById('serv-img').value
    };
    try {
        if (id && id !== 'null') await db.collection('services').doc(id).update(data);
        else await db.collection('services').add(data);
        alert('Salvo!');
        closeModal();
        carregarDados();
    } catch (e) { alert('Erro: ' + e.message); }
}

async function deleteService(id) {
    if (confirm('Excluir?')) {
        await db.collection('services').doc(id).delete();
        carregarDados();
    }
}

function editProfessional(id) {
    openProfessionalModal(professionals.find(p => p.id === id));
}

function editService(id) {
    openServiceModal(services.find(s => s.id === id));
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function agendarWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar.`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    const btn = document.querySelector('.hero-buttons .btn:first-child');
    if (btn) btn.onclick = (e) => { e.preventDefault(); agendarWhatsApp(); };
    if (isLoggedIn) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    }
});

window.onclick = (e) => {
    if (e.target === document.getElementById('modal')) closeModal();
};
