// CONFIGURACIÓN DE MAPAS DE VALORANT
const mapPool = [
    {
        name: 'Ascent',
        location: 'Venecia, Italia',
        url: 'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png',
        active: true
    },
    {
        name: 'Bind',
        location: 'Rabat, Marruecos',
        url: 'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png',
        active: true
    },
    {
        name: 'Breeze',
        location: 'Triángulo de las Bermudas, Océano Atlántico',
        url: 'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png',
        active: true
    },
    {
        name: 'Fracture',
        location: 'Santa Fe, Nuevo México, EE. UU.',
        url: 'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png',
        active: true
    },
    {
        name: 'Haven',
        location: 'Timbu, Bután',
        url: 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png',
        active: true
    },
    {
        name: 'Icebox',
        location: 'Isla Bennett, Rusia',
        url: 'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png',
        active: true
    },
    {
        name: 'Lotus',
        location: 'Ghats occidentales, India',
        url: 'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png',
        active: true
    },
    {
        name: 'Pearl',
        location: 'Lisboa, Portugal',
        url: 'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png',
        active: true
    },
    {
        name: 'Split',
        location: 'Tokio, Japón',
        url: 'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png',
        active: true
    },
    {
        name: 'Sunset',
        location: 'Los Ángeles, California, EE. UU.',
        url: 'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png',
        active: true
    },
    {
        name: 'Abyss',
        location: 'Jan Mayen, Noruega',
        url: 'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png',
        active: true
    },
    {
        name: 'District',
        location: 'Sarajevo, Bosnia y Herzegovina',
        url: 'https://static.wikia.nocookie.net/valorant/images/6/6f/Loading_Screen_Corrode.png',
        active: true
    },
    {
        name: 'Summit',
        location: 'Montañas de China, China',
        url: 'https://wiki.playvalorant.com/en-us/images/thumb/Loading_Screen_Summit.png/550px-Loading_Screen_Summit.png?33fee',
        active: true
    }
];

// ELEMENTOS DOM
const itemsContainer = document.getElementById('items');
const playBtn = document.getElementById('playBtn');
const lobby = document.getElementById('lobby');
const roulette = document.getElementById('roulette-container');
const rewardDisplay = document.getElementById('reward-display');
const winnerImg = document.getElementById('winner-img');
const winnerName = document.getElementById('winner-name');
const winnerLocation = document.getElementById('winner-location');
const muteBtn = document.getElementById('muteBtn');

// CONFIGURACIÓN DE AUDIO
const winSound = new Audio('partida.mp3');
let isMuted = false;
let audioCtx = null;

const itemWidth = 180; // Debe coincidir con el min-width del CSS de .item
let isSpinning = false;
let lastCenteredIndex = -1;

// MULTIJUGADOR MQTT
let mqttClient = null;
let mqttTopic = '';
let isApplyingSyncState = false;
const MSG_HISTORIAL = new Set();
let isHost = true;

// Inicializa el AudioContext para los sonidos de tick
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Reproduce un tick sintético usando Web Audio API
function playTickSound() {
    if (isMuted) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);

        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
        console.warn("Error reproducido el tick de audio:", e);
    }
}

// Reproduce la música de partida encontrada
function playWinSound() {
    if (isMuted) return;
    winSound.currentTime = 0;
    winSound.play().catch(e => console.log("Error al reproducir audio de victoria:", e));
}

// Alterna el estado de silenciado
function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        muteBtn.innerHTML = `
            <svg id="sound-icon" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.48,12.43 16.5,12.22 16.5,12Z" />
            </svg>
        `;
        winSound.muted = true;
    } else {
        muteBtn.innerHTML = `
            <svg id="sound-icon" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
        `;
        winSound.muted = false;
        initAudio();
    }
}

// Dibuja la rejilla de selección de mapas en el lobby
function renderMapPool() {
    const mapPoolContainer = document.getElementById('map-pool');
    mapPoolContainer.innerHTML = '';

    mapPool.forEach((map, index) => {
        const card = document.createElement('div');
        card.className = `map-card ${map.active ? 'active' : ''}`;
        card.dataset.index = index;

        card.innerHTML = `
            <img class="map-card-img" src="${map.url}" alt="${map.name}">
            <div class="map-card-overlay">
                <span class="map-card-name">${map.name}</span>
            </div>
            <div class="map-card-checkbox"></div>
        `;

        card.addEventListener('click', () => {
            if (isApplyingSyncState) return;
            map.active = !map.active;
            card.classList.toggle('active', map.active);
            updateLobbyState();
            broadcastState();
        });

        mapPoolContainer.appendChild(card);
    });
}

