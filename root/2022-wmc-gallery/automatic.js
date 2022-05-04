let images;
let currentImage = 0;
let progress = 0;
let progressbarIndex = 0;
let pauseProgress = true;
let fadeImageLoaded = false;
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

    document.getElementById("mainimg").addEventListener("load", () => {
        pauseProgress = false;
        document.getElementById("loadingbar").style.visibility = "hidden";
        document.getElementById("mainimg").classList.add("loaded");
        document.getElementById("bgimg").classList.add("loaded");
    });
    
    document.getElementById("mainimg").classList.remove("loaded");
    document.getElementById("bgimg").classList.remove("loaded");
    document.getElementById("fadebgimg").style.visibility = "hidden";
    document.getElementById("bgimg").src = `images/highres/${Object.values(images)[currentImage]}`;
    document.getElementById("mainimg").src = `images/highres/${Object.values(images)[currentImage]}`;
    
    
    setInterval(() => {
        if (pauseProgress) return;
        progress += 0.2;

        if (progress > 100) {
            toNext();
            document.getElementById("progressbar" + progressbarIndex).style.zIndex = progressbarMinZindex;
            progressbarIndex = (progressbarIndex + 1) % progressbarAmount;
            document.getElementById("progressbar" + progressbarIndex).style.zIndex = progressbarMinZindex + 1;
            pauseProgress = true;
            document.getElementById("loadingbar").style.visibility = "visible";
            progress = 0;
            fadeImageLoaded = false;
        } else if (!fadeImageLoaded && progress > 20) {
            fadeImageLoaded = true;
            document.getElementById("fademainimg").src = document.getElementById("mainimg").src;
            document.getElementById("fadebgimg").src = document.getElementById("bgimg").src;
        } else if (progress > 80) {
            document.getElementById("mainimg").classList.remove("loaded");
            document.getElementById("bgimg").classList.remove("loaded");
            document.getElementById("fadebgimg").style.visibility = "visible";
        }

        document.getElementById("progressbar" + progressbarIndex).style.left = (progress - 100) + "%";

    }, 10);

}

main();