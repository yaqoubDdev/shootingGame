/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// CollisionCanvas 
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');

collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
//

let score = 0;
ctx.font = '50px Impact';

let gameOver = false;

let ravens = [];


let timeToNextRaven = 0;
let ravenInterval = 500;
let lastime = 0;

let numOfRavens = 100;

class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 179;

        this.sizeModifier = Math.random() * 0.6 + 0.4;

        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;

        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);

        this.dirX = Math.random() * 5 + 3;
        this.dirY = Math.random() * 5 -2.5;

        this.markedForDeletion = false;

        this.image = new Image();
        this.image.src = 'raven.png';

        this.frame = 0;
        this.maxFrame = 4;

        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;

        this.randColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = `rgb( ${this.randColors[0]}, ${this.randColors[1]}, ${this.randColors[2]})`;

        this.hasTrail = Math.random() > 0.5;
    }

    update(time){
        if( this.y < 0 || this.y > canvas.height - this.height){
            this.dirY = this.dirY * -1;
        }
        this.x -= this.dirX;
        this.y += this.dirY;

        if(this.x < 0 - this.width) this.markedForDeletion = true;
        
        this.timeSinceFlap += time;

        if(this.timeSinceFlap > this.flapInterval){

            if(this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if (this.hasTrail) {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                    
                    
                }
                
            }

        }

        if(this.x < 0 - this.width) gameOver = true;



    }

    draw(){
        collisionCtx.fillStyle = this.color;

        collisionCtx.fillRect(this.x, this.y, this.width, this.height);

        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight ,this.x, this.y, this.width, this.height, )
    }
}


let explosions = [];
// console.log(boom)

class Explosion {
    constructor(x, y, size){

        this.image = boom;
        this.spriteWidth = 200;
        this.spriteHeight = 179;

        
        this.size = size;
        this.x = x;
        this.y = y;

        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'shoot.wav';

        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;

        this.markedForDeletion = false;
    }

    update(dTime){
        if(this.frame === 0) this.sound.play()
        this.timeSinceLastFrame += dTime;
        if(this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true; 
        }
    }

    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size /4, this.size, this.size); 
    }
}


let particles = [];

class Particle{
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size / 2;
        this.y = y + this.size / 3;
        this.radius = Math.random() * this.size/ 10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;

    }

    update(){
        this.x += this.speedX;
        this.radius += 0.3; 

        if(this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }

    draw(){
        ctx.save()
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore()
    }
}


function drawScore(){

    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 50, 75);

    ctx.fillText('tap d bird', 305, 75)
    
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 55, 80);
    ctx.fillText('tap d bird', 310, 80)
    
}




function drawGameOver(){
    ctx.textAlign = 'center'

    ctx.fillStyle = 'black';
    ctx.fillText(`GAME OVER, your score is: ${score}`, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = 'white';
    ctx.fillText(`GAME OVER, your score is: ${score}`, canvas.width / 2 + 5, canvas.height / 2 + 5);
}


window.addEventListener('click', event => {
    // console.log(event)
    const detectColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
    
    // console.log(detectColor)
    const pc = detectColor.data;

    ravens.forEach( object => {
        if(object.randColors[0] === pc[0] && object.randColors[1] === pc[1] && object.randColors[2] === pc[2]) {
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
            console.log(explosions);
        }
    })
})

function animate(time){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

    // if(time % )
    
    // ravens.forEach(e => {
    //     e.update();
    //     e.draw();
    // })

    let deltaTime = time - lastime;
    lastime = time;
    timeToNextRaven += deltaTime;
    

    if( timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort( (a, b) => {
            return a.width - b.width;
        })
    };

    drawScore();
    [...particles ,...explosions , ...ravens ].forEach(object => object.update(deltaTime));
    [...particles ,...explosions , ...ravens ].forEach(object => object.draw());

    explosions = explosions.filter(o => !o.markedForDeletion)
    ravens = ravens.filter(o => !o.markedForDeletion)
    particles = particles.filter(o => !o.markedForDeletion)
    

    // console.log(ravens)


    

    if(!gameOver) requestAnimationFrame(animate);
    else drawGameOver();;
}

animate(0);