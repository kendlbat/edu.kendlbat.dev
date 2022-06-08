async function getAvailableImages() {
    const response = await fetch('images/index.json');
    const images = await response.json();
    return images;
}

async function loadImages() {
    const images = await getAvailableImages();
    let i = 0;
    const container = document.querySelector("#image-container");

    for (const image of Object.keys(images)) {
        const div = document.createElement('div');
        const fg = document.createElement('img');
        
        div.className = 'image-wrapper-' + image;
        fg.src = `images/lowres/${image}`;
        fg.className = 'image-fg';
        fg.id = 'image-fg-' + image;
        fg.style.objectFit = 'contain';
        div.style.backgroundImage = `url(images/lowres/${image})`;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
        div.style.backgroundRepeat = 'no-repeat';

        div.style.zIndex = 1;
        fg.style.zIndex = 3;

        div.addEventListener('click', () => {
            loadMainImage(image);
        });

        div.appendChild(fg);
        container.appendChild(div);


        
    }
}

loadImages();