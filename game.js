const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 10, paddleHeight = 80;
const ballSize = 12;
const playerX = 20, aiX = canvas.width - paddleWidth - 20;
let playerY = canvas.height/2 - paddleHeight/2, aiY = canvas.height/2 - paddleHeight/2;
let ballX = canvas.width/2, ballY = canvas.height/2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1), ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Mouse movement for left paddle
canvas.addEventListener('mousemove', e => {
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight/2;
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI*2);
    ctx.fill();
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX *= (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY *= (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY - ballSize < 0) {
        ballY = ballSize;
        ballSpeedY *= -1;
    }
    if (ballY + ballSize > canvas.height) {
        ballY = canvas.height - ballSize;
        ballSpeedY *= -1;
    }

    // Ball collision with player paddle
    if (
        ballX - ballSize < playerX + paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballX = playerX + paddleWidth + ballSize;
        ballSpeedX *= -1;
        // Add some "spin"
        ballSpeedY += (ballY - (playerY + paddleHeight/2)) * 0.12;
    }

    // Ball collision with AI paddle
    if (
        ballX + ballSize > aiX &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballX = aiX - ballSize;
        ballSpeedX *= -1;
        // Add some "spin"
        ballSpeedY += (ballY - (aiY + paddleHeight/2)) * 0.12;
    }

    // Ball out of bounds (left/right)
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // AI paddle movement (simple "follow" logic)
    let aiCenter = aiY + paddleHeight/2;
    if (aiCenter < ballY - 10) aiY += 4;
    else if (aiCenter > ballY + 10) aiY -= 4;
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    ctx.setLineDash([8, 8]);
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#0f0");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#f00");

    // Draw ball
    drawBall(ballX, ballY, ballSize, "#fff");
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();