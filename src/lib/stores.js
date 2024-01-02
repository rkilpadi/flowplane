import { writable } from "svelte/store";

export const settings = writable({
    particleSize: 1,
    step: 0.02,
    trail: 10,
    perturbation: 0.5,
    perturbationCount:200,
    speedLimit: 2,
    enforceSpeedLimit: true,
    particleCount: 1000,
});

export const dx = writable('y');
export const dy = writable('-y-x');
// used to reset Sketch. {} === {} is false
export const unique = writable({ timestamp: Date.now() });
