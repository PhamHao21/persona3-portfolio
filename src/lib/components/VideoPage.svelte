<script>
	import { onMount } from 'svelte';

	let { src } = $props();

	onMount(() => {
		const onKey = (event) => {
			if (event.key === 'ArrowLeft' || event.key === 'Escape' || event.key === 'Backspace') {
				history.back();
			}
		};

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<div id="menu-screen">
	<video {src} autoplay loop muted playsinline></video>
</div>
