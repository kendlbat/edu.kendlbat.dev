let images;
let currentIndex = 0;
let lastScrollTime = new Date(0);

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

    document.documentElement.addEventListener("wheel", (e) => {
        if (lastScrollTime.getTime() + 250 > new Date().getTime()) return;
        lastScrollTime = new Date();
        if (e.deltaY > 0) {
            toNext();
        } else {
            toPrevious();
        }
    });

    document.documentElement.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
            toPrevious();
        } else if (e.key == "ArrowDown" || e.key == "ArrowRight") {
            toNext();
        }
    })
}

main();