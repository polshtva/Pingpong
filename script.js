let fieldPlayground = document.querySelector(".playground");
let countRight = document.querySelector(".count_right");
let countLeft = document.querySelector(".count_left");

let btnResert = document.querySelector(".btn-reset");

let fieldHeight = 600;
let fieldWidth = 800;

let gameObj = {
    rect: {
        top: 0,
        left: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }, 
    get x(){
        return this.rect.x;
    },
    set x(value){
        this.rect.x = value;
        this.rect.left = value - this.rect.width/2;
        this.el.style.left = (this.rect.left) + "px";
    },

    get y(){
        return this.rect.y;
    },
    set y(value){
        this.rect.y = value;
        this.rect.top = value - this.rect.height/2;
        this.el.style.top = (this.rect.top) + "px";
    },

    get bottom(){
        return this.rect.y + this.rect.height / 2;
    },
    get right(){
        return this.rect.x + this.rect.width / 2;
    },
    collideWith: function(obj){
        return (this.bottom > obj.rect.top &&
             this.right > obj.rect.left && 
             this.rect.left < obj.right && 
             this.rect.top < obj.bottom);
    }
};

let ball = {
    __proto__: gameObj,
    rect: {
        top: 0,
        left: 0,
        x: 400,
        y: 300,
        width: 40,
        height: 40,
    },  
    el: document.querySelector(".ball"),
    velocityX: 5,
    velocityY: 5,
    speed: 8,
    timerId: 0,
    // передвижение мячика
    update: function (){
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        if (this.rect.top < 0 || this.bottom > fieldHeight) {
            this.velocityY = -this.velocityY;
        }
    
        if (this.collideWith(paddleLeft)) {
            this.velocityX = Math.abs(this.velocityX); // Отскок вправо
            let deltaY = this.y - paddleLeft.y;
            let collidePoint = deltaY / paddleLeft.rect.height;
            let angleRad = collidePoint * (Math.PI / 4);
    
            this.velocityY = this.speed * Math.sin(angleRad);
    
            this.x = paddleLeft.right + this.rect.width / 2;
        }
    
        if (this.collideWith(paddleRight)) {
            this.velocityX = -Math.abs(this.velocityX); // Отскок влево
            let deltaY = this.y - paddleRight.y;
            let collidePoint = deltaY / paddleRight.rect.height;
            let angleRad = collidePoint * (Math.PI / 4);
    
            this.velocityY = this.speed * Math.sin(angleRad);
    
            this.x = paddleRight.rect.left - this.rect.width / 2;
        }
    
        if (this.right > fieldWidth) {
            this.velocityX = -this.velocityX;
            countLeft.dataset.value = +countLeft.dataset.value + 1;
        }
        if (this.rect.left < 0) {
            clearInterval(this.timerId);
            this.timerId = 0;
            setTimeout(this.reset.bind(this), 500);
            countRight.dataset.value = +countRight.dataset.value + 1;
        }
    
        let deltaY = this.y - paddleRight.y;
        let smartLevel = 0.3;
    
        if (deltaY > 0) {
            paddleRight.y += Math.min(smartLevel * deltaY, 5);
        } else if (deltaY < 0) {
            paddleRight.y -= Math.min(smartLevel * -deltaY, 5); 
        }

        // Вызываем функцию сохранения данных после каждого обновления мяча
        saveGameData()
    },
    reset: function(){
        this.x = 430;
        this.y = 300;
        this.velocityX = 5;
        this.velocityY = 5;
        this.start();
    },
    //запуск движения мячика произвольно 
    start(){
        if(this.timerId){
            clearInterval(this.timerId);
            this.timerId = 0;
        }
        else{
            this.timerId = setInterval(this.update.bind(this), 25);
        }   
    }
};

let btnStart = document.querySelector(".btn-wrapper > .btn-start");
let btnStop = document.querySelector(".btn-wrapper > .btn-end");

//левая сторона
let paddleLeft = {
    el:document.querySelector(".pad_left"),
    __proto__:gameObj,
    rect: {
        top: 0,
        left: 0,
        x: 10,
        y: 60,
        width: 20,
        height: 120,
    }, 
};

//правая сторона
let paddleRight = {
    el:document.querySelector(".pad_right"),
    __proto__:gameObj,
    rect: {
        top: 240,
        left: 780,
        x: 790,
        y: 300,
        width: 20,
        height: 120,
    }, 
};

// движение мышки
document.addEventListener("mousemove", function(e){
    let playRect = fieldPlayground.getBoundingClientRect();
    let y = e.clientY - playRect.top - 20;
    paddleLeft.y = y;
});

document.addEventListener("keyup", function(e){
    if(e.keyCode == 83){
        ball.start();
    }
});

// Установка значений счётчиков и текущего положения мяч
function saveGameData() {
    localStorage.setItem("countRight", countRight.dataset.value);
    localStorage.setItem("countLeft", countLeft.dataset.value);
    localStorage.setItem("ballX", ball.x);
    localStorage.setItem("ballY", ball.y);
}

// Получение значений из localStorage и установка их при загрузке страницы
function loadGameData() {
    const savedCountRight = localStorage.getItem("countRight");
    if (savedCountRight !== null) {
        countRight.dataset.value = savedCountRight;
    }

    const savedCountLeft = localStorage.getItem("countLeft");
    if (savedCountLeft !== null) {
        countLeft.dataset.value = savedCountLeft;
    }

    const savedBallX = localStorage.getItem("ballX");
    const savedBallY = localStorage.getItem("ballY");
    if (savedBallX !== null && savedBallY !== null) {
        ball.x = parseFloat(savedBallX);
        ball.y = parseFloat(savedBallY);
    }
}

window.addEventListener("DOMContentLoaded", function() {
    loadGameData();
});
//сброс данных
btnResert.addEventListener("click", ()=> {
    countRight.dataset.value = "0";  
    countLeft.dataset.value = "0";
    ball.x = 420
    ball.y = 300
    ball.start();
    saveGameData()
})