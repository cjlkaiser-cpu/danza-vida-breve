# Danza Espagnole · De Falla / Pujol — Plan de Estudio

App PWA de estudio para la **Primera Danza Española de *La Vie Brève*** de Manuel de Falla, en la transcripción para dos guitarras de Emilio Pujol (Éd. Max Eschig, 1957).

**→ [Abrir la app](https://cjlkaiser-cpu.github.io/danza-vida-breve/)**

---

## Qué es

Una herramienta de práctica instrumental pensada para guitarristas que estudian esta obra en dúo o en solitario. Funciona directamente en el navegador, sin instalación ni servidor.

La grabación de referencia incluye las dos guitarras separadas mediante **ICA** (*Independent Component Analysis*), lo que permite escuchar cada voz de forma independiente mientras se sigue la partitura.

---

## Características

### Partitura sincronizada (Score Player)
- La partitura está dividida en 14 páginas con **235 compases anotados** con su tiempo exacto en la grabación
- Un rectángulo amarillo sigue el compás activo en tiempo real mientras suena el audio
- **Click / tap en un compás** → el audio salta a ese punto y comienza a reproducir
- Las páginas cambian automáticamente mientras se reproduce
- **Loop A-B por compás**: pulsa ⟳ Loop, haz click en el compás inicial (marcador verde) y luego en el final (azul) → la grabación repite ese fragmento en bucle. ✕ Borrar para cancelar
- Seekbar propia en la sección de partitura para navegar por la grabación

### Grabación de referencia
- Reproductor de audio compacto con barra de progreso y seek
- Selector de fuente: **Ambas** · **G. I** · **G. II** (pistas separadas por ICA)
- **Waveform** de la forma de onda sobre el timeline A/B para ajustar puntos de loop con precisión
- Bucle A/B con handles arrastrables y botones de marcado manual
- Control de velocidad de reproducción (50 % – 130 %) conservando el tono

### Teclado (escritorio)
- **Espacio** — reproducir / pausar
- **← →** — navegar entre secciones

### Metrónomo
- Metrónomo integrado con slider y presets: 60 · 72 · **96 ♩** · 108 · 120 BPM
- Tap tempo y detección automática de BPM (requiere servidor local)
- Historial de sesiones de tempo por sección

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

Todas las funciones principales funcionan abriendo `index.html` directamente en el navegador (`file://`). Solo el detector automático de BPM requiere servir los archivos por HTTP.

Para lanzar un servidor local rápido:

```bash
cd /ruta/al/proyecto
python3 -m http.server 8504
# Abrir http://localhost:8504
```

---

## Herramienta de anotación de compases

`score-player-test.html` es una herramienta standalone para re-anotar o afinar los tiempos de los compases en la partitura. Útil si se quiere corregir el timing del rectángulo de seguimiento.

Para usarla localmente:

```bash
# En la carpeta del proyecto:
./score-player.command      # lanza servidor en puerto 7777 y abre el navegador
# — o manualmente —
python3 -m http.server 7777
# Abrir http://localhost:7777/score-player-test.html
```

Flujo de trabajo:
1. Carga la grabación (ambas guitarras o por separado)
2. En modo **Anotar**, haz click en cada compás en el momento exacto en que suena
3. **Exportar JSON** genera el fichero con todos los puntos
4. Sustituye el contenido de `js/annotations-data.js` con los nuevos datos

---

## Estructura

```
├── index.html
├── score-player-test.html   # Herramienta de anotación de compases
├── score-player.command     # Lanzador local para la herramienta de anotación
├── css/
│   └── styles.css
├── js/
│   ├── data.js              # 14 secciones con startTime, imagen y análisis
│   ├── annotations-data.js  # 235 compases anotados: {page, time, x, y}
│   ├── score-player.js      # Score player: RAF tick, highlight, loop A-B
│   ├── app.js               # Lógica principal de la app
│   └── waveforms.js         # Peaks pre-computados (1200 pts × 3 fuentes)
├── media/
│   ├── danza-vida-breve-1080p.mp4   # Ambas guitarras (246 s)
│   ├── guitar1.mp3                  # Guitarra I aislada (ICA)
│   └── guitar2.mp3                  # Guitarra II aislada (ICA)
└── img/
    └── danza_page-01.png … danza_page-14.png
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
