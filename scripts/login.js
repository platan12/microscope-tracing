async function handleLogin(event) {
    if (event) {
        event.preventDefault();
    }
    
    const emailInput = document.getElementById('mail');
    const passwordInput = document.getElementById('password');
    
    if (!emailInput || !passwordInput) {
        alert('Error: No se encontraron los campos');
        return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    try {
        // Carregar la base de dades d'usuaris
        const response = await fetch('/database/users.json');
        const data = await response.json();
        
        // Buscar l'usuari
        const user = data.users.find(u => u.mail === email && u.password === password);
        
        if (user) {
            // Login correcte
            window.location.href = '/Layout/main.html';
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al iniciar sesión');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login_form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
});

