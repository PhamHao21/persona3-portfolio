<script>
	import P3Menu from '$lib/components/P3Menu.svelte';
	import WaterTransition from '$lib/components/WaterTransition.svelte';
	import entranceVideo from '$lib/assets/water-main-menu1.webm?url';
	import bgVideo from '$lib/assets/water-main-menu2.webm?url';
	import { takeMenuEntrance } from '$lib/utils/menuEntrance.js';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	const playMenuEntrance = takeMenuEntrance();

	let menuReady = $state(true);
	let revealScene = $state(true);
	let backgroundVideoElement = $state();

	function handleWaterComplete() {
		menuReady = true;
	}

	function markBackgroundReady() {
		backgroundVideoElement?.play().catch(() => {});
	}

	function triggerWaterRipple(event) {
		return playRippleTransition(event);
	}
</script>

<svelte:head>
	<link rel="preload" href={entranceVideo} as="video" type="video/webm" />
	<link rel="preload" href={bgVideo} as="video" type="video/webm" />
</svelte:head>

<div id="menu-screen" class:scene-ready={revealScene}>
	<video
		bind:this={backgroundVideoElement}
		class="menu-bg-video"
		src={bgVideo}
		autoplay
		loop
		muted
		oncanplay={markBackgroundReady}
		onloadeddata={markBackgroundReady}
		onloadedmetadata={markBackgroundReady}
		playsinline
		preload="auto"
	></video>
	<P3Menu ready={menuReady} onRipple={triggerWaterRipple} />
	{#if playMenuEntrance}
		<WaterTransition onComplete={handleWaterComplete} />
	{/if}
</div>

<style>
	.menu-bg-video {
		opacity: 0;
		transition: opacity 0.22s ease;
	}

	.scene-ready .menu-bg-video {
		opacity: 1;
	}
</style>

