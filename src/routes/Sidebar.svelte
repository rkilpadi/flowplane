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
    unique.set(Date.now());
  }

  async function copyUrl() {
    let urlParams = [];
    Object.keys($settings).forEach(setting => {
      urlParams.push(`${setting}=${$settings[setting]}`);
    });
    urlParams.push(`dx=${encodeURIComponent($dx)}`);
    urlParams.push(`dy=${encodeURIComponent($dy)}`);
    let url = `${window.location.origin}/?${urlParams.join('&')}`;
    try {
      await navigator.clipboard.writeText(url);
      console.log(`Copied ${url} to clipboard`);
    } catch (error) {
      alert(`${url}\nFailed to copy to clipboard, please copy manually\n${error}`);
      console.log(url);
    }
  }

</script>

{#if show}
  <nav transition:fly={{x: -250, opacity: 1}}>
    <button on:click={() => show = false}>Close</button>
    <button on:click={copyUrl}>Copy URL</button>
    <button on:click={updateEquations}>Play</button>
    <p>Documentation on these settings is up and coming - for now we experiment!</p>
    <label class="input-container1">ẋ
      <input
        type='text'
        bind:value={tempDx}  
        name='xdot'
      />
    </label>
    
    <label class="input-container1">ẏ 
      <input
        type='text'
        bind:value={tempDy}  
        name='ydot'
      />
    </label>

    <label> 
      Zoom
      <input
        type="range"
        min=1
        max=100
        bind:value={$settings.Zoom}
        name="Zoom"
      />
    </label>

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
        min=1
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
        name="trail"
      />
    </label>

    <label> 
      Perturbation
      <input
        type="range"
        min=0
        max=3
        step=0.1
        bind:value={$settings.perturbation}
        name="perturbation"
      />
    </label>

    <label> 
      Perturbation Particles
      <input
        type="range"
        min=10
        max=250
        bind:value={$settings.perturbationCount}
        name="perturbationCount"
      />
    </label>

    <label> 
      Particles
      <input
        type="range"
        min=0
        max=3000
        bind:value={$settings.particleCount}
        name="particleCount"
      />
    </label>

    <label> 
      Test Particles
      <input
        type="range"
        min=1
        max=55
        bind:value={$settings.testParticleCount}
        name="testParticleCount"
      />
    </label>

    <label> 
      Fixed Points Merge Distance
      <input
        type="range"
        min=1
        max=5
        bind:value={$settings.mergeDist}
        name="mergeDist"
      />
    </label>

    <label> 
      Off Screen Tolerance
      <input
        type="range"
        min=0
        max=5
        step = .1
        bind:value={$settings.offScreenTolerance}
        name="offScreenTolerance"
      />
    </label>

    <label for="speedLimitSlider">
      Speed Limit
      <input
        type="range"
        id="speedLimitSlider"
        min=0
        max=5
        step=.1
        bind:value={$settings.speedLimit}
        name="speedLimit"
        disabled={!$settings.enforceSpeedLimit}
      />
    </label>

    <label for="speedLimitCheckbox">Enforce Speed Limit
      <input
        type="checkbox"
        id="speedLimitCheckbox"
        bind:checked={$settings.enforceSpeedLimit}
      />
    </label>

    <label> 
      Stable Node Reset Radius
      <input
        type="range"
        min=.01
        max=5
        step = .01
        bind:value={$settings.stableRadius}
        name="stableRadius"
      />
    </label>

    <label> 
      Minimum Velocity Reset
      <input
        type="range"
        min=0.01
        max=10
        step=.01
        bind:value={$settings.minVelocity}
        name="minVelocity"
      />
    </label>

    <label> 
      Unstable Node Spawn Radius
      <input
        type="range"
        min=0.01
        max=1
        step=.01
        bind:value={$settings.unstableRadius}
        name="unstableRadius"
      />
    </label>
    
    <label> 
      Zoom
      <input
        type="range"
        min=1
        max=100
        bind:value={$settings.Zoom}
        name="Zoom"
      />
    </label>

    <label for="respawnBorderCheckbox">
      Respawn Partciles On the Border
      <input
        type="checkbox"
        id="respawnBorderCheckbox"
        bind:checked={$settings.respawnBorder}
      />
    </label>

    <label for="respawnUnstable">
      Respawn Partciles Near Unstable and Saddle Nodes
      <input
        type="checkbox"
        id="respawnUnstable"
        bind:checked={$settings.respawnUnstable}
      />
    </label>

    <label for="respawnRandom">
      Respawn Partciles Randomly
      <input
        type="checkbox"
        id="respawnRandom"
        bind:checked={$settings.respawnRandom}
      />
    </label> 

    <label for="drawFixedPointsBool">
      Draw Fixed Points
      <input
        type="checkbox"
        id="drawFixedPointsBool"
        bind:checked={$settings.drawFixedPointsBool}
      />
    </label>
  </nav>
{:else}
  <button on:click={() => show = true} class="menu">☰</button>
{/if}
<style>
    .input-container1 {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .input-container1 input {
        margin-left: 5px;
    }

    .menu {
        font-size: 1.75em; 
        padding: 5px 10px;  
        background-color: rgba(12, 12, 12, 0); 
        border: none; 
        border-radius: 40px; 
        cursor: pointer;
    }



    .slider-checkbox {
        display: flex;
        align-items: center;
    }

     .slider-container {
        display: block; /* or use 'flex' with 'flex-direction: column;' for more control */
        margin-bottom: 10px;
     }

     #speedLimitCheckbox {
        margin-right: 10px;
     }

     #speedLimitSlider {
        flex-grow: 1;
     }

    button, input, label, p {
        font-family: 'Roboto', sans-serif;
    }

    nav {
        background-color: rgba(3, 3, 3, 0.5);
        color: rgba(231, 231, 231, 0.932);
        padding: 10px;
        padding-bottom: 30px; /* Extra bottom padding */
        width: 200px;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        max-height: 100vh;
        overflow-y: auto;
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

  input[type=text] {
    border: 2px solid #9e9e9e;
    border-radius: 7px;
    font-size: 1em;
    padding:4px;
    width: 80%;
    background-color:  rgba(3, 3, 3, 0.7);
    color: #dfdfdf;
  }


</style>
