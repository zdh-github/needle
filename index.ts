const canvas: HTMLCanvasElement = document.querySelector("canvas");
const context: CanvasRenderingContext2D = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Ball {
    score: number = 0;
    radius: number = 80;
    size: number = this.radius * 2;
    distance: number = 20;
    x: number = canvas.width / 2;
    y: number = this.size + this.distance;
    constructor() {
        this.draw();
    }
    draw() {
        // 绘制圆圈
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = "#000";
        context.fill();
        // 绘制得分
        context.fillStyle = "#fff";
        context.font = "40px serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(String(this.score), this.x, this.y);
    }
}

const ball = new Ball();

class Needle {
    ID: number = Date.now();
    state: string = "";
    fx: number = canvas.width / 2;
    fy: number = canvas.height - ball.size - ball.distance;
    cx: number = canvas.width / 2;
    cy: number = canvas.height - ball.distance - ball.radius;
    tx: number = canvas.width / 2;
    ty: number = canvas.height - ball.distance;
    radius: number = 2;
    speed: number = 30;
    angle: number = 0;
    constructor() {
        this.draw();
    }
    draw() {
        // 如果是准备状态
        if (this.state === "ready") {
            this.up();
        }
        // 如果是已经发射状态
        if (this.state === "already") {
            this.rotate();
        }
        // 绘制透明部分
        context.strokeStyle = "rgba(0, 0, 0, 0)";
        context.beginPath();
        context.moveTo(this.fx, this.fy);
        context.lineTo(this.cx, this.cy);
        context.closePath();
        context.stroke();
        // 绘制黑色部分
        context.strokeStyle = "rgba(0, 0, 0, 1)";
        context.beginPath();
        context.moveTo(this.cx, this.cy);
        context.lineTo(this.tx, this.ty);
        context.closePath();
        context.stroke();
        // 绘制圆圈
        context.fillStyle = "rgba(0, 0, 0, 1)";
        context.beginPath();
        context.arc(this.tx, this.ty, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
    up() {
        this.fy -= this.speed;
        this.cy -= this.speed;
        this.ty -= this.speed;
        if (this.fy < ball.y) {
            this.cy = ball.y - this.fy;
            this.ty = ball.y - this.fy;
            this.fy = ball.y;
            this.state = "already";
            ball.score += 1;
            generateNeedle();
        }
    }
    rotate() {
        this.angle++;
        const centerPosition = computeCircleAnglePosition(this.fx, this.fy, ball.radius, this.angle);
        this.cx = centerPosition.x;
        this.cy = centerPosition.y;
        const endPosition = computeCircleAnglePosition(this.fx, this.fy, ball.size, this.angle);
        this.tx = endPosition.x;
        this.ty = endPosition.y;
    }
}

// 计算当前圆心指定半径、角度的坐标
function computeCircleAnglePosition(x: number, y: number, radius: number, angle: number) {
    return {
        x: x + radius * Math.sin(Math.PI * 2 * angle / 360),
        y: y + radius * Math.cos(Math.PI * 2 * angle / 360),
    }
}

// 计算两点之间的距离
function computeTwoPointDistance(fx: number, fy: number, tx: number, ty: number): number {
    return Math.sqrt(Math.pow(tx - fx, 2) + Math.pow(ty - fy, 2));
}

let needles: Array<Needle> = [];
let needle = null;

function generateNeedle() {
    needle = new Needle();
    needles.push(needle);
}

function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < needles.length; i++) {
        needles[i].draw();
    }
    ball.draw();
    requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
    needle.state = "ready";
});

generateNeedle();
loop();