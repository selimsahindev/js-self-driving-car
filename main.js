const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, '#7777FF', 'AI');
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, '#FF7777', 'DUMMY', 2),
];

animate();

function animate() {
    // Update other cars in the traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    car.update(road.borders, traffic);

    // This resizes the canvas and also clears on every update.
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
    }
    car.draw(ctx);

    ctx.restore();

    requestAnimationFrame(animate);
}
