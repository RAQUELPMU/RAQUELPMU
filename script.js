// ===== SCRIPT PRINCIPAL COM FIREBASE =====
// O Firebase vem do firebase-config.js (arquivo separado)

let services = [];
let professionals = [];
let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== CARREGAR DADOS DO FIREBASE =====
async function carregarDados() {
    try {
        console.log('🔄 Buscando dados do Firebase...');
        
        // Verificar se o Firebase está disponível
        if (typeof db === 'undefined') {
            console.log('⚠️ Firebase não disponível, usando dados locais');
            usarDadosLocais();
            return;
        }
        
        // Buscar profissionais
        const profSnap = await db.collection('professionals').get();
        if (!profSnap.empty) {
            professionals = profSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('✅ Profissionais carregados:', professionals.length);
        }
        
        // Buscar serviços
        const servSnap = await db.collection('services').get();
        if (!servSnap.empty) {
            services = servSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('✅ Serviços carregados:', services.length);
        }
        
        // Se não tiver dados no Firebase, criar os iniciais
        if (services.length === 0 && professionals.length === 0) {
            console.log('📝 Nenhum dado no Firebase, criando dados iniciais...');
            await criarDadosIniciais();
        }
        
        renderServices();
        renderProfessionals();
        if (isLoggedIn) renderAdminTables();
        
    } catch (erro) {
        console.error('❌ Erro ao carregar do Firebase:', erro);
        console.log('⚠️ Usando dados locais de backup');
        usarDadosLocais();
    }
}

