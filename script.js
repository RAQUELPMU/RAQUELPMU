// ===== SCRIPT PRINCIPAL COM FIREBASE =====

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
        
        if (typeof db === 'undefined') {
            console.log('⚠️ Firebase não disponível, usando dados locais');
            usarDadosLocais();
            return;
        }
        
        const profSnap = await db.collection('professionals').get();
        professionals = profSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const servSnap = await db.collection('services').get();
        services = servSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log('✅ Profissionais:', professionals.length);
        console.log('✅ Serviços:', services.length);
        
        if (services.length === 0 && professionals.length === 0) {
            await criarDadosIniciais();
        }
        
        renderServices();
        renderProfessionals();
        if (isLoggedIn) renderAdminTables();
        
    } catch (erro) {
        console.error('❌ Erro:', erro);
        usarDadosLocais();
    }
}

// ===== DADOS INICIAIS =====
async function criarDadosIniciais() {
    try {
        console.log('📝 Criando dados iniciais...');
        
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
        
        for (const s of servicosIniciais) await db.collection('services').add(s);
        for (const p of profissionaisIniciais) await db.collection('professionals').add(p);
        
        console.log('✅ Dados iniciais criados!');
        
    } catch (erro) {
        console.error('❌ Erro ao criar dados:', erro);
        usarDadosLocais();
    }
}

// ===== BACKUP LOCAL =====
function usarDadosLocais() {
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

// ===== RENDERIZAÇÃO =====
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    if (!services.length) { container.innerHTML = '<p style="text-align: center;">Carregando...</p>'; return; }
    
    container.innerHTML = services.map(s => {
        const link = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar ${s.name}.`;
        return `
            <div class="service-card">
                <div class="service-img" style="background-image: url('${s.image}')"></div>
                <div class="service-content">
                    <h3>${s.name}</h3>
                    <p class="service-price">R$:${s.price}</p>
                    <p>Duração: ${s.duration} min</p>
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
    if (!professionals.length) { container.innerHTML = '<p style="text-align: center;">Carregando...</p>'; return; }
    
    container.innerHTML = professionals.map(p => `
        <div class="professional-card">
            <div class="professional-img" style="background-image: url('${p.image}')"></div>
            <h3>${p.name}</h3>
            <p>Especialidade: ${p.specialty}</p>
        </div>
    `).join('');
}

function agendarWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar um horário.`, '_blank');
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
                <td>R$:${s.price}</td>
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

function checkAdminAuth() {
    if (!sessionStorage.getItem('adminLoggedIn')) {
        alert('Faça login primeiro!');
        return false;
    }
    return true;
}

// ===== CRUD PROFISSIONAIS =====
function openProfessionalModal(p = null) {
    if (!checkAdminAuth()) return;
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveProfessional(event, ${p ? `'${p.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="prof-name" value="${p ? p.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Especialidade</label>
                <input type="text" id="prof-spec" value="${p ? p.specialty : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="prof-img" value="${p ? p.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = p ? 'Editar Profissional' : 'Novo Profissional';
    document.getElementById('modal').classList.add('active');
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
    if (!checkAdminAuth() || !confirm('Excluir?')) return;
    await db.collection('professionals').doc(id).delete();
    carregarDados();
}

// ===== CRUD SERVIÇOS =====
function openServiceModal(s = null) {
    if (!checkAdminAuth()) return;
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="saveService(event, ${s ? `'${s.id}'` : 'null'})">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="serv-name" value="${s ? s.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Preço</label>
                <input type="number" id="serv-price" value="${s ? s.price : ''}" required>
            </div>
            <div class="form-group">
                <label>Duração (min)</label>
                <input type="number" id="serv-dur" value="${s ? s.duration : ''}" required>
            </div>
            <div class="form-group">
                <label>URL da imagem</label>
                <input type="url" id="serv-img" value="${s ? s.image : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'}">
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    `;
    document.getElementById('modal-title').textContent = s ? 'Editar Serviço' : 'Novo Serviço';
    document.getElementById('modal').classList.add('active');
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
    if (!checkAdminAuth() || !confirm('Excluir?')) return;
    await db.collection('services').doc(id).delete();
    carregarDados();
}

function editProfessional(id) { openProfessionalModal(professionals.find(p => p.id === id)); }
function editService(id) { openServiceModal(services.find(s => s.id === id)); }
function closeModal() { document.getElementById('modal').classList.remove('active'); }

// ===== INICIAR =====
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    
    const btn = document.querySelector('.hero-buttons .btn:first-child');
    if (btn) btn.onclick = (e) => { e.preventDefault(); agendarWhatsApp(); };
    
    if (isLoggedIn) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    }
});

window.onclick = (e) => { if (e.target === document.getElementById('modal')) closeModal(); };
