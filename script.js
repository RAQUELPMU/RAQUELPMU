// Dados iniciais
let services = [
    { id: 1, name: 'Corte de Cabelo', price: 50, duration: 60, image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'Coloração', price: 120, duration: 120, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'Manicure', price: 35, duration: 45, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Pedicure', price: 40, duration: 45, image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 5, name: 'Maquiagem', price: 80, duration: 60, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 6, name: 'Escova', price: 45, duration: 60, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
];

let professionals = [
    { id: 1, name: 'Ana Silva', specialty: 'Cabelos', image: 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'Maria Oliveira', specialty: 'Maquiagem', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'João Santos', specialty: 'Barba', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Carla Souza', specialty: 'Unhas', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
];

let appointments = [
    { id: 1, client: 'Cliente 1', service: 'Corte de Cabelo', professional: 'Ana Silva', date: '2024-01-20', time: '14:00', status: 'confirmed' },
    { id: 2, client: 'Cliente 2', service: 'Manicure', professional: 'Carla Souza', date: '2024-01-20', time: '15:30', status: 'pending' }
];

// Funções de renderização
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-img" style="background-image: url('${service.image}')"></div>
            <div class="service-content">
                <h3>${service.name}</h3>
                <p class="service-price">R$ ${service.price}</p>
                <p>Duração: ${service.duration} min</p>
                <button class="btn" onclick="selectService(${service.id})" style="margin-top: 1rem;">Agendar</button>
            </div>
        </div>
    `).join('');
}

function renderProfessionals() {
    const container = document.getElementById('professionals-list');
    if (!container) return;
    
    container.innerHTML = professionals.map(prof => `
        <div class="professional-card">
            <div class="professional-img" style="background-image: url('${prof.image}')"></div>
            <h3>${prof.name}</h3>
            <p>Especialidade: ${prof.specialty}</p>
        </div>
    `).join('');
}

function renderSelects() {
    const serviceSelect = document.getElementById('servico');
    const professionalSelect = document.getElementById('profissional');
    
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>' + 
            services.map(s => `<option value="${s.id}">${s.name} - R$ ${s.price}</option>`).join('');
    }
    
    if (professionalSelect) {
        professionalSelect.innerHTML = '<option value="">Selecione um profissional</option>' + 
            professionals.map(p => `<option value="${p.id}">${p.name} - ${p.specialty}</option>`).join('');
    }
}

function renderAdminTables() {
    // Agendamentos
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

    // Serviços admin
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

    // Profissionais admin
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

// Funções de agendamento
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newAppointment = {
                id: appointments.length + 1,
                client: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('telefone').value,
                service: services.find(s => s.id == document.getElementById('servico').value).name,
                professional: professionals.find(p => p.id == document.getElementById('profissional').value).name,
                date: document.getElementById('data').value,
                time: document.getElementById('hora').value,
                observations: document.getElementById('observacoes').value,
                status: 'pending'
            };
            
            appointments.push(newAppointment);
            renderAdminTables();
            alert('Agendamento realizado com sucesso!');
            this.reset();
        });
    }
});

// Funções admin
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).style.display = 'block';
    event.target.classList.add('active');
}

function selectService(id) {
    document.getElementById('servico').value = id;
    document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
}

// CRUD Services
function openServiceModal(service = null) {
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
        image: document.getElementById('service-image').value || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };
    
    if (id) {
        const index = services.findIndex(s => s.id == id);
        services[index] = { ...services[index], ...serviceData };
    } else {
        serviceData.id = services.length + 1;
        services.push(serviceData);
    }
    
    renderServices();
    renderSelects();
    renderAdminTables();
    closeModal();
}

function deleteService(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        services = services.filter(s => s.id != id);
        renderServices();
        renderSelects();
        renderAdminTables();
    }
}

// CRUD Professionals
function openProfessionalModal(professional = null) {
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
        image: document.getElementById('professional-image').value || 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };
    
    if (id) {
        const index = professionals.findIndex(p => p.id == id);
        professionals[index] = { ...professionals[index], ...professionalData };
    } else {
        professionalData.id = professionals.length + 1;
        professionals.push(professionalData);
    }
    
    renderProfessionals();
    renderSelects();
    renderAdminTables();
    closeModal();
}

function deleteProfessional(id) {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
        professionals = professionals.filter(p => p.id != id);
        renderProfessionals();
        renderSelects();
        renderAdminTables();
    }
}

// Appointment functions
function editAppointment(id) {
    const appointment = appointments.find(a => a.id == id);
    alert('Funcionalidade de edição em desenvolvimento para o agendamento: ' + appointment.client);
}

function deleteAppointment(id) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        appointments = appointments.filter(a => a.id != id);
        renderAdminTables();
    }
}

function editService(id) {
    const service = services.find(s => s.id == id);
    openServiceModal(service);
}

function editProfessional(id) {
    const professional = professionals.find(p => p.id == id);
    openProfessionalModal(professional);
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    renderProfessionals();
    renderSelects();
    renderAdminTables();
});

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}
