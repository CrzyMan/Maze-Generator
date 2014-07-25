/*
 * This is the Block object that the user controls
 */
Block = {
    // position is the middle of the Block
    x: 0,
    y: 0,
    speed: 1,
    margin: 5,
    
    /*
     * Moves the box toward the mouse
     *
     * return boolean , If the game has been won
     */
    move: function(){
        
        // vel is normalize position to mouse, scale by speed
        // check for walls (pixels in a line in the cardinal directions)
        // move by vel, in allowed direciton
        var dx = mouseX - Block.x;
        var dy = mouseY - Block.y;
        var d = Math.sqrt(dx*dx + dy*dy);
        dx /= d*Block.speed;
        dy /= d*Block.speed;
        
        // check if you can move
        var dirx = dx > 0 ? 1 : dx < 0 ? 3 : -1;
        var diry = dy > 0 ? 0 : dy < 0 ? 2 : -1;
        
        var fx = Block.lookAround(dirx);
        var fy = Block.lookAround(diry);
        
        if (fx==1) dx=0;
        if (fy==1) dy=0;
        
        if (dx != 0 || dy != 0){
            Block.erase();
            Block.x += dx;
            Block.y += dy;
            Block.draw();
        }
        
        var win = (fx == 2 || fy == 2); 
        if (win != true){
            reqAnimId = requestAnimationFrame(Block.move);
        } else {
            // YOU WIN!
        }
        
    },
    
    lookAround: function(dir){
        if (dir < 0) return 1;
        // -1: don't check, 0: up, 1: right, 2: down, 3: left];
        // make it check all around the perimeter of the block to determine whether that side is going to hit a line
        var flag = 0;
        var i, limit, vx=1, vy=0;
        i = limit = (gridW/2) - Block.margin + 1;
        if (dir%2==1){
           i = limit = (gridH/2) - Block.margin + 1;
           vx=0;
           vy=1;
        }
        i *= -1;
        while (flag==0 && i <= limit){
           flag = checkMazePixel(Block.x + i*vx + vy*directions[dir][0]*(gridW*0.5 - Block.margin + 2) , Block.y + i*vy + vx*directions[dir][1]*(gridH*0.5 - Block.margin + 2));
           
           i++;
        }
        
        return flag;
    },
    
    draw: function(){
        c_block.c.fillRect(Block.x - gridW/2 + Block.margin, Block.y - gridH/2 + Block.margin, gridW - 2*Block.margin, gridH - 2*Block.margin);
    },
    
    erase: function(){
        c_block.c.clearRect(Block.x - gridW/2, Block.y - gridH/2 , gridW , gridH);
    },
    
    moveToStart: function(){
        Block.x = gridW/2;
        Block.y = gridH/2;
    },
};


/*
 * Checks the maze canvas at a specific pixel
 *
 * int x , x-coordinate to check
 *
 * int y , y-coordinate to check
 *
 * return int , 0: nothing, 1: black, 2: red
 */
function checkMazePixel(x, y){
    x = x < 0 ? 0 : x < c_maze.width ? ~~x : c_maze.width;
    y = y < 0 ? 0 : y < c_maze.height ? ~~y : c_maze.height;
    
    var i = x*4 + y*c_maze.width*4;
    var result = 0;
    
    // if is colored
    if (c_maze.data[i+3]){
        result++;
        
        // if is red
        if (c_maze.data[i] > c_maze.data[i+1])
            result++;
    }
    
    return result;
}