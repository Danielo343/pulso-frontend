/**
 * Datos de ejemplo únicamente para fines de maquetación visual.
 * No representan información real ni provienen de un backend.
 */

export const usuariosMock = [
  { id: 1, nombre: 'Rosa Martínez', edad: 78, parentesco: 'Madre', estado: 'Estable', dispositivo: 'Pulsera Pulso M2' },
  { id: 2, nombre: 'Jorge Delgado', edad: 82, parentesco: 'Padre', estado: 'En observación', dispositivo: 'Monitor Pulso H1' },
  { id: 3, nombre: 'Elena Vázquez', edad: 75, parentesco: 'Tía', estado: 'Estable', dispositivo: 'Pulsera Pulso M2' },
  { id: 4, nombre: 'Antonio Ruiz', edad: 88, parentesco: 'Abuelo', estado: 'Alerta', dispositivo: 'Monitor Pulso H1' },
  { id: 5, nombre: 'Carmen Soto', edad: 79, parentesco: 'Madre', estado: 'Estable', dispositivo: 'Pulsera Pulso M2' }
]

export const dispositivosMock = [
  { id: 1, nombre: 'Pulsera Pulso M2', tipo: 'Wearable', usuario: 'Rosa Martínez', bateria: '86%', estado: 'Conectado' },
  { id: 2, nombre: 'Monitor Pulso H1', tipo: 'Monitor cardíaco', usuario: 'Jorge Delgado', bateria: '54%', estado: 'Conectado' },
  { id: 3, nombre: 'Báscula Pulso S3', tipo: 'Báscula inteligente', usuario: 'Elena Vázquez', bateria: '92%', estado: 'Desconectado' },
  { id: 4, nombre: 'Tensiómetro Pulso T1', tipo: 'Presión arterial', usuario: 'Antonio Ruiz', bateria: '31%', estado: 'Batería baja' }
]

export const medicionesMock = [
  { id: 1, tipo: 'Frecuencia cardíaca', valor: '78 bpm', usuario: 'Rosa Martínez', fecha: '19/07/2026 08:30' },
  { id: 2, tipo: 'Presión arterial', valor: '120/80 mmHg', usuario: 'Jorge Delgado', fecha: '19/07/2026 08:15' },
  { id: 3, tipo: 'Oxígeno en sangre', valor: '97%', usuario: 'Elena Vázquez', fecha: '19/07/2026 07:50' },
  { id: 4, tipo: 'Temperatura', valor: '36.5 °C', usuario: 'Antonio Ruiz', fecha: '19/07/2026 07:40' },
  { id: 5, tipo: 'Frecuencia cardíaca', valor: '85 bpm', usuario: 'Carmen Soto', fecha: '19/07/2026 07:20' }
]

export const medicamentosMock = [
  { id: 1, nombre: 'Losartán 50mg', usuario: 'Rosa Martínez', dosis: '1 tableta', horario: '08:00 / 20:00', estado: 'Activo' },
  { id: 2, nombre: 'Metformina 850mg', usuario: 'Jorge Delgado', dosis: '1 tableta', horario: '09:00 / 21:00', estado: 'Activo' },
  { id: 3, nombre: 'Atorvastatina 20mg', usuario: 'Elena Vázquez', dosis: '1 tableta', horario: '22:00', estado: 'Activo' },
  { id: 4, nombre: 'Levotiroxina 100mcg', usuario: 'Antonio Ruiz', dosis: '1 tableta', horario: '06:30', estado: 'Pausado' }
]

export const historialMock = [
  { id: 1, usuario: 'Rosa Martínez', diagnostico: 'Hipertensión controlada', medico: 'Dr. Luis Paredes', fecha: '02/06/2026' },
  { id: 2, usuario: 'Jorge Delgado', diagnostico: 'Diabetes tipo 2', medico: 'Dra. Fernanda León', fecha: '18/05/2026' },
  { id: 3, usuario: 'Elena Vázquez', diagnostico: 'Colesterol elevado', medico: 'Dr. Luis Paredes', fecha: '30/04/2026' },
  { id: 4, usuario: 'Antonio Ruiz', diagnostico: 'Hipotiroidismo', medico: 'Dra. Fernanda León', fecha: '12/04/2026' }
]

