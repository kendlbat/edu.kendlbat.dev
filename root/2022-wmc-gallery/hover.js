let images;

async function loadMainImage(image) {
    let largeImageWrapper = document.getElementById('large-image-wrapper');
    let largeImgFg = document.getElementById('large-image-fg');
    let largeImgBg = document.getElementById('large-image-bg');

    console.log(largeImageWrapper);
    console.log(largeImgFg);
    console.log(largeImgBg);

    largeImgFg.src = `images/highres/${images[image]}`;
    largeImgBg.src = `images/highres/${images[image]}`;
    largeImageWrapper.classList.remove("nodisplay");
}

async function getAvailableImages() {
    const response = await fetch('images/index.json');
    const images = await response.json();
    return images;
}

async function loadImages() {
    images = await getAvailableImages();
    let i = 0;
    const container = document.querySelector("#image-container");

    for (const image of Object.keys(images)) {
        const div = document.createElement('div');
        const fg = document.createElement('img');
        const bg = document.createElement('img');
        
        div.className = 'image-wrapper image-wrapper-' + image.replace(/\..*/, "");
        fg.src = `images/lowres/${image}`;
        fg.className = 'image-fg';
        fg.id = 'image-fg-' + image;
        fg.style.objectFit = 'contain';
        bg.style.objectFit = 'cover';
        bg.src = `images/lowres/${image}`;
        bg.className = 'image-bg';
        bg.id = 'image-bg-' + image;

        div.style.display = 'grid';
        div.style.gridTemplateColumns = '1fr';
        div.style.gridTemplateRows = '1fr';

        div.style.aspectRatio = '1/1';

        fg.style.gridColumn = '1';
        fg.style.gridRow = '1';
        bg.style.gridColumn = '1';
        bg.style.gridRow = '1';

        div.style.zIndex = 1;
        bg.style.zIndex = 2;
        fg.style.zIndex = 3;

        div.addEventListener('click', () => {
            loadMainImage(image);
        });

        div.appendChild(fg);
        div.appendChild(bg);
        container.appendChild(div);
    }


    // Apply sound effect to trollface
    let trollface = document.querySelector(".image-wrapper-trollface");

    if (trollface) {
        // Create audio element
        const audio = document.createElement('audio');
        audio.src = 'assets/trollface.mp3';
        audio.id = "trollfaceaudio";
        document.body.appendChild(audio);

        trollface.addEventListener('click', () => {
            let audio = document.querySelector('#trollfaceaudio');
            audio.volume = 1;
            audio.play();
        });
    }
}

document.getElementById("large-image-wrapper").addEventListener("click", () => {
    document.getElementById("large-image-wrapper").classList.add("nodisplay");
    document.getElementById('large-image-bg').src = "";
    document.getElementById('large-image-fg').src = "";
})

loadImages();