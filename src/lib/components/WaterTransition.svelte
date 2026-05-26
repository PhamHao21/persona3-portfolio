<script>
	import { onMount } from 'svelte';
	import waterRiseVideo from '$lib/assets/water-main-menu1.webm?url';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	let { onComplete = () => {}, playEntrance: shouldPlayEntrance = true } = $props();

	const startDelayMs = 0;
	const fallbackDurationMs = 640;
	const maxEntranceDurationMs = 820;
	const fadeOutMs = 140;

	let entranceVisible = $state(true);
	let entranceDone = $state(false);
	let blocking = $state(true);
	let videoStarted = $state(false);
	let entranceRemoveTimer;
	let entranceFallbackTimer;
	let entranceStartTimer;
	let videoElement = $state();

	function scheduleEntranceFallback(durationMs = fallbackDurationMs) {
		window.clearTimeout(entranceFallbackTimer);
		entranceFallbackTimer = window.setTimeout(() => {
			completeEntrance();
		}, durationMs);
	}

	function completeEntrance() {
		if (entranceDone) return;

		entranceDone = true;
		blocking = false;
		window.clearTimeout(entranceFallbackTimer);
		onComplete();

		entranceRemoveTimer = window.setTimeout(() => {
			entranceVisible = false;
		}, fadeOutMs);
	}

	async function playEntranceVideo() {
		if (!videoElement || entranceDone) return;

		if (videoStarted) return;

		videoElement.muted = true;
		videoElement.load();
		videoElement.currentTime = 0;
		videoElement.playbackRate = 0.9;
		videoStarted = true;
		videoElement.play().catch(() => {});
	}

	function handleLoadedMetadata() {
		if (!videoElement) return;

		const rate = videoElement.playbackRate || 1;
		const duration = videoElement.duration;
		const durationMs =
			Number.isFinite(duration) && duration > 0
				? Math.min(Math.ceil((duration / rate) * 1000) + fadeOutMs, maxEntranceDurationMs)
				: fallbackDurationMs;

		scheduleEntranceFallback(durationMs);
	}

	function skipEntrance() {
		entranceDone = true;
		entranceVisible = false;
		blocking = false;
		onComplete();
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

		return () => {
			cancelled = true;
			window.clearTimeout(entranceRemoveTimer);
			window.clearTimeout(entranceFallbackTimer);
			window.clearTimeout(entranceStartTimer);
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
		z-index: 200;
		pointer-events: none;
	}

	.water-entrance {
		position: fixed;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		opacity: 1;
		transition: opacity 0.22s ease;
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
