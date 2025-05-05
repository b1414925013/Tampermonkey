// time.js - 数字时间 + 模拟时钟绘制

const canvas = document.getElementById("analog-clock");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;
ctx.translate(radius, radius);

function drawClock() {
    const now = new Date();
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
    drawFace();
    drawHands(now);
}

function drawFace() {
    ctx.save();
    for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i % 5 === 0 ? "#fff" : "rgba(255,255,255,0.6)";
        ctx.lineWidth = i % 5 === 0 ? 2 : 1;
        ctx.rotate(Math.PI / 30);
        ctx.moveTo(radius - 5, 0);
        ctx.lineTo(radius - (i % 5 === 0 ? 15 : 8), 0);
        ctx.stroke();
    }
    ctx.restore();
}

function drawHands(now) {
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    drawHand(((hour + minute / 60) * Math.PI) / 6, radius * 0.5, 4, "#fff"); // 时针
    drawHand((minute * Math.PI) / 30, radius * 0.7, 3, "#fff"); // 分针
    drawHand((second * Math.PI) / 30, radius * 0.85, 2, "#c14543"); // 秒针

    ctx.beginPath();
    ctx.fillStyle = "#c14543";
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fill();
}

function drawHand(angle, length, width, color) {
    ctx.save();
    ctx.beginPath();
    ctx.rotate(angle);
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -length);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
}

function updateDigitalTime() {
    const now = new Date();
    document.getElementById("time-hm").textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    document.getElementById("time-sec").textContent = now.getSeconds().toString().padStart(2, "0");
    document.getElementById("time-date").textContent = now.toLocaleDateString('zh-CN');
    document.getElementById("time-week").textContent = `星期${"日一二三四五六"[now.getDay()]}`;
}

function initTime() {
    setInterval(() => {
        drawClock();
        updateDigitalTime();
    }, 1000);

    drawClock();
    updateDigitalTime();
}