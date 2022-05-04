let images;
let currentImage = 0;
let progress = 0;
let progressbarIndex = 0;
const progressbarAmount = 2;
const progressbarMinZindex = 5;

async function getAvailableImages() {
    const response = await fetch('images/index.json');
    const images = await response.json();
    return images;
}

async function toNext() {
    currentImage = (currentImage + 1) % Object.values(images).length;
    document.getElementById("mainimg").src = `images/highres/${Object.values(images)[currentImage]}`;
    document.getElementById("bgimg").src = `images/highres/${Object.values(images)[currentImage]}`;
}

async function main() {
    images = await getAvailableImages();
    
    document.getElementById("mainimg").src = `images/highres/${Object.values(images)[currentImage]}`;
    document.getElementById("bgimg").src = `images/highres/${Object.values(images)[currentImage]}`;
    
    setInterval(() => {
        progress += 0.2;

        if (progress > 100) {
            toNext();
            document.getElementById("progressbar" + progressbarIndex).style.zIndex = progressbarMinZindex;
            progressbarIndex = (progressbarIndex + 1) % progressbarAmount;
            document.getElementById("progressbar" + progressbarIndex).style.zIndex = progressbarMinZindex + 1;
            progress = 0;
        }

        document.getElementById("progressbar" + progressbarIndex).style.left = (progress - 100) + "%";

    }, 10);

}

main();