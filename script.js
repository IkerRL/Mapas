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

function init() {
    itemsContainer.innerHTML = '';
    for (let i = 0; i < totalSpinItems; i++) {
        const randomSkin = skins[Math.floor(Math.random() * skins.length)];
        const item = document.createElement('div');
        item.className = 'item';
        
        // TU IDEA: Guardamos la imagen directamente en la caja (el elemento HTML)
        item.setAttribute('data-img', randomSkin);
        
        item.innerHTML = `<img src="${randomSkin}">`;
        itemsContainer.appendChild(item);
    }
}

playBtn.addEventListener('click', () => {
    lobby.style.display = 'none';
    roulette.style.display = 'block';

    setTimeout(() => {
        // Apuntamos a la caja 80 como objetivo base
        const winningIdx = 80; 
        const centerOffset = roulette.offsetWidth / 2;
        const landingPos = (winningIdx * itemWidth) - centerOffset + (itemWidth / 2);
        
        // Variación aleatoria para que no caiga siempre igual
        const randomExtra = Math.floor(Math.random() * (itemWidth * 0.7)) - (itemWidth * 0.35);

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                // CALCULAMOS CUÁL ES LA CAJA FÍSICA EN EL CENTRO
                const style = window.getComputedStyle(itemsContainer);
                const matrix = new WebKitCSSMatrix(style.transform);
                const finalLeft = Math.abs(matrix.m41);
                
                // Buscamos el índice de la caja basándonos en la posición final real
                const realIdx = Math.round((finalLeft + centerOffset - (itemWidth / 2)) / itemWidth);
                const allItems = document.querySelectorAll('.item');
                
                // Sacamos la imagen de esa caja específica (la que está bajo el selector)
                const finalMap = allItems[realIdx].getAttribute('data-img');

                // Escondemos ruleta y mostramos el mapa ganador
                roulette.style.display = 'none';
                winnerImg.src = finalMap; 
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
