let services = [
    { id: 1, name: 'Corte de Cabelo', price: 50, duration: 60, image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500' },
    { id: 2, name: 'Coloração', price: 120, duration: 120, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500' },
    { id: 3, name: 'Manicure', price: 35, duration: 45, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500' },
    { id: 4, name: 'Pedicure', price: 40, duration: 45, image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500' },
    { id: 5, name: 'Maquiagem', price: 80, duration: 60, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500' },
    { id: 6, name: 'Escova', price: 45, duration: 60, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500' }
];

let professionals = [
    { id: 1, name: 'Ana Silva', specialty: 'Cabelos', image: 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500' },
    { id: 2, name: 'Maria Oliveira', specialty: 'Maquiagem', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' },
    { id: 3, name: 'João Santos', specialty: 'Barba', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
    { id: 4, name: 'Carla Souza', specialty: 'Unhas', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500' }
];

let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';

// Número do WhatsApp atualizado
const WHATSAPP_NUMBER = "5521992649522"; // (21) 99264-9522

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
        const mensagem = `Olá! Gostaria de agendar um horário com ${prof.name} (especialidade: ${prof.specialty}).`;
        const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
        
        return `
            <div class="professional-card">
                <div class="professional-img" style="background-image: url('${prof.image}')"></div>
                <h3>${prof.name}</h3>
                <p>Especialidade: ${prof.specialty}</p>
                <a href="${linkWhatsApp}" target="_blank" class="btn whatsapp-btn" style="margin-top: 1rem;">
                    <i class="fab fa-whatsapp"></i> Agendar com ${prof.name}
                </a>
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

document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    renderProfessionals();
    
    // Adicionar evento ao botão Agendar Agora do topo
    const btnAgendar = document.querySelector('a[href="#agendamento"]');
    if (btnAgendar) {
        btnAgendar.addEventListener('click', function(e) {
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
    
    if (id) {
        const index = services.findIndex(s => s.id == id);
        services[index] = { ...services[index], ...serviceData };
    } else {
        serviceData.id = services.length + 1;
        services.push(serviceData);
    }
    
    renderServices();
    renderAdminTables();
    closeModal();
}

function deleteService(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        services = services.filter(s => s.id != id);
        renderServices();
        renderAdminTables();
    }
}

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

function saveProfessional(event, id) {
    event.preventDefault();
    
    const professionalData = {
        name: document.getElementById('professional-name').value,
        specialty: document.getElementById('professional-specialty').value,
        image: document.getElementById('professional-image').value || 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'
    };
    
    if (id) {
        const index = professionals.findIndex(p => p.id == id);
        professionals[index] = { ...professionals[index], ...professionalData };
    } else {
        professionalData.id = professionals.length + 1;
        professionals.push(professionalData);
    }
    
    renderProfessionals();
    renderAdminTables();
    closeModal();
}

function deleteProfessional(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
        professionals = professionals.filter(p => p.id != id);
        renderProfessionals();
        renderAdminTables();
    }
}

function editAppointment(id) {
    if (!checkAdminAuth()) return;
    alert('Funcionalidade em desenvolvimento');
}

function deleteAppointment(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        appointments = appointments.filter(a => a.id != id);
        renderAdminTables();
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
