// Première Danse Espagnole · La Vie Brève — Manuel de Falla
// Transcription pour deux Guitares de Emilio Pujol (Éd. Max Eschig, 1957)
// Molto ritmico · ♩≈ 96 · 6ª corde en Ré

const PASAJES = [

    // ── APERTURA · Re menor ─────────────────────────────────────────────────────
    {
        numero: 1,
        titulo: "Apertura · pp Pizz.",
        compases: "pág. 1",
        imagen: "img/danza_page-01.png",
        texto: "Entrada pp con la 6ª cuerda afinada en Re. Guitarra II establece el pulso con Pizz.; Guitarra I introduce el tema en posiciones BV y bII. Atención al equilibrio dinámico: el acompañamiento debe quedar por debajo del tema.",
        seccion: "apertura",
        startTime: 0
    },
    {
        numero: 2,
        titulo: "Apertura · nat. dolce BII",
        compases: "pág. 2",
        imagen: "img/danza_page-02.png",
        texto: "Pizz. evoluciona a nat. con indicación dolce. Guitarra I lleva la melodía en BII con arpegios m·i·m. Guitarra II mantiene el bordón con apoyaturas. Controlar la claridad de las ornamentaciones.",
        seccion: "apertura",
        startTime: 18
    },
    {
        numero: 3,
        titulo: "Apertura · CII cresc. → f",
        compases: "pág. 3",
        imagen: "img/danza_page-03.png",
        texto: "Primera escalada dinámica pp → f. Guitarra II entra con CII. El ritmo síncopado debe ser preciso. Momento clave de sincronización entre ambas guitarras al llegar al f.",
        seccion: "apertura",
        startTime: 37
    },

    // ── DESARROLLO ─────────────────────────────────────────────────────────────
    {
        numero: 4,
        titulo: "Desarrollo · f CVII / XII",
        compases: "pág. 4",
        imagen: "img/danza_page-04.png",
        texto: "Primer clímax parcial en f. Guitarra I en posición XII con figuras en CVII (a·m·i·p). Pizz. en CV para Guitarra II. Trabajar el cambio rápido de posición XII → abierta.",
        seccion: "desarrollo",
        startTime: 56
    },
    {
        numero: 5,
        titulo: "Desarrollo · mf Pizz. CV",
        compases: "pág. 5",
        imagen: "img/danza_page-05.png",
        texto: "Alternancia mf → pp. Regreso al tema con Pizz. CV. Guitarra I lleva la melodía p·i. Guitarra II en VII. La dinámica en escalera descendente requiere control de arco.",
        seccion: "desarrollo",
        startTime: 74
    },
    {
        numero: 6,
        titulo: "Desarrollo · BV arpegiado",
        compases: "pág. 6",
        imagen: "img/danza_page-06.png",
        texto: "Sección arpegiada con dedeo p·i·p·i·p·m·p·i. Guitarra I lleva melodía sostenida sobre arpegio continuo. BV prolongado con cresc. Guitarra II con bordón grave.",
        seccion: "desarrollo",
        startTime: 90
    },
    {
        numero: 7,
        titulo: "Desarrollo · XII m·i·a",
        compases: "pág. 7",
        imagen: "img/danza_page-07.png",
        texto: "Posición XII sostenida. Arpegio m·i·m·i·m·i en Guitarra I. BV y cresc. hacia mf. Guitarra II con bordón en O y acompañamiento de corcheas. Atención al cresc. conjunto hacia la página siguiente.",
        seccion: "desarrollo",
        startTime: 108
    },

    // ── CLÍMAX · Con fuoco ──────────────────────────────────────────────────────
    {
        numero: 8,
        titulo: "Clímax · Pesante ma con fuoco",
        compases: "pág. 8",
        imagen: "img/danza_page-08.png",
        texto: "Cambio radical de carácter: pesante ma con fuoco. BII y BII alternados. Ambas guitarras en ritmo marcado al unísono. Acentos > sobre tiempos débiles. El pesante requiere peso de brazo sin tensión.",
        seccion: "climax",
        startTime: 126
    },
    {
        numero: 9,
        titulo: "Clímax · ff sempre ff",
        compases: "pág. 9",
        imagen: "img/danza_page-09.png",
        texto: "Clímax principal: sempre ff. Ritmo implacable con acentos en todos los tiempos. Guitarra II en BVI con acordes de bajo. Coordinación crítica: los sfz deben caer exactamente juntos.",
        seccion: "climax",
        startTime: 144
    },
    {
        numero: 10,
        titulo: "Clímax · marc. XII/VII",
        compases: "pág. 10",
        imagen: "img/danza_page-10.png",
        texto: "Continuación ff con marc. Guitarras en XII, VII, XVII, VII alternados — requiere desplazamiento veloz. BVII y BII. Guitarra II mantiene el ritmo de bordones. ff → sfz en los puntos de llegada.",
        seccion: "climax",
        startTime: 162
    },
    {
        numero: 11,
        titulo: "Clímax · Ritmico con brio",
        compases: "pág. 11",
        imagen: "img/danza_page-11.png",
        texto: "ff sempre ritmico con brio. Nuevo impulso enérgico. Súbito allegremente y pp en BII — caída dramática de dinámica que anuncia el retorno. Trabajar el contraste extremo ff → pp.",
        seccion: "climax",
        startTime: 178
    },

    // ── RETORNO Y CODA ──────────────────────────────────────────────────────────
    {
        numero: 12,
        titulo: "Retorno · allegremente",
        compases: "pág. 12",
        imagen: "img/danza_page-12.png",
        texto: "Retorno al material de apertura con carácter allegremente. Guitarra I recupera el arpegio m·i·m·i. f con cresc., BIII. El retorno debe sonar fresco, sin el peso del clímax anterior.",
        seccion: "coda",
        startTime: 196
    },
    {
        numero: 13,
        titulo: "Retorno · f escalada final",
        compases: "pág. 13",
        imagen: "img/danza_page-13.png",
        texto: "Escalada final desde f. Guitarra I con tresillos sobre posiciones altas. BIII. Guitarra II con quintillos en bajo. Dinámicas en crescendo continuo hacia el final.",
        seccion: "coda",
        startTime: 214
    },
    {
        numero: 14,
        titulo: "Coda · Più vivo · Final",
        compases: "pág. 14",
        imagen: "img/danza_page-14.png",
        texto: "Coda: più vivo. Cada nota con el pulgar (Guitarra I). BIX, BVII, BXIV. ff sfz con Pizz. rápido. La aceleración final debe ser controlada y conjunta. Acorde final en BXIV con ferma.",
        seccion: "coda",
        startTime: 230
    }
];
