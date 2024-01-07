<script>
	import Sketch from './Sketch.svelte';
	import Sidebar from './Sidebar.svelte';
    import { settings, dx, dy, unique } from '$lib/stores.js';
    import { page } from '$app/stores';

    Object.keys($settings).forEach(setting => {
        $settings[setting] = JSON.parse($page.url.searchParams.get(setting)) ?? $settings[setting];
    });
    dx.set(decodeURI($page.url.searchParams.get('dx') ?? $dx));
    dy.set(decodeURI($page.url.searchParams.get('dy') ?? $dy));
    let showSignature = true;
  let signatureText = 'Drew & Ryan'; // New variable for dynamic text

  function toggleSignature() {
    showSignature = !showSignature;
    signatureText = showSignature ? 'Drew & Ryan' : 'Hide'; // Change text based on state
  }
</script>

<div class="app">
    {#key $unique}
        <div id="sketch">
            <Sketch />
        </div>
    {/key}

	<main>
		<Sidebar />
                {#if showSignature}
        <button class="signature" 
                on:click={toggleSignature} 
                on:mouseover={() => signatureText = 'Hide'} 
                on:mouseout={() => signatureText = 'Drew & Ryan'}
                on:focus={() => signatureText = 'Hide'} 
                on:blur={() => signatureText = 'Drew & Ryan'}>
        <span class="signature-text">{signatureText}</span>
        </button>
{/if}

	</main>
</div>

<style>
      @import url('https://fonts.googleapis.com/css?family=Great+Vibes');
      .signature {
        position: fixed;
        bottom: 0;
        right: 0;
        color: rgba(192, 192, 192, 0.61); /* Translucent gray */
        font-family: 'Great Vibes', cursive; /* Specify the imported cursive font */
        padding: 1px;
        margin:10px;
        font-size: 1vw;
        user-select: none;
        cursor: pointer; /* Change cursor to indicate clickable */
        width:6vw;
        background: none;
        display:none;
        border:none;
    }
	#sketch {
		position: fixed !important;
		top: 0;
		left: 0;
		z-index: -1;
		animation: fadein 2s;
	}  

</style>
