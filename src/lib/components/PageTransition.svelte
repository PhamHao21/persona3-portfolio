<script>
	import { onMount } from 'svelte';

	let { children, variant = 'about' } = $props();
	let showOverlay = $state(true);

	onMount(() => {
		const timer = window.setTimeout(() => {
			showOverlay = false;
		}, 1120);

		return () => window.clearTimeout(timer);
	});
</script>

<div class="transition-shell">
	<div class="transition-content">
		{@render children?.()}
	</div>

	{#if showOverlay}
		<div class="transition-overlay {variant}" aria-hidden="true">
			<div class="screen-flash"></div>
			<div class="shard shard-one"></div>
			<div class="shard shard-two"></div>
			<div class="shard shard-three"></div>
			<div class="shard shard-four"></div>
			<div class="red-strike"></div>
		</div>
	{/if}
</div>

<style>
	.transition-shell {
		position: relative;
		min-height: 100vh;
		background: #061044;
	}

	.transition-content {
		will-change: transform, opacity;
		animation: content-reveal 0.72s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
	}

	.transition-overlay {
		--accent: #67efff;
		position: fixed;
		inset: 0;
		z-index: 999;
		pointer-events: none;
		overflow: hidden;
	}

	.transition-overlay.projects { --accent: #ff4c6d; }
	.transition-overlay.tech { --accent: #8af5ff; }
	.transition-overlay.work { --accent: #ffffff; }

	.screen-flash {
		position: absolute;
		inset: 0;
		background: #06124e;
		animation: flash-out 0.72s ease-out both;
	}

	.shard {
		position: absolute;
		left: -28vw;
		width: 156vw;
		height: 28vh;
		transform: rotate(-9deg) translateX(0);
		transform-origin: center;
		clip-path: polygon(0 0, 96% 0, 100% 100%, 4% 100%);
		will-change: transform;
		animation: shard-pass 1s cubic-bezier(0.76, 0, 0.24, 1) both;
	}

	.shard-one { top: -12vh; background: #06114b; animation-delay: 0s; }
	.shard-two { top: 16vh; background: var(--accent); animation-delay: 0.065s; }
	.shard-three { top: 44vh; background: #f8fcff; animation-delay: 0.13s; }
	.shard-four { top: 72vh; background: #0945bd; animation-delay: 0.195s; }

	.red-strike {
		position: absolute;
		top: 49%;
		left: -20vw;
		width: 145vw;
		height: 8px;
		background: #ff4569;
		box-shadow: 0 0 18px rgba(255, 69, 105, 0.55);
		transform: rotate(-9deg);
		will-change: transform, opacity;
		animation: strike-pass 0.84s cubic-bezier(0.16, 1, 0.3, 1) 0.13s both;
	}

	@keyframes content-reveal {
		from { opacity: 0; transform: translate3d(0, 22px, 0); }
		to { opacity: 1; transform: translate3d(0, 0, 0); }
	}

	@keyframes flash-out {
		0%, 34% { opacity: 1; }
		100% { opacity: 0; }
	}

	@keyframes shard-pass {
		0% { transform: rotate(-9deg) translateX(-105%); }
		38% { transform: rotate(-9deg) translateX(0); }
		60% { transform: rotate(-9deg) translateX(0); }
		100% { transform: rotate(-9deg) translateX(105%); }
	}

	@keyframes strike-pass {
		0% { opacity: 0; transform: rotate(-9deg) translateX(-105%); }
		40% { opacity: 1; }
		100% { opacity: 0; transform: rotate(-9deg) translateX(105%); }
	}

	@media (prefers-reduced-motion: reduce) {
		.transition-content { animation: none; }
		.transition-overlay { display: none; }
	}
</style>
