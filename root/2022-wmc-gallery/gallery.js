let images;
let previewExpanded = true;

async function getAvailableImages() {
    const response = await fetch('images/index.json');
    const images = await response.json();
    return images;
}

async function showLoadScreen() {
    document.getElementById("loadscreen").classList.remove("novisible");
}

async function hideLoadScreen() {
    document.getElementById("loadscreen").classList.add("novisible");
}

async function loadMainImage(image) {
    let mainimg = images[image];

    showLoadScreen();

    let prevSelected = document.querySelectorAll(".preview-image.selected")[0];

    if (prevSelected) prevSelected.classList.remove('selected');
    document.getElementById(`preview-image-${image}`).classList.add('selected');

    document.getElementById("main-image").src = `images/highres/${mainimg}`;
    document.getElementById("main-image-bg").src = `images/highres/${mainimg}`;
}

async function loadPreviewImages(images) {
    for (const image of images) {
        const div = document.createElement('div');
        const img = document.createElement('img');
        div.className = 'preview-image-wrapper';
        img.src = `images/lowres/${image}`;
        img.className = 'preview-image';
        img.id = "preview-image-" + image;
        img.draggable = true;
        img.alt = "Image Preview: " + image;
        div.addEventListener('click', () => {
            loadMainImage(image);
        });

        div.appendChild(img);
        document.getElementById('image-preview-wrapper').appendChild(div);
    }
}

async function main() {
    showLoadScreen();

    images = await getAvailableImages();

    let mainImg = document.createElement("img");
    mainImg.src = `images/highres/${Object.values(images)[0]}`;
    mainImg.id = 'main-image';

    let mainImgBg = document.createElement("img");
    mainImgBg.src = `images/highres/${Object.values(images)[0]}`;
    mainImgBg.id = 'main-image-bg';

    document.getElementById('main-image-wrapper').appendChild(mainImg);
    document.getElementById('main-bg-wrapper').appendChild(mainImgBg);

    document.getElementById("image-main-wrapper").addEventListener("click", async () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    });

    document.getElementById("desktop-preview-toggle").addEventListener("click", async () => {
        if (previewExpanded) {
            previewExpanded = false;
            document.getElementById("desktop-preview-collapse").classList.add("rotatetoggle");
            document.body.classList.add("previewhidden");
        } else {
            previewExpanded = true;
            document.getElementById("desktop-preview-collapse").classList.remove("rotatetoggle");
            document.body.classList.remove("previewhidden");
        }
    });

    document.getElementById("mobile-preview-toggle").addEventListener("click", async () => {
        if (previewExpanded) {
            previewExpanded = false;
            document.getElementById("mobile-preview-collapse").classList.add("rotatetoggle");
            document.body.classList.add("previewhidden");
        } else {
            previewExpanded = true;
            document.getElementById("mobile-preview-collapse").classList.remove("rotatetoggle");
            document.body.classList.remove("previewhidden");
        }
    });

    document.getElementById("main-image-wrapper").ondragenter = (e) => {
        e.preventDefault();
    }

    document.getElementById("main-image-wrapper").ondragover = (e) => {
        e.preventDefault();
    }

    document.getElementById("main-image-wrapper").ondrop = (e) => {
        e.preventDefault();
        console.log(e);
        let imgUrl = e.dataTransfer.getData("text/plain");

        showLoadScreen();

        let prevSelected = document.querySelectorAll(".preview-image.selected")[0];

        if (prevSelected) prevSelected.classList.remove('selected');

        if (imgUrl.includes("images/lowres/")) {
            imgUrl = imgUrl.replace("images/lowres/", "images/highres/");
        }

        document.getElementById("main-image").src = imgUrl;
        document.getElementById("main-image-bg").src = imgUrl;
    }

    mainImg.addEventListener("load", (e) => {
        hideLoadScreen();
    });

    if (document.getElementById("main-image").complete) {
        hideLoadScreen();
    }


    loadPreviewImages(Object.keys(images));
}

let horizScrollInterval = null;
let horizScrolledInterval = 0;
let horizontalScroll = document.getElementById("image-preview-wrapper");

window.addEventListener("wheel", function (e) {
    if (this.window.innerWidth > 1370) return;
    if (horizScrollInterval != null) return;
    horizScrolledInterval = 0;
    if (e.deltaY > 0) {
        horizScrollInterval = setInterval(function () {
            horizontalScroll.scrollLeft += 7;
            horizScrolledInterval += 7;
            if (horizScrolledInterval >= 50) {
                clearInterval(horizScrollInterval);
                horizScrollInterval = null;
            }
        }, 1);
    } else {
        horizScrollInterval = setInterval(function () {
            horizontalScroll.scrollLeft -= 7;
            horizScrolledInterval += 7;
            if (horizScrolledInterval >= 50) {
                clearInterval(horizScrollInterval);
                horizScrollInterval = null;
            }
        }, 1);
    }
});

main();