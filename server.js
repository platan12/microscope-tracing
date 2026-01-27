const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Codi d'administrador hardcoded
const ADMIN_CODE = "ADMIN2025";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serveix tots els fitxers estàtics

// REDIRECCIÓ A LOGIN QUAN ENTREN A L'ARREL
app.get('/', (req, res) => {
    res.redirect('/Layout/login.html');
});

// Ruta per login
app.post('/api/login', (req, res) => {
    const { mail, password } = req.body;
    
    try {
        const usersPath = path.join(__dirname, 'database', 'users.json');
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const user = users.users.find(u => u.mail === mail && u.password === password);
        
        if (user) {
            res.json({ success: true, message: 'Login correcto' });
        } else {
            res.json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Ruta per registrar
app.post('/api/register', (req, res) => {
    const { mail, password, adminCode } = req.body;
    
    try {
        // Validar codi d'administrador
        if (adminCode !== ADMIN_CODE) {
            return res.json({ success: false, message: 'Codi d\'administrador incorrecte' });
        }
        
        const usersPath = path.join(__dirname, 'database', 'users.json');
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        
        // Comprovar si l'usuari ja existeix
        if (users.users.find(u => u.mail === mail)) {
            return res.json({ success: false, message: 'Usuario ya existe' });
        }
        
        // Afegir nou usuari
        users.users.push({ mail, password });
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        
        res.json({ success: true, message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Ruta per actualitzar estat del microscopi
app.post('/api/microscope/update', (req, res) => {
    const { serial, installed, installDate } = req.body;
    
    console.log('📝 Petició rebuda per actualitzar microscopi:', { serial, installed, installDate });
    
    try {
        const microscopePath = path.join(__dirname, 'database', 'microscopis.json');
        
        // Llegir el fitxer actual
        const fileContent = fs.readFileSync(microscopePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        console.log('📂 Dades actuals:', data);
        
        // Buscar el microscopi
        const microscope = data.microscopis.find(m => m.serial === serial);
        
        if (microscope) {
            // Actualitzar les dades
            microscope.installed = installed;
            microscope.installDate = installDate;
            
            console.log('✅ Microscopi trobat i actualitzat:', microscope);
            
            // Guardar els canvis
            fs.writeFileSync(microscopePath, JSON.stringify(data, null, 2), 'utf8');
            
            console.log('💾 Fitxer guardat correctament');
            
            res.json({ success: true, message: 'Microscopi actualitzat correctament' });
        } else {
            console.log('❌ Microscopi no trobat amb serial:', serial);
            res.json({ success: false, message: 'Microscopi no trobat' });
        }
    } catch (error) {
        console.error('💥 Error en actualització:', error);
        res.status(500).json({ success: false, message: 'Error del servidor: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 Accede a tu aplicación en http://localhost:${PORT}/Layout/login.html`);
    console.log(`🔑 Código de administrador: ${ADMIN_CODE}`);
});