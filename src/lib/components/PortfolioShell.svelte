<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import bgVideo from '$lib/assets/water-main-menu2.webm?url';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	let { section = 'ABOUT', pageCode = '01', kicker = 'DARK HOUR FILE', children } = $props();

	const sections = [
		{ label: 'ABOUT', href: '/about' },
		{ label: 'PROJECTS', href: '/project' },
		{ label: 'TECH', href: '/tech' },
		{ label: 'WORK', href: '/work' }
	];

	let mounted = $state(false);
	let navigating = $state(false);
	let pendingHref = $state('');

	async function navigate(event, href) {
		event.preventDefault();
		if (navigating || section === sections.find((item) => item.href === href)?.label) return;

		navigating = true;
		pendingHref = href;
		const source = { x: event.clientX || window.innerWidth / 2, y: event.clientY || 44 };

		try {
			await new Promise((resolve) => window.setTimeout(resolve, 320));
			await playRippleTransition(source);
			await goto(href, { noScroll: true });
		} finally {
			navigating = false;
			pendingHref = '';
		}
	}

	onMount(() => {
		const frame = window.requestAnimationFrame(() => {
			mounted = true;
		});
		return () => window.cancelAnimationFrame(frame);
	});
</script>

<div class:mounted class="portfolio-screen">
	<video class="portfolio-bg" src={bgVideo} autoplay loop muted playsinline></video>
	<div class="portfolio-wash"></div>
	<div class="portfolio-grid"></div>
	<div class="portfolio-orbit orbit-one"></div>
	<div class="portfolio-orbit orbit-two"></div>
	<div class="portfolio-slash slash-one"></div>
	<div class="portfolio-slash slash-two"></div>
	<div class="motion-streaks" aria-hidden="true">
		<i></i><i></i><i></i>
	</div>

	<header class:navigating class="portfolio-header">
		<a class="portfolio-brand" href="/" onclick={(event) => navigate(event, '/')}>
			<span class="brand-mark">P3</span>
			<span class="brand-copy">DARK HOUR<br />PORTFOLIO</span>
		</a>

		<nav class="portfolio-nav" aria-label="Portfolio sections">
			{#each sections as item, index}
				<a
					href={item.href}
					class:active={item.label === section}
					class:pending={pendingHref === item.href}
					class:leaving={navigating && item.label === section && pendingHref !== item.href}
					onclick={(event) => navigate(event, item.href)}
				>
					<span>{String(index + 1).padStart(2, '0')}</span>{item.label}
				</a>
			{/each}
		</nav>

		<div class="portfolio-counter">
			<span>ARC</span>
			<strong>{pageCode}</strong>
		</div>
	</header>

	<div class="portfolio-heading">
		<span>{kicker}</span>
		<strong>{section}</strong>
	</div>

	<main class="portfolio-content">
		{@render children?.()}
	</main>

	<div class="portfolio-footer-mark">00:00 // THE DARK HOUR</div>
</div>

<style>
	.portfolio-screen {
		--ink: #050817;
		--navy: #07134b;
		--blue: #073fbe;
		--cyan: #63efff;
		--paper: #f7fbff;
		--red: #ff4165;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		isolation: isolate;
		background: var(--navy);
		color: var(--paper);
		font-family: 'Barlow Condensed', sans-serif;
	}

	.portfolio-bg {
		position: absolute;
		inset: 0;
		z-index: -6;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(1.15) contrast(1.05) brightness(0.62);
		transform: scale(1.025);
		will-change: transform;
		animation: background-drift 16s ease-in-out infinite alternate;
	}

	.portfolio-wash {
		position: absolute;
		inset: 0;
		z-index: -5;
		background:
			linear-gradient(100deg, rgba(1, 7, 37, 0.96) 0%, rgba(3, 18, 78, 0.88) 43%, rgba(0, 72, 170, 0.42) 100%),
			linear-gradient(180deg, rgba(65, 231, 255, 0.12), transparent 30%);
	}

	.portfolio-grid {
		position: absolute;
		inset: 0;
		z-index: -4;
		opacity: 0.12;
		background-image:
			linear-gradient(rgba(138, 242, 255, 0.5) 1px, transparent 1px),
			linear-gradient(90deg, rgba(138, 242, 255, 0.5) 1px, transparent 1px);
		background-size: 54px 54px;
		transform: perspective(700px) rotateX(58deg) scale(1.5) translateY(22%);
		transform-origin: bottom;
		mask-image: linear-gradient(transparent 20%, #000 88%);
		animation: grid-breathe 9s ease-in-out infinite alternate;
	}

	.portfolio-orbit {
		position: absolute;
		z-index: -3;
		border: 1px solid rgba(117, 240, 255, 0.18);
		border-radius: 50%;
		pointer-events: none;
	}

	.orbit-one { width: 44vw; aspect-ratio: 1; right: -12vw; top: 8vh; }
	.orbit-two { width: 26vw; aspect-ratio: 1; right: 3vw; top: 28vh; border-style: dashed; }
	.mounted .orbit-one { animation: orbit-spin 26s linear infinite; }
	.mounted .orbit-two { animation: orbit-spin-reverse 20s linear infinite; }

	.portfolio-slash {
		position: absolute;
		z-index: -2;
		width: 9vw;
		height: 130vh;
		background: rgba(89, 236, 255, 0.08);
		transform: rotate(18deg);
		pointer-events: none;
	}

	.slash-one { right: 14vw; top: -15vh; }
	.slash-two { right: 2vw; top: -8vh; width: 2vw; background: rgba(255, 255, 255, 0.08); }
	.mounted .slash-one { animation: slash-float 8s ease-in-out infinite alternate; }
	.mounted .slash-two { animation: slash-float 6s ease-in-out 0.7s infinite alternate-reverse; }

	.motion-streaks { position: absolute; inset: 88px 0 0; z-index: -1; overflow: hidden; pointer-events: none; }
	.motion-streaks i { position: absolute; left: -32vw; width: 22vw; height: 2px; background: linear-gradient(90deg, transparent, rgba(126, 246, 255, 0.55), transparent); transform: rotate(-13deg); opacity: 0; will-change: transform, opacity; animation: streak-pass 7s linear infinite; }
	.motion-streaks i:nth-child(1) { top: 25%; animation-delay: 1.1s; }
	.motion-streaks i:nth-child(2) { top: 58%; width: 35vw; animation-delay: 3.5s; animation-duration: 8.5s; }
	.motion-streaks i:nth-child(3) { top: 78%; width: 16vw; animation-delay: 5.7s; animation-duration: 6.5s; }

	.portfolio-header {
		position: relative;
		z-index: 20;
		height: 88px;
		display: grid;
		grid-template-columns: 250px 1fr 90px;
		align-items: center;
		gap: 26px;
		padding: 0 34px;
		background: rgba(2, 7, 27, 0.78);
		border-bottom: 1px solid rgba(130, 239, 255, 0.18);
		backdrop-filter: blur(14px);
		opacity: 0;
		transform: translate3d(0, -18px, 0);
		will-change: transform, opacity;
		transition: opacity 0.46s ease, transform 0.54s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.mounted .portfolio-header { opacity: 1; transform: translate3d(0, 0, 0); }

	.portfolio-brand {
		display: flex;
		align-items: center;
		gap: 11px;
		color: inherit;
		text-decoration: none;
		transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.portfolio-brand:hover { transform: translateX(4px); }

	.brand-mark {
		font-family: 'Anton', sans-serif;
		font-size: 39px;
		font-style: italic;
		line-height: 1;
		color: var(--cyan);
		text-shadow: 4px 3px 0 var(--blue);
	}

	.brand-copy {
		font-size: 12px;
		font-weight: 700;
		line-height: 0.95;
		letter-spacing: 2.5px;
		color: rgba(233, 251, 255, 0.72);
	}

	.portfolio-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(12px, 3vw, 48px);
	}

	.portfolio-nav a {
		position: relative;
		padding: 12px 5px;
		color: rgba(217, 246, 255, 0.52);
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 2px;
		text-decoration: none;
		isolation: isolate;
		transform-origin: center bottom;
		transition: color 0.28s ease, background 0.28s ease, opacity 0.32s ease, transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.portfolio-nav a::before { content: ''; position: absolute; inset: -5px -13px; z-index: -1; background: linear-gradient(105deg, #ff496b 0 8%, #f8fcff 8% 100%); clip-path: polygon(7% 0, 100% 0, 93% 100%, 0 100%); opacity: 0; transform: translateX(-12px) scaleX(0.35); transform-origin: left center; transition: opacity 0.24s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
	.portfolio-nav a::after { content: ''; position: absolute; right: 5px; bottom: 6px; left: 5px; height: 2px; background: var(--cyan); transform: scaleX(0); transform-origin: right; transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1); }
	.portfolio-nav a:hover::after { transform: scaleX(1); transform-origin: left; }
	.portfolio-nav a.active::after { display: none; }

	.portfolio-nav a span { margin-right: 6px; font-size: 10px; color: var(--cyan); }
	.portfolio-nav a:hover { color: #fff; transform: translateY(-2px); }
	.portfolio-nav a.active { color: #07112f; background: var(--paper); opacity: 0; transform: skewX(-9deg) translateX(14px); padding-inline: 15px; }
	.mounted .portfolio-nav a.active { opacity: 1; transform: skewX(-9deg) translateX(0); transition-delay: 0.18s; }
	.portfolio-nav a.pending { color: #07112f; background: transparent; opacity: 1; transform: translateX(4px); transition-delay: 0s; }
	.portfolio-nav a.pending::before { opacity: 1; transform: translateX(0) scaleX(1); }
	.portfolio-nav a.leaving { opacity: 0.28; transform: skewX(-9deg) translateX(-10px); transition-delay: 0s; }
	.portfolio-header.navigating .portfolio-nav a:not(.pending):not(.leaving) { opacity: 0.48; transform: translateX(-3px); transition-delay: 0s; }
	.portfolio-nav a.active span { color: var(--red); }
	.portfolio-nav a.pending span { color: var(--red); }

	.portfolio-counter { display: flex; align-items: flex-end; justify-content: flex-end; gap: 7px; }
	.portfolio-counter span { margin-bottom: 7px; font-size: 11px; letter-spacing: 2px; color: var(--cyan); }
	.portfolio-counter strong { font-family: 'Anton', sans-serif; font-size: 43px; font-style: italic; line-height: 1; }

	.portfolio-heading {
		position: absolute;
		top: 108px;
		left: 38px;
		z-index: 4;
		display: flex;
		flex-direction: column;
		pointer-events: none;
		opacity: 0;
		transform: translateX(-24px);
		transition: opacity 0.5s ease 0.16s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.16s;
	}

	.mounted .portfolio-heading { opacity: 1; transform: translateX(0); }
	.portfolio-heading span { margin-left: 5px; font-size: 12px; font-weight: 700; letter-spacing: 4px; color: var(--cyan); }
	.portfolio-heading strong { font-family: 'Anton', sans-serif; font-size: clamp(62px, 7.5vw, 118px); font-style: italic; line-height: 0.84; letter-spacing: -2px; color: rgba(236, 250, 255, 0.1); -webkit-text-stroke: 1px rgba(151, 239, 255, 0.22); }

	.portfolio-content {
		position: absolute;
		inset: 88px 0 0;
		z-index: 10;
		overflow: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(100, 238, 255, 0.5) transparent;
		opacity: 0;
		transform: translate3d(0, 18px, 0);
		will-change: transform, opacity;
		transition: opacity 0.42s ease 0.12s, transform 0.72s cubic-bezier(0.16, 1, 0.3, 1) 0.12s;
	}

	.mounted .portfolio-content { opacity: 1; transform: translate3d(0, 0, 0); }

	.portfolio-footer-mark {
		position: fixed;
		left: 38px;
		bottom: 24px;
		z-index: 15;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 3px;
		color: rgba(162, 234, 255, 0.38);
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}

	@keyframes background-drift { to { transform: scale(1.055) translate3d(-0.7%, -0.4%, 0); } }
	@keyframes grid-breathe { to { opacity: 0.2; transform: perspective(700px) rotateX(58deg) scale(1.56) translateY(20%); } }
	@keyframes orbit-spin { to { transform: rotate(360deg); } }
	@keyframes orbit-spin-reverse { to { transform: rotate(-360deg); } }
	@keyframes slash-float { to { transform: rotate(18deg) translate3d(18px, -22px, 0); } }
	@keyframes streak-pass {
		0%, 68% { opacity: 0; transform: translate3d(0, 0, 0) rotate(-13deg); }
		72% { opacity: 0.55; }
		88% { opacity: 0.35; }
		94%, 100% { opacity: 0; transform: translate3d(170vw, -18vh, 0) rotate(-13deg); }
	}

	@media (max-width: 800px) {
		.portfolio-screen { overflow-y: auto; }
		.portfolio-header { position: sticky; top: 0; height: auto; min-height: 72px; grid-template-columns: 1fr auto; padding: 12px 18px; }
		.portfolio-nav { grid-column: 1 / -1; order: 3; justify-content: flex-start; gap: 8px; overflow-x: auto; padding-bottom: 3px; }
		.portfolio-nav a { font-size: 13px; padding: 8px 10px; white-space: nowrap; }
		.portfolio-counter { grid-column: 2; grid-row: 1; }
		.portfolio-heading { top: 132px; left: 20px; }
		.portfolio-content { position: relative; inset: auto; min-height: calc(100vh - 118px); overflow: visible; }
		.portfolio-footer-mark { display: none; }
		.motion-streaks { display: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.portfolio-header,
		.portfolio-heading,
		.portfolio-content { transition-duration: 0.01ms; transition-delay: 0ms; }
		.portfolio-bg { display: none; animation: none; }
		.portfolio-grid, .portfolio-orbit, .portfolio-slash, .motion-streaks i { animation: none !important; }
		.portfolio-nav a, .portfolio-nav a::before, .portfolio-brand { transition-duration: 0.01ms !important; transition-delay: 0ms !important; }
	}
</style>
