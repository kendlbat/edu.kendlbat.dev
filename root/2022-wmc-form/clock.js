"use strict";

let canvas = document.getElementById("analogclock");
let ctx;
let lastUpdateTime = new Date();
let stopwatch = null;
let fixedTime = null;
let epoch = new Date();
epoch.setHours(0, 0, 0, 0);

let bigMovementDone = [true, true];

let defaultMovementPerTick = 0.025;
let movementPerTick = defaultMovementPerTick;

let handles = [lastUpdateTime.getHours(), lastUpdateTime.getMinutes()];

let preventMousemove = false;

const digitalclock = document.getElementById("digitalclock");


const defaultColor = "white";
const defaultSecondaryColor = "red";
const backgroundColor = "black";

let secondaryColor = defaultSecondaryColor;

async function updateClock() {
    let time = new Date();
    if (stopwatch != null) {
        time = new Date(new Date().getTime() - stopwatch);
        time = new Date(epoch.getTime() + time.getTime());
    }
    if (fixedTime != null) {
        time = new Date(epoch.getTime() + fixedTime.getTime());
    }
    

    // Update digital clock and pad with 0's
    if (stopwatch == null && fixedTime == null) {
        digitalclock.innerText = time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0");
    } else {
        digitalclock.innerText = time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0") + ":" + time.getMilliseconds().toString().padStart(3, "0");
    }

    if (movementPerTick != defaultMovementPerTick) {
        if (bigMovementDone[0] && bigMovementDone[1]) {
            movementPerTick = defaultMovementPerTick;
        }
    }
    

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
    let x1, x2, y1, y2, x3, y3;
    
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
    let minute = time.getMinutes();

    if (handles[1] < minute - movementPerTick) {
        handles[1] += movementPerTick;
    } else if (!bigMovementDone[1]) {
        bigMovementDone[1] = true;
        handles[1] = minute;
    }

    angle = ((Math.PI * 2) * (handles[1] / 60)) - (Math.PI / 2); 
    ctx.lineWidth = radius / 23;
    ctx.strokeStyle = defaultColor;
    x1 = radius * -0.15 * Math.cos(angle);
    y1 = radius * -0.15 * Math.sin(angle);
    x2 = radius * 0.94 * Math.cos(angle);
    y2 = radius * 0.94 * Math.sin(angle);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);
    ctx.stroke();
    ctx.closePath();

    // Draw a small triangle at the end of the minute hand
    ctx.beginPath();
    ctx.fillStyle = "white";

    ctx.moveTo(radius * 0.935 * Math.cos(angle - 0.023) + radius, radius * 0.935 * Math.sin(angle - 0.023) + radius);
    ctx.lineTo(radius * 0.935 * Math.cos(angle + 0.023) + radius, radius * 0.935 * Math.sin(angle + 0.023) + radius);
    ctx.lineTo(radius * 1 * Math.cos(angle) + radius, radius * 1 * Math.sin(angle) + radius);

    ctx.fill();
    ctx.closePath();
    
    // Draw hour handle
    ctx.beginPath();
    let hour = (time.getHours() % 12) + (minute / 60);

    if (handles[0] < hour - movementPerTick) {
        handles[0] += movementPerTick / 4;
    } else if (!bigMovementDone[0]) {
        bigMovementDone[0] = true;
        handles[0] = hour;
    }

    angle = ((Math.PI * 2) * (handles[0] / 12)) - (Math.PI / 2);
    ctx.lineWidth = radius / 18;
    ctx.strokeStyle = defaultColor;
    x1 = radius * -0.15 * Math.cos(angle);
    y1 = radius * -0.15 * Math.sin(angle);
    x2 = radius * 0.45 * Math.cos(angle);
    y2 = radius * 0.45 * Math.sin(angle);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    // Draw a small triangle at the end of the hour handle
    ctx.fillStyle = defaultColor;
    x1 = radius * 0.5 * Math.cos(angle);
    y1 = radius * 0.5 * Math.sin(angle);
    x2 = radius * 0.445 * Math.cos(angle + 0.0485) - radius * 0.05 * Math.cos(angle + 0.0485 + Math.PI / 2);
    y2 = radius * 0.445 * Math.sin(angle + 0.0485) - radius * 0.05 * Math.sin(angle + 0.0485 + Math.PI / 2);
    x3 = radius * 0.445 * Math.cos(angle - 0.0485) - radius * 0.05 * Math.cos(angle - 0.0485 - Math.PI / 2);
    y3 = radius * 0.445 * Math.sin(angle - 0.0485) - radius * 0.05 * Math.sin(angle - 0.0485 - Math.PI / 2);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);
    ctx.lineTo(x3 + radius, y3 + radius);
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();

    // Draw second handle in red
    let second = time.getSeconds();
    if (stopwatch != null) second += time.getMilliseconds() / 1000;
    angle = ((Math.PI * 2) * (second / 60)) - (Math.PI / 2);
    ctx.lineWidth = radius / 35;
    ctx.strokeStyle = secondaryColor;
    x1 = radius * -0.15 * Math.cos(angle);
    y1 = radius * -0.15 * Math.sin(angle);
    x2 = radius * 0.95 * Math.cos(angle);
    y2 = radius * 0.95 * Math.sin(angle);
    ctx.moveTo(x1 + radius, y1 + radius);
    ctx.lineTo(x2 + radius, y2 + radius);
    ctx.stroke();
    ctx.closePath();

    // Draw a small red triangle at the second hand
    ctx.beginPath();
    ctx.fillStyle = secondaryColor;
    ctx.moveTo(radius * 0.945 * Math.cos(angle - 0.017) + radius, radius * 0.945 * Math.sin(angle - 0.017) + radius);
    ctx.lineTo(radius * 0.945 * Math.cos(angle + 0.017) + radius, radius * 0.945 * Math.sin(angle + 0.017) + radius);
    ctx.lineTo(radius * 1 * Math.cos(angle) + radius, radius * 1 * Math.sin(angle) + radius);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();

    // Draw a round line in the center
    ctx.lineWidth = radius / 50;
    ctx.strokeStyle = secondaryColor;
    ctx.arc(radius, radius, radius * 0.02, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

function initBigMovement(newMPT) {
    bigMovementDone[0] = false;
    bigMovementDone[1] = false;
    movementPerTick = newMPT;
}

async function checkTime() {
    lastUpdateTime = new Date();
    updateClock();
}

async function resizeClockFont() {
    let fs = 100;
    document.getElementById("digitalclock").style.fontSize = fs + "px";
    while (document.getElementById("digitalclock").offsetWidth > document.getElementById("clockoverlay").offsetWidth - 4 && fs > 0) {
        fs--;
        document.getElementById("digitalclock").style.fontSize = fs + "px";
    }
}

async function clockOverlayCheck(e) {
    if (e.target.id == "stopwatch-start") return;

    if (e.type == "mousemove" && preventMousemove) {
        preventMousemove = false;
        return;
    } else if (e.type == "touchstart") {
        preventMousemove = true;
    }
    // Check whether the mouse is over the clocks radius
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    // Calculate distance from center
    if (isNaN(x)) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    }
    let radius = document.getElementById("analogclock").clientWidth / 2;
    let distance = Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2));
    if (distance < 0 || distance > Number.MAX_SAFE_INTEGER) return;
    if (distance <= radius) {
        // Check if event is a touch event
        if (e.type == "touchstart") {
            document.getElementById("clockoverlay").classList.toggle("nodisplay");
        } else {
            document.getElementById("clockoverlay").classList.remove("nodisplay");
        }
        resizeClockFont();
    } else {
        document.getElementById("clockoverlay").classList.add("nodisplay");
    }
}

