//JavaScript for color palette generator !!!!!!!
//Utilities functions adding, random color generator, hex to rgb color, image upload for color generator. 
//Working 
function getRandomColor() {
    const hex = Math.floor(Math.random()*16777215).toString(16);
    return `#${hex.padStart(6, '0')}`;
}

function hexToRGB(hex) {
    let r = parseInt(hex.slice(1,3),16);
    let g = parseInt(hex.slice(3,5),16);
    let b = parseInt(hex.slice(5,7),16);
    return `rgba(${r}, ${g}, ${b})`;
}

/* Palette Generation */
let colors = Array(50).fill('').map(() => getRandomColor());
let lockedColors = Array(50).fill(false);

function toggleLock(index) {
    lockedColors[index] = !lockedColors[index];
    generatePalette();
}

function generatePalette() {
    const container = document.getElementById('palette-container');
    container.innerHTML = '';

    for(let i = 0; i < 50; i++) {
        if (!lockedColors[i]) {
            colors[i] = getRandomColor();
        }

        const color = colors[i];
        const rgb = hexToRGB(color);

        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.background = color;
        card.innerHTML = `<div>${color}</div><div>${rgb}</div>`;

        //Lock button
        const lockBtn = document.createElement('button');
        lockBtn.className = 'lock-btn';
        lockBtn.innerText = lockedColors[i] ? 'Unlock' : 'Lock';
        lockBtn.onclick = (e) => {
            e.stopPropagation();
            toggleLock(i);
        }
        card.appendChild(lockBtn);

        //Copy color on click
        card.onclick = () => {
            navigator.clipboard.writeText(color);
            alert(`${color} copied!`);
        }

        container.appendChild(card);
    }
}

// Gradient Generator
function generateGradient() {
    const colorsArr= colors;

    const gradient = `linear-gradient(90deg, ${colorsArr.join(',')})`;
    document.body.style.background = gradient;
}

//Dark/light mode
function toggleTheme() {
    document.body.classList.toggle('dark');
}

//Image upload palette extraction
function extractPaletteFromImages(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
        const img = new Image();
        img.src = reader.result;

        img.onload = function() {
            Vibrant.from(img).getPalette()
                .then(palette => {
                    const container = document.getElementById('palette-container');
                    container.innerHTML = '';

                Object.keys(palette).forEach((swatch, index) => {
                    if (palette[swatch]) {
                        const rgb = palette[swatch].getRgb();
                        const hex = palette[swatch].getHex();
                        const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                        const card = document.createElement('div');
                        card.className = 'color-card';
                        card.style.background = hex;
                       
                        const info = document.createElement('div');
                        info.innerHTML = `<div>${swatch}</div><div>${hex}</div><div>${color}</div>`;
                        card.appendChild(info);
                        
                        const lockBtn = document.createElement('button');
                        lockBtn.className = 'lock-btn';
                        lockBtn.innerText = lockedColors[index] ? 'Unlock' : 'Lock';
                        lockBtn.onclick = (e) => {
                            e.stopPropagation();
                            toggleLock(index);
                        };
                        card.appendChild(lockBtn);
                        
                        card.onclick = () => {
                            navigator.clipboard.writeText(hex);
                            alert(`${hex} Copied to the clipboard!`);
                        };

                        container.appendChild(card);

                        //Stores the color
                        colors[index] = hex;
                    }
                });
                })
                .catch(err => console.error(err));
        };
    };
        reader.readAsDataURL(file);
}

function dailyPalette() {
    const colors = [getRandomColor(),
        getRandomColor(),
        getRandomColor(),
        getRandomColor(),
        getRandomColor()
    ];
    const container = document.getElementById('palette-container');
    container.innerHTML = '';
    colors.forEach(c => {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.background = c;
        card.innerHTML = `<div>${c}</div>`;
        card.onclick = () => {
            navigator.clipboard.writeText(c);
            alert(`${c} copied!!!`);
        }
        container.appendChild(card);
    });
}

generatePalette();
