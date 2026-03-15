// ===== FIREBASE JÁ ESTÁ CONFIGURADO NO INDEX.HTML =====
let services = [];
let professionals = [];
let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== CARREGAR DADOS DO FIREBASE =====
async function carregarDados() {
    try {
        console.log('🔄 Carregando dados do Firebase...');
        
        // Carregar serviços
        const servicesSnapshot = await db.collection('services').get();
        services = servicesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Carregar profissionais
        const professionalsSnapshot = await db.collection('professionals').get();
        professionals = professionalsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Carregar agendamentos
        const appointmentsSnapshot = await db.collection('appointments').get();
        appointments = appointmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log('✅ Dados carregados!');
        
        // Atualizar tela
        renderServices();
        renderProfessionals();
        if (isLoggedIn) renderAdminTables();
        
    } catch (erro) {
        console.error('❌ Erro ao carregar:', erro);
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
                    <button class="edit-btn" onclick="editAppointment('${apt.id}')">Editar</button>
                    <button class="delete-btn" onclick="deleteAppointment('${apt.id}')">Excluir</button>
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
                    <button class="edit-btn" onclick="editService('${service.id}')">Editar</button>
                    <button class="delete-btn" onclick="deleteService('${service.id}')">Excluir</button>
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
                    <button class="edit-btn" onclick="editProfessional('${prof.id}')">Editar</button>
                    <button class="delete-btn" onclick="deleteProfessional('${prof.id}')">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    
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

// ===== CRUD PROFISSIONAIS (CORRIGIDO PARA FIREBASE) =====
function openProfessionalModal(professional = null) {
    if (!checkAdminAuth()) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <form onsubmit="saveProfessional(event, ${professional ? `'${professional.id}'` : 'null'})">
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
    
    try {
        if (id) {
            // EDITAR
            await db.collection('professionals').doc(id).update(professionalData);
            alert('✅ Profissional atualizado com sucesso!');
        } else {
            // NOVO
            await db.collection('professionals').add(professionalData);
            alert('✅ Profissional criado com sucesso!');
        }
        
        await carregarDados(); // Recarrega tudo
        closeModal();
        
    } catch (erro) {
        console.error('❌ Erro ao salvar:', erro);
        alert('Erro ao salvar. Tente novamente.');
    }
}

async function deleteProfessional(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
        try {
            await db.collection('professionals').doc(id).delete();
            alert('✅ Profissional excluído com sucesso!');
            await carregarDados();
        } catch (erro) {
            console.error('❌ Erro ao excluir:', erro);
            alert('Erro ao excluir. Tente novamente.');
        }
    }
}

// ===== CRUD SERVIÇOS =====
function openServiceModal(service = null) {
    if (!checkAdminAuth()) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <form onsubmit="saveService(event, ${service ? `'${service.id}'` : 'null'})">
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
    
    try {
        if (id) {
            await db.collection('services').doc(id).update(serviceData);
            alert('✅ Serviço atualizado com sucesso!');
        } else {
            await db.collection('services').add(serviceData);
            alert('✅ Serviço criado com sucesso!');
        }
        
        await carregarDados();
        closeModal();
        
    } catch (erro) {
        console.error('❌ Erro ao salvar:', erro);
        alert('Erro ao salvar. Tente novamente.');
    }
}

async function deleteService(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        try {
            await db.collection('services').doc(id).delete();
            alert('✅ Serviço excluído com sucesso!');
            await carregarDados();
        } catch (erro) {
            console.error('❌ Erro ao excluir:', erro);
            alert('Erro ao excluir. Tente novamente.');
        }
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
        try {
            await db.collection('appointments').doc(id).delete();
            alert('✅ Agendamento cancelado!');
            await carregarDados();
        } catch (erro) {
            console.error('❌ Erro ao excluir:', erro);
            alert('Erro ao excluir. Tente novamente.');
        }
    }
}

function editService(id) {
    if (!checkAdminAuth()) return;
    const service = services.find(s => s.id === id);
    openServiceModal(service);
}

function editProfessional(id) {
    if (!checkAdminAuth()) return;
    const professional = professionals.find(p => p.id === id);
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
