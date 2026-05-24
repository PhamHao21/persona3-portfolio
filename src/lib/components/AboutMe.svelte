<script>
	import { onMount } from 'svelte';
	import bgVideo from '$lib/assets/main1.mp4';
	import char1 from '$lib/assets/char1.png';
	import char2 from '$lib/assets/char2.png';
	import char3 from '$lib/assets/char3.png';
	import { aboutImages, aboutItems, revealContent } from '$lib/data/about.js';
	import { socialRoles } from '$lib/data/project.js';

	const chars = [char1, char2, char3];

	let active = $state(0);
	let mounted = $state(false);
	let revealed = $state(false);
	let currentReveal = $derived(revealContent[active]);

	onMount(() => {
		const timer = window.setTimeout(() => {
			mounted = true;
		}, 60);

		return () => {
			window.clearTimeout(timer);
		};
	});
</script>

<div id="menu-screen">
	<video src={bgVideo} autoplay loop muted playsinline></video>

	{#if revealed}
		<div class="about-dim"></div>
		<div class:mounted class="about-reveal-panel">
			<div class="about-reveal-upper-bar">
				{#each currentReveal.upper as line}
					<div class="about-reveal-upper-line">{line}</div>
				{/each}
			</div>
			<div class="about-reveal-lower-bar">{currentReveal.lower}</div>
		</div>
		<div class="about-right-nav">
			<span class="about-nav-arrow">◄</span>
			<span class="about-nav-btn">LB</span>
			<span class="about-nav-dot"></span>
			<span class="about-nav-btn">RB</span>
			<span class="about-nav-arrow">►</span>
		</div>
		<div class:mounted class="about-main-portrait-shell">
			<img class="about-main-portrait" src={aboutImages[active]} alt="" />
		</div>
	{/if}

	<div class="about-root" role="navigation">
		{#each aboutItems as item, i}
			<button
				type="button"
				class:active={active === i}
				class:mounted
				class="about-bar-outer"
				onclick={() => {
					active = i;
					revealed = true;
				}}
				onmouseenter={() => {
					active = i;
				}}
			>
				<div class="about-bar-red"></div>
				<div class="about-bar">
					<img class="about-char" src={chars[i]} alt="" />
					<div class="about-bar-fill"></div>
					<div class="about-bar-content">
						<div class="about-role">{socialRoles[i].text}</div>
						<div class="about-main">
							<div class="about-label">{item.label}</div>
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.about-root {
		position: absolute;
		inset: 0;
		z-index: 6;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 6px;
	}

	.about-dim {
		position: absolute;
		inset: 0;
		z-index: 12;
		background: rgba(40, 45, 54, 0.68);
		pointer-events: none;
		animation: dim-in 0.32s ease-out;
	}

	.about-reveal-panel {
		position: absolute;
		top: 44vh;
		left: -6vw;
		width: 88vw;
		height: 60vh;
		z-index: 12;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(243, 246, 252, 0.98));
		clip-path: polygon(0 0, 100% 0, calc(100% - 88px) 100%, 0 100%);
		box-shadow: 18px 0 0 rgba(215, 13, 44, 0.82), 28px 0 0 rgba(255, 255, 255, 0.26);
		opacity: 0;
		transform: translateX(-40px) rotate(-20deg);
		transform-origin: left bottom;
		transition: opacity 0.3s ease, transform 0.35s ease;
	}

	.about-reveal-panel.mounted {
		opacity: 0.92;
		transform: translateX(0) rotate(-20deg);
		animation: reveal-bar-in 0.46s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.about-reveal-upper-bar {
		position: absolute;
		top: 10%;
		left: 0;
		width: 100%;
		height: 40%;
		background: rgba(0, 0, 0, 0.92);
		clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		color: #fff;
		text-align: center;
	}

	.about-reveal-upper-line,
	.about-reveal-lower-bar {
		font-family: 'Montserrat', sans-serif;
		font-weight: 300;
	}

	.about-reveal-upper-line {
		font-size: 20px;
		letter-spacing: 0.5px;
		line-height: 1.15;
	}

	.about-reveal-lower-bar {
		position: absolute;
		top: 58%;
		right: 0;
		width: 48%;
		height: 20%;
		background: rgba(0, 0, 0, 0.92);
		clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
		display: flex;
		align-items: center;
		color: #fff;
		font-size: 22px;
		padding-left: 22px;
	}

	.about-main-portrait-shell {
		position: absolute;
		top: 0;
		right: -3vw;
		z-index: 13;
		pointer-events: none;
		width: 43vw;
		height: 100vh;
		overflow: hidden;
		opacity: 0;
		transform: translateX(24px) skewX(-8deg) scale(0.98);
		transition: opacity 0.35s ease, transform 0.35s ease;
	}

	.about-main-portrait-shell.mounted {
		opacity: 0.96;
		transform: translateX(0) skewX(-8deg) scale(1);
		animation: portrait-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.about-main-portrait {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top right;
		transform: skewX(8deg) scale(1.08);
		transform-origin: top right;
	}

	.about-right-nav {
		position: absolute;
		top: 10vh;
		left: 6vw;
		display: flex;
		align-items: center;
		gap: 6px;
		pointer-events: none;
		z-index: 14;
		transform: translateX(-40px) rotate(-20deg);
		transform-origin: left bottom;
		animation: nav-pop 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.about-nav-btn {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 100px;
		line-height: 1;
		color: #fff;
		-webkit-text-stroke: 2px #000;
		paint-order: stroke fill;
	}

	.about-nav-dot {
		width: 16px;
		height: 16px;
		border-radius: 999px;
		background: #111;
		margin: 0 10px;
	}

	.about-nav-arrow {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 22px;
		color: #c4001a;
	}

	.about-bar-outer {
		position: relative;
		flex-shrink: 0;
		display: block;
		padding: 0;
		border: 0;
		background: transparent;
		font: inherit;
		text-align: left;
		transform: translateX(-100%);
		transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.about-bar-outer.mounted { transform: translateX(0); }
	.about-bar-outer:nth-child(1) { transition-delay: 0ms; }
	.about-bar-outer:nth-child(2) { transition-delay: 80ms; }
	.about-bar-outer:nth-child(3) { transition-delay: 160ms; }

	.about-bar {
		position: relative;
		width: 45vw;
		height: 64px;
		transition: height 0.3s cubic-bezier(0.22, 1, 0.36, 1);
		background: #111;
		cursor: pointer;
		pointer-events: all;
		clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.65);
		z-index: 1;
	}

	.about-bar-outer.active .about-bar,
	.about-bar-outer.active .about-bar-red { height: 90px; }

	.about-bar-red {
		position: absolute;
		top: 0;
		left: 0;
		width: 45vw;
		height: 64px;
		background: #c4001a;
		clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
		transform: translateY(-7px);
		opacity: 0;
		transition: opacity 0.2s ease;
		z-index: 0;
		pointer-events: none;
	}

	.about-bar-outer.active .about-bar-red { opacity: 1; }

	.about-bar-fill {
		position: absolute;
		inset: 0;
		background: #fff;
		clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
		transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.about-bar-outer.active .about-bar-fill {
		clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
	}

	.about-bar-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
	}

	.about-role {
		font-family: 'Anton', sans-serif;
		font-size: 50px;
		color: #fff;
		transform: rotate(-30deg);
		line-height: 1;
		padding: 0 16px 0 8px;
	}

	.about-main {
		flex: 1;
		display: flex;
		justify-content: center;
		padding-left: 78px;
	}

	.about-label {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 28px;
		letter-spacing: 4px;
		line-height: 1;
		color: rgba(255, 255, 255, 0.85);
	}

	.about-bar-outer.active .about-label { color: #111; }

	.about-char {
		position: absolute;
		top: 0;
		left: 110px;
		height: 100%;
		width: auto;
		max-width: 160px;
		object-fit: cover;
		object-position: top;
		pointer-events: none;
		z-index: 3;
		clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
	}

	@keyframes dim-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes reveal-bar-in {
		0% { opacity: 0; transform: translateX(-120px) rotate(-20deg) scaleX(0.72); }
		60% { opacity: 0.96; transform: translateX(18px) rotate(-20deg) scaleX(1.03); }
		100% { opacity: 0.92; transform: translateX(0) rotate(-20deg) scaleX(1); }
	}

	@keyframes portrait-in {
		0% { opacity: 0; transform: translateX(78px) skewX(-8deg) scale(0.94); filter: blur(8px); }
		55% { opacity: 0.9; transform: translateX(-8px) skewX(-8deg) scale(1.015); filter: blur(0); }
		100% { opacity: 0.96; transform: translateX(0) skewX(-8deg) scale(1); filter: blur(0); }
	}

	@keyframes nav-pop {
		0% { opacity: 0; transform: scale(0.55) translateY(-10px) rotate(-20deg); }
		65% { opacity: 1; transform: scale(1.1) translateY(2px) rotate(-20deg); }
		100% { opacity: 1; transform: scale(1) translateY(0) rotate(-20deg); }
	}
</style>
