const ctx = canvas.getContext("2d");
const share = document.getElementById("sharebutton");
const undo = document.getElementById("undo");
const hcabinet = document.getElementById("hcabinet");
const vcabinet = document.getElementById("vcabinet");
const waitings = document.getElementById("waitings");

let waiting = [];
let cabinets = [];
let order = [];

//プレイ中の人数を数える関数
function countPlayers() {
    let playercount = 0;
    for(let i = 0; i < cabinets.length; i++) {
        if(cabinets[i].playing == 1){
            playercount++;
        }
    }
    return playercount;
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

//筐体を描画する関数
function drawCabinet(ctx, x, y, direction) {
    if(direction == "v"){
        ctx.fillRect(x-75, y-100, 150, 200);
    }
    if(direction == "h"){
        ctx.fillRect(x-100, y-75, 200, 150);
    }
}

//canvas全体を描画する関数
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
        ctx.arc(waiting[i].x, waiting[i].y, 50, 0, 360 * Math.PI / 180, false);
        ctx.fill();
    }

    ctx.fillStyle = "red"
    ctx.font = '64px sans-serif';
    ctx.fillText("空き:" + String(cabinets.length - countPlayers()), 40, 1190);
    ctx.fillText("待ち:" + String(waiting.length), 40, 1260);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

//重なり判定の関数
//重なっている時trueを返す
function checkoverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    if((Math.abs(x1-x2) < (w1+w2)/2) && (Math.abs(y1-y2) < (h1+h2)/2)){
        return true;
    } else {
        return false;
    }
}

draw(ctx);

canvas.addEventListener("click", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    for(let i = 0; i < cabinets.length; i++) {
        if(cabinets[i].direction == "v"){
            if(checkoverlap(x, y, 0, 0, cabinets[i].x, cabinets[i].y, 150, 200)){
                cabinets[i].playing = cabinets[i].playing * (-1);
            }
        } else if(cabinets[i].direction == "h"){
            if(checkoverlap(x, y, 0, 0, cabinets[i].x, cabinets[i].y, 200, 150)){
                cabinets[i].playing = cabinets[i].playing * (-1);
            }
        }
    }

    if(waitings.checked){
        let n = 1;
        for(i = 0; i < cabinets.length; i++) {
            if(cabinets[i].direction == "v"){
                if(checkoverlap(x, y, 0, 0, cabinets[i].x, cabinets[i].y, 150, 200)){
                    n = n * 0;
                }
            } else if(cabinets[i].direction == "h"){
                if(checkoverlap(x, y, 0, 0, cabinets[i].x, cabinets[i].y, 200, 150)){
                    n = n * 0;
                }
            }
        }
        if(n > 0) {
            waiting.push({x: x, y: y});
            order.push("waiting");
        }
    } else if(vcabinet.checked){
        let n = 1;
        for(i = 0; i < cabinets.length; i++) {
            if(cabinets[i].direction == "v"){
                if(checkoverlap(x, y, 150, 200, cabinets[i].x, cabinets[i].y, 150+5, 200+5)){
                    n = n * 0;
                }
            } else if(cabinets[i].direction == "h"){
                if(checkoverlap(x, y, 150, 200, cabinets[i].x, cabinets[i].y, 200+5, 150+5)){
                    n = n * 0;
                }
            }
        }
        if(n > 0) {
            cabinets.push({x: x, y: y, direction: "v", playing: -1});
            order.push("cabinet");
        }
    } else if(hcabinet.checked){
        let n = 1;
        for(i = 0; i < cabinets.length; i++) {
            if(cabinets[i].direction == "v"){
                if(checkoverlap(x, y, 200, 150, cabinets[i].x, cabinets[i].y, 150+5, 200+5)){
                    n = n * 0;
                }
            } else if(cabinets[i].direction == "h"){
                if(checkoverlap(x, y, 200, 150, cabinets[i].x, cabinets[i].y, 200+5, 150+5)){
                    n = n * 0;
                }
            }
        }
        if(n > 0) {
            cabinets.push({x: x, y: y, direction: "h", playing: -1});
            order.push("cabinet");
        }
    }
    draw(ctx);
    console.log(cabinets);
}, false);

undo.onclick = () => {
    if(order.length > 0){
        let last = order.pop();
        if(last == "waiting"){
            waiting.pop();
        } else if(last == "cabinet"){
            cabinets.pop();
        }
    }
    draw(ctx);
    console.log("undo : ", undo);
}

share.onclick = () => {
    let text ="";
    let now = new Date();
    text = `#嘘モナ恋情報
${now.getHours()}時${now.getMinutes()}分
チュウニズム 空き${String(cabinets.length - countPlayers())} 待ち${waiting.length}
嘘モナ恋情報共有はこちらから！
↓ ↓ ↓
https://kyu099.github.io/usomonacoi/`

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