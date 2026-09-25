<script>
	import { onMount } from 'svelte';
	import waterRiseVideo from '$lib/assets/water-main-menu1.webm?url';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	let {
		onReveal = () => {},
		onComplete = () => {},
		playEntrance: shouldPlayEntrance = true
	} = $props();

	const startDelayMs = 0;
	const playbackRate = 1;
	const revealAtSeconds = 1.25;
	const handoffAtSeconds = 4.95;
	const revealFallbackDurationMs = 2600;
	const fallbackDurationMs = 6200;
	const fallbackGraceMs = 350;
	const fadeOutMs = 250;

	let entranceVisible = $state(true);
	let entranceDone = $state(false);
	let handoffPending = false;
	let menuRevealed = $state(false);
	let blocking = $state(true);
	let videoStarted = $state(false);
	let entranceRemoveTimer;
	let entranceFallbackTimer;
	let revealFallbackTimer;
	let entranceStartTimer;
	let entranceProgressFrame;
	let videoElement = $state();

	function scheduleEntranceFallback(durationMs = fallbackDurationMs) {
		window.clearTimeout(entranceFallbackTimer);
		entranceFallbackTimer = window.setTimeout(() => {
			completeEntrance();
		}, durationMs);
	}

	function scheduleRevealFallback(durationMs = revealFallbackDurationMs) {
		window.clearTimeout(revealFallbackTimer);
		revealFallbackTimer = window.setTimeout(revealMenu, durationMs);
	}

	function revealMenu() {
		if (menuRevealed) return;

		menuRevealed = true;
		blocking = false;
		window.clearTimeout(revealFallbackTimer);
		onReveal();
	}

	async function completeEntrance() {
		if (entranceDone || handoffPending) return;

		revealMenu();
		handoffPending = true;
		blocking = false;
		window.cancelAnimationFrame(entranceProgressFrame);
		window.clearTimeout(entranceFallbackTimer);
		try {
			await onComplete({ entranceTime: videoElement?.currentTime ?? handoffAtSeconds });
		} finally {
			entranceDone = true;
			handoffPending = false;
		}

		entranceRemoveTimer = window.setTimeout(() => {
			entranceVisible = false;
		}, fadeOutMs);
	}

	async function playEntranceVideo() {
		if (!videoElement || entranceDone || handoffPending) return;

		if (videoStarted) return;

		videoElement.muted = true;
		videoElement.load();
		videoElement.currentTime = 0;
		videoElement.playbackRate = playbackRate;
		videoStarted = true;
		videoElement.play().then(monitorEntranceProgress).catch(completeEntrance);
	}

	function monitorEntranceProgress() {
		if (!videoElement || entranceDone) return;

		if (!menuRevealed && videoElement.currentTime >= revealAtSeconds) {
			revealMenu();
		}

		if (videoElement.currentTime >= handoffAtSeconds) {
			completeEntrance();
			return;
		}

		entranceProgressFrame = window.requestAnimationFrame(monitorEntranceProgress);
	}

	function handleLoadedMetadata() {
		if (!videoElement) return;

		const rate = videoElement.playbackRate || 1;
		const revealDurationMs = Math.ceil((revealAtSeconds / rate) * 1000) + fallbackGraceMs;
		const durationMs = Math.ceil((handoffAtSeconds / rate) * 1000) + fallbackGraceMs;

		scheduleRevealFallback(revealDurationMs);
		scheduleEntranceFallback(durationMs);
	}

	function skipEntrance() {
		entranceDone = true;
		entranceVisible = false;
		blocking = false;
		revealMenu();
		onComplete({ entranceTime: 0 });
	}

	export function triggerRipple(event) {
		return playRippleTransition(event);
	}

	onMount(() => {
		let cancelled = false;

		if (!shouldPlayEntrance) {
			skipEntrance();
			return () => {};
		}

		entranceStartTimer = window.setTimeout(() => {
			if (!cancelled) playEntranceVideo();
		}, startDelayMs);

		scheduleEntranceFallback(fallbackDurationMs);
		scheduleRevealFallback(revealFallbackDurationMs);

		return () => {
			cancelled = true;
			window.clearTimeout(entranceRemoveTimer);
			window.clearTimeout(entranceFallbackTimer);
			window.clearTimeout(revealFallbackTimer);
			window.clearTimeout(entranceStartTimer);
			window.cancelAnimationFrame(entranceProgressFrame);
		};
	});
</script>

<div class="water-transition" aria-hidden="true">
	{#if entranceVisible}
		<div class:blocking class:done={entranceDone} class="water-entrance">
			<video
				bind:this={videoElement}
				autoplay
				class:started={videoStarted}
				class="water-rise-video"
				muted
				onloadeddata={playEntranceVideo}
				onloadedmetadata={handleLoadedMetadata}
				onended={completeEntrance}
				playsinline
				preload="auto"
				src={waterRiseVideo}
			></video>
		</div>
	{/if}
</div>

<style>
	.water-transition {
		position: fixed;
		inset: 0;
		z-index: 5;
		pointer-events: none;
	}

	.water-entrance {
		position: fixed;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		opacity: 1;
		transition: opacity 0.25s linear;
		background: #12d7f2;
		overflow: hidden;
	}

	.water-entrance.done {
		opacity: 0;
		pointer-events: none;
	}

	.water-entrance.blocking {
		pointer-events: none;
	}

	.water-rise-video {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		display: block;
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		transform: translateZ(0);
		opacity: 0;
	}

	.water-rise-video.started {
		opacity: 1;
	}

</style>
