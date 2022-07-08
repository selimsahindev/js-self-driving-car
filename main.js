const BEST_NETWORK_DATA = 'best_network_data';
const DUMMY_CAR_COLOR = '#FF7777';
const MUTATION_FACTOR = 0.1;
const NUMBER_OF_CARS = 1000;

const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 680;
networkCanvas.height = 680;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Spawn AI cars
const cars = generateCars(NUMBER_OF_CARS);

// Initially assign the first car to the bestCar variable, read the best network data and overwrite car brain.
let bestCar = cars[0];
if (localStorage.getItem(BEST_NETWORK_DATA)) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem(BEST_NETWORK_DATA));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, MUTATION_FACTOR);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, DUMMY_CAR_COLOR, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, DUMMY_CAR_COLOR, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, DUMMY_CAR_COLOR, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, DUMMY_CAR_COLOR, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, DUMMY_CAR_COLOR, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, DUMMY_CAR_COLOR, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, DUMMY_CAR_COLOR, 'DUMMY', 2),
];

animate();

// Save best network data
function save() {
    localStorage.setItem(BEST_NETWORK_DATA, JSON.stringify(bestCar.brain));
}

// Discard best network data
function discard() {
    localStorage.removeItem(BEST_NETWORK_DATA);
}

// Restart simulation
function restart() {
    location.reload();
}

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, '#7777FF', 'AI'));
    }
    return cars;
}

function animate(time) {
    // Update other cars in the traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    // find the best car that goes the most distance.
    const bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

    // This resizes the canvas and also clears on every update.
    carCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    // Draw cars in traffic.
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }

    // Draw AI cars.
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    // We draw best car again after resetting globalAlpha to 1.0 to make it fully visible.
    carCtx.globalAlpha = 1.0;
    bestCar.draw(carCtx, true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 150;

    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
