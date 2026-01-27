// Codi d'administrador hardcoded
const ADMIN_CODE = "ADMIN2025";

// Detectar automàticament la URL de l'API
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;

async function handleRegister(event) {
    if (event) {
        event.preventDefault();
    }
    
    const adminCodeInput = document.getElementById('admin_code');
    const emailInput = document.getElementById('mail');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    
    if (!adminCodeInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        alert('Error: No se encontraron los campos');
        return;
    }
    
    const adminCode = adminCodeInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validacions
    if (!adminCode || !email || !password || !confirmPassword) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Validar codi d'administrador
    if (adminCode !== ADMIN_CODE) {
        alert('Codi d\'administrador incorrecte');
        adminCodeInput.value = '';
        adminCodeInput.focus();
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Les contrasenyes no coincideixen');
        return;
    }
    
    if (password.length < 6) {
        alert('La contrasenya ha de tenir mínim 6 caràcters');
        return;
    }
    
    try {
        console.log('📡 Enviant petició a:', `${API_URL}/api/register`);
        
        // Crida a l'API per registrar
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                mail: email, 
                password: password,
                adminCode: adminCode 
            })
        });
        
        console.log('📥 Resposta rebuda:', response.status);
        
        const data = await response.json();
        
        console.log('📄 Dades:', data);
        
        if (data.success) {
            alert('Usuari registrat correctament!');
            window.location.href = '/Layout/login.html';
        } else {
            alert(data.message);
        }
        
    } catch (error) {
        console.error('❌ Error al registrar:', error);
        alert('Error de connexió amb el servidor: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register_form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    console.log('🔧 API URL configurada:', API_URL);
});