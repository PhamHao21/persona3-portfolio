<script>
	import P3Menu from '$lib/components/P3Menu.svelte';
	import WaterTransition from '$lib/components/WaterTransition.svelte';
	import bgVideo from '$lib/assets/main1.mp4';
	import { takeMenuEntrance } from '$lib/utils/menuEntrance.js';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	const playMenuEntrance = takeMenuEntrance();

	let menuReady = $state(!playMenuEntrance);
	let revealScene = $state(!playMenuEntrance);

	function handleWaterComplete() {
		revealScene = true;
		menuReady = true;
	}

	function triggerWaterRipple(event) {
		return playRippleTransition(event);
	}
</script>

<div id="menu-screen" class:scene-ready={revealScene}>
	<video class="menu-bg-video" src={bgVideo} autoplay loop muted playsinline></video>
	<P3Menu ready={menuReady} onRipple={triggerWaterRipple} />
	{#if playMenuEntrance}
		<WaterTransition onComplete={handleWaterComplete} />
	{/if}
</div>

<style>
	.menu-bg-video {
		opacity: 0;
		transition: opacity 0.34s ease;
	}

	.scene-ready .menu-bg-video {
		opacity: 1;
	}
</style>
