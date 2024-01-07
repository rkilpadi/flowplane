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
</script>

<div class="app">
    {#key $unique}
        <div id="sketch">
            <Sketch />
        </div>
    {/key}

	<main>
		<Sidebar />
        <div class="signature"> Ryan & Drew </div>
	</main>
</div>

<style>
	#sketch {
		position: fixed !important;
		top: 0;
		left: 0;
		z-index: -1;
		animation: fadein 2s;
	}  

    .signature {
        position: fixed;
        bottom: 0;
        right: 0;
        color: rgba(192, 192, 192, 0.61);
        font-family: 'Great Vibes', cursive;
        padding: 10px;
        font-size: 1.5em;
        user-select: none;
    }
</style>
