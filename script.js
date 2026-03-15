// ===== DADOS DO SEU SALÃO =====
// Tudo salvo aqui mesmo, sem Firebase, sem JSON, sem complicação!

let services = [
    {
        id: 1,
        name: 'Manicure',
        price: 35,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500'
    },
    {
        id: 2,
        name: 'Pedicure',
        price: 40,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500'
    },
    {
        id: 3,
        name: 'Design de Sobrancelhas',
        price: 50,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500'
    },
    {
        id: 4,
        name: 'Micropigmentação de Sobrancelhas',
        price: 450,
        duration: 120,
        image: 'https://https://res.cloudinary.com/dnez7rl46/image/upload/v1773595593/zrpgxvvo0r8gkakmmmc4.jpg'
    }
];

let professionals = [
    {
        id: 1,
        name: 'Raquel Sobreira',
        specialty: 'Unhas e Sobrancelha',
        image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600488/lyrh3xheum9kd9cqtjk4.png'
    },
    {
        id: 2,
        name: 'Glauce Costa',
        specialty: 'Podóloga',
        image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600024/wdf4gnrwo9hdhz6c7ocv.png'
    }
];

let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== FUNÇÕES DE RENDERIZAÇÃO =====
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    
    container.innerHTML = services.map(service => {
        const mensagem = `Olá! Gostaria de agendar ${service.name}.`;
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

function saveService(event, id) {
    event.preventDefault();
    
    const serviceData = {
        name: document.getElementById('service-name').value,
        price: parseFloat(document.getElementById('service-price').value),
        duration: parseInt(document.getElementById('service-duration').value),
        image: document.getElementById('service-image').value || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'
    };
    
    if (id && id !== 'null') {
        const index = services.findIndex(s => s.id == id);
        services[index] = { ...services[index], ...serviceData };
    } else {
        serviceData.id = services.length + 1;
        services.push(serviceData);
    }
    
    renderServices();
    renderAdminTables();
    closeModal();
    alert('✅ Serviço salvo com sucesso!');
}

function deleteService(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        services = services.filter(s => s.id != id);
        renderServices();
        renderAdminTables();
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
                <input type="url" id="professional-image" value="${professional ? professional.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = professional ? 'Editar Profissional' : 'Novo Profissional';
    modal.classList.add('active');
}

function saveProfessional(event, id) {
    event.preventDefault();
    
    const professionalData = {
        name: document.getElementById('professional-name').value,
        specialty: document.getElementById('professional-specialty').value,
        image: document.getElementById('professional-image').value
    };
    
    if (id && id !== 'null') {
        const index = professionals.findIndex(p => p.id == id);
        professionals[index] = { ...professionals[index], ...professionalData };
    } else {
        professionalData.id = professionals.length + 1;
        professionals.push(professionalData);
    }
    
    renderProfessionals();
    renderAdminTables();
    closeModal();
    alert('✅ Profissional salvo com sucesso!');
}

function deleteProfessional(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
        professionals = professionals.filter(p => p.id != id);
        renderProfessionals();
        renderAdminTables();
        alert('✅ Profissional excluído com sucesso!');
    }
}

// ===== FUNÇÕES DE AGENDAMENTO =====
function editAppointment(id) {
    if (!checkAdminAuth()) return;
    alert('Funcionalidade em desenvolvimento');
}

function deleteAppointment(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        appointments = appointments.filter(a => a.id != id);
        renderAdminTables();
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

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    renderProfessionals();
    
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
        renderAdminTables();
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}
