class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        // PI means 180 degrees
        this.raySpread = Math.PI / 2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders) {
        this.#castRays(roadBorders);

        this.readings = [];

        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(this.#getReading(this.rays[i], roadBorders));
        }
    }

    #getReading(ray, roadBorders) {
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );

            if (touch) {
                touches.push(touch);
            }
        }

        if (touches.length == 0) {
            return null;
        } else {
            const offsets = touches.map((e) => e.offset);
            // ... operator is spreading the array into different individual values.
            const minOffset = Math.min(...offsets);
            // Return the touch with the minimum offset.
            return touches.find((e) => e.offset == minOffset);
        }
    }

    #castRays() {
        // Empty the rays array
        this.rays = [];

        for (let i = 0; i < this.rayCount; i++) {
            // Calculate the ray angle and add the angle of the car to rotate together.
            const rayAngle =
                lerp(
                    this.raySpread / 2,
                    -this.raySpread / 2,
                    // Avoid division by zero by checking if the ray count is equal to one.
                    this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
                ) + this.car.angle;

            // Starting point of the ray
            const start = {
                x: this.car.x,
                y: this.car.y,
            };
            // End point of the ray
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            };

            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        // Draw all the rays
        for (let i = 0; i < this.rays.length; i++) {
            let end = this.rays[i][1];

            // If there is a reading from the sensor, we set the end point to that reading.
            if (this.readings[i]) {
                end = this.readings[i];
            }

            ctx.lineWidth = 1.75;

            // Draw the line up to the end point.
            ctx.beginPath();
            ctx.strokeStyle = '#BBFFBB';
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw the rest of the line after the touch point.
            ctx.beginPath();
            ctx.strokeStyle = '#889988';
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}
