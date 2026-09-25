<script>
	import RippleShaderOverlay from '$lib/components/RippleShaderOverlay.svelte';
	import '$lib/utils/menuEntrance.js';
	import '$lib/styles/app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<meta name="theme-color" content="#061044" />
</svelte:head>

{@render children()}
<RippleShaderOverlay />
