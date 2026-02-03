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
const tipoAfiliadoRoutes = require('./src/routes/tipoAfiliadoRoutes');
const municipioRoutes = require('./src/routes/municipioRoutes');
const decisionPrimeraInstanciaRoutes = require('./src/routes/decisionPrimeraInstanciaRoutes');
const paisRoutes = require('./src/routes/paisRoutes');
const decisionSegundaInstanciaRoutes = require('./src/routes/decisionSegundaInstanciaRoutes');
const catProblemaJuridicoRoutes = require('./src/routes/codigoProblemaJuridicoRoutes');
const migranteRoutes = require('./src/routes/migranteRoutes');
const fuenteFinanciacionRoutes = require('./src/routes/fuenteFinanciacionRoutes');
const causaDemoraRoutes = require('./src/routes/causaDemoraRoutes');
const descCausaDemoraRoutes = require('./src/routes/descripcionCausaDemoraRoutes');
const regimenAfiliacionRoutes = require('./src/routes/regimenAfiliacionRoutes');
const diagnosticoRoutes = require('./src/routes/diagnosticoRoutes');
const pretensionTutelaRoutes = require('./src/routes/pretensionTutelaRoutes');
const codigoCausaAccionRoutes = require('./src/routes/codigoCausaAccionRoutes');
const datosGeneralesRoutes = require('./src/routes/datosGeneralesRoutes');
const caracterizacionRoutes = require('./src/routes/caracterizacionRoutes');
const gestionTutelasRoutes = require('./src/routes/gestionTutelaRoutes.js');
const gestionProblemaJuridicoRoutes = require('./src/routes/problemaJuridico.routes.js');
const datosAccionTutelaRoutes = require('./src/routes/datosAccionTutelaRoutes.js');
const causasJuridicasRoutes = require('./src/routes/causasJuridicasRoutes.js');
const pretensionesTutelaModuloRoutes = require('./src/routes/pretensionesTutelaModuloRoutes.js');
const tutelaRoutes = require('./src/routes/tutelaRoutes.js');


const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middlewares de rutas
app.use('/api/admin/areas-destino', areaDestinoRoutes);
app.use('/api/admin/terminos-respuesta', terminoRespuestaRoutes);
app.use('/api/admin/peticion', peticionesRoutes);
app.use('/api/admin/poblacionespacial', poblacionEspecialRoutes);
app.use('/api/admin/organizacion', organizacionRoutes);
app.use('/api/admin/tipo-identificacion', tipoidentificacionRoutes); 
app.use('/api/admin/etnia', etniaRoutes);
app.use('/api/admin/tipo-afiliado', tipoAfiliadoRoutes);
app.use('/api/admin/municipio', municipioRoutes);
app.use('/api/admin/decision-primera-instancia', decisionPrimeraInstanciaRoutes);
app.use('/api/admin/pais', paisRoutes);
app.use('/api/admin/decision-segunda-instancia', decisionSegundaInstanciaRoutes);
app.use('/api/admin/codigo-problema-juridico', catProblemaJuridicoRoutes);
app.use('/api/admin/migrante', migranteRoutes);
app.use('/api/admin/fuente-financiacion', fuenteFinanciacionRoutes);
app.use('/api/admin/causa-demora', causaDemoraRoutes);
app.use('/api/admin/descripcion-causa-demora', descCausaDemoraRoutes);
app.use('/api/admin/regimen-afiliacion', regimenAfiliacionRoutes);
app.use('/api/admin/diagnostico', diagnosticoRoutes);
app.use('/api/admin/pretension-tutela', pretensionTutelaRoutes);
app.use('/api/admin/codigo-causa-accion-tutela', codigoCausaAccionRoutes);
app.use('/api/admin/datos-generales', datosGeneralesRoutes);
app.use('/api/admin/caracterizacion-beneficiario', caracterizacionRoutes);
app.use('/api/admin/gestion-tutelas', gestionTutelasRoutes);
app.use('/api/admin/problema-juridico', gestionProblemaJuridicoRoutes);
app.use('/api/admin/datos-accion-tutela', datosAccionTutelaRoutes);
app.use('/api/admin/causasjuridicas', causasJuridicasRoutes);
app.use('/api/admin/pretensionestutelamodulo',pretensionesTutelaModuloRoutes);
app.use("/api/admin", require("./src/routes/exportarTutelasTxt"));
app.use('/api/admin/tutelas', tutelaRoutes); 

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.send('Aura API Operativa 🟢'));

// Conexión DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 Aura DB Conectada con éxito'))
  .catch(err => console.error('❌ Error crítico:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`💻 Servidor Aura corriendo en: http://localhost:${PORT}`);
});