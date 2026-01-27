const itemsContainer = document.getElementById('items');
const playBtn = document.getElementById('playBtn');
const lobby = document.getElementById('lobby');
const roulette = document.getElementById('roulette-container');
const rewardDisplay = document.getElementById('reward-display');
const winnerImg = document.getElementById('winner-img');

const itemWidth = 160;
const totalSkins = 12; // Tus 12 imágenes
const repetitions = 10; // Veces que se repite el circuito 1-12

// El orden estricto de tus 12 mapas
const skins = [
    'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png',   // ID 1
    'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png',  // ID 2
    'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png',  // ID 3
    'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png', // ID 4
    'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png', // ID 5
    'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png', // ID 6
    'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png',// ID 7
    'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png',   // ID 8
    'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png',   // ID 9
    'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png',  // ID 10
    'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png',   // ID 11
    'https://static.wikia.nocookie.net/valorant/images/6/6f/Loading_Screen_Corrode.png'  // ID 12
];

function init() {
    itemsContainer.innerHTML = '';
    // CREAMOS EL CIRCUITO CERRADO (1 al 12 repetido)
    for (let r = 0; r < repetitions; r++) {
        skins.forEach((url, index) => {
            const item = document.createElement('div');
            item.className = 'item';
            
            // Asignamos el "código" (ID) basado en su posición 1-12
            const skinId = index + 1;
            item.setAttribute('data-id', skinId);
            item.setAttribute('data-img', url);
            
            item.innerHTML = `<img src="${url}">`;
            itemsContainer.appendChild(item);
        });
    }
}

playBtn.addEventListener('click', () => {
    lobby.style.display = 'none';
    roulette.style.display = 'block';

    setTimeout(() => {
        // Apuntamos a una caja lejana (ej: la caja 80 del circuito)
        const winningIdx = 80; 
        const centerOffset = roulette.offsetWidth / 2;
        const landingPos = (winningIdx * itemWidth) - centerOffset + (itemWidth / 2);
        
        // Empujón aleatorio para que no caiga siempre igual
        const randomExtra = Math.floor(Math.random() * (itemWidth * 0.8)) - (itemWidth * 0.4);

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                // --- DETECTOR DE CÓDIGO POR POSICIÓN ---
                const style = window.getComputedStyle(itemsContainer);
                const matrix = new WebKitCSSMatrix(style.transform);
                const currentTranslateX = Math.abs(matrix.m41);
                
                // Calculamos qué caja está bajo el centro exacto (línea roja)
                const pointOfSelection = currentTranslateX + centerOffset;
                const realIdx = Math.floor(pointOfSelection / itemWidth);
                
                const allItems = document.querySelectorAll('.item');
                const winnerBox = allItems[realIdx];
                
                // Leemos el "código" y la imagen de esa caja
                const winnerId = winnerBox.getAttribute('data-id');
                const winnerMap = winnerBox.getAttribute('data-img');

                console.log("Línea roja detecta código: " + winnerId);

                roulette.style.display = 'none';
                winnerImg.src = winnerMap; 
                rewardDisplay.style.display = 'flex';
            }, 500);
        }, { once: true });
    }, 100);
});

function resetGame() {
    rewardDisplay.style.display = 'none';
    roulette.style.display = 'none';
    lobby.style.display = 'block';
    itemsContainer.style.transition = 'none';
    itemsContainer.style.transform = 'translateX(0)';
    init();
}

window.onload = init;
