import { writable } from "svelte/store";

export const settings = writable({
    particleSize: 1,
    step: 0.02,
    trail: 10,
});

export const dx = writable('y');
export const dy = writable('-y-x');
// used to reset Sketch. {} === {} is false
export const unique = writable({});