// Actualiza el estado del botón START y los mensajes informativos
function updateLobbyState() {
    const activeCount = mapPool.filter(m => m.active).length;
    const lobbyStatus = document.getElementById('lobby-status');

    if (activeCount < 2) {
        playBtn.disabled = true;
        lobbyStatus.textContent = 'ACTIVA AL MENOS 2 MAPAS PARA EL SORTEO';
    } else {
        playBtn.disabled = false;
        lobbyStatus.textContent = '';
    }
}

// Escucha del loop de animación para reproducir sonido de tick al pasar por el selector central
function checkTick() {
    if (!isSpinning) return;

    const style = window.getComputedStyle(itemsContainer);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const currentX = matrix.m41; // Transformación actual en X (negativa)

    const viewportWidth = roulette.offsetWidth;
    const centerOffset = viewportWidth / 2;

    // Posición del selector con respecto al inicio del contenedor items
    const relativeCenter = centerOffset - currentX;

    // Calculamos qué elemento está justo cruzando la línea
    const currentCenteredIndex = Math.floor(relativeCenter / itemWidth);

    if (currentCenteredIndex !== lastCenteredIndex && currentCenteredIndex >= 0) {
        lastCenteredIndex = currentCenteredIndex;
        playTickSound();
    }

    if (isSpinning) {
        requestAnimationFrame(checkTick);
    }
}

// EVENTO DE INICIO DEL GIRO
playBtn.addEventListener('click', () => {
    if (isApplyingSyncState) return;
    const activeMaps = mapPool.filter(m => m.active);
    if (activeMaps.length < 2) return;

    initAudio();

    const totalActive = activeMaps.length;
    const chosenIdx = Math.floor(Math.random() * totalActive);

    const targetItemsCount = 150;
    const reps = Math.ceil(targetItemsCount / totalActive);

    publishMQTT({ type: 'SPIN', chosenIdx, reps });
    aplicarSpin(chosenIdx, reps);
});

function aplicarSpin(chosenIdx, reps) {
    const activeMaps = mapPool.filter(m => m.active);
    if (activeMaps.length < 2) return;

    const totalActive = activeMaps.length;
    const winnerMap = activeMaps[chosenIdx];

    // Ocultar Lobby y mostrar contenedor de la ruleta
    lobby.style.display = 'none';
    roulette.style.display = 'block';

    itemsContainer.innerHTML = '';

    for (let r = 0; r < reps; r++) {
        activeMaps.forEach((map) => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <img class="item-img" src="${map.url}" alt="${map.name}">
                <div class="item-overlay">
                    <span class="item-name-overlay">${map.name}</span>
                </div>
            `;
            itemsContainer.appendChild(item);
        });
    }

    // Reiniciamos posición sin transición
    itemsContainer.style.transition = 'none';
    itemsContainer.style.transform = 'translateX(0)';
    void itemsContainer.offsetWidth; // Forzar reflow

    // Esperar un frame y comenzar el giro de ruleta
    setTimeout(() => {
        const viewportWidth = roulette.offsetWidth;
        const centerOffset = viewportWidth / 2;

        const targetRepetition = reps - 2;
        const absoluteWinningIdx = (targetRepetition * totalActive) + chosenIdx;

        const landingPos = (absoluteWinningIdx * itemWidth) - centerOffset + (itemWidth / 2);

        // Sin desviación para garantizar sincronización visual en todas las pantallas
        const finalLandingPos = landingPos;

        // Activar control de sonido por animación
        isSpinning = true;
        lastCenteredIndex = -1;
        requestAnimationFrame(checkTick);

        // Disparar transición CSS
        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${finalLandingPos}px)`;

        // Al terminar el giro
        itemsContainer.addEventListener('transitionend', () => {
            isSpinning = false; // Detener chequeos de tick

            setTimeout(() => {
                roulette.style.display = 'none';

                // Mostrar pantalla de recompensa
                winnerImg.src = winnerMap.url;
                winnerName.textContent = winnerMap.name;
                winnerLocation.textContent = winnerMap.location;

                rewardDisplay.style.display = 'flex';

                // Reproducir sonido de victoria
                playWinSound();
            }, 600);
        }, { once: true });
    }, 50);
}

