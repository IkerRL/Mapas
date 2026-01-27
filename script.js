const itemsContainer = document.getElementById('items');
const playBtn = document.getElementById('playBtn');
const lobby = document.getElementById('lobby');
const roulette = document.getElementById('roulette-container');
const rewardDisplay = document.getElementById('reward-display');
const winnerImg = document.getElementById('winner-img');

const itemWidth = 160;
// 12 mapas x 10 repeticiones = 120 cajas en total
const repetitions = 10; 

const skins = [
    { id: 1, url: 'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png' },
    { id: 2, url: 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png' },
    { id: 3, url: 'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png' },
    { id: 4, url: 'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png' },
    { id: 5, url: 'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png' },
    { id: 6, url: 'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png' },
    { id: 7, url: 'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png' },
    { id: 8, url: 'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png' },
    { id: 9, url: 'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png' },
    { id: 10, url: 'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png' },
    { id: 11, url: 'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png' },
    { id: 12, url: 'https://static.wikia.nocookie.net/valorant/images/6/6f/Loading_Screen_Corrode.png' }
];

function init() {
    itemsContainer.innerHTML = '';
    // CREAMOS EL CIRCUITO: Repetimos la serie 1-12 varias veces
    for (let r = 0; r < repetitions; r++) {
        skins.forEach((skin) => {
            const item = document.createElement('div');
            item.className = 'item';
            item.setAttribute('data-id', skin.id);
            item.setAttribute('data-img', skin.url);
            item.innerHTML = `<img src="${skin.url}">`;
            itemsContainer.appendChild(item);
        });
    }
}

playBtn.addEventListener('click', () => {
    lobby.style.display = 'none';
    roulette.style.display = 'block';

    setTimeout(() => {
        // Apuntamos a una zona lejana del circuito (ej. la repetición 7 u 8)
        const targetBox = 85; 
        const centerOffset = roulette.offsetWidth / 2;
        const landingPos = (targetBox * itemWidth) - centerOffset + (itemWidth / 2);
        
        // El "extra" ahora es más sutil para no saltar de caja bruscamente
        const randomExtra = Math.floor(Math.random() * (itemWidth * 0.6)) - (itemWidth * 0.3);

        itemsContainer.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        itemsContainer.style.transform = `translateX(-${landingPos + randomExtra}px)`;

        itemsContainer.addEventListener('transitionend', () => {
            setTimeout(() => {
                const style = window.getComputedStyle(itemsContainer);
                const matrix = new WebKitCSSMatrix(style.transform);
                const currentX = Math.abs(matrix.m41);
                
                // DETECTOR FÍSICO
                const pointOfSelection = currentX + centerOffset;
                const finalIdx = Math.floor(pointOfSelection / itemWidth);
                
                const allItems = document.querySelectorAll('.item');
                const winnerBox = allItems[finalIdx];

                // Extraemos la info de la caja que "toca" la línea
                const winnerMap = winnerBox.getAttribute('data-img');

                roulette.style.display = 'none';
                winnerImg.src = winnerMap; 
                rewardDisplay.style.display = 'flex';
            }, 500);
        }, { once: true });
    }, 100);
});
