// Obtenir el número de sèrie de la URL
const urlParams = new URLSearchParams(window.location.search);
const SERIAL_NUMBER = urlParams.get('serial');

let currentMicroscope = null;
let modelsData = null;

// URL de l'API (canvia segons on tinguis el servidor)
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://microscope-tracing.onrender.com';

// Carregar dades del microscopi quan la pàgina carregui
document.addEventListener('DOMContentLoaded', async function() {
    if (!SERIAL_NUMBER) {
        alert('No s\'ha especificat un número de serie');
        window.location.href = '/Layout/main.html';
        return;
    }
    
    // Carregar dades de models primer
    await loadModelsData();
    // Després carregar dades del microscopi
    await loadMicroscopeData(SERIAL_NUMBER);
});

async function loadModelsData() {
    try {
        const response = await fetch('/database/models.json');
        modelsData = await response.json();
    } catch (error) {
        console.error('Error al carregar dades dels models:', error);
    }
}

async function loadMicroscopeData(serial) {
    try {
        const response = await fetch('/database/microscopis.json');
        const data = await response.json();
        
        // Buscar el microscopi pel número de sèrie
        currentMicroscope = data.microscopis.find(m => m.serial === serial);
        
        if (currentMicroscope) {
            updateDisplay(currentMicroscope);
        } else {
            alert('Microscopi no trobat');
            window.location.href = '/Layout/main.html';
        }
    } catch (error) {
        console.error('Error al carregar dades del microscopi:', error);
        alert('Error al carregar les dades');
    }
}

function updateDisplay(microscope) {
    // Actualitzar la imatge del model
    updateModelImage(microscope.model);
    
    // Actualitzar el model
    document.getElementById('model').textContent = `Model ${microscope.model}`;
    
    // Actualitzar número de sèrie
    document.getElementById('serial').textContent = `Numero de serie: ${microscope.serial}`;
    
    // Actualitzar estat
    const status = microscope.installed ? 'Instal·lat' : 'No Instal·lat';
    document.getElementById('status').textContent = `Estat: ${status}`;
    
    // Actualitzar data d'instal·lació
    const installDate = microscope.installDate ? microscope.installDate : 'No instal·lat';
    document.getElementById('installDate').textContent = `Data de instal·lació: ${installDate}`;
    
    // Actualitzar botó
    const installBtn = document.getElementById('installBtn');
    if (microscope.installed) {
        installBtn.textContent = 'Desinstal·lar';
        installBtn.classList.add('uninstall');
    } else {
        installBtn.textContent = 'Instal·lar';
        installBtn.classList.remove('uninstall');
    }
}

function updateModelImage(modelName) {
    const imgElement = document.querySelector('.img_div img');
    
    if (!modelsData || !imgElement) {
        return;
    }
    
    // Buscar el model a la base de dades
    const model = modelsData.models.find(m => m.name === modelName);
    
    if (model && model.image) {
        imgElement.src = model.image;
        imgElement.alt = `Microscopi ${modelName}`;
    } else {
        // Si no es troba el model, usar la imatge placeholder
        imgElement.src = '/images/placeholder.png';
        imgElement.alt = 'Microscopi';
    }
}

async function toggleInstall() {
    if (!currentMicroscope) {
        alert('No hi ha microscopi carregat');
        return;
    }
    
    const installBtn = document.getElementById('installBtn');
    
    // Deshabilitar el botó mentre es processa
    installBtn.disabled = true;
    installBtn.style.opacity = '0.6';
    installBtn.style.cursor = 'wait';
    
    if (currentMicroscope.installed) {
        // Desinstal·lar
        if (confirm('Estàs segur que vols desinstal·lar aquest microscopi?')) {
            try {
                const response = await fetch(`${API_URL}/api/microscope/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serial: currentMicroscope.serial,
                        installed: false,
                        installDate: null
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    currentMicroscope.installed = false;
                    currentMicroscope.installDate = null;
                    updateDisplay(currentMicroscope);
                    alert('Microscopi desinstal·lat correctament');
                } else {
                    alert('Error al desinstal·lar: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de connexió amb el servidor');
            }
        }
    } else {
        // Instal·lar
        try {
            const today = new Date().toISOString().split('T')[0];
            
            const response = await fetch(`${API_URL}/api/microscope/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serial: currentMicroscope.serial,
                    installed: true,
                    installDate: today
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                currentMicroscope.installed = true;
                currentMicroscope.installDate = today;
                updateDisplay(currentMicroscope);
                alert('Microscopi instal·lat correctament');
            } else {
                alert('Error al instal·lar: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de connexió amb el servidor');
        }
    }
    
    // Rehabilitar el botó
    installBtn.disabled = false;
    installBtn.style.opacity = '1';
    installBtn.style.cursor = 'pointer';
}

function goToSearch() {
    window.location.href = '/Layout/main.html';
}

function handleLogout() {
    if (confirm('Estàs segur que vols tancar sessió?')) {
        window.location.href = '/Layout/login.html';
    }
}