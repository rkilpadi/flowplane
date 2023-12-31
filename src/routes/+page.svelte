<script>
	import Sketch from './Sketch.svelte';
	import Sidebar from './Sidebar.svelte';
	import { unique } from '$lib/stores.js';
</script>

<div class="app">
	{#key $unique}
		<div id="sketch">
			<Sketch />
		</div>
	{/key}

	<main>
		<Sidebar />
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
</style>
