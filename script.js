// ===== SCRIPT PRINCIPAL COM FIREBASE V12.12.0 (NOVA VERSÃO) =====

let services = [];
let professionals = [];
let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== FUNÇÕES DE ACESSO AO FIRESTORE (V12) =====
async function carregarDados() {
    if (typeof db === 'undefined') {
        alert('❌ Firebase não conectado!');
        return;
    }
    
    try {
        // Buscar profissionais - sintaxe V12
        const profQuery = collection(db, 'professionals');
        const profSnapshot = await getDocs(profQuery);
        professionals = profSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Buscar serviços - sintaxe V12
        const servQuery = collection(db, 'services');
        const servSnapshot = await getDocs(servQuery);
        services = servSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (services.length === 0 && professionals.length === 0) {
            await criarDadosIniciais();
        }
        
        renderServices();
        renderProfessionals();
        if (isLoggedIn) renderAdminTables();
        
    } catch (erro) {
        console.error('❌ Erro:', erro);
        alert('Erro ao carregar: ' + erro.message);
    }
}

async function criarDadosIniciais() {
    try {
        const servicosIniciais = [
            { name: 'Manicure', price: 35, duration: 45, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500' },
            { name: 'Pedicure', price: 40, duration: 45, image: 'https://image2url.com/r2/default/images/1774123867804-312b158d-6a9e-44a9-bf26-8d77c0b02870.jpeg' },
            { name: 'Design de Sobrancelhas', price: 50, duration: 30, image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600811/boco4k7hfxuyzcwmfpog.jpg' },
            { name: 'Micropigmentação de Sobrancelhas', price: 450, duration: 120, image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773615529/g6fk0xn7lbsawlqtpey6.jpg' }
        ];
        
        const profissionaisIniciais = [
            { name: 'Raquel Sobreira', specialty: 'Unhas e Sobrancelha', image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600488/lyrh3xheum9kd9cqtjk4.png' },
            { name: 'Glauce Costa', specialty: 'Podóloga', image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600024/wdf4gnrwo9hdhz6c7ocv.png' }
        ];
        
        // Adicionar serviços - sintaxe V12
        const servColl = collection(db, 'services');
        for (const s of servicosIniciais) {
            await addDoc(servColl, s);
        }
        
        // Adicionar profissionais - sintaxe V12
        const profColl = collection(db, 'professionals');
        for (const p of profissionaisIniciais) {
            await addDoc(profColl, p);
        }
        
        alert('✅ Dados iniciais criados!');
        await carregarDados();
        
    } catch (erro) {
        console.error('❌ Erro:', erro);
        alert('Erro ao criar dados: ' + erro.message);
    }
}

// ===== FUNÇÕES DE RENDERIZAÇÃO =====
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    
    if (!services || services.length === 0) {
        container.innerHTML = '<p style="text-align: center;">Carregando serviços...</p>';
        return;
    }
    
    container.innerHTML = services.map(service => {
        const mensagem = `Olá! Gostaria de agendar ${service.name}.`;
        const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
        
        return `
            <div class="service-card">
                <div class="service-img" style="background-image: url('${service.image}')"></div>
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p class="service-price">R$:${service.price}</p>
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
    
    if (!professionals || professionals.length === 0) {
        container.innerHTML = '<p style="text-align: center;">Carregando profissionais...</p>';
        return;
    }
    
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
    const servicesAdminList = document.getElementById('services-admin-list');
    if (servicesAdminList) {
        if (!services || services.length === 0) {
            servicesAdminList.innerHTML = '<tr><td colspan="4">Nenhum serviço</td</tr>';
        } else {
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

    const professionalsAdminList = document.getElementById('professionals-admin-list');
    if (professionalsAdminList) {
        if (!professionals || professionals.length === 0) {
            professionalsAdminList.innerHTML = '<tr><td colspan="3">Nenhum profissional</td</tr>';
        } else {
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

// ===== CRUD SERVIÇOS (V12) =====
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
    if (!checkAdminAuth()) return;
    
    const serviceData = {
        name: document.getElementById('service-name').value,
        price: parseFloat(document.getElementById('service-price').value),
        duration: parseInt(document.getElementById('service-duration').value),
        image: document.getElementById('service-image').value || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'
    };
    
    try {
        if (id && id !== 'null') {
            // EDITAR - sintaxe V12
            const docRef = doc(db, 'services', id);
            await updateDoc(docRef, serviceData);
            alert('✅ Serviço atualizado!');
        } else {
            // CRIAR - sintaxe V12
            const collRef = collection(db, 'services');
            await addDoc(collRef, serviceData);
            alert('✅ Serviço criado!');
        }
        await carregarDados();
        closeModal();
    } catch (erro) {
        alert('❌ Erro: ' + erro.message);
    }
}

async function deleteService(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        try {
            // DELETAR - sintaxe V12
            const docRef = doc(db, 'services', id);
            await deleteDoc(docRef);
            alert('✅ Serviço excluído!');
            await carregarDados();
        } catch (erro) {
            alert('❌ Erro: ' + erro.message);
        }
    }
}

// ===== CRUD PROFISSIONAIS (V12) =====
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
                <input type="url" id="professional-image" value="${professional ? professional.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = professional ? 'Editar Profissional' : 'Novo Profissional';
    modal.classList.add('active');
}

async function saveProfessional(event, id) {
    event.preventDefault();
    if (!checkAdminAuth()) return;
    
    const professionalData = {
        name: document.getElementById('professional-name').value,
        specialty: document.getElementById('professional-specialty').value,
        image: document.getElementById('professional-image').value
    };
    
    try {
        if (id && id !== 'null') {
            // EDITAR - sintaxe V12
            const docRef = doc(db, 'professionals', id);
            await updateDoc(docRef, professionalData);
            alert('✅ Profissional atualizado!');
        } else {
            // CRIAR - sintaxe V12
            const collRef = collection(db, 'professionals');
            await addDoc(collRef, professionalData);
            alert('✅ Profissional criado!');
        }
        await carregarDados();
        closeModal();
    } catch (erro) {
        alert('❌ Erro: ' + erro.message);
    }
}

async function deleteProfessional(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
        try {
            // DELETAR - sintaxe V12
            const docRef = doc(db, 'professionals', id);
            await deleteDoc(docRef);
            alert('✅ Profissional excluído!');
            await carregarDados();
        } catch (erro) {
            alert('❌ Erro: ' + erro.message);
        }
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
        renderAdminTables();
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}
