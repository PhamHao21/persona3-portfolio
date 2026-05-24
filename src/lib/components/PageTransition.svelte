<script>
	import { onMount } from 'svelte';

	let { children, variant = 'default' } = $props();
	let showOverlay = $state(true);
	let overlayTimer;

	const overlayDurations = {
		default: 650,
		about: 780,
		resume: 900,
		socials: 850
	};

	const blocks = {
		default: [
			{ className: 'block default one' },
			{ className: 'block default two' },
			{ className: 'block default three' }
		],
		about: [
			{ className: 'block about one' },
			{ className: 'block about two' },
			{ className: 'block about three' }
		],
		resume: [
			{ className: 'block resume one' },
			{ className: 'block resume two' },
			{ className: 'block resume three' },
			{ className: 'block resume four' }
		],
		socials: [
			{ className: 'block socials one' },
			{ className: 'block socials two' },
			{ className: 'block socials three' }
		]
	};

	onMount(() => {
		overlayTimer = window.setTimeout(() => {
			showOverlay = false;
		}, overlayDurations[variant] ?? overlayDurations.default);

		return () => window.clearTimeout(overlayTimer);
	});
</script>

<div class="transition-shell">
	<div class="transition-content">
		{@render children?.()}
	</div>

	{#if showOverlay}
		<div class="transition-overlay" aria-hidden="true">
			{#each blocks[variant] ?? blocks.default as block}
				<div class={block.className}></div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.transition-shell {
		position: relative;
		min-height: 100vh;
		background: #000;
	}

	.transition-content {
		animation: content-in 0.2s ease 0.18s both;
	}

	.transition-overlay {
		position: fixed;
		inset: 0;
		z-index: 999;
		pointer-events: none;
		overflow: hidden;
	}

	.block {
		position: fixed;
		pointer-events: none;
	}

	.default {
		inset: 0;
		transform-origin: left center;
		animation: wipe-x 0.45s cubic-bezier(0.76, 0, 0.24, 1) both;
	}

	.default.one { z-index: 999; background: #0d1a3a; animation-delay: 0s; }
	.default.two { z-index: 998; background: #1a6aff; animation-delay: 0.05s; }
	.default.three { z-index: 997; background: #7dd4fc; animation-delay: 0.1s; }

	.about {
		height: 26vh;
		transform: rotate(-18deg);
		transform-origin: left center;
		clip-path: polygon(0 0, 100% 0, calc(100% - 120px) 100%, 0 100%);
		animation: about-strike 0.52s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.about.one { top: -12vh; left: -18vw; width: 86vw; z-index: 999; background: #00184c; }
	.about.two { top: 24vh; left: -10vw; width: 72vw; z-index: 998; background: #53edff; animation-delay: 0.05s; }
	.about.three { top: 58vh; left: -14vw; width: 82vw; z-index: 997; background: #fff; animation-delay: 0.1s; }

	.resume {
		left: -6vw;
		width: 78vw;
		height: 14vh;
		clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
		animation: resume-card 0.6s cubic-bezier(0.76, 0, 0.24, 1) both;
	}

	.resume.one { top: 14vh; z-index: 999; background: #0f1760; }
	.resume.two { top: 31vh; z-index: 998; background: #7ff6ff; animation-delay: 0.05s; }
	.resume.three { top: 48vh; z-index: 997; background: #fff; box-shadow: 10px 0 0 #d63232; animation-delay: 0.1s; }
	.resume.four { top: 65vh; z-index: 996; background: #0f1760; animation-delay: 0.15s; }

	.socials {
		top: -6vh;
		height: 112vh;
		transform: skewX(-16deg);
		transform-origin: top center;
		animation: social-stripe 0.56s cubic-bezier(0.76, 0, 0.24, 1) both;
	}

	.socials.one { left: 72vw; width: 24vw; z-index: 999; background: #00184c; }
	.socials.two { left: 80vw; width: 14vw; z-index: 998; background: #00dff7; animation-delay: 0.06s; }
	.socials.three { left: 88vw; width: 8vw; z-index: 997; background: #fff; animation-delay: 0.12s; }

	@keyframes content-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes wipe-x {
		0% { transform: scaleX(0); }
		40% { transform: scaleX(1); }
		60% { transform: scaleX(1); }
		100% { transform: scaleX(0); }
	}

	@keyframes about-strike {
		0% { transform: translateX(-900px) rotate(-18deg); opacity: 0; visibility: visible; }
		42% { transform: translateX(20px) rotate(-18deg); opacity: 1; visibility: visible; }
		62% { transform: translateX(0) rotate(-18deg); opacity: 1; visibility: visible; }
		100% { transform: translateX(900px) rotate(-18deg); opacity: 0; visibility: hidden; }
	}

	@keyframes resume-card {
		0% { transform: translateX(-900px); opacity: 1; }
		48% { transform: translateX(30px); opacity: 1; }
		70% { transform: translateX(0); opacity: 1; }
		100% { transform: translateX(900px); opacity: 0; visibility: hidden; }
	}

	@keyframes social-stripe {
		0% { transform: translateY(-1200px) skewX(-16deg); opacity: 1; }
		42% { transform: translateY(0) skewX(-16deg); opacity: 1; }
		58% { transform: translateY(0) skewX(-16deg); opacity: 1; }
		100% { transform: translateY(1200px) skewX(-16deg); opacity: 0; visibility: hidden; }
	}
</style>
