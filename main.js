const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
let tile
const tileSize = 16;
let tileColumns;

// Load the tileset image
const tileset = new Image();
tileset.src = 'tileset.png'; // Ensure this file is in the same directory as index.html
// Function to draw a tile based on its ID
function drawTile(tileId, x, y) {
    const tilesetWidth = tileset.width;
    const columns = tilesetWidth / tileSize;
    tileColumns = columns;
    const sourceX = (tileId % columns) * tileSize;
    const sourceY = Math.floor(tileId / columns) * tileSize;
    context.drawImage(tileset, sourceX, sourceY, tileSize, tileSize, x, y, tileSize, tileSize);
}

// Function to draw the entire map
function drawMap(mapData) {
    for (let row = 0; row < mapData.length; row++) {
        for (let col = 0; col < mapData[row].length; col++) {
            const tileId = mapData[row][col];
            if(tileId !=-1)
                drawTile(tileId, col * tileSize, row * tileSize);

         }
    }
}

function clear() {
        context.fillStyle = 'white';
        context.fillRect(0, 0, 366, 366);
}

function drawText(text, x, y) {
        context.font = '12px Arial';
        context.fillStyle = 'black';
        context.fillText(text, x, y);
}


function formatTimestampToTime(timestamp) {
    // Créer un objet Date à partir du timestamp
    const date = new Date(timestamp);

    // Obtenir les composants de l'heure
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formater les composants pour les rendre lisibles
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Construire la chaîne de texte lisible
    const readableTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return readableTime;
}

tileset.onload = async () => {
    draw(await getUpdates());
    // Ensure this file is in the same directory as index.html
}


async function draw(json){
    clear();
    for (let obj of json.layers) {
        drawMap(obj.view);
    }



    //draw player
    const currentPlayer = json.player

    // const player = json.players
    const playerIds = {down:9114,up:9254,left:9394,right:9534}

    for (let player of json.players) {
        console.log(player.viewX)
        const refId = playerIds[player.lastDirection];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                drawTile(playerIds[player.lastDirection]+i+tileColumns*j,(player.viewX+i-1)*tileSize,(player.viewY+j-2)*tileSize);
            }
        }

        //player name
        if(player.id != currentPlayer.id)
                drawText(player.name, (player.viewX-1)*tileSize, (player.viewY-1.5)*tileSize)
    }


    //messages
    drawMessages(currentPlayer.messages);


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
        const json = await res.json();
        console.log(json)
        return json;
    }
    return null;
}

async function getUpdatesMove(position) {
    const res = await fetch("https://24hweb.iutv.univ-paris13.fr/server/move", {
        method: 'POST',
        headers: {
            "TeamPassword": "hN3iKNcI3",
            "TeamPlayerNb": 1,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "direction": position
        })
    });
    if (res.ok) {
        console.log(position)
        return await res.json();
    }

    return null;
}


const button = document.getElementById("sendButton")
const input = document.getElementById("messageInput");
button.addEventListener("click", sendMessage);

async function sendMessage() {
    const text = input.value;
    const res = await fetch("https://24hweb.iutv.univ-paris13.fr/server/say", {
        method: 'POST',
        headers: {
            "TeamPassword": "hN3iKNcI3",
            "TeamPlayerNb": 1,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "message": text
        })
    });
    if (res.ok) {
        console.log(position)
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
        draw(await getUpdatesMove("up"))

    }
    else if (e.keyCode == '40') {
        // down arrow
        draw(await getUpdatesMove("down"))
    }
    else if (e.keyCode == '37') {
        // left arrow
        draw(await getUpdatesMove("left"))
    }
    else if (e.keyCode == '39') {
        // right arrow
        draw(await getUpdatesMove("right"))
    }

}



const teamPassword = "hN3iKNcI3";
const teamPlayerNb = 1;

// URL du serveur WebSocket
const wsUrl = "wss://24hweb.iutv.univ-paris13.fr/server";

// Création de la connexion WebSocket
const ws = new WebSocket(wsUrl);

// Fonction pour envoyer un message d'enregistrement
function register() {
    const registerMessage = JSON.stringify({
        action: "register",
        teamPassword: teamPassword,
        teamPlayerNb: teamPlayerNb
    });
    ws.send(registerMessage);
}

// Gestion des événements de connexion WebSocket
ws.onopen = function() {
    console.log("WebSocket connection opened.");
    register();
};

// Gestion des messages reçus du serveur WebSocket
ws.onmessage = async function(event) {
    const message = event.data;
    // console.log("Message received from server:", message);

    if (message === "redraw") {
        // console.log("Redraw message received. Refreshing display.");
        draw(await getUpdates())

    }

    // Gestion de la fermeture de la connexion WebSocket
    ws.onclose = function() {
        console.log("WebSocket connection closed.");
    };
};



const messageList = document.getElementById("chatMessages")


function drawMessages(messages){
    messageList.innerHTML=""
    for (let message of messages) {
        let div = document.createElement("div");

        let name = document.createElement("span");
        name.innerText = message.name;
        div.appendChild(name);

        let date = document.createElement("span");
        date.innerText = "("+formatTimestampToTime(message.date)+") : ";
        div.appendChild(date);

        let messageSpan = document.createElement("span");
        messageSpan.innerText = message.text;
        div.appendChild(messageSpan);

        messageList.insertBefore(div, messageList.firstChild)
    }
}


