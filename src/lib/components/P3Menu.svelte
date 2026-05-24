<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ControlHints from '$lib/components/ControlHints.svelte';
	import { menuItems } from '$lib/data/menu.js';

	let { ready = true, onRipple = () => {} } = $props();

	let active = $state(0);
	let mounted = $state(false);
	let introDone = $state(false);
	let animKey = $state(0);
	let navigating = false;

	const menuFontSize = 48;
	const activeMenuScale = 1.18;
	const stripTip = 72;
	const textPad = 16;

	function activate(index) {
		active = index;
		animKey += 1;
	}

	async function navigateTo(page) {
		if (page.startsWith('http')) {
			window.open(page, '_blank');
			return;
		}

		await goto(`/${page}`, { noScroll: true });
	}

	function hrefFor(page) {
		if (page.startsWith('http')) return page;
		return `/${page}`;
	}

	async function handleMenuClick(event, page) {
		event.preventDefault();
		if (navigating) return;

		navigating = true;
		await onRipple(event);
		await navigateTo(page);
		navigating = false;
	}

	async function confirmActive(source) {
		if (navigating) return;

		navigating = true;
		await onRipple(source);
		await navigateTo(menuItems[active].page);
		navigating = false;
	}

	$effect(() => {
		if (!ready) {
			mounted = false;
			introDone = false;
			return;
		}

		const mountTimer = window.setTimeout(() => {
			mounted = true;
		}, 20);

		const introTimer = window.setTimeout(() => {
			introDone = true;
		}, 720);

		return () => {
			window.clearTimeout(mountTimer);
			window.clearTimeout(introTimer);
		};
	});

	onMount(() => {
		const onKey = (event) => {
			if (!ready) return;
			if (event.defaultPrevented) return;

			if (event.key === 'ArrowUp') {
				event.preventDefault();
				activate(Math.max(0, active - 1));
			}

			if (event.key === 'ArrowDown') {
				event.preventDefault();
				activate(Math.min(menuItems.length - 1, active + 1));
			}

			if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
				event.preventDefault();
				const x = event.key === 'ArrowLeft' ? window.innerWidth * 0.28 : window.innerWidth * 0.72;
				confirmActive({ x, y: window.innerHeight * 0.48 });
			}
		};

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<div class:ready class="p3-overlay">
	<div class="p3-name-tag">
		<span>Thorwen</span>
		<span>Pham</span>
	</div>

	<nav class="p3-menu" aria-label="Main navigation">
		{#each menuItems as item, i}
			{@const isActive = active === i}
			{@const dist = Math.abs(i - active)}
			{@const opacity = isActive ? 1 : Math.max(0.5, 1 - dist * 0.2)}
			{@const estH = menuFontSize * 0.94}
			{@const pointsLeft = i % 2 === 1}
			{@const skewX = pointsLeft ? -11 : -6}
			{@const skewY = pointsLeft ? -10 : 8}

			<a
				href={hrefFor(item.page)}
				class:active={isActive}
				class:mounted
				class:point-left={pointsLeft}
				class="p3-row"
				style={`margin-right: ${item.offsetX}px; margin-top: ${item.offsetY}px; --entry-delay: ${i * 36}ms; --text-delay: ${introDone ? 0 : i * 36 + 82}ms; --accent-delay: ${introDone ? 42 : i * 36 + 125}ms; --accent-height: ${estH}px; --strip-tip: ${stripTip}px; --text-pad: ${textPad}px;`}
				aria-current={isActive ? 'page' : undefined}
				onclick={(event) => handleMenuClick(event, item.page)}
				onmouseenter={() => activate(i)}
			>
				<div class="p3-glow"></div>
				<div
					class="p3-skew-wrap"
					style:transform={`skewX(${skewX}deg) skewY(${skewY}deg) scale(${isActive ? activeMenuScale : 1})`}
				>
					<div
						class:pop={isActive}
						class="p3-shadow-tri"
						data-key={isActive ? `pop-${i}-${animKey}` : `idle-${i}`}
					></div>
					<div class:pop={isActive} class="p3-shadow-text-mask" aria-hidden="true">
						<span class="p3-shadow-label" style:font-size={`${menuFontSize}px`}>
							{item.label}
						</span>
					</div>
					<div class="p3-highlight">
						<span
							aria-hidden="true"
							class="p3-highlight-label"
							style:font-size={`${menuFontSize}px`}
						>
							{item.label}
						</span>
					</div>
					<div class:pop-text={isActive} class="p3-label-wrap" style:opacity>
						<span class="p3-label-base p3-label-dark" style:font-size={`${menuFontSize}px`}>
							{item.label}
						</span>
					</div>
				</div>
			</a>
		{/each}
	</nav>
</div>

<ControlHints
	rows={[
		{ key: 'Up/Down', label: 'Navigate' },
		{ key: 'Left/Right', label: 'Confirm' }
	]}
/>

<style>
	.p3-overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.28s ease;
	}

	.p3-overlay.ready {
		opacity: 1;
	}

	.p3-menu {
		position: relative;
		z-index: 20;
		padding: 48px;
		display: flex;
		flex-direction: column;
		align-items: center;
		pointer-events: all;
	}

	.p3-row {
		position: relative;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		text-decoration: none;
		opacity: 0;
		z-index: 1;
		pointer-events: none;
		transform: translate3d(52px, -30px, 0) scale(0.92);
		transform-origin: center;
		will-change: transform, opacity;
	}

	.p3-row:hover,
	.p3-row.active {
		z-index: 30;
	}

	.p3-row.mounted {
		animation: p3-menu-row-in 0.34s both;
		animation-delay: var(--entry-delay);
		pointer-events: auto;
	}

	.p3-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120%;
		height: 200%;
		background: radial-gradient(ellipse at center, rgba(255, 100, 180, 0.35) 0%, transparent 70%);
		filter: blur(18px);
		z-index: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.p3-row.active .p3-glow { opacity: 1; }

	.p3-skew-wrap {
		position: relative;
		display: flex;
		align-items: center;
		isolation: isolate;
		transform-origin: center;
		transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.p3-shadow-tri,
	.p3-shadow-text-mask {
		position: absolute;
		top: 50%;
		left: 0;
		width: calc(100% + var(--strip-tip));
		height: var(--accent-height);
		transform-origin: left center;
		background: rgba(235, 80, 120, 0.85);
		clip-path: polygon(0 0, 100% 50%, 0 100%);
		z-index: 1;
		pointer-events: none;
		transform: translateY(-40%) translateX(-12px) scaleX(0);
	}

	.p3-shadow-text-mask {
		background: transparent;
		overflow: hidden;
		z-index: 7;
	}

	.p3-row.point-left .p3-shadow-tri,
	.p3-row.point-left .p3-shadow-text-mask {
		left: calc(var(--strip-tip) * -1);
		transform-origin: right center;
		clip-path: polygon(100% 0, 0 50%, 100% 100%);
		transform: translateY(-40%) translateX(12px) scaleX(0);
	}

	.p3-shadow-tri.pop,
	.p3-shadow-text-mask.pop {
		animation: p3-shadow-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: var(--accent-delay);
	}

	.p3-row.point-left .p3-shadow-tri.pop,
	.p3-row.point-left .p3-shadow-text-mask.pop {
		animation-name: p3-shadow-pop-left;
	}

	.p3-highlight {
		position: absolute;
		top: 50%;
		left: 0;
		width: calc(100% + var(--strip-tip));
		height: var(--accent-height);
		transform-origin: left center;
		background: #fff;
		clip-path: polygon(0 0, 100% 50%, 0 100%);
		overflow: hidden;
		z-index: 6;
		transform: translateY(-50%) scaleX(0);
		transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
		pointer-events: none;
	}

	.p3-row.point-left .p3-highlight {
		left: calc(var(--strip-tip) * -1);
		transform-origin: right center;
		clip-path: polygon(100% 0, 0 50%, 100% 100%);
	}

	.p3-row.active .p3-highlight {
		transform: translateY(-50%) scaleX(1);
	}

	.p3-row.mounted.active .p3-highlight {
		animation: p3-highlight-pop 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: var(--accent-delay);
	}

	.p3-label-wrap {
		position: relative;
		z-index: 5;
		padding: 0 var(--text-pad);
		transform-origin: center;
		transform: translate3d(0, 0, 0) scale(1);
		transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.p3-row.active .p3-label-wrap {
		transform: translate3d(0, -7px, 0) scale(1.035);
	}

	.p3-row.mounted.active .p3-label-wrap.pop-text {
		animation: p3-label-pop 0.24s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: var(--text-delay);
	}

	.p3-label-base {
		font-family: 'Anton', sans-serif;
		font-style: italic;
		letter-spacing: 2px;
		line-height: 0.85;
		display: block;
		white-space: nowrap;
		user-select: none;
	}

	.p3-highlight-label,
	.p3-shadow-label {
		position: absolute;
		top: 50%;
		left: var(--text-pad);
		z-index: 1;
		color: #ff2a2a;
		font-family: 'Anton', sans-serif;
		font-style: italic;
		letter-spacing: 2px;
		line-height: 0.85;
		display: block;
		white-space: nowrap;
		user-select: none;
		transform: translateY(calc(-50% - 7px)) scale(1.035);
		transform-origin: center;
	}

	.p3-row.point-left .p3-highlight-label {
		left: calc(var(--strip-tip) + var(--text-pad));
	}

	.p3-shadow-label {
		transform: translate(12px, calc(-50% - 12px)) scale(1.035);
	}

	.p3-row.point-left .p3-shadow-label {
		left: calc(var(--strip-tip) + var(--text-pad));
		transform: translate(-12px, calc(-50% - 12px)) scale(1.035);
	}

	.p3-row.mounted.active .p3-highlight-label {
		animation: p3-highlight-label-pop 0.24s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: var(--text-delay);
	}

	.p3-row.mounted.active .p3-shadow-label {
		animation: p3-shadow-label-pop 0.24s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: var(--text-delay);
	}

	.p3-row.mounted.active.point-left .p3-shadow-label {
		animation-name: p3-shadow-label-pop-left;
	}

	.p3-label-dark {
		color: #3ce2ff;
		transition: color 0.12s ease;
	}

	.p3-row:hover:not(.active) .p3-label-dark { color: #00d9ff; }

	.p3-row.active .p3-label-dark {
		color: #07090f;
		text-shadow: none;
	}

	.p3-name-tag {
		position: absolute;
		top: 18px;
		left: 22px;
		z-index: 20;
		font-family: 'Anton', sans-serif;
		font-style: italic;
		font-size: 108px;
		line-height: 0.88;
		letter-spacing: 2px;
		color: rgba(10, 10, 14, 0.64);
		transform: rotate(18deg);
		transform-origin: left top;
		user-select: none;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.p3-name-tag span:first-child {
		color: rgba(0, 0, 0, 0.86);
	}

	@keyframes p3-shadow-pop {
		0% { transform: translateY(-40%) translateX(-12px) scaleX(0) scaleY(1); }
		55% { transform: translateY(-46%) translateX(-15px) scaleX(1.22) scaleY(1.18); }
		75% { transform: translateY(-39%) translateX(-11px) scaleX(0.96) scaleY(0.97); }
		100% { transform: translateY(-40%) translateX(-12px) scaleX(1) scaleY(1); }
	}

	@keyframes p3-shadow-pop-left {
		0% { transform: translateY(-40%) translateX(12px) scaleX(0) scaleY(1); }
		55% { transform: translateY(-46%) translateX(15px) scaleX(1.22) scaleY(1.18); }
		75% { transform: translateY(-39%) translateX(11px) scaleX(0.96) scaleY(0.97); }
		100% { transform: translateY(-40%) translateX(12px) scaleX(1) scaleY(1); }
	}

	@keyframes p3-highlight-pop {
		0% { transform: translateY(-50%) scaleX(0) scaleY(0.86); }
		50% { transform: translateY(-53%) scaleX(1.18) scaleY(1.13); }
		72% { transform: translateY(-49%) scaleX(0.96) scaleY(0.96); }
		100% { transform: translateY(-50%) scaleX(1) scaleY(1); }
	}

	@keyframes p3-label-pop {
		0% { transform: translate3d(4px, 10px, 0) scale(0.96); }
		54% { transform: translate3d(-3px, -10px, 0) scale(1.08); }
		76% { transform: translate3d(1px, -5px, 0) scale(1.01); }
		100% { transform: translate3d(0, -7px, 0) scale(1.035); }
	}

	@keyframes p3-highlight-label-pop {
		0% { transform: translateY(calc(-50% + 10px)) scale(0.96); }
		54% { transform: translateY(calc(-50% - 10px)) scale(1.08); }
		76% { transform: translateY(calc(-50% - 5px)) scale(1.01); }
		100% { transform: translateY(calc(-50% - 7px)) scale(1.035); }
	}

	@keyframes p3-shadow-label-pop {
		0% { transform: translate(12px, calc(-50% + 5px)) scale(0.96); }
		54% { transform: translate(12px, calc(-50% - 15px)) scale(1.08); }
		76% { transform: translate(12px, calc(-50% - 10px)) scale(1.01); }
		100% { transform: translate(12px, calc(-50% - 12px)) scale(1.035); }
	}

	@keyframes p3-shadow-label-pop-left {
		0% { transform: translate(-12px, calc(-50% + 5px)) scale(0.96); }
		54% { transform: translate(-12px, calc(-50% - 15px)) scale(1.08); }
		76% { transform: translate(-12px, calc(-50% - 10px)) scale(1.01); }
		100% { transform: translate(-12px, calc(-50% - 12px)) scale(1.035); }
	}

	@keyframes p3-menu-row-in {
		0% {
			opacity: 0;
			transform: translate3d(34px, -18px, 0) scale(0.96);
		}
		45% {
			opacity: 1;
			transform: translate3d(-5px, 4px, 0) scale(1.025);
		}
		68% {
			opacity: 1;
			transform: translate3d(2px, -2px, 0) scale(0.995);
		}
		84% {
			opacity: 1;
			transform: translate3d(-1px, 1px, 0) scale(1.006);
		}
		100% {
			opacity: 1;
			transform: translate3d(0, 0, 0) scale(1);
		}
	}
</style>