// Reiniciar juego al Lobby
function resetGame(fromSync = false) {
    rewardDisplay.style.display = 'none';
    roulette.style.display = 'none';
    lobby.style.display = 'block';

    itemsContainer.style.transition = 'none';
    itemsContainer.style.transform = 'translateX(0)';
    void itemsContainer.offsetWidth;

    if (!fromSync && !isApplyingSyncState) {
        publishMQTT({ type: 'RESET' });
    }
}

// CONTROLES DE ACTIVACIÓN DEL POOL COMPLETO
document.getElementById('selectAllBtn').addEventListener('click', () => {
    if (isApplyingSyncState) return;
    mapPool.forEach(m => m.active = true);
    document.querySelectorAll('.map-card').forEach(c => c.classList.add('active'));
    updateLobbyState();
    broadcastState();
});

document.getElementById('deselectAllBtn').addEventListener('click', () => {
    if (isApplyingSyncState) return;
    mapPool.forEach(m => m.active = false);
    document.querySelectorAll('.map-card').forEach(c => c.classList.remove('active'));
    updateLobbyState();
    broadcastState();
});

document.getElementById('currentRotationBtn').addEventListener('click', () => {
    if (isApplyingSyncState) return;
    const rotacionActual = ['Ascent', 'Breeze', 'Haven', 'Lotus', 'Summit', 'Sunset', 'Split'];
    mapPool.forEach((m, index) => {
        m.active = rotacionActual.includes(m.name);
        const card = document.querySelector(`.map-card[data-index="${index}"]`);
        if (card) {
            card.classList.toggle('active', m.active);
        }
    });
    updateLobbyState();
    broadcastState();
});

// ==========================================================================
// SINCRONIZACIÓN EN VIVO (MQTT VIA HIVEMQ)
// ==========================================================================
function updateConnectionStatus(status, roomName = '') {
    const statusText = document.getElementById('sync-status');
    const consoleText = document.getElementById('consoleSyncStatusText');
    const consolePulse = document.getElementById('consoleSyncStatusPulse');

    if (status === 'connecting') {
        if (statusText) { statusText.innerText = 'CONECTANDO...'; statusText.style.color = 'var(--v-cyan)'; }
        if (consoleText) { consoleText.innerText = 'CONECTANDO...'; consoleText.className = 'status-badge status-connecting'; }
        if (consolePulse) { consolePulse.className = 'pulse-icon yellow'; }
    } else if (status === 'connected') {
        if (statusText) { statusText.innerText = `SALA: ${roomName}`; statusText.style.color = '#4CAF50'; }
        if (consoleText) { consoleText.innerText = `CONECTADO: ${roomName}`; consoleText.className = 'status-badge status-connected'; }
        if (consolePulse) { consolePulse.className = 'pulse-icon green'; }
    } else {
        if (statusText) { statusText.innerText = 'DESCONECTADO'; statusText.style.color = 'var(--v-gray)'; }
        if (consoleText) { consoleText.innerText = 'DESCONECTADO'; consoleText.className = 'status-badge status-disconnected'; }
        if (consolePulse) { consolePulse.className = 'pulse-icon red'; }
    }
}

