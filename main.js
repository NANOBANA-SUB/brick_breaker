// JavaScript source code
window.onload = function () {

    let node_game = document.getElementById('game');
    node_game.onclick = game;
}
function game(event) {
    //canvasの設定
    alert("ブロック崩しだよ！矢印キーで移動、shiftキーで減速できるよ！");
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let x = canvas.width / 2;
    let y = canvas.height - 30;

    let dx = 2;
    let dy = -2;

    let score = 0;
    let gameStartTime; // Add this to track start time
    let gameEndTime;   // Add this to track end time

    let lives = 3;
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
            bricks[c][r] = { x: 0, y: 0, status: 1 };
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

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score === brickRowCount * brickColumnCount) {
                            gameEndTime = Date.now(); // Add this to record the end time
                            let elapsedTime = (gameEndTime - gameStartTime) / 1000; // Calculate elapsed time in seconds
                            let finalScore = score / elapsedTime; // Calculate score based on elapsed time
                            alert(`YOU WIN, CONGRATULATIONS! Your Score: ${finalScore.toFixed(2)}`);
                            document.location.reload();
                            clearInterval(interval); // Needed for Chrome to end game
                        }
                    }
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText(`Score: ${score}`, 8, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
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
                if (bricks[c][r].status === 1) {
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
    }
    // ゲーム終了時、スコア送信
    function endGame(win) {
        let finalScore = score; //ゲームのスコアを設定します
        let username = prompt("Enter your name for the leaderboard:"); // ユーザー名を取得するために、プロンプトを表示します。
        let serverURL = "http://localhost:3000/score"; // サーバーのURLを設定します。

        fetch(serverURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                score: finalScore
            })
        })
            .then(response => response.json())
            .then(data => console.log('Response:', data))
            .catch((error) => console.error('Error:', error));

        if (win) {
            alert("YOU WIN, CONGRATULATIONS!");
        } else {
            alert("GAME OVER");
        }
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
    }

    // 現在のゲーム終了時のコード部分
    if (score === brickRowCount * brickColumnCount) {
        endGame(true); // ユーザーが勝ったとき
    } else if (!lives) {
        endGame(false); // ユーザーが全てのライフを失ったとき
    }

    function draw() {

        // 描画コード
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        // 以下の部分を追加
        if (score === brickRowCount * brickColumnCount) {
            endGame(true); // ユーザーが勝ったとき
        } else if (!lives) {
            endGame(false); // ユーザーが全てのライフを失ったとき
        }

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    gameEndTime = Date.now(); // Add this to record the end time
                    let elapsedTime = (gameEndTime - gameStartTime) / 1000; // Calculate elapsed time in seconds
                    let finalScore = score / elapsedTime; // Calculate score based on elapsed time
                    alert(`GAME OVER. Your Score: ${finalScore.toFixed(2)}`);
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
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

    gameStartTime = Date.now(); // Add this to record the start time
    var interval = setInterval(draw, 10);
}
