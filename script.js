// ===== CONFIGURAÇÃO =====
let services = [];
let professionals = [];
let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== CARREGAR DADOS DO FIREBASE =====
async function carregarDados() {
    try {
        console.log('Carregando dados...');
        
        const servicesSnapshot = await db.collection('services').get();
        services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const professionalsSnapshot = await db.collection('professionals').get();
        professionals = professionalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        renderServices();
        renderProfessionals();
        if (isLoggedIn) renderAdminTables();
        
    } catch (erro) {
        console.error('Erro:', erro);
    }
}

// ===== RENDERIZAR =====
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    
    container.innerHTML = services.map(service => {
        const msg = `Olá! Quero agendar ${service.name}`;
        const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
        
        return `
            <div class="service-card">
                <div class="service-img" style="background-image: url('${service.image}')"></div>
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p class="service-price">R$ ${service.price}</p>
                    <p>${service.duration} min</p>
                    <a href="${link}" target="_blank" class="btn whatsapp-btn">
                        <i class="fab fa-whatsapp"></i> Agendar
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function renderProfessionals() {
    const container = document.getElementById('professionals-list');
    if (!container) return;
    
    container.innerHTML = professionals.map(prof => `
        <div class="professional-card">
            <div class="professional-img" style="background-image: url('${prof.image}')"></div>
            <h3>${prof.name}</h3>
            <p>${prof.specialty}</p>
        </div>
    `).join('');
}

function renderAdminTables() {
    // Profissionais admin
    const professionalsAdminList = document.getElementById('professionals-admin-list');
    if (professionalsAdminList) {
        professionalsAdminList.innerHTML = professionals.map(prof => `
            <tr>
                <td>${prof.name}</td>
                <td>${prof.specialty}</td>
                <td>
                    <button class="edit-btn" onclick="editProfessional('${prof.id}')">Editar</button>
                    <button class="delete-btn" onclick="deleteProfessional('${prof.id}')">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Serviços admin
    const servicesAdminList = document.getElementById('services-admin-list');
    if (servicesAdminList) {
        servicesAdminList.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td>R$ ${service.price}</td>
                <td>${service.duration} min</td>
                <td>
                    <button class="edit-btn" onclick="editService('${service.id}')">Editar</button>
                    <button class="delete-btn" onclick="deleteService('${service.id}')">Excluir</button>
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
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    event.target.classList.add('active');
}

// ===== CRUD PROFISSIONAIS (VERSÃO SIMPLES) =====
function openProfessionalModal(professional = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveProfessional(event, ${professional ? `'${professional.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="prof-name" value="${professional ? professional.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Especialidade</label>
                <input type="text" id="prof-specialty" value="${professional ? professional.specialty : ''}" required>
            </div>
            <div class="form-group">
                <label>Imagem URL</label>
                <input type="url" id="prof-image" value="${professional ? professional.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = professional ? 'Editar' : 'Novo Profissional';
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
        alert('✅ Salvo!');
        closeModal();
        carregarDados();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function deleteProfessional(id) {
    if (confirm('Excluir?')) {
        await db.collection('professionals').doc(id).delete();
        carregarDados();
    }
}

// ===== CRUD SERVIÇOS (VERSÃO SIMPLES) =====
function openServiceModal(service = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveService(event, ${service ? `'${service.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="service-name" value="${service ? service.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Preço</label>
                <input type="number" id="service-price" value="${service ? service.price : ''}" required>
            </div>
            <div class="form-group">
                <label>Duração (min)</label>
                <input type="number" id="service-duration" value="${service ? service.duration : ''}" required>
            </div>
            <div class="form-group">
                <label>Imagem URL</label>
                <input type="url" id="service-image" value="${service ? service.image : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = service ? 'Editar' : 'Novo Serviço';
    modal.classList.add('active');
}

async function saveService(event, id) {
    event.preventDefault();
    
    const data = {
        name: document.getElementById('service-name').value,
        price: Number(document.getElementById('service-price').value),
        duration: Number(document.getElementById('service-duration').value),
        image: document.getElementById('service-image').value
    };
    
    try {
        if (id && id !== 'null') {
            await db.collection('services').doc(id).update(data);
        } else {
            await db.collection('services').add(data);
        }
        alert('✅ Salvo!');
        closeModal();
        carregarDados();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function deleteService(id) {
    if (confirm('Excluir?')) {
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
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar um horário.`, '_blank');
}

// ===== INICIAR =====
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    
    document.querySelector('.hero-buttons .btn:first-child')?.addEventListener('click', (e) => {
        e.preventDefault();
        agendarWhatsApp();
    });
    
    if (isLoggedIn) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    }
});

window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
};
