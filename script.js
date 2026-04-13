// ===== SCRIPT PRINCIPAL COM FIREBASE V12.12.0 =====

let services = [];
let professionals = [];
let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ===== FUNÇÃO PARA PADRONIZAR TAMANHO DAS IMAGENS =====
function padronizarImagem(url, width, height) {
    if (!url) return '';
    
    // Se for do Unsplash
    if (url.includes('unsplash.com')) {
        url = url.split('?')[0];
        return `${url}?w=${width}&h=${height}&fit=crop`;
    }
    
    // Se for do Cloudinary (res.cloudinary.com)
    if (url.includes('res.cloudinary.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=${width}&h=${height}&c=fill`;
    }
    
    // Se for do image2url (imagem corrompida)
    if (url.includes('image2url.com')) {
        return `https://placehold.co/${width}x${height}?text=Imagem+Indisponivel`;
    }
    
    return url;
}

// ===== FUNÇÕES DE ACESSO AO FIRESTORE (V12) =====
async function carregarDados() {
    if (typeof db === 'undefined') {
        alert('❌ Firebase não conectado!');
        return;
    }
    
    try {
        const profQuery = collection(db, 'professionals');
        const profSnapshot = await getDocs(profQuery);
        professionals = profSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
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
            { name: 'Manicure', price: 35, duration: 45, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop' },
            { name: 'Pedicure', price: 40, duration: 45, image: 'https://images.unsplash.com/photo-1583244688026-d6c5e6b6f8a9?w=600&h=400&fit=crop' },
            { name: 'Design de Sobrancelhas', price: 50, duration: 30, image: 'https://images.unsplash.com/photo-1570172619644-dfd8ed3e2e4c?w=600&h=400&fit=crop' },
            { name: 'Micropigmentação de Sobrancelhas', price: 450, duration: 120, image: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=400&fit=crop' }
        ];
        
        const profissionaisIniciais = [
            { name: 'Raquel Sobreira', specialty: 'Unhas e Sobrancelha', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop' },
            { name: 'Glauce Costa', specialty: 'Podóloga', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop' }
        ];
        
        const servColl = collection(db, 'services');
        for (const s of servicosIniciais) {
            await addDoc(servColl, s);
        }
        
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

// ===== FUNÇÕES DE RENDERIZAÇÃO COM IMAGENS PADRONIZADAS =====
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    
    if (!services || services.length === 0) {
        container.innerHTML = '<p style="text-align: center;">Carregando serviços...</p>';
        return;
    }
    
    container.innerHTML = services.map(service => {
        const imagemPadrao = padronizarImagem(service.image, 600, 400);
        const mensagem = `Olá! Gostaria de agendar ${service.name}.`;
        const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
        
        return `
            <div class="service-card">
                <div class="service-img" style="background-image: url('${imagemPadrao}'); background-size: cover; background-position: center; width: 100%; height: 220px;"></div>
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p class="service-price">R$: ${service.price}</p>
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
        const imagemPadrao = padronizarImagem(prof.image, 300, 300);
        
        return `
            <div class="professional-card">
                <div class="professional-img" style="background-image: url('${imagemPadrao}'); background-size: cover; background-position: center; width: 160px; height: 160px; border-radius: 50%; margin: 0 auto 1rem;"></div>
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
            servicesAdminList.innerHTML = '<td><td colspan="4">Nenhum serviço</td</tr>';
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
        image: document.getElementById('service-image').value || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop'
    };
    
    try {
        if (id && id !== 'null') {
            const docRef = doc(db, 'services', id);
            await updateDoc(docRef, serviceData);
            alert('✅ Serviço atualizado!');
        } else {
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
                <input type="url" id="professional-image" value="${professional ? professional.image : 'https://images.unsplash.com/photo-1494790108777-466fd0c3a2b3?w=300&h=300&fit=crop'}">
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
            const docRef = doc(db, 'professionals', id);
            await updateDoc(docRef, professionalData);
            alert('✅ Profissional atualizado!');
        } else {
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

// ===== SISTEMA DE AVALIAÇÕES =====

let avaliacoes = [];

async function carregarAvaliacoes() {
    try {
        const avaliacoesQuery = collection(db, 'avaliacoes');
        const avaliacoesSnapshot = await getDocs(avaliacoesQuery);
        avaliacoes = avaliacoesSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            data: doc.data().data || new Date().toISOString()
        }));
        
        avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
        renderAvaliacoes();
    } catch (erro) {
        console.error('Erro ao carregar avaliações:', erro);
    }
}

function renderAvaliacoes() {
    const container = document.getElementById('lista-avaliacoes');
    if (!container) return;
    
    if (avaliacoes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Seja o primeiro a avaliar! 🌟</p>';
        return;
    }
    
    container.innerHTML = avaliacoes.map(avaliacao => `
        <div class="avaliacao-item">
            <div class="avaliacao-nome">${avaliacao.nome || 'Cliente anônimo'}</div>
            <div class="avaliacao-estrelas-item">
                ${'★'.repeat(avaliacao.nota)}${'☆'.repeat(5 - avaliacao.nota)}
            </div>
            <div class="avaliacao-comentario">${avaliacao.comentario || 'Sem comentários'}</div>
            <div class="avaliacao-data">${formatarData(avaliacao.data)}</div>
        </div>
    `).join('');
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function initEstrelas() {
    const estrelas = document.querySelectorAll('#estrelas i');
    let notaSelecionada = 0;
    
    estrelas.forEach(estrela => {
        estrela.addEventListener('mouseenter', function() {
            const nota = parseInt(this.getAttribute('data-nota'));
            atualizarEstrelasTemporario(nota);
        });
        
        estrela.addEventListener('mouseleave', function() {
            atualizarEstrelasTemporario(notaSelecionada);
        });
        
        estrela.addEventListener('click', function() {
            notaSelecionada = parseInt(this.getAttribute('data-nota'));
            atualizarEstrelasTemporario(notaSelecionada);
            estrelas.forEach((e, i) => {
                if (i < notaSelecionada) {
                    e.classList.add('permanente');
                    e.classList.remove('far');
                    e.classList.add('fas');
                } else {
                    e.classList.remove('permanente');
                    e.classList.remove('fas');
                    e.classList.add('far');
                }
            });
        });
    });
    
    function atualizarEstrelasTemporario(nota) {
        estrelas.forEach((estrela, index) => {
            if (index < nota) {
                estrela.classList.remove('far');
                estrela.classList.add('fas');
                estrela.style.color = '#ffc107';
            } else {
                if (!estrela.classList.contains('permanente')) {
                    estrela.classList.remove('fas');
                    estrela.classList.add('far');
                    estrela.style.color = '#ddd';
                }
            }
        });
    }
}

async function enviarAvaliacao() {
    const estrelas = document.querySelectorAll('#estrelas i');
    let nota = 0;
    for (let i = 0; i < estrelas.length; i++) {
        if (estrelas[i].classList.contains('permanente') || estrelas[i].classList.contains('fas')) {
            nota++;
        } else {
            break;
        }
    }
    
    const nome = document.getElementById('avaliacao-nome').value.trim();
    const comentario = document.getElementById('avaliacao-comentario').value.trim();
    
    if (nota === 0) {
        alert('Selecione uma nota antes de enviar!');
        return;
    }
    
    if (comentario === '') {
        alert('Escreva um comentário sobre sua experiência!');
        return;
    }
    
    try {
        const avaliacaoData = {
            nota: nota,
            nome: nome || null,
            comentario: comentario,
            data: new Date().toISOString()
        };
        
        const avaliacoesColl = collection(db, 'avaliacoes');
        await addDoc(avaliacoesColl, avaliacaoData);
        
        alert('✅ Obrigado pela sua avaliação!');
        
        document.getElementById('avaliacao-nome').value = '';
        document.getElementById('avaliacao-comentario').value = '';
        
        const estrelasReset = document.querySelectorAll('#estrelas i');
        estrelasReset.forEach(estrela => {
            estrela.classList.remove('permanente', 'fas');
            estrela.classList.add('far');
            estrela.style.color = '#ddd';
        });
        
        await carregarAvaliacoes();
        
    } catch (erro) {
        console.error('Erro ao enviar avaliação:', erro);
        alert('❌ Erro ao enviar. Tente novamente.');
    }
}

function initAvaliacoes() {
    const btnEnviar = document.getElementById('btn-enviar-avaliacao');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', enviarAvaliacao);
    }
    initEstrelas();
    carregarAvaliacoes();
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    initAvaliacoes();
    
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
