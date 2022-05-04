let images;
let currentIndex = 0;

async function getAvailableImages() {
    const response = await fetch('images/index.json');
    const images = await response.json();
    return images;
}

async function toNext() {
    currentIndex = (currentIndex + 1) % images.length;
    document.getElementById("image-current").src = `images/highres/${images[currentIndex]}`;
    document.getElementById("image-next").src = `images/highres/${images[currentIndex + 1 === images.length ? 0 : currentIndex + 1]}`;
    document.getElementById("image-previous").src = `images/highres/${images[currentIndex - 1 === -1 ? images.length - 1 : currentIndex - 1]}`;
}

async function toPrevious() {
    currentIndex = (currentIndex - 1) % images.length;
    if (currentIndex < 0) currentIndex = images.length - 1;
    document.getElementById("image-current").src = `images/highres/${images[currentIndex]}`;
    document.getElementById("image-next").src = `images/highres/${images[currentIndex + 1 === images.length ? 0 : currentIndex + 1]}`;
    document.getElementById("image-previous").src = `images/highres/${images[currentIndex - 1 === -1 ? images.length - 1 : currentIndex - 1]}`;
}

async function main() {
    images = Object.values(await getAvailableImages());

    document.getElementById("image-current").src = `images/highres/${images[currentIndex]}`;
    document.getElementById("image-previous").src = `images/highres/${images[images.length - 1]}`;
    document.getElementById("image-next").src = `images/highres/${images[1]}`;

    document.getElementById("imnext").addEventListener("click", toNext);
    document.getElementById("imprev").addEventListener("click", toPrevious);
}

main();