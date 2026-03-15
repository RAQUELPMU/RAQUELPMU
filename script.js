// ===== CONFIGURAÇÃO =====
const GITHUB_USER = "RAQUELPMU"; // Coloque seu nome de usuário do GitHub
const REPO_NAME = "RAQUELPMU"; // O nome que você deu ao repositório
const API_URL = `https://my-json-server.typicode.com/${GITHUB_USER}/${REPO_NAME}`;

let services = [];
let professionals = [];
let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== CARREGAR DADOS DA API =====
async function carregarDados() {
    try {
        console.log('🔄 Carregando dados da API...');
        
        // Carrega serviços
        const servicesRes = await fetch(`${API_URL}/services`);
        services = await servicesRes.json();
        console.log('✅ Serviços carregados:', services.length);
        
        // Carrega profissionais
        const profRes = await fetch(`${API_URL}/professionals`);
        professionals = await profRes.json();
        console.log('✅ Profissionais carregados:', professionals.length);
        
        // Carrega agendamentos
        const aptRes = await fetch(`${API_URL}/appointments`);
        appointments = await aptRes.json();
        console.log('✅ Agendamentos carregados:', appointments.length);
        
        // Atualiza a tela
        renderServices();
        renderProfessionals();
        if (isLoggedIn) renderAdminTables();
        
    } catch (erro) {
        console.error('❌ Erro ao carregar dados:', erro);
        alert('Erro ao conectar com o servidor. Verifique sua internet.');
    }
}

