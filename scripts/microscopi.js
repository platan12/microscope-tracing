// Obtenir el número de sèrie de la URL
const urlParams = new URLSearchParams(window.location.search);
const SERIAL_NUMBER = urlParams.get('serial');

let currentMicroscope = null;
let modelsData = null;

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

function toggleInstall() {
    if (!currentMicroscope) {
        alert('No hi ha microscopi carregat');
        return;
    }
    
    if (currentMicroscope.installed) {
        // Desinstal·lar
        if (confirm('Estàs segur que vols desinstal·lar aquest microscopi?')) {
            currentMicroscope.installed = false;
            currentMicroscope.installDate = null;
            updateDisplay(currentMicroscope);
            alert('Microscopi desinstal·lat correctament');
            // Aquí hauríes de fer una crida al backend per guardar els canvis
        }
    } else {
        // Instal·lar
        const today = new Date().toISOString().split('T')[0];
        currentMicroscope.installed = true;
        currentMicroscope.installDate = today;
        updateDisplay(currentMicroscope);
        alert('Microscopi instal·lat correctament');
        // Aquí hauríes de fer una crida al backend per guardar els canvis
    }
}

function goToSearch() {
    window.location.href = '/Layout/main.html';
}

function handleLogout() {
    if (confirm('Estàs segur que vols tancar sessió?')) {
        window.location.href = '/Layout/login.html';
    }
}
