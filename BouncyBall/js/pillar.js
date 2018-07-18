// Bouncy Ball
// Prabhat Pal (www.prabhatpal.com)

/**
 * [Gererate pillars with random gap position on different pillars]
 * @param {[Object]} s            [p5 canvas object]
 * @param {[Number]} groundHeight [height of the bottom pillar]
 */
function Pillar(s, groundHeight) {
    this.top = Math.floor(Math.random() * ((s.height - groundHeight - 250) - 50 + 1)) + 50;
    this.w = 80;
    this.space = 200;
    this.speed = 1.5;
    this.X = s.width;

    this.display = function() {
        s.fill(50, 205, 50);
        s.rect(this.X, -4, this.w, this.top);
        s.rect(this.X, this.top + this.space, this.w, s.height);
    }

    this.update = function() {
        this.X -= this.speed;
    }

    //did the ball collided with the pillar? return true if yes else false
    this.checkCollision = function(ball) {
        ball.posWrtPillar = Math.sqrt(Math.pow(ball.Y - (this.top + (this.space/100)), 2));
        if ((ball.Y - (ball.size / 2) <= this.top || ball.Y + (ball.size / 2) >= this.top + this.space) &&
            (ball.X + (ball.size / 2) >= this.X && ball.X - (ball.size / 2) <= this.X + this.w)) {
            return true;
        }
        return false;
    }
}