function connectMQTT(roomName) {
    if (mqttClient) {
        mqttClient.end(true);
        mqttClient = null;
    }

    const broker = 'wss://broker.hivemq.com:8884/mqtt';
    const topicBase = 'val_roulette_sync';
    mqttTopic = `${topicBase}/${roomName.trim()}`;

    updateConnectionStatus('connecting');

    if (typeof mqtt === 'undefined') {
        console.error('MQTT.js no está cargado.');
        return;
    }

    mqttClient = mqtt.connect(broker, {
        clientId: 'roulette_' + Math.random().toString(16).slice(2, 10),
        clean: true,
        reconnectPeriod: 3000,
    });

    mqttClient.on('connect', () => {
        updateConnectionStatus('connected', roomName);
        mqttClient.subscribe(mqttTopic, { qos: 0 });
        publishMQTT({ type: 'REQUEST_STATE' });
    });

    mqttClient.on('message', (topic, payload) => {
        try {
            const msg = JSON.parse(payload.toString());
            if (msg._id && MSG_HISTORIAL.has(msg._id)) return;
            MSG_HISTORIAL.add(msg._id);

            if (msg.type === 'REQUEST_STATE') {
                if (isHost) broadcastState();
            } else if (msg.type === 'STATE_UPDATE') {
                isApplyingSyncState = true;
                aplicarEstado(msg.state);
                isApplyingSyncState = false;
            } else if (msg.type === 'SPIN') {
                isApplyingSyncState = true;
                aplicarSpin(msg.chosenIdx, msg.reps);
                isApplyingSyncState = false;
            } else if (msg.type === 'RESET') {
                isApplyingSyncState = true;
                resetGame(true);
                isApplyingSyncState = false;
            }
        } catch (e) {
            console.error('Error procesando MQTT', e);
        }
    });
}

function publishMQTT(msg) {
    if (!mqttClient || !mqttClient.connected) return;
    const id = Math.random().toString(36).slice(2, 10);
    msg._id = id;
    MSG_HISTORIAL.add(id);
    if (MSG_HISTORIAL.size > 200) {
        const first = MSG_HISTORIAL.values().next().value;
        MSG_HISTORIAL.delete(first);
    }
    mqttClient.publish(mqttTopic, JSON.stringify(msg), { qos: 0, retain: false });
}

function broadcastState() {
    if (isApplyingSyncState) return;
    if (!mqttClient || !mqttClient.connected) return;
    
    const mapActiveState = mapPool.map(m => m.active);
    publishMQTT({ type: 'STATE_UPDATE', state: { mapActiveState } });
}

function aplicarEstado(state) {
    if (state.mapActiveState) {
        state.mapActiveState.forEach((isActive, index) => {
            if(mapPool[index]) mapPool[index].active = isActive;
        });
        
        document.querySelectorAll('.map-card').forEach((c, index) => {
            if (mapPool[index]) {
                c.classList.toggle('active', mapPool[index].active);
            }
        });
        updateLobbyState();
    }
}

// Funciones de UI de la Consola Admin
function toggleAdminConsole(show) {
    const consoleEl = document.getElementById('admin-console');
    if (!consoleEl) return;
    
    if (show === undefined) {
        consoleEl.classList.toggle('active');
    } else if (show) {
        consoleEl.classList.add('active');
    } else {
        consoleEl.classList.remove('active');
    }
}

// Carga Inicial
window.onload = () => {
    renderMapPool();
    updateLobbyState();
    muteBtn.addEventListener('click', toggleMute);
    
    // Abrir consola desde el icono de Valorant original
    const syncTrigger = document.getElementById('sync-trigger');
    if (syncTrigger) {
        syncTrigger.addEventListener('click', () => toggleAdminConsole(true));
    }
    
    // Abrir consola desde el nuevo botón inferior
    const syncTriggerBtn = document.getElementById('sync-trigger-btn');
    if (syncTriggerBtn) {
        syncTriggerBtn.addEventListener('click', () => toggleAdminConsole(true));
    }
    
    // Cerrar consola
    const adminCloseBtn = document.getElementById('admin-close-btn');
    if (adminCloseBtn) {
        adminCloseBtn.addEventListener('click', () => toggleAdminConsole(false));
    }
    
    // Botón de Conectar en la consola
    const consoleBtnConnect = document.getElementById('consoleBtnConnect');
    if (consoleBtnConnect) {
        consoleBtnConnect.addEventListener('click', () => {
            const roomInput = document.getElementById('consoleSyncRoom');
            const hostSelect = document.getElementById('consoleHostToggle');
            
            const room = roomInput ? roomInput.value.trim() : '';
            if (!room) {
                alert('Introduce un nombre de sala válido.');
                return;
            }
            
            isHost = (hostSelect && hostSelect.value === 'true');
            connectMQTT(room);
            toggleAdminConsole(false);
        });
    }
};
