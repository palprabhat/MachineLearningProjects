// Bouncy Ball
// Prabhat Pal (www.prabhatpal.com)

/**
 * [Create cloud of different size and speed]
 * @param {[Object]} s     [p5 canvas object]
 * @param {[Object]} cloud [cloud image object]
 */
function Cloud(s, cloud) {
	this.X = s.random(s.width, s.width + 500);
	this.Y = s.random(25, 150);
	this.height = s.random(10, 75);
	this.width = 2 * this.height;

	this.update = function() {
		this.X -= this.height / 75;
	}

	this.display = function() {
		s.image(cloud, this.X, this.Y, this.width, this.height);
	}
}