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
    roulette.style.display = 'none';

    setTimeout(() => {
        const winningIdx = 80; 
        const landingPos = (winningIdx * itemWidth) - (roulette.offsetWidth / 2) + (itemWidth / 2);
        const randomExtra = Math.floor(Math.random() * 80) - 40;

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                // ELIMINA O COMENTA ESTA LÍNEA -> roulette.style.display = 'none'; 
                
                winnerImg.src = itemsOrder[winningIdx];
                rewardDisplay.style.display = 'flex'; // Esto muestra el premio encima
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