// ===== SALVAR DADOS NA API =====
async function salvarDados(tipo, metodo, dados, id = null) {
    try {
        let url = `${API_URL}/${tipo}`;
        let options = {
            method: metodo,
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (dados) {
            options.body = JSON.stringify(dados);
        }
        
        if (id) {
            url = `${API_URL}/${tipo}/${id}`;
        }
        
        const response = await fetch(url, options);
        const resultado = await response.json();
        console.log(`✅ Dados salvos em ${tipo}:`, resultado);
        
        // Recarrega tudo para garantir consistência
        await carregarDados();
        
    } catch (erro) {
        console.error('❌ Erro ao salvar:', erro);
        alert('Erro ao salvar. Tente novamente.');
    }
}

// ===== FUNÇÕES DE RENDERIZAÇÃO =====
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    
    container.innerHTML = services.map(service => {
        const mensagem = `Olá! Gostaria de agendar ${service.name} com duração de ${service.duration} minutos.`;
        const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
        
        return `
            <div class="service-card">
                <div class="service-img" style="background-image: url('${service.image}')"></div>
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p class="service-price">R$ ${service.price}</p>
                    <p>Duração: ${service.duration} min</p>
                    <a href="${linkWhatsApp}" target="_blank" class="btn whatsapp-btn">
                        <i class="fab fa-whatsapp"></i> Agendar via WhatsApp
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function renderProfessionals() {
    const container = document.getElementById('professionals-list');
    if (!container) return;
    
    container.innerHTML = professionals.map(prof => {
        return `
            <div class="professional-card">
                <div class="professional-img" style="background-image: url('${prof.image}')"></div>
                <h3>${prof.name}</h3>
                <p>Especialidade: ${prof.specialty}</p>
            </div>
        `;
    }).join('');
}

function agendarWhatsApp() {
    const mensagem = "Olá! Gostaria de agendar um horário no salão.";
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
}

function renderAdminTables() {
    const appointmentsList = document.getElementById('appointments-list');
    if (appointmentsList) {
        appointmentsList.innerHTML = appointments.map(apt => `
            <tr>
                <td>${apt.client}</td>
                <td>${apt.service}</td>
                <td>${apt.professional}</td>
                <td>${apt.date} ${apt.time}</td>
                <td><span class="status-badge status-${apt.status}">${apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}</span></td>
                <td>
                    <button class="edit-btn" onclick="editAppointment(${apt.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteAppointment(${apt.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    }

    const servicesAdminList = document.getElementById('services-admin-list');
    if (servicesAdminList) {
        servicesAdminList.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td>R$ ${service.price}</td>
                <td>${service.duration} min</td>
                <td>
                    <button class="edit-btn" onclick="editService(${service.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteService(${service.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    }

    const professionalsAdminList = document.getElementById('professionals-admin-list');
    if (professionalsAdminList) {
        professionalsAdminList.innerHTML = professionals.map(prof => `
            <tr>
                <td>${prof.name}</td>
                <td>${prof.specialty}</td>
                <td>
                    <button class="edit-btn" onclick="editProfessional(${prof.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteProfessional(${prof.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    carregarDados(); // CARREGA DA API ONLINE
    
    const heroButton = document.querySelector('.hero-buttons .btn:first-child');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            e.preventDefault();
            agendarWhatsApp();
        });
    }
    
    if (isLoggedIn) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    }
});

// ===== FUNÇÕES DE LOGIN =====
function checkPassword() {
    const passwordInput = document.getElementById('admin-password');
    const errorElement = document.getElementById('login-error');
    
    if (passwordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        errorElement.style.display = 'none';
        renderAdminTables();
    } else {
        errorElement.style.display = 'block';
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

function checkAdminAuth() {
    if (!sessionStorage.getItem('adminLoggedIn')) {
        alert('Faça login primeiro!');
        return false;
    }
    return true;
}

// ===== CRUD SERVIÇOS =====
function openServiceModal(service = null) {
    if (!checkAdminAuth()) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <form onsubmit="saveService(event, ${service ? service.id : 'null'})">
            <div class="form-group">
                <label>Nome do serviço</label>
                <input type="text" id="service-name" value="${service ? service.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Preço</label>
                <input type="number" id="service-price" value="${service ? service.price : ''}" required>
            </div>
            <div class="form-group">
                <label>Duração (minutos)</label>
                <input type="number" id="service-duration" value="${service ? service.duration : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="service-image" value="${service ? service.image : ''}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = service ? 'Editar Serviço' : 'Novo Serviço';
    modal.classList.add('active');
}

async function saveService(event, id) {
    event.preventDefault();
    
    const serviceData = {
        name: document.getElementById('service-name').value,
        price: parseFloat(document.getElementById('service-price').value),
        duration: parseInt(document.getElementById('service-duration').value),
        image: document.getElementById('service-image').value || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'
    };
    
    if (id) {
        // EDITAR
        await salvarDados('services', 'PUT', serviceData, id);
    } else {
        // NOVO
        serviceData.id = services.length + 1;
        await salvarDados('services', 'POST', serviceData);
    }
    
    closeModal();
    alert('✅ Serviço salvo com sucesso!');
}

async function deleteService(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        await salvarDados('services', 'DELETE', null, id);
        alert('✅ Serviço excluído com sucesso!');
    }
}

// ===== CRUD PROFISSIONAIS =====
function openProfessionalModal(professional = null) {
    if (!checkAdminAuth()) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <form onsubmit="saveProfessional(event, ${professional ? professional.id : 'null'})">
            <div class="form-group">
                <label>Nome do profissional</label>
                <input type="text" id="professional-name" value="${professional ? professional.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Especialidade</label>
                <input type="text" id="professional-specialty" value="${professional ? professional.specialty : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="professional-image" value="${professional ? professional.image : ''}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = professional ? 'Editar Profissional' : 'Novo Profissional';
    modal.classList.add('active');
}

async function saveProfessional(event, id) {
    event.preventDefault();
    
    const professionalData = {
        name: document.getElementById('professional-name').value,
        specialty: document.getElementById('professional-specialty').value,
        image: document.getElementById('professional-image').value || 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'
    };
    
    if (id) {
        await salvarDados('professionals', 'PUT', professionalData, id);
    } else {
        professionalData.id = professionals.length + 1;
        await salvarDados('professionals', 'POST', professionalData);
    }
    
    closeModal();
    alert('✅ Profissional salvo com sucesso!');
}

async function deleteProfessional(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
        await salvarDados('professionals', 'DELETE', null, id);
        alert('✅ Profissional excluído com sucesso!');
    }
}

// ===== FUNÇÕES DE AGENDAMENTO =====
function editAppointment(id) {
    if (!checkAdminAuth()) return;
    alert('Funcionalidade em desenvolvimento');
}

async function deleteAppointment(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        await salvarDados('appointments', 'DELETE', null, id);
        alert('✅ Agendamento cancelado!');
    }
}

function editService(id) {
    if (!checkAdminAuth()) return;
    const service = services.find(s => s.id == id);
    openServiceModal(service);
}

function editProfessional(id) {
    if (!checkAdminAuth()) return;
    const professional = professionals.find(p => p.id == id);
    openProfessionalModal(professional);
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}
