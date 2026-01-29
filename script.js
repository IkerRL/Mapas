const itemsContainer = document.getElementById('items');
const playBtn = document.getElementById('playBtn');
const lobby = document.getElementById('lobby');
const roulette = document.getElementById('roulette-container');
const rewardDisplay = document.getElementById('reward-display');
const winnerImg = document.getElementById('winner-img');

// CONFIGURACIÓN DEL AUDIO
const winSound = new Audio('partida.mp3'); 

const itemWidth = 160; 
const repetitions = 15; 

const skins = [
    'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png',   
    'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png',  
    'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png',  
    'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png', 
    'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png', 
    'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png', 
    'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png',
    'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png',   
    'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png',   
    'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png',  
    'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png',   
    'https://static.wikia.nocookie.net/valorant/images/6/6f/Loading_Screen_Corrode.png'  
];

function init() {
    itemsContainer.innerHTML = '';
    for (let r = 0; r < repetitions; r++) {
        skins.forEach((url) => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `<img src="${url}">`;
            itemsContainer.appendChild(item);
        });
    }
}

playBtn.addEventListener('click', () => {
    // 1. EL AZAR DECIDE PRIMERO
    const totalSkins = skins.length;
    const chosenIdx = Math.floor(Math.random() * totalSkins); 
    const winnerMapUrl = skins[chosenIdx];

    lobby.style.display = 'none';
    roulette.style.display = 'block';

    setTimeout(() => {
        const viewportWidth = roulette.offsetWidth;
        const centerOffset = viewportWidth / 2;
        
        // 2. VIAJE AL MAPA ELEGIDO
        const targetRepetition = repetitions - 2; 
        const absoluteWinningIdx = (targetRepetition * totalSkins) + chosenIdx;
        const landingPos = (absoluteWinningIdx * itemWidth) - centerOffset + (itemWidth / 2);
        
        // Margen de seguridad para que la flecha quede siempre centrada
        const safeMargin = itemWidth * 0.2; 
        const randomExtra = Math.floor(Math.random() * (safeMargin * 2)) - safeMargin;

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        // 3. EVENTO AL TERMINAR EL GIRO
        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                roulette.style.display = 'none';
                winnerImg.src = winnerMapUrl; 
                rewardDisplay.style.display = 'flex';

                // REPRODUCIR SONIDO DE VICTORIA
                winSound.currentTime = 0; // Resetear audio
                winSound.play().catch(e => console.log("Error al reproducir audio:", e));

            }, 500);
        }, { once: true });
    }, 50);
});

function resetGame() {
    rewardDisplay.style.display = 'none';
    roulette.style.display = 'none';
    lobby.style.display = 'block';
    itemsContainer.style.transition = 'none';
    itemsContainer.style.transform = 'translateX(0)';
    void itemsContainer.offsetWidth; 
}

window.onload = init;
