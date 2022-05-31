let red;
let green;
let blue;
let currentHex = "#000";
  
function rgbToHEX(red, green, blue) {
    let colorToHex = (color) => {
        var hexadecimal = Number(color).toString(16);
        return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    }
    return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
}
  

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}


function setSliders(r, g, b) {
    document.querySelector("#colors-red").value = r;
    document.querySelector("#colors-green").value = g;
    document.querySelector("#colors-blue").value = b;
}


function loadText(e) {
    let hex = document.querySelector("#input-hex").value;
    let rgb = document.querySelector("#input-rgb").value.replace(/\s/g, '');

    if (!hex.startsWith("#")) hex = "#" + hex;

    if (!hex.toLowerCase().match(/\#([0-9a-f]{3}|[0-9a-f]{6})/g)) {
        if (e) {
            return;
        }
        document.querySelector("#input-hex").value = "#000";
        hex = "#000";
        return;
    }

    if (!rgb.match(/([0-9]{1,3}\,){2}[0-9]{1,3}/g)) {
        if (e) {
            return;
        }
        document.querySelector("#input-rgb").value = "0,0,0";
        rgb = "0,0,0";
        return;
    }

    let tempRgb;

    if (hex != currentHex && hex.toLowerCase().match(/\#([0-9a-f]{3}|[0-9a-f]{6})/g)) {
        currentHex = hex;
        tempRgb = hexToRgb(hex);
        if (!tempRgb) return;
        red = tempRgb.r;
        green = tempRgb.g;
        blue = tempRgb.b;
        setSliders(red, green, blue);
        document.querySelector("#input-rgb").value = tempRgb.r + "," + tempRgb.g + "," + tempRgb.b;
        document.documentElement.style.setProperty("--red", tempRgb.r);
        document.documentElement.style.setProperty("--green", tempRgb.g);
        document.documentElement.style.setProperty("--blue", tempRgb.b);
    } else if (rgb.match(/([0-9]{1,3}\,){2}[0-9]{1,3}/g)) {
        tempRgb = {
            r: rgb.split(",")[0],
            g: rgb.split(",")[1],
            b: rgb.split(",")[2]
        };
        let chexRgb = hexToRgb(currentHex);
        if (!tempRgb) return;
        if (tempRgb.r <= 255 && tempRgb.g <= 255 && tempRgb.b <= 255) {
            if (!chexRgb || (tempRgb.r != chexRgb.r || tempRgb.g != chexRgb.g || tempRgb.b != chexRgb.b)) {
                currentHex = rgbToHEX(tempRgb.r, tempRgb.g, tempRgb.b);
                console.log(currentHex);
                document.querySelector("#input-hex").value = currentHex;
                red = tempRgb.r;
                green = tempRgb.g;
                blue = tempRgb.b;
                setSliders(red, green, blue);
                document.documentElement.style.setProperty("--red", tempRgb.r);
                document.documentElement.style.setProperty("--green", tempRgb.g);
                document.documentElement.style.setProperty("--blue", tempRgb.b);
            }
        }
    }
}

function setColorText(r, g, b) {
    console.log("Overwriting");
    document.querySelector("#input-rgb").value = r + "," + g + "," + b;
    document.querySelector("#input-hex").value = rgbToHEX(r, g, b);
}

red = parseInt(document.querySelector("#colors-red").value);
green = parseInt(document.querySelector("#colors-green").value);
blue = parseInt(document.querySelector("#colors-blue").value);
document.documentElement.style.setProperty("--red", red);
document.documentElement.style.setProperty("--green", green);
document.documentElement.style.setProperty("--blue", blue);
document.querySelector("#input-rgb").value = red + "," + green + "," + blue;
currentHex = rgbToHEX(red, green, blue);

document.querySelector("#colors-red").addEventListener("input", function(e) {
    document.documentElement.style.setProperty("--red", e.target.value);
    red = parseInt(e.target.value);
    setColorText(red, green, blue);
});

document.querySelector("#colors-green").addEventListener("input", function(e) {
    document.documentElement.style.setProperty("--green", e.target.value);
    green = parseInt(e.target.value);
    setColorText(red, green, blue);
});

document.querySelector("#colors-blue").addEventListener("input", function(e) {
    document.documentElement.style.setProperty("--blue", e.target.value);
    blue = parseInt(e.target.value);
    setColorText(red, green, blue);
});

document.querySelector("#inputform").addEventListener("submit", function(e) {
    e.preventDefault();
    loadText();
});

document.querySelector("#input-hex").addEventListener("onkeyup", function(e) {
    loadText(true);
});

document.querySelector("#input-rgb").addEventListener("onkeyup", function(e) {
    loadText(true);
});