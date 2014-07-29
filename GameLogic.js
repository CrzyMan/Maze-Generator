/* NOW FOR GAMEPLAY! */
var gameLogic = []
var gameMode = 0;
var points = 0;
var time = 0;
var timeRef = 0;
var levTime = 0;

var s_points = document.getElementById('s_points');
var s_time = document.getElementById('s_time');

// Add all the gamemodes

// 0: FreeMode
gameLogic.push({
    name: "Free Mode",
    
    setup: function(){
        points = time = 0;
        timeRef = Date.now();
        this.update();
    },
    
    update: function(){
        time = ~~((Date.now() - timeRef)/1000);
        updateDisplay();
        
        if (Block.move() == true){
            points += ~~((rows*columns)/time);
            generate();
            timeRef = Date.now();
        }
        
        reqAnimId = requestAnimationFrame(gameLogic[0].update);
    },
    
    tearDown: function(){
        //this.setup();
    }
});

// 1: Time-Attack
gameLogic.push({
    name: "Time-Attack",
    
    limit: 120,
    
    setup: function(){
        points = time = 0;
        timeRef = Date.now() + gameLogic[1].limit*1000;
        levTime = Date.now();
        this.update();
    },
    
    update: function(){
        time = ~~((timeRef - Date.now())/1000);
        updateDisplay();
        
        if (time==0){
            gameLogic[1].tearDown();
            return;
        }
        
        if (Block.move() == true){
            points += pointsForLevel(~~((Date.now()-levTime)/1000))
            generate();
            levTime = Date.now();
        }
        
        reqAnimId = requestAnimationFrame(gameLogic[1].update);
    },
    
    tearDown: function(){
        alert("Congradulations! You got "+points+" points in " + gameLogic[1].limit + " seconds!")
    }
});


// 2: Point-Attack 
gameLogic.push({
    name: "Point-Attack",
    
    goal: 100,
    
    setup: function(){
        points = gameLogic[2].goal;
        timeRef = Date.now();
        levTime = Date.now();
        this.update();
    },
    
    update: function(){
        time = ~~((Date.now() - timeRef)/1000);
        updateDisplay();
        
        if (Block.move() == true){
            points -= pointsForLevel(~~((Date.now()-levTime)/1000));
            generate();
            levTime = Date.now();
        }
        
        if (points <= 0){
            points = 0;
            updateDisplay();
            gameLogic[2].tearDown();
            return;
        }
        
        reqAnimId = requestAnimationFrame(gameLogic[2].update);
    },
    
    tearDown: function(){
        alert("Congradulations! It took you "+time+" seconds to get "+gameLogic[2].goal+" points!")
    }
});

function setGameMode(){
    var a = document.getElementsByClassName('radio');
    for (var i = 0; i < a.length; i++){
        if (a[i].checked == true){
            gameMode = parseInt(a[i].value);
            break;
        }
    }
}

function updateDisplay(){
    s_points.innerText = points;
    s_time.innerText = time;
}

function pointsForLevel(theTime){
    return ~~(5*(rows*columns)/theTime);
}