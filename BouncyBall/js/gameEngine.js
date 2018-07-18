// Bouncy Ball
// Prabhat Pal (www.prabhatpal.com)

//global variables
var tile;
var groundTiles;
var Y_norm;
var X_norm;
var top_norm;
var balls = [];
var deadBalls = [];
var ground = [];
var clouds = [];
var pillar = [2];
var population = 100;
var tileWidth = 18;
var index = 0;
var index_pillar = 0;
var gravity = 0.5;
var force = -15;
var wd = ($(window).width() < 768) ? $(window).width() : 450;
var ht = wd * 1.35;
var changeIndexFlag = true;
var generation = 1;
var bestScore = 0;
var speed = 1;
var pillarOffset = 30;


/**
 * [Initialize game parameter, set action for key or mouse pressed, provide game flow]
 * @param  {[String]} game [id of the HTML div where the canvas will be rendered]
 * @return {[Object]}      [p5 object]
 */
var gameWindow = function(game) {
    game.preload = function() {
        tile = game.loadImage("images/ground.png");
        title = game.loadImage("images/bouncy-ball.png");
        cloud = game.loadImage("images/cloud.png");
    };

    game.setup = function() {
        cnv = game.createCanvas(wd, ht);
        cnv.class("box-shadow");
        game.strokeWeight(4);
        game.stroke(84, 56, 71);
        createCloud();
        startGame(true);
    };

    game.draw = function() {
        document.getElementById("generation").innerHTML = generation;
        document.getElementById("best_score").innerHTML = bestScore;

        for (var i = 0; i < speed; i++) {
            generatePillars();
            moveGround();
            moveCloud();
            for (var p in pillar) {
                pillar[p].update();
            }

            for (var ball in balls) {
                balls[ball].update(gravity, ground[0].height);
            }

            for (var ball in balls) {
                Y_norm = balls[ball].Y / (game.height - ground[0].height);
                X_norm = (pillar[index_pillar].X - balls[ball].X) / (game.width - balls[ball].X - pillarOffset);
                top_norm = (pillar[index_pillar].top + 100) / game.height;

                var thought = balls[ball].predict([X_norm, Y_norm - top_norm]);

                if (thought[0] > 0.5) {
                    balls[ball].applyForce(force);
                }

                document.getElementById("score").innerHTML = balls[ball].score;
                if (bestScore < balls[ball].score) {
                    bestScore = balls[ball].score;
                }

                if (pillar[index_pillar].checkCollision(balls[ball]) || balls[ball].fallen(ground[0].height)) {
                    var deadBall = balls.splice(ball, 1);
                    deadBalls.push(deadBall[0]);

                    if (balls.length == 0) {
                        evolve(deadBalls);
                        deadBalls = [];
                        generation++;
                        startGame(false);
                    }
                }
                document.getElementById("alive").innerHTML = balls.length + "/" + population;

                if (changeIndexFlag) {
                    if (pillar[index_pillar].X + pillar[index_pillar].w <= balls[ball].X - balls[ball].size) {
                        index_pillar = (index_pillar + 1) % 2;
                    }
                }
                changeIndexFlag = false;
            }
            changeIndexFlag = true;
        }

        game.background(135, 206, 235);

        for (var c in clouds) {
            clouds[c].display();
        }

        for (var p in pillar) {
            pillar[p].display();
        }

        for (var ball in balls) {
            balls[ball].display();
        }

        for (var t in ground) {
            ground[t].display();
        }

    };
};
var canvas = new p5(gameWindow, 'gameWindow');

//initialize paramaters
function initialize(createBalls) {
    index = 0;
    index_pillar = 0;

    groundTiles = canvas.width / tileWidth + 2;

    createGround();
    var brain = null;

    if (createBalls) {
        for (var i = 0; i < population; i++) {
            balls[i] = createBall();
        }
    }

    pillar[index] = new Pillar(canvas, ground[0].height);
    pillar[index].X += pillarOffset;
}

//create new ball
function createBall(brain) {
    if (brain) {
        return new Ball(canvas, brain);
    } else {
        return new Ball(canvas, new NeuralNetwork(2, 6, 1, 1, 0.1));
    }
}

//start the game
function startGame(flag) {
    pillar = [2];
    initialize(flag);
    pillar[index];
}

//update ball and pillar position and display them during the game is played 
function playGame(flag) {
    for (var p in pillar) {
        pillar[p].update(flag);
        pillar[p].display();
    }

    for (var ball in balls) {
        balls[ball].update(gravity, ground[0].height);
        balls[ball].display();
    }
}

//apply fixed force to the ball
function applyForce() {
    ball.applyForce(force);
}

//create new pillars and destroy the pillars which are outside the frame
function generatePillars() {
    if (pillar[index].X <= wd * 0.4) {
        index = (index + 1) % 2
        pillar[index] = new Pillar(canvas, ground[0].height);
    }
}

//create ground of size of the game window
function createGround() {
    for (i = 0; i < groundTiles; i++) {
        ground[i] = new Ground(canvas, tile, i * tileWidth);
    }
}

//move the ground during the game play
function moveGround() {
    for (var t in ground) {
        ground[t].update();
        if (ground[t].X <= -tileWidth) {
            ground[t] = new Ground(canvas, tile, canvas.width);
        }
    }
}

//create clouds
function createCloud() {
    for (i = 0; i < 5; i++) {
        clouds[i] = new Cloud(canvas, cloud);
    }
}

//move clouds
function moveCloud() {
    for (var c in clouds) {
        clouds[c].update();
        if (clouds[c].X + clouds[c].width <= 0) {
            clouds[c] = new Cloud(canvas, cloud);
        }
    }
}