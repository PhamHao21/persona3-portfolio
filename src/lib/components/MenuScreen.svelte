<script>
	import { onMount } from 'svelte';
	import P3Menu from '$lib/components/P3Menu.svelte';
	import WaterTransition from '$lib/components/WaterTransition.svelte';
	import entranceVideo from '$lib/assets/water-main-menu1.webm?url';
	import bgVideo from '$lib/assets/water-main-menu2.webm?url';
	import { takeMenuEntrance } from '$lib/utils/menuEntrance.js';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	const playMenuEntrance = takeMenuEntrance();
	const entranceToBackgroundOffsetSeconds = 1.45;
	const fallbackBackgroundStartTimeSeconds = 6.425;

	let menuReady = $state(!playMenuEntrance);
	let revealScene = $state(true);
	let entranceComplete = $state(!playMenuEntrance);
	let backgroundVideoElement = $state();
	let backgroundPrepared = false;

	function waitForMediaEvent(element, eventName, timeoutMs = 600) {
		return new Promise((resolve) => {
			let settled = false;
			const finish = () => {
				if (settled) return;
				settled = true;
				window.clearTimeout(timeout);
				element.removeEventListener(eventName, finish);
				resolve();
			};
			const timeout = window.setTimeout(finish, timeoutMs);
			element.addEventListener(eventName, finish, { once: true });
		});
	}

	function waitForRenderedVideoFrame(video) {
		return new Promise((resolve) => {
			let settled = false;
			const finish = () => {
				if (settled) return;
				settled = true;
				window.clearTimeout(timeout);
				resolve();
			};
			const timeout = window.setTimeout(finish, 600);

			if (typeof video.requestVideoFrameCallback === 'function') {
				video.requestVideoFrameCallback(finish);
			} else {
				window.requestAnimationFrame(() => window.requestAnimationFrame(finish));
			}
		});
	}

	function handleMenuReveal() {
		menuReady = true;
	}

	function getBackgroundSyncTime(entranceTime) {
		const duration = backgroundVideoElement?.duration;
		if (!Number.isFinite(duration) || duration <= 0) return fallbackBackgroundStartTimeSeconds;

		return (entranceTime + entranceToBackgroundOffsetSeconds) % duration;
	}

	async function prepareBackground() {
		if (!backgroundVideoElement || entranceComplete || backgroundPrepared) return;

		backgroundVideoElement.pause();
		const seeked = waitForMediaEvent(backgroundVideoElement, 'seeked');
		backgroundVideoElement.currentTime = fallbackBackgroundStartTimeSeconds;
		await seeked;
		backgroundPrepared = true;
	}

	async function handleWaterComplete({ entranceTime = 4.95 } = {}) {
		entranceComplete = true;
		if (!backgroundVideoElement) return;

		backgroundVideoElement.pause();
		const syncTime = getBackgroundSyncTime(entranceTime);
		if (!backgroundPrepared || Math.abs(backgroundVideoElement.currentTime - syncTime) > 0.08) {
			const seeked = waitForMediaEvent(backgroundVideoElement, 'seeked');
			backgroundVideoElement.currentTime = syncTime;
			await seeked;
		}
		await backgroundVideoElement.play().catch(() => {});
		await waitForRenderedVideoFrame(backgroundVideoElement);
	}

	function markBackgroundReady() {
		if (!backgroundVideoElement) return;

		if (!entranceComplete) {
			backgroundVideoElement.pause();
			return;
		}

		backgroundVideoElement.play().catch(() => {});
	}

	function triggerWaterRipple(event) {
		return playRippleTransition(event);
	}

	onMount(() => {
		if (!backgroundVideoElement || entranceComplete) return;

		const prepare = () => prepareBackground();
		if (backgroundVideoElement.readyState >= 1) {
			prepare();
		} else {
			backgroundVideoElement.addEventListener('loadedmetadata', prepare, { once: true });
		}

		return () => backgroundVideoElement?.removeEventListener('loadedmetadata', prepare);
	});
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
		loop
		muted
		oncanplay={markBackgroundReady}
		onloadeddata={markBackgroundReady}
		onloadedmetadata={prepareBackground}
		playsinline
		preload="auto"
	></video>
	<P3Menu ready={menuReady} onRipple={triggerWaterRipple} />
	{#if playMenuEntrance}
		<WaterTransition onReveal={handleMenuReveal} onComplete={handleWaterComplete} />
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
