const fs = require("fs");
const path = require("path");

// Modelos exactos según tus archivos
const Pretension = require("../models/PretensionTutelaModulo");
const DatosAccion = require("../models/DatosAccionTutela");
const ProblemaJuridico = require("../models/ProblemaJuridico");
const GestionTutela = require("../models/GestionTutela");
const Caracterizacion = require("../models/CaracterizacionBeneficiario");
const DatosGenerales = require("../models/DatosGenerales");

// Limpiador de fechas y valores
const limpiar = (v) => {
    if (v === null || v === undefined || v === "") return "";
    let str = String(v);
    if (v instanceof Date || str.includes("GMT") || /^\d{4}-\d{2}-\d{2}/.test(str)) {
        try {
            const d = new Date(v);
            if (!isNaN(d)) return d.toISOString().split('T')[0];
        } catch (e) { return str.replace(/\|/g, "").trim(); }
    }
    return str.replace(/\|/g, "").trim();
};

exports.exportarTxt = async (req, res) => {
    try {
        const [pret, accion, prob, gest, carac, gen] = await Promise.all([
            Pretension.find().lean(),
            DatosAccion.find().lean(),
            ProblemaJuridico.find().lean(),
            GestionTutela.find().lean(),
            Caracterizacion.find().lean(),
            DatosGenerales.find().lean()
        ]);

        let lineas = [];

        // 1️⃣ TIPO 1 - DATOS GENERALES
        // Nota: Basado en tu modelo DatosGenerales, si no hay NIT ahí, usamos el de la entidad
        const primerRegistro = carac[0] || {};
        const fechaRef = gen[0] || {};
        
        lineas.push([
            1,
            limpiar(primerRegistro.tipoIdentificacionEntidad || "NI"),
            limpiar(primerRegistro.numeroIdentificacionEntidad || "900330752"),
            limpiar(fechaRef.fechaFallo || "2025-07-01"), // Ajustar según periodo
            limpiar(fechaRef.fechaFallo || "2025-12-31"),
            carac.length + accion.length + prob.length + gest.length + pret.length
        ].join("|"));

        // 2️⃣ TIPO 2 - CARACTERIZACIÓN
        carac.forEach((d, i) => {
            lineas.push([
                2,
                i + 1,
                limpiar(d.tipoIdentificacionEntidad),
                limpiar(d.numeroIdentificacionEntidad),
                limpiar(d.tipoDocumentoBeneficiario),
                limpiar(d.numeroDocumentoBeneficiario),
                limpiar(d.nombreBeneficiario),
                limpiar(d.apellidoBeneficiario),
                170, 3, // Constantes
                "S",    // Estado civil (puedes mapearlo si lo agregas al modelo)
                "6827604428", // Teléfono o campo correspondiente
                limpiar(d.fechaNacimiento),
                limpiar(d.sexo),
                2,      // Estrato (ejemplo)
                "07", "", 
                1,      // Nivel educativo (ejemplo)
                "68001", // Municipio (ejemplo)
                "I"
            ].join("|"));
        });

        // 3️⃣ TIPO 3 - DATOS ACCIÓN TUTELA
        const offset3 = carac.length;
        accion.forEach((d, i) => {
            lineas.push([
                3,
                i + 1 + offset3,
                limpiar(d.tipoIdentificacionEntidad),
                limpiar(d.numeroDocumentoEntidad),
                limpiar(d.tipoDocumentoBeneficiario),
                limpiar(d.numeroIdentificacionBeneficiario),
                limpiar(d.codigoMunicipioTutela),
                limpiar(d.numeroRadicacionTutela),
                limpiar(d.fechaRadicacionTutela),
                limpiar(d.codigoDecisionPrimeraInstancia || "1"), // Causa
                "1", // Clase
                "",
                limpiar(d.impugnacion === "SI" ? "2" : "1"), // Instancia
                "I"
            ].join("|"));
        });

        // 4️⃣ TIPO 4 - PROBLEMA JURÍDICO
        const offset4 = offset3 + accion.length;
        prob.forEach((d, i) => {
            lineas.push([
                4,
                i + 1 + offset4,
                limpiar(d.tipoIdentificacion || "NI"),
                limpiar(d.numeroIdentificacionEntidad),
                limpiar(d.tipoDocumentoBeneficiario),
                limpiar(d.numeroIdentificacionBeneficiario),
                limpiar(d.numeroRadicacionTutela),
                limpiar(d.codigoProblemaJuridico),
                "", 
                "1", 
                "", "", "", "", "", "I"
            ].join("|"));
        });

        const offset5 = offset4 + prob.length;
        gest.forEach((d, i) => {
            const rel = accion.find(a => String(a.idDatosGenerales) === String(d.idDatosGenerales)) || {};
            lineas.push([
                5,
                i + 1 + offset5,
                "NI",
                "900330752",
                limpiar(rel.tipoDocumentoBeneficiario || "CC"),
                limpiar(rel.numeroIdentificacionBeneficiario || "0"),
                limpiar(rel.numeroRadicacionTutela || "0"),
                limpiar(d.codigoTipoAfiliado || "1"),
                limpiar(d.codigoPoblacionEspecial || "3"),
                "I"
            ].join("|"));
        });

        const offset6 = offset5 + gest.length;
        pret.forEach((d, i) => {
            lineas.push([
                6,
                i + 1 + offset6,
                limpiar(d.tipoIdentificacionEntidad),
                limpiar(d.numeroIdentificacionEntidad),
                limpiar(d.tipoDocumentoBeneficiario),
                limpiar(d.numeroIdentificacionBeneficiario),
                limpiar(d.numeroRadicacionTutela),
                limpiar(d.codigoPretension),
                limpiar(d.codigoCausaAccionTutela),
                "0", 
                "I"
            ].join("|"));
        });

        const exportDir = path.join(__dirname, "../exports");
        if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

        const filePath = path.join(exportDir, "IVC170TIDS.txt");
        fs.writeFileSync(filePath, lineas.join("\r\n"), "utf8");

        res.download(filePath, "IVC170TIDS.txt");

    } catch (error) {
        console.error("❌ ERROR CRÍTICO:", error);
        res.status(500).json({ error: error.message });
    }
};