const fs = require("fs");
const path = require("path");
const Tutela = require("../models/Tutela");

const limpiar = (v) => {
    if (v === null || v === undefined || v === "") return "";
    let str = String(v);
    if (v instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(str)) {
        try {
            const d = new Date(v);
            if (!isNaN(d)) return d.toISOString().split('T')[0];
        } catch (e) { return str.replace(/\|/g, "").trim(); }
    }
    return str.replace(/\|/g, "").trim();
};

exports.exportarTxt = async (req, res) => {
    try {
        const tutelas = await Tutela.find().lean();
        if (!tutelas || tutelas.length === 0) return res.status(404).json({ mensaje: "No hay datos" });

        let lineas = [];
        let consecutivo = 1;

        // 1. TIPO 1 - ENCABEZADO
        const t1 = tutelas[0];
        lineas.push([
            1,
            limpiar(t1.tipoIdentificacionEntidad),
            limpiar(t1.numeroIdentificacionEntidad),
            "2026-01-01", 
            "2026-12-31",
            tutelas.length * 5 
        ].join("|"));

        tutelas.forEach((t) => {
            // 2. TIPO 2 - CARACTERIZACIÓN
            lineas.push([
                2,
                consecutivo++,
                limpiar(t.tipoIdentificacionEntidad),
                limpiar(t.numeroIdentificacionEntidad),
                limpiar(t.tipoDocumentoBeneficiario),
                limpiar(t.numeroDocumentoBeneficiario),
                limpiar(t.nombreBeneficiario),
                limpiar(t.apellidoBeneficiario),
                170, 3, "S", "6070000",
                limpiar(t.fechaNacimiento),
                limpiar(t.sexo),
                2,
                limpiar(t.codigoEtnia),
                "", // Discapacidad (vacío)
                1,
                limpiar(t.codigoMunicipioResidencia),
                "I"
            ].join("|"));

            // 3. TIPO 3 - DATOS ACCIÓN (Corregido: Decisiones e Impugnación)
            lineas.push([
                3,
                consecutivo++,
                limpiar(t.tipoIdentificacionEntidad),
                limpiar(t.numeroIdentificacionEntidad),
                limpiar(t.tipoDocumentoBeneficiario),
                limpiar(t.numeroDocumentoBeneficiario),
                limpiar(t.codigoMunicipioTutela),
                limpiar(t.numeroRadicacionTutela),
                limpiar(t.fechaRadicacionTutela),
                limpiar(t.codigoDecisionPrimeraInstancia || "1"), // Trae el dato de mongo
                "1", 
                limpiar(t.fechaFallo), // Se usa fecha fallo como referencia de decisión
                limpiar(t.impugnacion === "SI" ? "2" : "1"),
                "I"
            ].join("|"));

            // 4. TIPO 4 - PROBLEMA JURÍDICO (Completo con diagnósticos)
            lineas.push([
                4,
                consecutivo++,
                limpiar(t.tipoIdentificacionEntidad),
                limpiar(t.numeroIdentificacionEntidad),
                limpiar(t.tipoDocumentoBeneficiario),
                limpiar(t.numeroDocumentoBeneficiario),
                limpiar(t.numeroRadicacionTutela),
                limpiar(t.codigoProblemaJuridico),
                limpiar(t.diagnosticoPrincipal),
                limpiar(t.codigoFuenteFinanciacion),
                limpiar(t.codigoCausaDemora),
                limpiar(t.codigoDescripcionCausaDemora),
                limpiar(t.otroDiagnosticoRelacionado),
                limpiar(t.diagnosticoEnfermedad), // Aquí saldrá "daniela"
                limpiar(t.indicadorActualizacionRegistro),
                "I"
            ].join("|"));

            // 5. TIPO 5 - GESTIÓN
            lineas.push([
                5,
                consecutivo++,
                limpiar(t.tipoIdentificacionEntidad),
                limpiar(t.numeroIdentificacionEntidad),
                limpiar(t.tipoDocumentoBeneficiario),
                limpiar(t.numeroDocumentoBeneficiario),
                limpiar(t.numeroRadicacionTutela),
                limpiar(t.codigoTipoAfiliado),
                limpiar(t.codigoPoblacionEspecial),
                "I"
            ].join("|"));

            // 6. TIPO 6 - PRETENSIONES
            lineas.push([
                6,
                consecutivo++,
                limpiar(t.tipoIdentificacionEntidad),
                limpiar(t.numeroIdentificacionEntidad),
                limpiar(t.tipoDocumentoBeneficiario),
                limpiar(t.numeroDocumentoBeneficiario),
                limpiar(t.numeroRadicacionTutela),
                limpiar(t.codigoPretension),
                "1",
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
        res.status(500).json({ error: error.message });
    }
};