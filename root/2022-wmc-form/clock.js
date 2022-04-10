"use strict";

let canvas = document.getElementById("analogclock");
let ctx;
let lastUpdateTime = new Date();

const digitalclock = document.getElementById("digitalclock");

const defaultColor = "white";
const secondaryColor = "red";
const backgroundColor = "black";

async function updateClock() {
    let time = new Date();

    // Update digital clock and pad with 0's
    digitalclock.innerText = time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0");
    

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let radius = canvas.height / 2;
    let angle;

    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = radius / 22;
    ctx.strokeStyle = defaultColor;
    let startPercentage = 0.8;
    let endPercentage = 1;
    let x1, x2, y1, y2;
    
    for (let i = 1; i < 12; i++) {
        let j = i - 3;
        x1 = radius * startPercentage * Math.cos(j * Math.PI / 6);
        y1 = radius * startPercentage * Math.sin(j * Math.PI / 6);
        x2 = radius * endPercentage * Math.cos(j * Math.PI / 6);
        y2 = radius * endPercentage * Math.sin(j * Math.PI / 6);
        ctx.moveTo(x1 + radius, y1 + radius);
        ctx.lineTo(x2 + radius, y2 + radius);
    }

    // Draw 12:00 mark
    x1 = radius * startPercentage * Math.cos(-3.1 * Math.PI / 6);
    y1 = radius * startPercentage * Math.sin(-3.1 * Math.PI / 6);
    x2 = radius * endPercentage * Math.cos(-3.1 * Math.PI / 6);
    y2 = radius * endPercentage * Math.sin(-3.1 * Math.PI / 6);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);

    x1 = radius * startPercentage * Math.cos(-2.9 * Math.PI / 6);
    y1 = radius * startPercentage * Math.sin(-2.9 * Math.PI / 6);
    x2 = radius * endPercentage * Math.cos(-2.9 * Math.PI / 6);
    y2 = radius * endPercentage * Math.sin(-2.9 * Math.PI / 6);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);

    ctx.stroke();

    // Draw minute handle
    let minute = time.getMinutes() + (time.getSeconds() / 60);
    angle = ((Math.PI * 2) * (minute / 60)) - (Math.PI / 2); 
    ctx.lineWidth = radius / 23;
    ctx.strokeStyle = defaultColor;
    x1 = radius * -0.15 * Math.cos(angle);
    y1 = radius * -0.15 * Math.sin(angle);
    x2 = radius * 1 * Math.cos(angle);
    y2 = radius * 1 * Math.sin(angle);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);
    ctx.stroke();

    // Draw hour handle
    let hour = (time.getHours() % 12 + 1) + (minute / 60);
    angle = ((Math.PI * 2) * (hour / 12)) - (Math.PI / 2);
    ctx.lineWidth = radius / 23;
    ctx.strokeStyle = defaultColor;
    x1 = radius * -0.15 * Math.cos(angle);
    y1 = radius * -0.15 * Math.sin(angle);
    x2 = radius * 0.5 * Math.cos(angle);
    y2 = radius * 0.5 * Math.sin(angle);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    // Draw second handle in red
    let second = time.getSeconds();
    angle = ((Math.PI * 2) * (second / 60)) - (Math.PI / 2);
    ctx.lineWidth = radius / 30;
    ctx.strokeStyle = secondaryColor;
    x1 = radius * -0.15 * Math.cos(angle);
    y1 = radius * -0.15 * Math.sin(angle);
    x2 = radius * 1 * Math.cos(angle);
    y2 = radius * 1 * Math.sin(angle);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);
    ctx.stroke();

    ctx.closePath();
    ctx.beginPath();

    // Draw a round line in the center
    ctx.lineWidth = radius / 50;
    ctx.strokeStyle = secondaryColor;
    ctx.arc(radius, radius, radius * 0.02, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

async function checkTime() {
    if (new Date() - lastUpdateTime > 1000) {
        lastUpdateTime = new Date();
        updateClock();
    }
}

document.getElementById("analogclock-wrapper").onmousemove = async (e) => {
    // Check whether the mouse is over the clocks radius
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let distance = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
    if (distance < canvas.height / 2) {
        document.getElementById("clockoverlay").classList.remove("nodisplay");
    } else {
        document.getElementById("clockoverlay").classList.add("nodisplay");
    }
}

document.getElementById("analogclock-wrapper").onmouseleave = async (e) => {
    document.getElementById("clockoverlay").classList.add("nodisplay");
}

if (canvas != null) {
    console.log("Starting clock.js by Tobias Kendlbacher");
    ctx = canvas.getContext("2d");
    updateClock();
    setInterval(checkTime, 20);
} else {
    console.warn("Canvas not found - Skipping clock");
}