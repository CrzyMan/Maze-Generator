var grid, gridW, gridH;

function startGame(){
    generate();
    setGameMode();
    gameLogic[gameMode].setup();
}

/*
 * Generates the maze
 *
 * int columns , number of columns in the maze
 *
 * int rows , number of columns in the maze
 *
 * return void
 */
function generate(){
    
    // Reset and cleanup from potential last round
    cancelAnimationFrame(reqAnimId);
    mouseX = mouseY = 0;
    grid = [];
    pathStack = [];
    
    columns = r_c.value;
    rows = r_r.value;
    
    // Keep the columns and rows within bounds
    columns = columns >= 10 ? (columns <= 30 ? ~~columns : 30) : 10;
    rows = rows >= 10 ? (rows <= 30 ? ~~rows : 30) : 10;
    
    
    // empty and then fill the the grid

    for (var i = 0; i < columns; i++){
        grid.push(new Uint8Array(rows));
    }
    
    // clear and then draw the grid
    c_maze.c.clearRect(0,0,c_maze.width,c_maze.height);
    c_maze.c.lineWidth = 1;
    gridW = c_maze.width / columns;
    gridH = c_maze.height / rows;
    c_maze.c.beginPath();
    for(var i = 0; i < columns; i++){
        c_maze.c.moveTo(~~(gridW*i) + 0.5, 0);
        c_maze.c.lineTo(~~(gridW*i) + 0.5, c_maze.height);
    }
    
    for(var i = 0; i <= rows; i++){
        c_maze.c.moveTo(0, ~~(gridH*i) + 0.5);
        c_maze.c.lineTo(c_maze.width, ~~(gridH*i) + 0.5);
    }
    
    c_maze.c.closePath();
    c_maze.c.stroke();
    
    // set starting point
    var sx = randInt(columns-1);
    var sy = randInt(rows-1);
    //grid[sx][sy] = 1;
    pathStack.push([[sx, sy],null]);
    
    if (animation){
        runMazeGen();
    } else {
        while (stepMazeGenerate() == true){}
        
        finishSetUp();
    }
}

function finishSetUp(){
    grid = [];
    
    c_maze.c.fillStyle = "red";
    c_maze.c.fillRect((columns-1)*gridW + Block.margin, (rows-1)*gridH + Block.margin, gridW - 2*Block.margin, gridH - 2*Block.margin);
    c_maze.updateData();
    
    Block.moveToStart();
    Block.draw();
}

function runMazeGen(){
    if (stepMazeGenerate() == true)
        reqAnimId = requestAnimationFrame(runMazeGen);
    else{
        finishSetUp();
    }
}


// Stack to hold all of the possible paths ([[to],[from]])
var pathStack = [];

/*
 * Performs the next step in making the maze
 *
 * return Boolean , whether the step was executed or not (if not, the maze is done!)
 */
function stepMazeGenerate(){
    // Clear background canvas
    c_block.c.clearRect(0, 0, c_block.width, c_block.height);
    
    // Return false if the stack is empty
    if (pathStack.length == 0) return false;
    
    // Grab the reference ([current],[came from])
    var ref = pathStack.pop();
    
    // Draw spot where we are
    c_block.c.fillStyle = "lime";
    c_block.c.fillRect(ref[0][0]*gridW + Block.margin, ref[0][1]*gridH + Block.margin, gridW - 2*Block.margin, gridH - 2*Block.margin);
    
    if (ref[1] != null){
        // Make sure the position just arrived from is flagged as visited
        grid[ref[1][0]][ref[1][1]] = 1;
        
        // Erase the wall in the correct direction
        if (grid[ref[0][0]][ref[0][1]] == 0){
            eraseWall(ref[0], ref[1])
        }
        
        // Flag current position as visited
        grid[ref[0][0]][ref[0][1]] = 1;
    }
    
    
    
    // Produce potential moves
    var options = [];
    for (var i = 0; i < directions.length; i++){
        var nx = ref[0][0]+directions[i][0];
        var ny = ref[0][1]+directions[i][1];
        
        // if the new position is within the grid, and hasn't been visited yet
        if (nx >= 0 && nx < columns && ny >= 0 && ny < rows && grid[nx][ny] == 0){
            //           [newX, newY]
            options.push([nx, ny]);
        }
    }
    
    // Pick a move to do
    var move = options.length > 0 ? ~~(Math.random()*options.length) : -1;
    
    // if there is a move to be made
    if (move != -1){
        
        // Add the moves to the stack, the selected one last
        for(var i = 0; i < options.length; i++){
            if (i != move)
                pathStack.push([options[i], ref[0]]);
        }
        pathStack.push([options[move], ref[0]]);
    }
    
    return true;
}


/*
 * Produce random integer inclusively between the min and max
 *
 * int max , maximum value that the randInt() may return
 *
 * int min , minimum value that the randInt() may return
 *
 * return random integer inclusively between max and min
 */
function randInt(max, min){
    min = ~~min || 0;
    max = ~~max || 0;
    return ~~(min + (Math.random()*max - min + 1));
}


/*
 * Erases the wall between to blocks
 *
 * int[] to , [x, y] the grid space the generator is going to
 *
 * int[] from , [x, y] the grid space the generator is coming from
 *
 * return void
 */
function eraseWall(to, from){
    // supposing that to and from are neighbors
    var mx = ((to[0] + from[0])*gridW) >> 1;
    var my = ((to[1] + from[1])*gridH) >> 1;
    var w = (((to[0] + from[0] + 2)*gridW) >> 1) - mx;
    var h = (((to[1] + from[1] + 2)*gridH) >> 1) - my;
    c_maze.c.clearRect(mx + 1, my + 1, w - 1, h - 1);
}
/* */