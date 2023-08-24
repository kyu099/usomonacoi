const ctx = canvas.getContext("2d");
const share = document.getElementById("sharebutton");

let players = [1, 1, 1, 1];
let waiting = [];

function countPlayers() {
    let x = 0;
    for (let i = 0; i < players.length; i++){
        x += players[i];
    }
    return x;
}

//バツ印を描画する関数
function drawCross(x, y, size, ctx) {
    ctx.beginPath();
    ctx.moveTo(x-size, y-size+size/10);
    ctx.lineTo(x-size+size/10, y-size);
    ctx.lineTo(x+size, y+size-size/10);
    ctx.lineTo(x+size-size/10, y+size);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x+size-size/10, y-size);
    ctx.lineTo(x+size, y-size+size/10);
    ctx.lineTo(x-size+size/10, y+size);
    ctx.lineTo(x-size, y+size-size/10);
    ctx.closePath();
    ctx.fill();
}

function draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, 180, 240);
    ctx.fillRect(0, 250, 180, 240);
    ctx.fillRect(0, 500, 180, 240);
    ctx.fillRect(0, 750, 180, 240);
    ctx.fillStyle = "red"

    if(players[0] == 1){
        drawCross(150, 120, 60, ctx);
    }
    if(players[1] == 1){
        drawCross(150, 120 + 250, 60, ctx);  
    }
    if(players[2] == 1){
        drawCross(150, 120 + 500, 60, ctx);
    }
    if(players[3] == 1){
        drawCross(150, 120 + 750, 60, ctx);
    }

    for(i = 0; i < waiting.length; i++) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(waiting[i].x, waiting[i].y, 60, 0, 360 * Math.PI / 180, false);
        ctx.fill();
    }
    ctx.fillStyle = "red"
    ctx.font = '64px sans-serif';
    ctx.fillText("空き:" + String((4 - countPlayers())/2), 360, 900);
    ctx.fillText("待ち:" + String(waiting.length), 360, 980);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

draw(ctx);

canvas.addEventListener("click", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    if(x < 200){
        if(y < 240) {players[0] = -players[0];}
        if(y > 250 && y < 490) {players[1] = -players[1];}
        if(y > 500 && y < 740) {players[2] = -players[2];}
        if(y > 750 && y < 990) {players[3] = -players[3];}
    } else {
        waiting.push({x: x, y: y});
    }
    draw(ctx);
    //console.log(x, y, waiting.length);
}, false);

share.onclick = () => {
    let text ="";
    let now = new Date();
    text = `#嘘モナ恋情報
${now.getHours()}時${now.getMinutes()}分
チュウニズム 空き${(4-countPlayers())/2} 待ち${waiting.length}
モナ恋情報共有はこちらから！
↓ ↓ ↓
https://kyu099.github.io/fmonacoi/`

    const cvs = document.getElementById("canvas");

    cvs.toBlob(function(blob) {
        const image = new File([blob], "tmp.png", {type: "image/png"});
        navigator.share({
            text: decodeURI(text),
            files: [image]
        }).then(() => {
            console.log("Share was successful.");
        }).catch((error) => {
            console.log("Sharing failed", error);
        });
    });
}