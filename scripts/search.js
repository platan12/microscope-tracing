async function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    
    const searchInput = document.getElementById('search');
    
    if (!searchInput) {
        alert('Error: No se encontró el campo de búsqueda');
        return;
    }
    
    const serial = searchInput.value.trim();
    
    if (!serial) {
        alert('Por favor introduce un número de serie');
        return;
    }
    
    try {
        // Carregar la base de dades de microscopis
        const response = await fetch('/database/microscopis.json');
        const data = await response.json();
        
        // Buscar el microscopi pel número de sèrie
        const microscope = data.microscopis.find(m => m.serial === serial);
        
        if (microscope) {
            // Microscopi trobat - redirigir amb el número de sèrie
            window.location.href = `/Layout/microscopi.html?serial=${serial}`;
        } else {
            alert('Microscopi no trobat. Si us plau, verifica el número de serie.');
        }
    } catch (error) {
        console.error('Error al buscar microscopi:', error);
        alert('Error al buscar el microscopi');
    }
}

function handleLogout() {
    if (confirm('Estàs segur que vols tancar sessió?')) {
        window.location.href = '/Layout/login.html';
    }
}

// Gestionar el submit del formulari
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('search_form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch();
        });
    }
});