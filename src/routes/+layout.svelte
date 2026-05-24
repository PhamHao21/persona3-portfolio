<script>
	import RippleShaderOverlay from '$lib/components/RippleShaderOverlay.svelte';
	import '$lib/utils/menuEntrance.js';
	import '$lib/styles/app.css';

	let { children } = $props();
</script>

{@render children()}
<RippleShaderOverlay />
