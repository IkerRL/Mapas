const itemsContainer = document.getElementById('items');
const playBtn = document.getElementById('playBtn');
const lobby = document.getElementById('lobby');
const roulette = document.getElementById('roulette-container');
const rewardDisplay = document.getElementById('reward-display');
const winnerImg = document.getElementById('winner-img');

const itemWidth = 160;
const repetitions = 15; // Cuántas veces repetimos el bloque del 1 al 12

const skins = [
    'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png',   // 1
    'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png',  // 2
    'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png',  // 3
    'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png', // 4
    'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png', // 5
    'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png', // 6
    'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png',// 7
    'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png',   // 8
    'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png',   // 9
    'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png',  // 10
    'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png',   // 11
    'https://static.wikia.nocookie.net/valorant/images/6/6f/Loading_Screen_Corrode.png'  // 12
];

function init() {
    itemsContainer.innerHTML = '';
    // Circuito ordenado: 1, 2, 3... 12 -> 1, 2, 3... 12
    for (let r = 0; r < repetitions; r++) {
        skins.forEach((url, index) => {
            const item = document.createElement('div');
            item.className = 'item';
            // Guardamos la URL directamente en la caja
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
        // Apuntamos a una caja lejana (ej: la 100)
        const winningIdx = 100; 
        const centerOffset = roulette.offsetWidth / 2;
        const landingPos = (winningIdx * itemWidth) - centerOffset + (itemWidth / 2);
        
        // El "empujón" aleatorio para que no sea estático
        const randomExtra = Math.floor(Math.random() * (itemWidth * 0.8)) - (itemWidth * 0.4);

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                // DETECTOR: Miramos qué caja está bajo la línea roja
                const style = window.getComputedStyle(itemsContainer);
                const matrix = new WebKitCSSMatrix(style.transform);
                const currentX = Math.abs(matrix.m41);
                
                // Punto exacto de la línea roja
                const pointOfSelection = currentX + centerOffset;
                // Índice de la caja (0, 1, 2, 3...)
                const finalIdx = Math.floor(pointOfSelection / itemWidth);
                
                const allItems = document.querySelectorAll('.item');
                const winnerBox = allItems[finalIdx];
                const winnerMap = winnerBox.getAttribute('data-img');

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
