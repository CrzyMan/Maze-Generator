/*
 * This is the Block object that the user controls
 */
Block = {
    x: 0,
    y: 0,
    speed: 1,
    margin: 3,
    
    move: function(){
        // vel is normalize position to mouse, scale by speed
        // check for walls (pixels in a line in the cardinal directions)
        // move by vel, in allowed direciton
        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        var d = Math.sqrt(dx*dx + dy*dy);
        dx *= d*this.speed;
        dy *= d*this.speed;
        
        //            [up  ,right, down, left];
        var options = [true, true, true, true];
        
        // check for possible movement
        for (var i = -margin; i < margin; i++){
            
        }
    },
    
    hasWon: function(){
        // check if the bounds are intersecting with the red square
    }
};