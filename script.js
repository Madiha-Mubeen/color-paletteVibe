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
let lockedColors = [false,false,false,false,false];

function toggleLock(index) {
    lockedColors[index] = !lockedColors[index];
    generatePalette();
}

function generatePalette() {
    const container = document.getElementById('palette-container');
    container.innerHTML = '';
    for(let i = 0; i < 50; i++) {
        let color = lockedColors[i] && container.children[i] ? container.children[i].style.background : getRandomColor();
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
    const colors = [];
    document.querySelectorAll('.color-card').forEach(card => colors.push(card.style.background));
    const gradient = `linear-gradient(90deg, ${colors.join(',')})`;
    document.body.style.background = gradient;
}

//Dark/light mode
function toggleTheme() {
    document.body.classList.toggle('dark');
}

//Image upload palette extraction
function extractPaletteFromImages(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        const img = new Image();
        img.src = reader.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img,0,0);
            const data = ctx.getImageData(0,0,canvas.width, canvas.height).data;
            let colors = new Set();
            for (let i = 0; i < data.length; i += 4) {
                colors.add(`rgb(${data[i]},${data[i + 1]}, ${data[i + 2]})`);
                if(colors.size >= 5) break;
            }
            colors = Array.from(colors);
            document.getElementById('palette-container').innerHTML = '';
            colors.forEach(c => {
               const card = document.createElement('div');
               card.className = 'color-card';
               card.style.background = c;
               card.innerHTML = `<div> ${c} </div>`;
               card.onlclick = () => {
                navigagtor.clipboard.writeText(c);
                alert(`${c} copied!`);
               }
               document.getElementById('palette-container').appendChild(card);
       });
     }
    }
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

dailyPalette();

document.getElementById("ImageUpload").addEventListener("change", extractPaletteFromImages);