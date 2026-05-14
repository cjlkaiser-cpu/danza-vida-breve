# Danza Espagnole · De Falla / Pujol — Plan de Estudio

App PWA de estudio para la **Primera Danza Española de *La Vie Brève*** de Manuel de Falla, en la transcripción para dos guitarras de Emilio Pujol (Éd. Max Eschig, 1957).

**→ [Abrir la app](https://cjlkaiser-cpu.github.io/danza-vida-breve/)**

---

## Qué es

Una herramienta de práctica instrumental pensada para guitarristas que estudian esta obra en dúo o en solitario. Funciona directamente en el navegador, sin instalación ni servidor.

La grabación de referencia incluye las dos guitarras separadas mediante **ICA** (*Independent Component Analysis*), lo que permite escuchar cada voz de forma independiente mientras se sigue la partitura.

---

## Características

### Partitura y navegación
- 14 secciones (páginas de partitura) con título, indicaciones técnicas y análisis interpretativo
- Botones ◀ / ▶ bajo la partitura para pasar página sin interrumpir el audio
- Flechas del teclado ← → para navegar entre secciones
- **Auto-follow** (⏱ Auto): la partitura pasa de página automáticamente sincronizada con la grabación
- **Calibración de tiempos** (⏺ Marcar): escucha y marca el segundo exacto en que debe cambiar cada página; se guarda en el navegador y se puede borrar con ✕

### Grabación de referencia
- Reproductor de audio compacto con barra de progreso y seek
- Selector de fuente: **Ambas** · **G. I** · **G. II** (pistas separadas por ICA)
- **Waveform** de la forma de onda sobre el timeline A/B para ajustar puntos de loop con precisión
- Bucle A/B con handles arrastrables y botones de marcado
- Control de velocidad de reproducción (50 % – 130 %) conservando el tono

### Metrónomo
- Metrónomo integrado con slider y presets: 60 · 72 · **96 ♩** · 108 · 120 BPM
- Tap tempo y detección automática de BPM (requiere servidor local)
- Historial de sesiones de tempo por sección

### Anotaciones en partitura
- Lápiz y goma sobre la imagen de partitura (rojo, azul, verde, naranja)
- Vista a pantalla completa para anotar en tablet
- Las anotaciones se guardan por sección en IndexedDB

### Grabaciones propias
- Grabación de audio y vídeo con la webcam
- Subida de archivos externos
- Historial de tomas por sección, con reproducción, descarga y eliminación
- Foto de la partitura anotada en papel

### Modo Dúo asíncrono
Herramienta para practicar el dúo a distancia, sin servidor:

1. **Persona A** selecciona su voz (G. I o G. II), escribe el rango de compases, graba y descarga el vídeo.
2. **Persona B** carga ese vídeo con *"Cargar vídeo del compañero"* → aparece en el slot izquierdo del split screen.
3. B graba su parte y la carga en el slot derecho pulsando **▷** en la lista de vídeos.
4. **Reproducir juntos** sincroniza ambos vídeos. El slider **Compañero ±** permite ajustar el desfase (±3 s). Los botones **50 % / 75 % / 100 %** controlan el tempo de los dos vídeos a la vez.

### Herramientas adicionales
- Afinador cromático por micrófono
- Espejo de vídeo (cámara frontal) para control de postura
- Export / import de backup completo (JSON)

---

## Uso sin servidor

La mayoría de funciones funcionan abriendo `index.html` directamente en el navegador (`file://`). Solo el detector automático de BPM requiere servir los archivos por HTTP.

Para lanzar un servidor local rápido:

```bash
cd /ruta/al/proyecto
python3 -m http.server 8504
# Abrir http://localhost:8504
```

---

## Estructura

```
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js          # 14 secciones con startTime, imagen y análisis
│   ├── app.js           # Toda la lógica de la app
│   └── waveforms.js     # Peaks pre-computados (1200 pts × 3 fuentes)
├── media/
│   ├── danza-vida-breve-1080p.mp4   # Ambas guitarras (246 s)
│   ├── guitar1.mp3                  # Guitarra I aislada (ICA)
│   └── guitar2.mp3                  # Guitarra II aislada (ICA)
└── img/
    ├── danza_page-01.png … danza_page-14.png
```

---

## Separación de voces

La grabación de referencia es de Canal Cultura / YouTube. Las pistas individuales se obtuvieron analizando la correlación estéreo del audio original (r = 0.30) y aplicando **FastICA** (scikit-learn), logrando correlación cero entre las dos fuentes resultantes.

---

## Pieza

**Manuel de Falla** · *Première Danse Espagnole* de *La Vie Brève*  
Transcripción para dos guitarras de **Emilio Pujol**  
Éd. Max Eschig, Paris, 1957  
Molto ritmico · ♩ ≈ 96 · 6.ª cuerda afinada en Re
