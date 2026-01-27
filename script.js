const itemsContainer = document.getElementById('items');
const playBtn = document.getElementById('playBtn');
const lobby = document.getElementById('lobby');
const roulette = document.getElementById('roulette-container');
const rewardDisplay = document.getElementById('reward-display');
const winnerImg = document.getElementById('winner-img');

const itemWidth = 160;
const totalSpinItems = 100;

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

let itemsOrder = [];

function init() {
    itemsContainer.innerHTML = '';
    itemsOrder = [];
    for (let i = 0; i < totalSpinItems; i++) {
        const randomSkin = skins[Math.floor(Math.random() * skins.length)];
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `<img src="${randomSkin}">`;
        itemsContainer.appendChild(item);
        itemsOrder.push(randomSkin);
    }
}

playBtn.addEventListener('click', () => {
    lobby.style.display = 'none';
    roulette.style.display = 'block';

    setTimeout(() => {
        const winningIdx = 80; 
        const landingPos = (winningIdx * itemWidth) - (roulette.offsetWidth / 2) + (itemWidth / 2);
        const randomExtra = Math.floor(Math.random() * 80) - 40;

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                // AQUÍ ESTABA EL FALLO: Ahora la línea está activa (sin las barras //)
                roulette.style.display = 'none'; 
                
                winnerImg.src = itemsOrder[winningIdx];
                rewardDisplay.style.display = 'flex'; 
            }, 500);
        }, { once: true });
    }, 100);
});

playBtn.addEventListener('click', () => {
    lobby.style.display = 'none';
    roulette.style.display = 'block';

    setTimeout(() => {
        // 1. Elegimos un destino lejano (entre la caja 70 y 90)
        const winningIdx = Math.floor(Math.random() * 20) + 70; 
        
        // 2. Calculamos la posición para que esa caja quede centrada
        const centerOffset = roulette.offsetWidth / 2;
        const landingPos = (winningIdx * itemWidth) - centerOffset + (itemWidth / 2);
        
        // 3. Añadimos un extra aleatorio limitado (máximo 40% del ancho de la caja)
        const randomExtra = Math.floor(Math.random() * (itemWidth * 0.8)) - (itemWidth * 0.4);

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                // CALCULAMOS QUÉ CAJA ESTÁ REALMENTE BAJO EL SELECTOR
                const style = window.getComputedStyle(itemsContainer);
                const matrix = new WebKitCSSMatrix(style.transform);
                const finalTransform = Math.abs(matrix.m41);
                
                // Esta es la cuenta matemática que no falla:
                const realWinnerIdx = Math.round((finalTransform + centerOffset - (itemWidth / 2)) / itemWidth);
                
                roulette.style.display = 'none';
                winnerImg.src = itemsOrder[realWinnerIdx]; 
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
