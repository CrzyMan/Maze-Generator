/* NOW FOR GAMEPLAY! */
var gameLogic = []

// Add all the gamemodes

// FreeMode
gameLogic.push({
    name: "Free-mode",
    
    setup: function(){
        generate();
        this.update();
    },
    
    update: function(){
        
    },
    
    isDone: function(){
        this.setup();
    }
});