document.getElementById("analogclock-wrapper").onmousemove = async (e) => {
    clockOverlayCheck(e);
}

document.getElementById("analogclock-wrapper").ontouchstart = async (e) => {
    clockOverlayCheck(e);
}

document.getElementById("analogclock-wrapper").onmouseleave = async (e) => {
    document.getElementById("clockoverlay").classList.add("nodisplay");
}

if (canvas != null) {
    console.log("Starting clock.js by Tobias Kendlbacher");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    updateClock();
    setInterval(checkTime, 20);
} else {
    console.warn("Canvas not found - Skipping clock");
}

document.getElementById("stopwatch-start").addEventListener("click", () => {
    let btn = document.getElementById("stopwatch-start");

    if (btn.innerText == "Start") {
        fixedTime = null;
        stopwatch = new Date().getTime();
        digitalclock.innerText = "00:00:00:000";
        movementPerTick = 0.25;
        handles[0] = 0;
        handles[1] = 0;
        resizeClockFont();
        updateClock();
        btn.innerText = "Stop";
        btn.style.backgroundColor = "red";
        secondaryColor = "limegreen";
    } else if (btn.innerText == "Stop") {
        fixedTime = new Date(new Date().getTime() - stopwatch);
        stopwatch = null;
        btn.innerText = "Clear";
        btn.style.backgroundColor = "orange";
        secondaryColor = "orange";
    } else {
        stopwatch = null;
        fixedTime = null;
        let time = new Date();
        digitalclock.innerText = time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0");
        updateClock();
        resizeClockFont();
        initBigMovement(0.3);
        btn.innerText = "Start";
        btn.style.backgroundColor = "limegreen";
        secondaryColor = defaultSecondaryColor;
    }
});
resizeClockFont();