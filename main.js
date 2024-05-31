const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const tileSize = 16;

// Load the tileset image
const tileset = new Image();
tileset.src = 'tileset.png'; // Ensure this file is in the same directory as index.html

// Function to draw a tile based on its ID
function drawTile(tileId, x, y) {
    const tilesetWidth = tileset.width;
    const columns = tilesetWidth / tileSize;
    const sourceX = (tileId % columns) * tileSize;
    const sourceY = Math.floor(tileId / columns) * tileSize;
    context.drawImage(tileset, sourceX, sourceY, tileSize, tileSize, x, y, tileSize, tileSize);
}

// Function to draw the entire map
function drawMap(mapData) {
    for (let row = 0; row < mapData.length; row++) {
        for (let col = 0; col < mapData[row].length; col++) {
            const tileId = mapData[row][col];
            drawTile(tileId, col * tileSize, row * tileSize);
        }
    }
}

tileset.onload = async () => {
    draw(await getUpdates());
    // Ensure this file is in the same directory as index.html
}


async function draw(json){
    for (let obj of json.layers) {
        drawMap(obj.view);
    }
}

async function getUpdates(){
    const res = await fetch("https://24hweb.iutv.univ-paris13.fr/server/get-update",{
        method: 'GET',
        headers:{
            TeamPassword:"hN3iKNcI3",
            TeamPlayerNb:1
        }
    })

    if(res.ok){
        return await res.json();
    }
    return null;
}

async function getUpdatesMove(position){
    const res = await fetch("https://24hweb.iutv.univ-paris13.fr/server/move",{
        method: 'POST',
        headers:{
            TeamPassword:"hN3iKNcI3",
            TeamPlayerNb:1,
            "Content-Type": "application/json",
        },
        body: {
            direction :position
        }
    })

    if(res.ok){
        return await res.json();
    }
    return null;
}


document.onkeydown = checkKey;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        draw( await getUpdatesMove("up"))

    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
        // left arrow
    }
    else if (e.keyCode == '39') {
        // right arrow
    }

}
console.log(await getUpdatesMove('up'))