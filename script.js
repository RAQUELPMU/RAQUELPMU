// ===== FIREBASE DIRETO AQUI =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZdLxppl2HXTtw2cgdFFFcDIFH5yx9vDY",
    authDomain: "raquelpmu1.firebaseapp.com",
    projectId: "raquelpmu1",
    storageBucket: "raquelpmu1.firebasestorage.app",
    messagingSenderId: "81115737255",
    appId: "1:81115737255:web:8b71ecb791666d9a263f82"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('🔥 Firebase conectado!');

// ===== VARIÁVEIS =====
let services = [];
let professionals = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== CARREGAR DADOS =====
async function carregarDados() {
    try {
        const profSnap = await db.collection('professionals').get();
        professionals = profSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const servSnap = await db.collection('services').get();
        services = servSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
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
    el.innerHTML = services.map(s => `
        <div class="service-card">
            <div class="service-img" style="background-image: url('${s.image}')"></div>
            <div class="service-content">
                <h3>${s.name}</h3>
                <p class="service-price">R$ ${s.price}</p>
                <p>${s.duration} min</p>
                <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20${s.name}" target="_blank" class="btn whatsapp-btn">Agendar</a>
            </div>
        </div>
    `).join('');
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
    const profAdmin = document.getElementById('professionals-admin-list');
    if (profAdmin) {
        profAdmin.innerHTML = professionals.map(p => `
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
    
    const servAdmin = document.getElementById('services-admin-list');
    if (servAdmin) {
        servAdmin.innerHTML = services.map(s => `
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
    } else {
        alert('Senha incorreta!');
    }
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

// ===== CRUD PROFISSIONAIS =====
function openProfessionalModal(prof = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveProfessional(event, ${prof ? `'${prof.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="prof-name" value="${prof ? prof.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Especialidade</label>
                <input type="text" id="prof-specialty" value="${prof ? prof.specialty : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="prof-image" value="${prof ? prof.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = prof ? 'Editar Profissional' : 'Novo Profissional';
    modal.classList.add('active');
}

async function saveProfessional(event, id) {
    event.preventDefault();
    const data = {
        name: document.getElementById('prof-name').value,
        specialty: document.getElementById('prof-specialty').value,
        image: document.getElementById('prof-image').value
    };
    
    try {
        if (id && id !== 'null') {
            await db.collection('professionals').doc(id).update(data);
        } else {
            await db.collection('professionals').add(data);
        }
        alert('✅ Profissional salvo!');
        closeModal();
        carregarDados();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function deleteProfessional(id) {
    if (confirm('Excluir este profissional?')) {
        await db.collection('professionals').doc(id).delete();
        carregarDados();
    }
}

// ===== CRUD SERVIÇOS =====
function openServiceModal(serv = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveService(event, ${serv ? `'${serv.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome do serviço</label>
                <input type="text" id="serv-name" value="${serv ? serv.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Preço (R$)</label>
                <input type="number" id="serv-price" value="${serv ? serv.price : ''}" required>
            </div>
            <div class="form-group">
                <label>Duração (minutos)</label>
                <input type="number" id="serv-duration" value="${serv ? serv.duration : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="serv-image" value="${serv ? serv.image : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = serv ? 'Editar Serviço' : 'Novo Serviço';
    modal.classList.add('active');
}

async function saveService(event, id) {
    event.preventDefault();
    const data = {
        name: document.getElementById('serv-name').value,
        price: Number(document.getElementById('serv-price').value),
        duration: Number(document.getElementById('serv-duration').value),
        image: document.getElementById('serv-image').value
    };
    
    try {
        if (id && id !== 'null') {
            await db.collection('services').doc(id).update(data);
        } else {
            await db.collection('services').add(data);
        }
        alert('✅ Serviço salvo!');
        closeModal();
        carregarDados();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function deleteService(id) {
    if (confirm('Excluir este serviço?')) {
        await db.collection('services').doc(id).delete();
        carregarDados();
    }
}

function editProfessional(id) {
    const prof = professionals.find(p => p.id === id);
    openProfessionalModal(prof);
}

function editService(id) {
    const serv = services.find(s => s.id === id);
    openServiceModal(serv);
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function agendarWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de agendar um horário.`, '_blank');
}

// ===== INICIAR =====
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    
    const btnAgendar = document.querySelector('.hero-buttons .btn:first-child');
    if (btnAgendar) {
        btnAgendar.onclick = (e) => {
            e.preventDefault();
            agendarWhatsApp();
        };
    }
    
    if (isLoggedIn) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    }
});

window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
};
