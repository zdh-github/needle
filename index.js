var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var Ball = /** @class */ (function () {
    function Ball() {
        this.score = 0;
        this.radius = 80;
        this.size = this.radius * 2;
        this.distance = 20;
        this.x = canvas.width / 2;
        this.y = this.size + this.distance;
        this.draw();
    }
    Ball.prototype.draw = function () {
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
    };
    return Ball;
}());
var ball = new Ball();
var Needle = /** @class */ (function () {
    function Needle() {
        this.ID = Date.now();
        this.state = "";
        this.fx = canvas.width / 2;
        this.fy = canvas.height - ball.size - ball.distance;
        this.cx = canvas.width / 2;
        this.cy = canvas.height - ball.distance - ball.radius;
        this.tx = canvas.width / 2;
        this.ty = canvas.height - ball.distance;
        this.radius = 2;
        this.speed = 30;
        this.angle = 0;
        this.draw();
    }
    Needle.prototype.draw = function () {
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
    };
    Needle.prototype.up = function () {
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
    };
    Needle.prototype.rotate = function () {
        this.angle++;
        var centerPosition = computeCircleAnglePosition(this.fx, this.fy, ball.radius, this.angle);
        this.cx = centerPosition.x;
        this.cy = centerPosition.y;
        var endPosition = computeCircleAnglePosition(this.fx, this.fy, ball.size, this.angle);
        this.tx = endPosition.x;
        this.ty = endPosition.y;
    };
    return Needle;
}());
// 计算当前圆心指定半径、角度的坐标
function computeCircleAnglePosition(x, y, radius, angle) {
    return {
        x: x + radius * Math.sin(Math.PI * 2 * angle / 360),
        y: y + radius * Math.cos(Math.PI * 2 * angle / 360)
    };
}
// 计算两点之间的距离
function computeTwoPointDistance(fx, fy, tx, ty) {
    return Math.sqrt(Math.pow(tx - fx, 2) + Math.pow(ty - fy, 2));
}
var needles = [];
var needle = null;
function generateNeedle() {
    needle = new Needle();
    needles.push(needle);
}
function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < needles.length; i++) {
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
