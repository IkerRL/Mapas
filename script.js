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
        
        // Guardamos la imagen en el elemento para leerla luego
        item.setAttribute('data-img', randomSkin);
        
        item.innerHTML = `<img src="${randomSkin}">`;
        itemsContainer.appendChild(item);
    }
}

playBtn.addEventListener('click', () => {
    lobby.style.display = 'none';
    roulette.style.display = 'block';

    setTimeout(() => {
        // Apuntamos a la caja 80 como objetivo
        const winningIdx = 80; 
        const centerOffset = roulette.offsetWidth / 2;
        const landingPos = (winningIdx * itemWidth) - centerOffset + (itemWidth / 2);
        
        // Extra aleatorio (mantenemos un margen para que no baile demasiado)
        const randomExtra = Math.floor(Math.random() * (itemWidth * 0.8)) - (itemWidth * 0.4);

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                // LÓGICA DE MAYORÍA DE PORCENTAJE
                const style = window.getComputedStyle(itemsContainer);
                const matrix = new WebKitCSSMatrix(style.transform);
                const currentTranslateX = Math.abs(matrix.m41);
                
                // Calculamos el punto exacto donde cae la línea roja en la tira de imágenes
                const pointOfSelection = currentTranslateX + centerOffset;
                
                // Math.floor nos da la caja que tiene la mayor parte de su cuerpo bajo la línea
                const realIdx = Math.floor(pointOfSelection / itemWidth);
                
                const allItems = document.querySelectorAll('.item');
                const safeIdx = Math.max(0, Math.min(realIdx, allItems.length - 1));
                
                // Leemos la imagen de la caja ganadora
                const finalMap = allItems[safeIdx].getAttribute('data-img');

                // Ocultar ruleta y mostrar premio
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
