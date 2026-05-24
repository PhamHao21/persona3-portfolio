<script>
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import waterRiseVideo from '$lib/assets/water-frames/water-rise.webm?url';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	let { onComplete = () => {}, playEntrance: shouldPlayEntrance = true } = $props();

	const startDelayMs = 90;
	const fallbackDurationMs = 1300;

	let entranceVisible = $state(true);
	let entranceDone = $state(false);
	let blocking = $state(true);
	let videoStarted = $state(false);
	let entranceRemoveTimer;
	let entranceFallbackTimer;
	let entranceStartTimer;
	let videoElement = $state();
	let videoSrc = $state('');

	function completeEntrance() {
		if (entranceDone) return;

		entranceDone = true;
		blocking = false;
		onComplete();

		entranceRemoveTimer = window.setTimeout(() => {
			entranceVisible = false;
		}, 230);
	}

	async function playEntranceVideo() {
		if (!videoElement || entranceDone) return;

		if (!videoSrc) {
			videoSrc = waterRiseVideo;
			await tick();
		}

		if (videoStarted) return;

		videoElement.muted = true;
		videoElement.load();
		videoElement.currentTime = 0;
		videoElement.playbackRate = 0.9;
		videoStarted = true;
		videoElement.play().catch(() => {});
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

		entranceFallbackTimer = window.setTimeout(() => {
			if (!cancelled) completeEntrance();
		}, fallbackDurationMs);

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
			<div class="water-cover">
				<div class="water-swell"></div>
				<div class="water-glint water-glint-a"></div>
				<div class="water-glint water-glint-b"></div>
			</div>
			<video
				bind:this={videoElement}
				autoplay
				class:started={videoStarted}
				class="water-rise-video"
				muted
				onloadeddata={playEntranceVideo}
				onended={completeEntrance}
				playsinline
				preload="auto"
				src={videoSrc}
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
		pointer-events: auto;
		opacity: 1;
		transition: opacity 0.22s ease;
		background: #20d9f0;
		overflow: hidden;
	}

	.water-entrance.done {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.water-cover {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, #6ef2ff 0%, #17d0ec 48%, #038dc9 100%);
		overflow: hidden;
	}

	.water-swell {
		position: absolute;
		left: -10vw;
		right: -10vw;
		bottom: -22vh;
		height: 122vh;
		background:
			linear-gradient(180deg, rgba(185, 255, 255, 0.82) 0%, rgba(43, 222, 255, 0.72) 9%, rgba(0, 145, 218, 0.88) 52%, rgba(0, 70, 196, 0.92) 100%);
		clip-path: polygon(0 12%, 8% 8%, 18% 13%, 31% 7%, 43% 12%, 57% 6%, 70% 11%, 83% 7%, 100% 13%, 100% 100%, 0 100%);
		opacity: 0.7;
		transform: translate3d(0, 58%, 0);
		animation: water-cover-rise 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		will-change: transform;
	}

	.water-glint {
		position: absolute;
		left: -15vw;
		width: 130vw;
		height: 12vh;
		border-radius: 50%;
		background: rgba(210, 255, 255, 0.22);
		filter: blur(16px);
		transform: translate3d(-12vw, 0, 0) rotate(-2deg);
		animation: water-glint-slide 0.46s ease-out forwards;
		pointer-events: none;
	}

	.water-glint-a {
		top: 16vh;
	}

	.water-glint-b {
		top: 55vh;
		animation-delay: 0.06s;
		opacity: 0.55;
	}

	.water-entrance.blocking {
		pointer-events: auto;
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

	@keyframes water-cover-rise {
		0% {
			transform: translate3d(0, 58%, 0);
		}
		100% {
			transform: translate3d(0, -2%, 0);
		}
	}

	@keyframes water-glint-slide {
		0% {
			opacity: 0;
			transform: translate3d(-20vw, 0, 0) rotate(-2deg) scaleX(0.8);
		}
		35% {
			opacity: 0.8;
		}
		100% {
			opacity: 0;
			transform: translate3d(12vw, -3vh, 0) rotate(-2deg) scaleX(1.05);
		}
	}

</style>