// ===== DADOS INICIAIS PARA CRIAR NO FIREBASE =====
async function criarDadosIniciais() {
    try {
        console.log('📝 Criando dados iniciais no Firebase...');
        
        const servicosIniciais = [
            { name: 'Manicure', price: 35, duration: 45, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500' },
            { name: 'Pedicure', price: 40, duration: 45, image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500' },
            { name: 'Design de Sobrancelhas', price: 50, duration: 30, image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500' },
            { name: 'Micropigmentação', price: 450, duration: 120, image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500' }
        ];
        
        const profissionaisIniciais = [
            { name: 'Raquel Sobreira', specialty: 'Unhas e Sobrancelha', image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600488/lyrh3xheum9kd9cqtjk4.png' },
            { name: 'Glauce Costa', specialty: 'Podóloga', image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600024/wdf4gnrwo9hdhz6c7ocv.png' }
        ];
        
        for (const servico of servicosIniciais) {
            await db.collection('services').add(servico);
        }
        
        for (const prof of profissionaisIniciais) {
            await db.collection('professionals').add(prof);
        }
        
        console.log('✅ Dados iniciais criados com sucesso!');
        
    } catch (erro) {
        console.error('❌ Erro ao criar dados iniciais:', erro);
        usarDadosLocais();
    }
}

// ===== BACKUP LOCAL (CASO FIREBASE FALHE) =====
function usarDadosLocais() {
    console.log('📱 Usando dados locais de backup');
    
    services = [
        { id: 1, name: 'Manicure', price: 35, duration: 45, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500' },
        { id: 2, name: 'Pedicure', price: 40, duration: 45, image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500' },
        { id: 3, name: 'Design de Sobrancelhas', price: 50, duration: 30, image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500' },
        { id: 4, name: 'Micropigmentação', price: 450, duration: 120, image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500' }
    ];
    
    professionals = [
        { id: 1, name: 'Raquel Sobreira', specialty: 'Unhas e Sobrancelha', image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600488/lyrh3xheum9kd9cqtjk4.png' },
        { id: 2, name: 'Glauce Costa', specialty: 'Podóloga', image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600024/wdf4gnrwo9hdhz6c7ocv.png' }
    ];
    
    renderServices();
    renderProfessionals();
    if (isLoggedIn) renderAdminTables();
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
        const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
        
        return `
            <div class="service-card">
                <div class="service-img" style="background-image: url('${service.image}')"></div>
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p class="service-price">R$:${service.price}</p>
                    <p>Duração: ${service.duration} min</p>
                    <a href="${link}" target="_blank" class="btn whatsapp-btn">
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
    
    container.innerHTML = professionals.map(prof => `
        <div class="professional-card">
            <div class="professional-img" style="background-image: url('${prof.image}')"></div>
            <h3>${prof.name}</h3>
            <p>Especialidade: ${prof.specialty}</p>
        </div>
    `).join('');
}

function agendarWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar um horário.`, '_blank');
}

function renderAdminTables() {
    const profAdmin = document.getElementById('professionals-admin-list');
    if (profAdmin) {
        if (!professionals || professionals.length === 0) {
            profAdmin.innerHTML = '<tr><td colspan="3">Nenhum profissional cadastrado</td></tr>';
        } else {
            profAdmin.innerHTML = professionals.map(p => `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.specialty}</td>
                    <td>
                        <button class="edit-btn" onclick="editProfessional('${p.id}')">Editar</button>
                        <button class="delete-btn" onclick="deleteProfessional('${p.id}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    }
    
    const servAdmin = document.getElementById('services-admin-list');
    if (servAdmin) {
        if (!services || services.length === 0) {
            servAdmin.innerHTML = '<tr><td colspan="4">Nenhum serviço cadastrado</td></tr>';
        } else {
            servAdmin.innerHTML = services.map(s => `
                <tr>
                    <td>${s.name}</td>
                    <td>R$:${s.price}</td>
                    <td>${s.duration} min</td>
                    <td>
                        <button class="edit-btn" onclick="editService('${s.id}')">Editar</button>
                        <button class="delete-btn" onclick="deleteService('${s.id}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// ===== FUNÇÕES DE LOGIN =====
function checkPassword() {
    const input = document.getElementById('admin-password');
    if (input.value === ADMIN_PASSWORD) {
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

function checkAdminAuth() {
    if (!sessionStorage.getItem('adminLoggedIn')) {
        alert('Faça login primeiro!');
        return false;
    }
    return true;
}

// ===== CRUD PROFISSIONAIS =====
function openProfessionalModal(prof = null) {
    if (!checkAdminAuth()) return;
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveProfessional(event, ${prof ? `'${prof.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="prof-name" value="${prof ? prof.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Especialidade</label>
                <input type="text" id="prof-spec" value="${prof ? prof.specialty : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="prof-img" value="${prof ? prof.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = prof ? 'Editar Profissional' : 'Novo Profissional';
    modal.classList.add('active');
}

async function saveProfessional(event, id) {
    event.preventDefault();
    if (!checkAdminAuth()) return;
    
    const data = {
        name: document.getElementById('prof-name').value,
        specialty: document.getElementById('prof-spec').value,
        image: document.getElementById('prof-img').value
    };
    
    try {
        if (id && id !== 'null') {
            await db.collection('professionals').doc(id).update(data);
            alert('✅ Profissional atualizado!');
        } else {
            await db.collection('professionals').add(data);
            alert('✅ Profissional criado!');
        }
        await carregarDados();
        closeModal();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function deleteProfessional(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Excluir este profissional?')) {
        try {
            await db.collection('professionals').doc(id).delete();
            alert('✅ Profissional excluído!');
            await carregarDados();
        } catch (erro) {
            alert('Erro: ' + erro.message);
        }
    }
}

// ===== CRUD SERVIÇOS =====
function openServiceModal(serv = null) {
    if (!checkAdminAuth()) return;
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveService(event, ${serv ? `'${serv.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="serv-name" value="${serv ? serv.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Preço (R$)</label>
                <input type="number" id="serv-price" value="${serv ? serv.price : ''}" required>
            </div>
            <div class="form-group">
                <label>Duração (min)</label>
                <input type="number" id="serv-dur" value="${serv ? serv.duration : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="serv-img" value="${serv ? serv.image : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = serv ? 'Editar Serviço' : 'Novo Serviço';
    modal.classList.add('active');
}

async function saveService(event, id) {
    event.preventDefault();
    if (!checkAdminAuth()) return;
    
    const data = {
        name: document.getElementById('serv-name').value,
        price: Number(document.getElementById('serv-price').value),
        duration: Number(document.getElementById('serv-dur').value),
        image: document.getElementById('serv-img').value
    };
    
    try {
        if (id && id !== 'null') {
            await db.collection('services').doc(id).update(data);
            alert('✅ Serviço atualizado!');
        } else {
            await db.collection('services').add(data);
            alert('✅ Serviço criado!');
        }
        await carregarDados();
        closeModal();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function deleteService(id) {
    if (!checkAdminAuth()) return;
    if (confirm('Excluir este serviço?')) {
        try {
            await db.collection('services').doc(id).delete();
            alert('✅ Serviço excluído!');
            await carregarDados();
        } catch (erro) {
            alert('Erro: ' + erro.message);
        }
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

// ===== INICIAR =====
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    
    const btn = document.querySelector('.hero-buttons .btn:first-child');
    if (btn) {
        btn.onclick = (e) => {
            e.preventDefault();
            agendarWhatsApp();
        };
    }
    
    if (isLoggedIn) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    }
});

window.onclick = (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) closeModal();
};
