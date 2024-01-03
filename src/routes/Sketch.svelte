<script>
    import P5 from 'p5-svelte';
    import { onDestroy } from 'svelte';
    import { settings, dx, dy } from '$lib/stores.js';
    import { evaluate } from 'mathjs';
    $: ({ step, drawFixedPointsBool, unstableRadius, particleSize, trail, perturbation, perturbationCount, particleCount, speedLimit, enforceSpeedLimit, stableRadius, minVelocity, offScreenTolerance, respawnBorder, respawnUnstable, respawnRandom } = $settings);
  
    let p5Instance;
    let particles = [];
    let fixedPoints = [];
    let fixedPointsTotals = [];
    let stage = 0;
    const initialFrames = 300;
    let framesLeft = initialFrames;
    let numFixedPoints = 0;
    let negateVelocity = true;

    const stability = Object.freeze({
        STABLE: Symbol("stable"),
        UNSTABLE: Symbol("unstable"),
        SADDLE: Symbol("saddle"),
        UNKNOWN: Symbol("unknown")
    });

    const sketch = (p5) => {

        p5Instance = p5;
        let xMin = -10;
        let xMax = 10;
        let yMin = -10*p5.windowHeight/p5.windowWidth;
        let yMax = 10*p5.windowHeight/p5.windowWidth;

        p5.setup = () => {
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
        }

        p5.draw = () => {
            p5.background(35, 30, 50, trail);
            if(drawFixedPointsBool){
                drawFixedPoints();
            }
            drawParticles();
            let newStage = framesLeft == initialFrames;
            framesLeft--;
            if (framesLeft <= 0 && stage < 3) {
                framesLeft = initialFrames;
                stage == 2 && numFixedPoints > 1 ? numFixedPoints-- : stage++;
                newStage = true;
            }

            switch (stage) {
                case 0:
                    if (newStage) initializeTestParticles();
                    findFixedPointsStage();
                    break;
                case 1:
                    if (newStage) initializeTestParticles();
                    negateVelocity = false;
                    p5.stroke('red');
                    findFixedPointsStage(newStage);
                    break;
                case 2:
                    if (newStage) particles = [];
                    findStabilityStage(newStage);
                    break;
                case 3:
                    if (newStage){
                        initializeParticles();
                        p5.clear();
                    }
                    console.log(particles.length, particleCount)
                    if (particles.length != particleCount){
                        initializeParticles();
                    }
                    moveParticles();
                    resetParticles();
                    break;
            }
        }

        function findFixedPointsStage() {
            moveParticles();
            resetParticles();
        }

        function findStabilityStage() {
            if (particles.length < perturbationCount) {
                let fixedPoint = fixedPoints[numFixedPoints-1]
                let offset = p5.TAU * (particles.length / perturbationCount);
                for (let i = 0; i < perturbationCount-1;i++){
                    particles.push(p5.createVector(fixedPoint.x + p5.cos(offset)*perturbation, fixedPoint.y + p5.sin(offset)*perturbation));
                    offset = p5.TAU * (particles.length / perturbationCount);
                }
            } else {
                moveParticles();
            }

            if (framesLeft == 100) {
                let point = fixedPoints[numFixedPoints-1];
                let close = 0;
                let far = 0;
                for (let i = 0; i < particles.length; i++) {
                    p5.dist(particles[i].x, particles[i].y, point.x, point.y) < perturbation ? close++ : far++;
                }
                if (far == 0) {
                    point.stability = stability.STABLE;
                    console.log('STABLE');
                } else if (close == 0) {
                    point.stability = stability.UNSTABLE;
                    console.log('UNSTABLE');
                } else {
                    point.stability = stability.SADDLE;
                    console.log('SADDLE');
                }
                console.log(close, far);
            }
        }

        function initializeTestParticles(particleTestCount = 30) {
            particles = [];
            for (let i = xMin; i < xMax; i += Math.abs(xMin - xMax)/particleTestCount) {
                for (let j = yMin; j < yMax; j += Math.abs(yMin - yMax)/particleTestCount) {
                    particles.push({ x: i, y: j });
                }
            }
        }

        function resetParticles() {

            for (let i = 0; i < particles.length; i++) {
                let particle = particles[i];
                let velocity = p5.createVector(xdot(particle.x, particle.y), ydot(particle.x, particle.y));

                let tooFarOffScreen = particle.x > xMax + offScreenTolerance ||
                                    particle.x < xMin - offScreenTolerance ||
                                    particle.y > yMax + offScreenTolerance ||
                                    particle.y < yMin - offScreenTolerance;
                let tooCloseToStablePoint = fixedPoints.some(point => 
                    point.stability == stability.STABLE && 
                    p5.dist(particle.x, particle.y, point.x, point.y) < stableRadius
                );

                let velocityTooLow = velocity.mag() < minVelocity;

                if (tooFarOffScreen || tooCloseToStablePoint || velocityTooLow) {
                let resetFunctions = [];

                // Add functions to the array based on the boolean flags
                if (respawnBorder) {
                    resetFunctions.push(() => resetParticleOnBorder(particle));
                }
                if (respawnUnstable) {
                    resetFunctions.push(() => resetParticleNearUnstablePoint(particle, unstableRadius));
                }
                if (respawnRandom) {
                    resetFunctions.push(() => resetRandomParticle(particle));
                }

                if (resetFunctions.length > 0) {                
                    let choice = Math.floor(p5.random(resetFunctions.length));
                    resetFunctions[choice](); 
                }
                }
            }
        }

        function resetRandomParticle(particle) {
            particle.x = p5.random(xMin, xMax);
            particle.y = p5.random(yMin, yMax);
        }
 
        function resetParticleOnBorder(particle) {
            let side = Math.floor(p5.random(4));
            switch (side) {
                case 0: // Top side
                    particle.x = p5.random(xMin, xMax);
                    particle.y = yMin;
                    break;
                case 1: // Right side
                    particle.x = xMax;
                    particle.y = p5.random(yMin, yMax);
                    break;
                case 2: // Bottom side
                    particle.x = p5.random(xMin, xMax);
                    particle.y = yMax;
                    break;
                case 3: // Left side
                    particle.x = xMin;
                    particle.y = p5.random(yMin, yMax);
                    break;
            }
        }

        function resetParticleNearUnstablePoint(particle, epsilon) {
            let unstablePoints = fixedPoints.filter(point => point.stability !== stability.STABLE);

            if (unstablePoints.length > 0) {
                let randomUnstablePoint = unstablePoints[Math.floor(Math.random() * unstablePoints.length)];
                let angle = p5.random(p5.TAU);
                let noiseFactor = p5.random(0.5 * epsilon, 4 * epsilon);
                particle.x = randomUnstablePoint.x + p5.cos(angle) * (epsilon + noiseFactor);
                particle.y = randomUnstablePoint.y + p5.sin(angle) * (epsilon + noiseFactor);
            } 
        }

        function drawFixedPoints() {
            p5.noStroke();
            p5.fill(255, 255, 255);
            const fixedPointSize = 8;
            for (let i = 0; i < fixedPoints.length; i++) {
                p5.ellipse(p5.map(fixedPoints[i].x, xMin, xMax, 0, p5.width), p5.map(fixedPoints[i].y, yMin, yMax, p5.height, 0), fixedPointSize, fixedPointSize);
            }
        }

        function initializeParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(p5.createVector(p5.random(xMin, xMax), p5.random(yMin, yMax)));
            }
        }

        function drawParticles() {
            p5.strokeWeight(particleSize);
            for (let i = 0; i < particles.length; i++) {
                p5.stroke('lightseagreen');
                let prevX = p5.map(particles[i].x, xMin, xMax, 0, p5.width);
                let prevY = p5.map(particles[i].y, yMin, yMax, p5.height, 0);
                p5.point(prevX, prevY);
            }
        }

        function moveParticles() {
            for (let i = 0; i < particles.length; i++) {
                let prevX = p5.map(particles[i].x, xMin, xMax, 0, p5.width);
                let prevY = p5.map(particles[i].y, yMin, yMax, p5.height, 0);

                let x = particles[i].x;
                let y = particles[i].y;
                let xDelta = xdot(x, y);
                let yDelta = ydot(x, y);

                let particleSpeed = p5.sqrt(xDelta * xDelta + yDelta * yDelta);

                if (particleSpeed > speedLimit && enforceSpeedLimit) {
                    let scaleFactor = speedLimit / particleSpeed;
                    xDelta *= scaleFactor;
                    yDelta *= scaleFactor;
                }

                if (negateVelocity) {
                    xDelta *= -1;
                    yDelta *= -1;
                }

                x += xDelta * step;
                y += yDelta * step;

                let tolerance = 0.2;
                let epsilon = 1;
                if (stage < 2 && particleSpeed < tolerance) {
                    let point = { x: particles[i].x, y: particles[i].y, stability: stability.UNKNOWN };
                    let foundPoint = false
                    for (let i = 0; i < fixedPoints.length; i++) {
                        if (p5.dist(fixedPoints[i].x, fixedPoints[i].y, point.x, point.y) < epsilon) {
                            fixedPoints[i].x = (fixedPoints[i].x * fixedPointsTotals[i] + point.x) / (fixedPointsTotals[i]+1);
                            fixedPoints[i].y = (fixedPoints[i].y * fixedPointsTotals[i] + point.y) / (fixedPointsTotals[i]+1);
                            fixedPointsTotals[i]++;
                            foundPoint = true;
                            break;
                        }
                    }
                    if (!foundPoint && point.x > xMin && point.x < xMax && point.y > yMin && point.y < yMax) {
                        fixedPoints.push(point);
                        numFixedPoints++;
                        fixedPointsTotals.push(1);
                        console.log('POINT FOUND', point);
                    }
                }

                let newX = p5.map(x, xMin, xMax, 0, p5.width);
                let newY = p5.map(y, yMin, yMax, p5.height, 0);

                p5.line(prevX, prevY, newX, newY);
                particles[i].x = x;
                particles[i].y = y;

            }
        }

        function xdot(x, y) {
            return evaluate($dx, { x: x, y: y });
        }

        function ydot(x, y) {
            return evaluate($dy, { x: x, y: y });
        }

        p5.windowResized = () => {
            particles = [];
            p5.canvas.remove();
            p5.setup();
        }
    }

    onDestroy(() => {
        p5Instance?.remove();
    });
</script>

<P5 {sketch} />
