<script>
	import { onMount } from 'svelte';
	import bgVideo from '$lib/assets/main1.mp4';
	import char1 from '$lib/assets/char1.png';
	import char2 from '$lib/assets/char2.png';
	import char3 from '$lib/assets/char3.png';
	import newsign from '$lib/assets/newsign.png';
	import { socialItems, socialRoles } from '$lib/data/project.js';

	const chars = [char1, char2, char3];

	let active = $state(0);
	let mounted = $state(false);
	let activeInfoBar = $state(0);
	let focus = $state('left');

	let current = $derived(socialItems[active]);

	function openCurrent() {
		if (focus === 'left') {
			window.open(current.href, '_blank');
			return;
		}

		window.open(`https://${current.links[activeInfoBar]}`, '_blank');
	}

	onMount(() => {
		const timer = window.setTimeout(() => {
			mounted = true;
		}, 60);

		const onKey = (event) => {
			if (focus === 'left') {
				if (event.key === 'ArrowUp') active = Math.max(0, active - 1);
				if (event.key === 'ArrowDown') active = Math.min(socialItems.length - 1, active + 1);
				if (event.key === 'Enter') openCurrent();
			} else {
				if (event.key === 'ArrowUp') activeInfoBar = Math.max(0, activeInfoBar - 1);
				if (event.key === 'ArrowDown') activeInfoBar = Math.min(current.bars - 1, activeInfoBar + 1);
				if (event.key === 'Enter') openCurrent();
			}
		};

		window.addEventListener('keydown', onKey);
		return () => {
			window.clearTimeout(timer);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<div id="menu-screen">
	<video src={bgVideo} autoplay loop muted playsinline></video>

	<div class="sc-root" role="navigation">
		{#each socialItems as item, i}
			<div
				class:active={active === i}
				class:mounted
				class="sc-bar-outer"
				role="button"
				tabindex="0"
				onclick={() => {
					if (active === i) window.open(item.href, '_blank');
					else active = i;
				}}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						if (active === i) window.open(item.href, '_blank');
						else active = i;
					}
				}}
				onmouseenter={() => {
					active = i;
				}}
			>
				<div class="sc-bar-red"></div>
				<div class="sc-bar">
					<img class="sc-char" src={chars[i]} alt="" />
					<div class="sc-bar-fill"></div>
					<div class="sc-bar-shade"></div>
					<div class="sc-bar-content">
						<div class="sc-role">{socialRoles[i].text}</div>
						<div class="sc-main">
							<div class="sc-main-top">
								<div class="sc-label">{item.label}</div>
							</div>
						</div>
						<div class="sc-stats">
							{#each item.stats as stat}
								<div class="sc-stat">
									<div class="sc-stat-top">
										<span class="sc-stat-tag" style:color={stat.color} style:border-color={stat.color}>{stat.tag}</span>
										<span class="sc-stat-num">{stat.value}</span>
									</div>
									<div class="sc-stat-bars">
										<div class="sc-stat-bar-color" style:background={stat.color}></div>
										<div class="sc-stat-bar-black"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if mounted}
		<div class="sc-right-nav">
			<span class="sc-nav-arrow left">◄</span>
			<span class="sc-nav-btn">LB</span>
			<span class="sc-nav-label">{current.label}</span>
			<span class="sc-nav-btn">RB</span>
			<span class="sc-nav-arrow right">►</span>
		</div>

		{#each Array.from({ length: current.bars }) as _, i}
			<div
				class:selected={activeInfoBar === i}
				class="sc-info-bar-wrap"
				role="button"
				tabindex="0"
				style:top={`${155 + i * 52}px`}
				style:animation-delay={`${i * 50}ms`}
				onclick={() => {
					activeInfoBar = i;
				}}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') activeInfoBar = i;
				}}
				onmouseenter={() => {
					activeInfoBar = i;
				}}
			>
				{#if current.newBars.includes(i)}
					<img class="sc-info-bar-new" src={newsign} alt="" />
				{/if}
				<div class="sc-info-bar">
					<img class="sc-info-bar-icon" src={current.barIcon} alt="" />
					<span class="sc-info-bar-text">{current.links[i].slice(0, 10)}...</span>
					<span class="sc-info-bar-box">VIEWS</span>
					<span class="sc-info-bar-count">{current.counts[i]}</span>
				</div>
			</div>
		{/each}
	{/if}

	<!-- <div class:mounted class="sc-footer">
		<div class="sc-footer-row"><span class="sc-footer-key">Up/Down</span><span>SELECT</span></div>
		<div class="sc-footer-row"><span class="sc-footer-key">Enter</span><span>OPEN</span></div>
	</div> -->
</div>

<style>
	.sc-root {
		position: absolute;
		inset: 0;
		z-index: 10;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 6px;
	}

	.sc-bar-outer {
		position: relative;
		flex-shrink: 0;
		transform: translateX(-100%);
		transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.sc-bar-outer.mounted { transform: translateX(0); }
	.sc-bar-outer:nth-child(1) { transition-delay: 0ms; }
	.sc-bar-outer:nth-child(2) { transition-delay: 80ms; }
	.sc-bar-outer:nth-child(3) { transition-delay: 160ms; }

	.sc-bar {
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

	.sc-bar-outer.active .sc-bar,
	.sc-bar-outer.active .sc-bar-red { height: 90px; }

	.sc-bar-red {
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

	.sc-bar-outer.active .sc-bar-red { opacity: 1; }

	.sc-bar-fill {
		position: absolute;
		inset: 0;
		width: 100%;
		background: #fff;
		clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
		transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 0;
	}

	.sc-bar-outer.active .sc-bar-fill {
		clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
	}

	.sc-bar-shade {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 73%;
		width: 6%;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%);
		z-index: 1;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.35s ease;
	}

	.sc-bar-outer.active .sc-bar-shade { opacity: 1; }

	.sc-bar::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%);
		z-index: 10;
		pointer-events: none;
	}

	.sc-bar-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
	}

	.sc-role {
		font-family: 'Anton', sans-serif;
		font-size: 50px;
		color: #fff;
		transform: rotate(-30deg);
		line-height: 1;
		padding: 0 16px 0 8px;
	}

	.sc-main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sc-label {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 28px;
		letter-spacing: 4px;
		line-height: 1;
		color: rgba(255, 255, 255, 0.85);
	}

	.sc-bar-outer.active .sc-label { color: #111; }

	.sc-stats {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-right: 24px;
		flex-shrink: 0;
	}

	.sc-stat-tag {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 9px;
		letter-spacing: 1.5px;
		padding: 1px 4px;
		border-width: 1px;
		border-style: solid;
		line-height: 1.4;
	}

	.sc-stat-num {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 26px;
		font-style: italic;
		line-height: 1;
		color: #fff;
		letter-spacing: 1px;
	}

	.sc-bar-outer.active .sc-stat-num { color: #111; }
	.sc-stat-bars { display: flex; flex-direction: column; gap: 1px; margin-top: 2px; }
	.sc-stat-bar-color { height: 3px; width: 100%; }
	.sc-stat-bar-black { height: 2px; width: 100%; background: #000; }

	.sc-char {
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

	.sc-right-nav {
		position: fixed;
		top: 40px;
		right: 40px;
		display: flex;
		align-items: center;
		gap: 6px;
		pointer-events: none;
		z-index: 50;
		animation: nav-pop 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.sc-nav-btn {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 100px;
		line-height: 1;
		color: #fff;
		-webkit-text-stroke: 2px #000;
		paint-order: stroke fill;
	}

	.sc-nav-label {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 28px;
		letter-spacing: 3px;
		color: #111;
		padding: 0 8px;
	}

	.sc-nav-arrow {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 22px;
		color: #c4001a;
		display: inline-block;
	}

	.sc-info-bar-wrap {
		position: fixed;
		right: 0;
		left: 65%;
		height: 46px;
		background: transparent;
		pointer-events: all;
		cursor: pointer;
		z-index: 50;
		animation: infobar-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.sc-info-bar-wrap.selected {
		background: #111;
		padding: 1.5px;
		border-radius: 8px;
	}

	.sc-info-bar {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.sc-info-bar-wrap.selected .sc-info-bar {
		background: #fff;
		border-radius: 7px;
	}

	.sc-info-bar-wrap.selected .sc-info-bar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: #c4001a;
		z-index: 1;
	}

	.sc-info-bar-new {
		position: absolute;
		left: -40px;
		bottom: 0;
		height: 65%;
		z-index: 3;
		pointer-events: none;
	}

	.sc-info-bar-icon {
		height: 55%;
		width: auto;
		flex-shrink: 0;
		margin-left: 14px;
		object-fit: contain;
	}

	.sc-info-bar-text,
	.sc-info-bar-box,
	.sc-info-bar-count,
	.sc-footer {
		font-family: 'Bebas Neue', sans-serif;
	}

	.sc-info-bar-text {
		flex: 1;
		font-size: 22px;
		letter-spacing: 2px;
		color: #111;
		padding: 0 14px;
	}

	.sc-info-bar-box {
		height: 70%;
		background: #000;
		display: flex;
		align-items: center;
		padding: 0 12px;
		font-size: 20px;
		letter-spacing: 1px;
		color: #fff;
		border-radius: 6px;
		margin-right: 4px;
	}

	.sc-info-bar-count {
		font-size: 22px;
		letter-spacing: 1px;
		color: #111;
		margin-right: 80px;
	}

	.sc-footer {
		position: fixed;
		bottom: 20px;
		right: 28px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 5px;
		z-index: 50;
		opacity: 0;
		transition: opacity 0.4s ease 0.6s;
	}

	.sc-footer.mounted { opacity: 1; }
	.sc-footer-row { display: flex; align-items: center; gap: 8px; font-size: 13px; letter-spacing: 2px; color: rgba(255, 255, 255, 0.22); }
	.sc-footer-key { border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 3px; padding: 1px 6px; font-size: 11px; }

	@keyframes nav-pop {
		0% { opacity: 0; transform: scale(0.55) translateY(-10px); }
		65% { opacity: 1; transform: scale(1.1) translateY(2px); }
		100% { opacity: 1; transform: scale(1) translateY(0); }
	}

	@keyframes infobar-in {
		0% { opacity: 0; transform: translateX(40px); }
		60% { opacity: 1; transform: translateX(-4px); }
		100% { opacity: 1; transform: translateX(0); }
	}
</style>
