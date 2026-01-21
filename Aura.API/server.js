require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importación de rutas
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const areaDestinoRoutes = require('./src/routes/areaDestinoRoutes');
const terminoRespuestaRoutes = require('./src/routes/terminoRespuestaRoutes');
const peticionesRoutes = require('./src/routes/peticionesRoutes');
const poblacionEspecialRoutes = require('./src/routes/poblacionEspecialRoutes');
const organizacionRoutes = require('./src/routes/organizacionRoutes');
const tipoidentificacionRoutes = require('./src/routes/tipoIdentificacionRoutes'); 
const etniaRoutes = require('./src/routes/etniaRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/admin/areas-destino', areaDestinoRoutes);
app.use('/api/admin/terminos-respuesta', terminoRespuestaRoutes);
app.use('/api/admin/peticion', peticionesRoutes);
app.use('/api/admin/poblacionespacial', poblacionEspecialRoutes);
app.use('/api/admin/organizacion', organizacionRoutes);
app.use('/api/admin/tipo-identificacion', tipoidentificacionRoutes); 
app.use('/api/admin/etnia', etniaRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.send('Aura API Operativa 🟢'));

if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI no definida en el archivo .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 Aura DB Conectada con éxito'))
  .catch(err => {
    console.error('❌ Error crítico al conectar a la DB:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`💻 Servidor Aura corriendo en: http://localhost:${PORT}`);
  console.log(`📡 Endpoint de autenticación: http://localhost:${PORT}/api/auth/google`);
});