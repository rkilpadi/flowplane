<script>
  import { fly } from 'svelte/transition';
  import { settings, dx, dy, unique } from '$lib/stores.js';
  import { evaluate } from 'mathjs';

  export let show = false;
  let tempDx = $dx;
  let tempDy = $dy;

  function updateEquations() {
    try {
      evaluate(tempDx, {x: 0, y: 0});
      evaluate(tempDy, {x: 0, y: 0});
    } catch (error) {
      alert(`Invalid expression: ${error.message}`);
      return;
    }
    dx.set(tempDx);
    dy.set(tempDy);
    unique.set({});
  }
</script>

{#if show}
  <nav transition:fly={{x: -250, opacity: 1}}>
    <button on:click={() => show = false}>x</button>

    <input
      type='text'
      bind:value={tempDx}  
    />

    <input
      type='text'
      bind:value={tempDy}  
    />

    <button on:click={updateEquations}>Play</button>

    <label> 
      Step Size
      <input
        type="range"
        min=0
        max=0.2
        step=0.01
        bind:value={$settings.step}
        name="step"
      />
    </label>

    <label> 
      Particle Size
      <input
        type="range"
        min=0
        max=10
        bind:value={$settings.particleSize}
        name="particleSize"
      />
    </label>

    <label> 
      Trail
      <input
        type="range"
        min=0
        max=100
        bind:value={$settings.trail}
        name="particleSize"
      />
    </label>
  </nav>
{:else}
  <button on:click={() => show = true}>☰</button>
{/if}

<style>
  nav {
    background-color: rgba(3, 3, 3, 0.5);
    color: white;
    padding: 10px;
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1;
  }

  button {
    border: none;
    cursor: pointer;
    outline: none;
    background-color: Transparent;
    color: #c1c1c1;
    text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
    margin-bottom: 20px;
   }

  button:hover {
    color: #fff;
  }

  input {
    display: block;
    accent-color: lightseagreen;
    margin-bottom: 10px;
  }

  label {
    display: block;
    margin-bottom: 20px;
  }
</style>
