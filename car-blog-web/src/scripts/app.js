// This file contains the JavaScript code that handles the game logic for the car driving down a road with buildings that reveal buttons for blog links when the car stops.

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let carImg = new Image();
let roadImg = new Image();
let buildingImages = [];
let buildings = [];
let blogData = [];
let car;
let gameSpeed = 2;
let carPosition = 0;
let currentBuildingIndex = 0;
let buttonsVisible = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

carImg.src = '../assets/sprites/car.png';
roadImg.src = '../assets/backgrounds/road.png';
for (let i = 1; i <= 3; i++) {
    let buildingImg = new Image();
    buildingImg.src = `../assets/buildings/building${i}.png`;
    buildingImages.push(buildingImg);
}

fetch('../data/blogs.json')
    .then(response => response.json())
    .then(data => {
        blogData = data;
        init();
    });

class GameObject {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Car extends GameObject {
    constructor(image) {
        super(image, canvas.width / 2 - 50, canvas.height - 100, 100, 50);
    }
    update() {
        this.x += gameSpeed;
        if (this.x > canvas.width) {
            this.x = -this.width;
        }
    }
}

class Building extends GameObject {
    constructor(image, x, y) {
        super(image, x, y, 100, 150);
    }
}

function init() {
    car = new Car(carImg);
    for (let i = 0; i < buildingImages.length; i++) {
        buildings.push(new Building(buildingImages[i], i * 300 + 200, canvas.height - 250));
    }
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(roadImg, 0, 0, canvas.width, canvas.height);
    
    car.update();
    car.draw();

    for (let building of buildings) {
        building.draw();
        if (car.x + car.width > building.x && car.x < building.x + building.width && !buttonsVisible) {
            currentBuildingIndex = buildings.indexOf(building);
            showButtons();
        }
    }

    requestAnimationFrame(gameLoop);
}

function showButtons() {
    buttonsVisible = true;
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '20px';
    buttonContainer.style.left = '20px';
    buttonContainer.style.zIndex = '1000';

    const blog = blogData[currentBuildingIndex];
    const button = document.createElement('button');
    button.innerText = blog.title;
    button.onclick = () => {
        window.open(blog.url, '_blank');
    };

    buttonContainer.appendChild(button);
    document.body.appendChild(buttonContainer);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});