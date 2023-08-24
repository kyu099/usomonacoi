const ctx = canvas.getContext("2d");
const share = document.getElementById("sharebutton");
const hcabinet = document.getElementById("hcabinet");
const vcabinet = document.getElementById("vcabinet");
const waitings = document.getElementById("waitings");

let players = [1, 1, 1, 1];
let waiting = [];
let cabinets = [];

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

function drawCabinet(ctx, x, y, direction) {
    if(direction == "v"){
        ctx.fillRect(x-90, y-120, 180, 240);
    }
    if(direction == "h"){
        ctx.fillRect(x-120, y-90, 240, 180);
    }
    
}

function draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(i = 0; i < cabinets.length; i++) {
        ctx.fillStyle = "yellow";
        drawCabinet(ctx, cabinets[i].x, cabinets[i].y, cabinets[i].direction);
        if(cabinets[i].playing == 1){
            ctx.fillStyle = "red"
            drawCross(cabinets[i].x, cabinets[i].y, 80, ctx);
            console.log("drawCross");
        }
    }
    
    ctx.fillStyle = "red"

    for(i = 0; i < waiting.length; i++) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(waiting[i].x, waiting[i].y, 60, 0, 360 * Math.PI / 180, false);
        ctx.fill();
    }

    let playercount = 0;
    for(let i = 0; i < cabinets.length; i++) {
        if(cabinets[i].playing == 1){
            playercount++;
        }
    }
    ctx.fillStyle = "red"
    ctx.font = '72px sans-serif';
    ctx.fillText("空き:" + String(cabinets.length - playercount), 40, 1320);
    ctx.fillText("待ち:" + String(waiting.length), 40, 1400);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

draw(ctx);

canvas.addEventListener("click", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    for(let i = 0; i < cabinets.length; i++) {
        if((x-cabinets[i].x)**2 + (y-cabinets[i].y)**2 < 120**2){
            cabinets[i].playing = cabinets[i].playing * (-1);
        }
    }

    if(waitings.checked){
        let n = 1;
        for(i = 0; i < cabinets.length; i++) {
            if((x-cabinets[i].x)**2 + (y-cabinets[i].y)**2 < (60 + 120)**2){
                n = n * 0;
            }
        }
        if(n > 0) {
            waiting.push({x: x, y: y});
        }
    } else if(vcabinet.checked){
        let n = 1;
        for(i = 0; i < cabinets.length; i++) {
            if((x-cabinets[i].x)**2 + (y-cabinets[i].y)**2 < (120 + 120)**2){
                n = n * 0;
            }
        }
        if(n > 0) {
            cabinets.push({x: x, y: y, direction: "v", playing: -1});
        }
    } else if(hcabinet.checked){
        let n = 1;
        for(i = 0; i < cabinets.length; i++) {
            if((x-cabinets[i].x)**2 + (y-cabinets[i].y)**2 < (120 + 120)**2){
                n = n * 0;
            }
        }
        if(n > 0) {
            cabinets.push({x: x, y: y, direction: "h", playing: -1});
        }
    }
    draw(ctx);
    console.log(cabinets);
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