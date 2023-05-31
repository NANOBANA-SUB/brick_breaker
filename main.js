// JavaScript source code
window.onload = function () {
   
    let node_game = document.getElementById('game');
    node_game.onclick = game;
}
function game(event){
    //canvasの設定
    alert("ブロック崩しだよ！矢印キーで移動、shiftキーで減速できるよ！");
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let x = canvas.width / 2;
    let y = canvas.height - 30;

    let dx = 2;
    let dy = -2;

    //ボール
    const ballRadius = 10;

    //棒
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    //ブロック本体
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x:0, y:0};
        }
    }

    let rightPressed = false;
    let leftPressed = false;
    let shiftPressed = false;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        } else if (e.key === "Shift") {
            shiftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        } else if (e.key === "Shift") {
            shiftPressed = false;
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    function draw() {

        // 描画コード
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBricks();
        drawBall();
        drawPaddle();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                alert("ゲームオーバー");
                document.location.reload();
                clearInterval(interval);
            }
        }

        if (rightPressed) {
            if (shiftPressed) {
                paddleX = Math.min(paddleX - 2, canvas.width - paddleWidth);
            }
            paddleX = Math.min(paddleX + 5, canvas.width - paddleWidth);
        }
        else if (leftPressed) {
            if (shiftPressed) {
                paddleX = Math.max(paddleX + 2, 0);
            }
            paddleX = Math.max(paddleX - 5, 0);
        }


        x += dx;
        y += dy;

    }
    var interval = setInterval(draw, 10);
}
