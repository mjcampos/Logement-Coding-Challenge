/*

interface Point {
	x: number;
	y: number;
}

function getClosestPointInsidePolygon(poly: Point[], pos: Point): Point {
// This function should return the closest point to "pos" that is inside the polygon defined by "poly"
}

example input:
getClosestPointInsidePolygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ], { x: 150, y: 50 }) should return { x: 100, y: 50 }. This should also work with shapes more complex than a square.

*/

// Vector class
var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

// dot product of two vectors
Vector.prototype.dotProduct = function(v2) {
	return this.x * v2.x + this.y *v2.y;
}

// get the magnitude of the vector
Vector.prototype.getMagnitude = function() {
	// use pythagoras theorem to work out the magnitude of the vector
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Array.min = array => Math.min.apply( Math, array );


function getClosestPointInsidePolygon(poly, point) {
	// Start off by collecting the distances of the point to the center of each consective p position in the poly
    var distances = poly.map((p2, i) => {
    	// Traverse through each p position and get its previous p position
    	var prev = (i == 0 ? poly.length : i) - 1;
        var p1 = poly[prev];

        /*
			Get the vectors from the following points
			- p1 to p2
			- p1 to point
			- p2 to point
        */
        var p1p2Diff = new Vector((p2.x - p1.x), p2.y - p1.y);
        var pointp1diff = new Vector((point.x - p1.x), (point.y - p1.y));
        var p2pointDiff = new Vector((p2.x - point.x), (p2.y - point.y));

        // Get the dot product of the difference between p1 and p2, and the point and p1
        var r = p1p2Diff.dotProduct(pointp1diff);

        // Divide r by the cubed of the magnitude of the p1-p2 diff vector
        r = r / Math.pow(p1p2Diff.getMagnitude(), 2);

        // If r is less than 0 then return magnitude of the point-p1 vector diff
        if (r < 0) {
        	return pointp1diff.getMagnitude();

        // If r is greater than 1 then return magnitude of point-p2 vector diff
        } else if(r > 1) {
        	return p2pointDiff.getMagnitude();

        // If r is between 0 & 1 then return the square root of the cubed differences between point-p1 and p1-p2 vectors
        } else {
        	return Math.sqrt(Math.pow(pointp1diff.getMagnitude(), 2) - Math.pow(r * p1p2Diff.getMagnitude(), 2));
        }
    });

    // Get the two nearest positions, left and right, in the poly to the point
    var shortestDist = Array.min(distances);
    var shortestDistLoc = distances.indexOf(shortestDist);
    var p1 = (shortestDistLoc === 0) ? poly[poly.length - 1] : poly[shortestDistLoc - 1];
    var p2 = poly[shortestDistLoc];

    // From experimentally moving the point to different angles of the polygon I notice that if r is less than 0 then the closest p position in the polygon is p1, often on its left of its shortest distance. If r is greater than 1 then it's closest to its p2 position in the polygon, often on its right of its shortest distance
    // So I gather the r again
    var p1p2Diff = new Vector((p2.x - p1.x), p2.y - p1.y);
    var pointp1diff = new Vector((point.x - p1.x), (point.y - p1.y));

    var r = p1p2Diff.dotProduct(pointp1diff);

    r = r / Math.pow(p1p2Diff.getMagnitude(), 2);

    // I check if r is less than 0 or greater than 1 and return either p1 or p2 as the point closest to the polygon
    if (r < 0) {
    	return p1;
    } else if(r > 1) {
    	return p2;
    } else {
    	// Check is shortestDist is between X values if there is no slope between p1 and p2
    	if(p1.x === p2.x) {
    		// Get the lowest and highest X points
    		var lowerYStartingPoint = Math.min(p1.y, p2.y);
            var highStartingYPoint = Math.max(p1.y, p2.y);
            var iterator = lowerYStartingPoint;  // We'll be traversing the x-axis from the lowest point in lowerYStartingPoint to its highest in highStartingYPoint

            // We know Y will always be consistent, so we need to find an X value that if placed in a pythagorean equation with the point should match the shortest distance
	    	while(iterator < highStartingYPoint) {
	            if (shortestDist === Math.sqrt(Math.pow((point.x - p1.x), 2) + Math.pow(point.y - iterator, 2))) {
	            	// If so then return the constant X and iterator as the Y-value
	                return {
	                    x: p1.x,
	                    y: iterator 
	                }
	            } else {
	            	// Else increase iteration by the r-value and repeat
	                iterator += r;
	            }
	        }

	    // Check is shortestDist is between Y values if there is no slope between p1 and p2
    	} else if(p1.y === p2.y) {
    		// Get the lowest and highest Y points
    		var lowerXStartingPoint = Math.min(p1.x, p2.x);
            var highStartingXPoint = Math.max(p1.x, p2.x);
            var iterator = lowerXStartingPoint;  // We'll be traversing the y-axis from the lowest point in lowerXStartingPoint to its highest in highStartingXPoint

            // We know X will always be consistent, so we need to find an Y value that if placed in a pythagorean equation with the point should match the shortest distance
            while(iterator < highStartingXPoint) {
            	if(shortestDist === Math.sqrt(Math.pow((point.x - iterator), 2) + Math.pow((point.y - p1.y), 2))) {
            		// If so then return the constant Y and iterator as the X-value
            		return {
            			x: iterator,
            			y: p1.y
            		}
            	} else {
            		// Else increase iteration by the r-value and repeat
            		iterator += r;
            	}
            }
    	} else {
    		// If the code makes it this far then it's safe to say that the point is located between a p1 & p2 line that is not purely horizontal or vertical. So we'll be traversing through the X-axis, starting with the lowest value between the two p values
    		var lowerXStartingPoint = Math.min(p1.x, p2.x);
            var highStartingXPoint = Math.max(p1.x, p2.x);
            var iterator = lowerXStartingPoint;  // We'll be traversing the y-axis from the lowest point in lowerXStartingPoint to its highest in highStartingXPoint

        	var slope = (p2.y - p1.y)/(p2.x - p1.x);  // A slope exists in this condition
        	var b = p1.y - (slope * p1.x);  // Get the b value of the line equation by f(b) = y - mx

            // We know that the closest point to the point is somewhere between the lowerXStartingPoint and highStartingXPoint values. So we'll need to iterate between them
            while(iterator <= highStartingXPoint) {
            	var localY = (slope * iterator) + b;  // Get the local y using the line equation of y = mx + b. x = iterator
            	var localDist = Math.sqrt(Math.pow((point.x - iterator), 2) + Math.pow((point.y - localY), 2));  // With iterator as the x-value and the localy as the y-value use the pythagorean theorem to get the distance between the point of the iterator's location on the p1-p2 vertex

            	// If the localDist matches the shortest distance then we have our shortest point to the point-value
            	if (localDist.toFixed(1) === shortestDist.toFixed(1)) {
            		// Return the X-value as the iterator and Y-value as the localY
            		return {
            			x: iterator,
            			y: localY
            		}
            	}

            	// Else increase iterator by r-value
            	iterator += r;
            }
    	}
    }
}

// Expect { x: 100, y: 50 }
console.log(getClosestPointInsidePolygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ], { x: 150, y: 50 }));