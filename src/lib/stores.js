import { writable } from "svelte/store";

export const settings = writable({
    particleSize: 1,
    step: 0.02,
    trail: 10,
    perturbation: 0.5,
    perturbationCount: 100,
    speedLimit: 2,
    enforceSpeedLimit: true,
    particleCount: 1000,
    respawnRandom: true,
    respawnUnstable: true,
    respawnBorder: true,
    minVelocity: 0.05,
    stableRadius: 0.1,
    offScreenTolerance: 1,
    unstableRadius:0.1,
    drawFixedPointsBool: true,
});

export const dx = writable('-y');
export const dy = writable('y+x');
export const unique = writable({ timestamp: Date.now() });

