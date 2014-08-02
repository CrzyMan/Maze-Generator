/*
 * This is the Block object that the user controls
 */
Block = {
    // position is the middle of the Block
    x: 0,
    y: 0,
    speed: 2,
    margin: 7,
    
    /*
     * Moves the box toward the mouse
     *
     * return boolean , If the game has been won
     */
    move: function(){
        
        var dx = dy = 0;
        
        switch (inputMode){
            case 0:
                dx += KeyBinding.isKeyDown("A") ? -1*Block.speed : 0;
                dx += KeyBinding.isKeyDown("D") ? 1*Block.speed : 0;
                dy += KeyBinding.isKeyDown("S") ? 1*Block.speed : 0;
                dy += KeyBinding.isKeyDown("W") ? -1*Block.speed : 0;
                break;
            
            case 1:
                // vel is normalize position to mouse, scale by speed
                // check for walls (pixels in a line in the cardinal directions)
                // move by vel, in allowed direciton
                dx = mouseX - Block.x;
                dy = mouseY - Block.y;
                var d = Math.sqrt(dx*dx + dy*dy);
                
                if (d > 0){
                    dx *= Block.speed/d;
                    dy *= Block.speed/d;
                }
                break;
            
            default:
                console.error("inputMode = " + inputMode + " has not been programmed.");
                break;
        }
        
        // check if you can move
        var dirx = dx > 0 ? 1 : dx < 0 ? 3 : -1;
        var diry = dy > 0 ? 0 : dy < 0 ? 2 : -1;
        
        var fx = Block.lookAround(dirx);
        var fy = Block.lookAround(diry);
        
        if (fx == 0 || fy == 0){
            Block.x += dx;
            Block.y += dy;
            
            fx = fx || Block.lookAround(dirx);
            fy = fy || Block.lookAround(diry);
            
            Block.x -= dx;
            Block.y -= dy;
        }
        
        if (fx==1)
            dx=0;
        if (fy==1)
            dy=0;
        
        if (dx != 0 || dy != 0){
            Block.erase();
            //c_block.c.clearRect(0,0,800,800);
            Block.x += dx;
            Block.y += dy;
            Block.draw();
        }
        
        return (fx == 2 || fy == 2); 
        
    },
    
    lookAround: function(dir){
        // -1: don't check, 0: up, 1: right, 2: down, 3: left];
        if (dir < 0) return 1;
        
        // make it check all around the perimeter of the block to determine whether that side is going to hit a line
        var flag = 0;
        var i, limit, vx=1, vy=0;
        limit = (gridW/2) - Block.margin;
        if (dir%2==1){
           limit = (gridH/2) - Block.margin;
           vx=0;
           vy=1;
        }
        dRadius = 0;
        while (flag==0 && dRadius <= Block.speed){
            i = -limit;
            while (flag==0 && i <= limit){
                flag = checkMazePixel(Block.x + i*vx + vy*directions[dir][0]*(gridW*0.5 - Block.margin + dRadius) , Block.y + i*vy + vx*directions[dir][1]*(gridH*0.5 - Block.margin + dRadius));
                
                i++;
            }
            dRadius++;
        }
        
        return flag;
    },
    
    drawAround: function(dir){
        // -1: don't check, 0: up, 1: right, 2: down, 3: left];
        if (dir < 0) return;
        
        // make it check all around the perimeter of the block to determine whether that side is going to hit a line
        var flag = 0;
        var i, limit, vx=1, vy=0;
        limit = (gridW/2) - Block.margin;
        if (dir%2==1){
           limit = (gridH/2) - Block.margin;
           vx=0;
           vy=1;
        }
        dRadius = 0;
        while (flag==0 && dRadius <= Block.speed){
            i = -limit;
            while (flag==0 && i <= limit){
                c_block.c.fillStyle = "red";
                c_block.c.fillRect(Block.x + i*vx + vy*directions[dir][0]*(gridW*0.5 - Block.margin + dRadius) , Block.y + i*vy + vx*directions[dir][1]*(gridH*0.5 - Block.margin + dRadius),1,1);
                c_block.c.fillStyle = "lime";
                
                i++;
            }
            dRadius++;
        }
    },
    
    draw: function(){
        c_block.c.fillRect(Block.x - gridW/2 + Block.margin, Block.y - gridH/2 + Block.margin, gridW - 2*Block.margin, gridH - 2*Block.margin);
    },
    
    erase: function(){
        c_block.c.clearRect(Block.x - gridW/2, Block.y - gridH/2 , gridW , gridH);
    },
    
    moveToStart: function(){
        Block.x = mouseX = gridW/2;
        Block.y = mouseY = gridH/2;        
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

/*
 * Checks the block canvas at a specific pixel
 *
 * int x , x-coordinate to check
 *
 * int y , y-coordinate to check
 *
 * return int , 0: nothing, 1: colored
 */
function checkBlockPixel(x, y){
    x = x < 0 ? 0 : x < c_block.width ? ~~x : c_block.width;
    y = y < 0 ? 0 : y < c_block.height ? ~~y : c_block.height;
    
    var i = x*4 + y*c_block.width*4;
    var result = 0;
    
    // if is colored
    if (c_block.data[i+3]){
        result++;
    }
    
    return result;
}