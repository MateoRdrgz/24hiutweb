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
    await fetch('map-layers.json') // Ensure this file is in the same directory as index.html
        .then(response => response.json())
        .then(data => {
            for (let obj of data) {
                drawMap(obj.view);
            }

        })
        .catch(error => {
            console.error('Error loading the map data:', error);
        });
}