export const contactosMock = [
  { id: 1, nombre: 'María Martínez', relacion: 'Hija', telefono: '+52 33 1234 5678', prioridad: 'Principal' },
  { id: 2, nombre: 'Pedro Delgado', relacion: 'Hijo', telefono: '+52 33 2345 6789', prioridad: 'Principal' },
  { id: 3, nombre: 'Dr. Luis Paredes', relacion: 'Médico tratante', telefono: '+52 33 3456 7890', prioridad: 'Secundaria' },
  { id: 4, nombre: 'Ana Vázquez', relacion: 'Sobrina', telefono: '+52 33 4567 8901', prioridad: 'Secundaria' }
]

export const eventosMock = [
  { id: 1, titulo: 'Consulta de control', usuario: 'Rosa Martínez', tipo: 'Cita médica', fecha: '21/07/2026 10:00' },
  { id: 2, titulo: 'Estudio de laboratorio', usuario: 'Jorge Delgado', tipo: 'Laboratorio', fecha: '22/07/2026 09:00' },
  { id: 3, titulo: 'Terapia física', usuario: 'Elena Vázquez', tipo: 'Terapia', fecha: '23/07/2026 16:30' },
  { id: 4, titulo: 'Revisión cardiológica', usuario: 'Antonio Ruiz', tipo: 'Cita médica', fecha: '25/07/2026 11:15' }
]

export const notificacionesMock = [
  { id: 1, mensaje: 'Frecuencia cardíaca elevada detectada', usuario: 'Antonio Ruiz', tipo: 'alerta', fecha: 'Hace 12 min' },
  { id: 2, mensaje: 'Medicamento tomado correctamente', usuario: 'Rosa Martínez', tipo: 'info', fecha: 'Hace 40 min' },
  { id: 3, mensaje: 'Dispositivo con batería baja', usuario: 'Antonio Ruiz', tipo: 'advertencia', fecha: 'Hace 1 h' },
  { id: 4, mensaje: 'Nueva receta médica disponible', usuario: 'Jorge Delgado', tipo: 'info', fecha: 'Hace 3 h' }
]

export const archivosMock = [
  { id: 1, nombre: 'Estudio_sangre_junio.pdf', usuario: 'Rosa Martínez', tipo: 'PDF', tamano: '1.2 MB', fecha: '15/06/2026' },
  { id: 2, nombre: 'Radiografia_torax.jpg', usuario: 'Jorge Delgado', tipo: 'Imagen', tamano: '3.4 MB', fecha: '10/06/2026' },
  { id: 3, nombre: 'Electrocardiograma.pdf', usuario: 'Antonio Ruiz', tipo: 'PDF', tamano: '860 KB', fecha: '05/06/2026' },
  { id: 4, nombre: 'Perfil_lipidico.pdf', usuario: 'Elena Vázquez', tipo: 'PDF', tamano: '540 KB', fecha: '01/06/2026' }
]

export const recetasMock = [
  { id: 1, folio: 'REC-2026-0142', usuario: 'Rosa Martínez', medico: 'Dr. Luis Paredes', fecha: '02/06/2026', estado: 'Vigente' },
  { id: 2, folio: 'REC-2026-0138', usuario: 'Jorge Delgado', medico: 'Dra. Fernanda León', fecha: '18/05/2026', estado: 'Vigente' },
  { id: 3, folio: 'REC-2026-0119', usuario: 'Elena Vázquez', medico: 'Dr. Luis Paredes', fecha: '30/04/2026', estado: 'Vencida' },
  { id: 4, folio: 'REC-2026-0101', usuario: 'Antonio Ruiz', medico: 'Dra. Fernanda León', fecha: '12/04/2026', estado: 'Vigente' }
]

export const reportesMock = [
  { id: 1, nombre: 'Reporte mensual de signos vitales', usuario: 'Todos', periodo: 'Junio 2026', formato: 'PDF' },
  { id: 2, nombre: 'Resumen de adherencia a medicamentos', usuario: 'Rosa Martínez', periodo: 'Junio 2026', formato: 'Excel' },
  { id: 3, nombre: 'Historial de alertas', usuario: 'Antonio Ruiz', periodo: 'Últimos 30 días', formato: 'PDF' },
  { id: 4, nombre: 'Reporte de actividad física', usuario: 'Elena Vázquez', periodo: 'Junio 2026', formato: 'PDF' }
]
