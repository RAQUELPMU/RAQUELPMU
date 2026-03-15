// ===== DADOS DO SEU SALÃO =====
// (Nada de JSON ou Firebase complicado, são só arrays como antes)

let services = [
    {
        id: 1,
        name: 'Manicure',
        price: 35,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500' // Foto de manicure
    },
    {
        id: 2,
        name: 'Pedicure',
        price: 40,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500' // Foto de pedicure
    },
    {
        id: 3,
        name: 'Design de Sobrancelhas',
        price: 50,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500' // Foto de design de sobrancelhas
    },
    {
        id: 4,
        name: 'Micropigmentação de Sobrancelhas',
        price: 450,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?w=500' // Foto de micropigmentação
    }
];

let professionals = [
    {
        id: 1,
        name: 'Raquel Sobreira',
        specialty: 'Unhas e Sobrancelha',
        image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600488/lyrh3xheum9kd9cqtjk4.png' // Sua foto
    },
    {
        id: 2,
        name: 'Glauce Costa',
        specialty: 'Podóloga',
        image: 'https://res.cloudinary.com/dnez7rl46/image/upload/v1773600024/wdf4gnrwo9hdhz6c7ocv.png' // Foto da Glauce
    }
];

let appointments = [];
let ADMIN_PASSWORD = "247126Ca";
let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
const WHATSAPP_NUMBER = "5521992649522";

// ==================================
// O RESTO DO SEU SCRIPT CONTINUA IGUAL
// (as funções de renderServices, renderProfessionals,
//  admin, login, etc. são as mesmas de antes)
// ==================================

// FUNÇÕES DE RENDERIZAÇÃO (cole as que você já tinha aqui)
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

// Aqui você coloca TODAS as outras funções que já tinha:
// agendarWhatsApp, renderAdminTables, checkPassword, logout, showTab,
// openServiceModal, saveService, deleteService, openProfessionalModal,
// saveProfessional, deleteProfessional, etc.
// (para não ficar gigante, não repeti tudo, mas você mantém o que já funcionava)

// INICIALIZAÇÃO
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
