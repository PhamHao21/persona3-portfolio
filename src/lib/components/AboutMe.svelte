<script>
	import { onMount } from 'svelte';
	import PortfolioShell from '$lib/components/PortfolioShell.svelte';
	import char1 from '$lib/assets/char1.png';
	import char2 from '$lib/assets/char2.png';
	import char3 from '$lib/assets/char3.png';
	import { profileSections } from '$lib/data/portfolio.js';

	const characters = [char1, char2, char3];
	let active = $state(0);
	let current = $derived(profileSections[active]);

	onMount(() => {
		const onKey = (event) => {
			if (event.key === 'ArrowUp') active = Math.max(0, active - 1);
			if (event.key === 'ArrowDown') active = Math.min(profileSections.length - 1, active + 1);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<PortfolioShell section="ABOUT" pageCode="01" kicker="PROFILE // WILD CARD">
	<section class="about-layout">
		<div class="about-intro">
			<div class="availability"><span></span> AVAILABLE FOR NEW OPPORTUNITIES</div>
			<p class="intro-index">PLAYER PROFILE / 0001</p>
			<h1>THORWEN<br /><em>PHAM</em></h1>
			<p class="intro-copy">
				A frontend developer turning strong visual direction into responsive, memorable web
				experiences.
			</p>

			<div class="intro-meta">
				<div><span>CLASS</span><strong>FRONTEND DEV</strong></div>
				<div><span>FOCUS</span><strong>UI + MOTION</strong></div>
				<div><span>LOCATION</span><strong>VIETNAM</strong></div>
			</div>

			<a class="github-link" href="https://github.com/PhamHao21" target="_blank" rel="noreferrer">
				<span>VIEW GITHUB</span><strong>↗</strong>
			</a>
		</div>

		<div class="about-selector" aria-label="Profile sections">
			{#each profileSections as item, index}
				<button
					type="button"
					class:active={active === index}
					style={`--item-delay: ${180 + index * 70}ms`}
					onclick={() => (active = index)}
					onmouseenter={() => (active = index)}
					onfocus={() => (active = index)}
				>
					<span class="selector-code">{item.code}</span>
					<span class="selector-label">{item.label}</span>
					<span class="selector-arrow">›</span>
				</button>
			{/each}
		</div>

		<div class="about-detail">
			<div class="character-slice" aria-hidden="true">
				{#key active}
					<img src={characters[active]} alt="" />
				{/key}
			</div>

			{#key active}
				<article class="detail-card" style={`--section-accent: ${current.accent}`}>
					<div class="detail-heading">
						<span>{current.code}</span>
						<p>PERSONA RECORD</p>
					</div>
					<h2>{current.title}</h2>
					<p class="detail-description">{current.description}</p>
					<ul>
						{#each current.points as point, index}
							<li><span>{String(index + 1).padStart(2, '0')}</span>{point}</li>
						{/each}
					</ul>
				</article>
			{/key}
		</div>
	</section>
</PortfolioShell>

<style>
	.about-layout {
		min-height: 100%;
		display: grid;
		grid-template-columns: minmax(360px, 0.92fr) minmax(230px, 0.5fr) minmax(420px, 1fr);
		gap: clamp(18px, 3vw, 54px);
		align-items: center;
		padding: 86px 6vw 62px 7.5vw;
	}

	.about-intro { position: relative; z-index: 2; animation: column-enter 0.72s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both; }
	.availability { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 22px; padding: 7px 12px; background: rgba(4, 12, 44, 0.7); border: 1px solid rgba(107, 240, 255, 0.26); color: #8ef5ff; font-size: 11px; font-weight: 700; letter-spacing: 2.2px; }
	.availability span { width: 7px; height: 7px; border-radius: 50%; background: #ff4f70; box-shadow: 0 0 12px #ff4f70; animation: status-pulse 1.8s ease-in-out infinite; }
	.intro-index { margin-bottom: 8px; color: rgba(151, 237, 255, 0.54); font-size: 12px; font-weight: 700; letter-spacing: 4px; }
	h1 { font-family: 'Anton', sans-serif; font-size: clamp(72px, 8.4vw, 138px); font-style: italic; font-weight: 400; line-height: 0.76; letter-spacing: -4px; color: #f6fbff; text-shadow: 9px 7px 0 rgba(3, 55, 161, 0.88); }
	h1 em { color: #65edff; font-style: inherit; }
	.intro-copy { max-width: 570px; margin-top: 28px; padding-left: 18px; border-left: 4px solid #ff4f70; color: rgba(234, 249, 255, 0.78); font-size: clamp(18px, 1.45vw, 24px); line-height: 1.35; }
	.intro-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 24px; }
	.intro-meta div { padding: 10px 12px; background: rgba(4, 11, 42, 0.62); border-top: 2px solid rgba(100, 237, 255, 0.54); }
	.intro-meta span, .intro-meta strong { display: block; }
	.intro-meta span { margin-bottom: 3px; color: rgba(148, 228, 255, 0.48); font-size: 9px; letter-spacing: 2px; }
	.intro-meta strong { color: #fff; font-size: 15px; letter-spacing: 1.4px; }
	.github-link { display: inline-flex; align-items: center; gap: 34px; margin-top: 22px; padding: 11px 16px 10px; background: #f7fbff; color: #06123c; text-decoration: none; transform: skewX(-8deg); transition: transform 0.18s ease, background 0.18s ease; }
	.github-link span, .github-link strong { transform: skewX(8deg); }
	.github-link span { font-size: 14px; font-weight: 700; letter-spacing: 2px; }
	.github-link:hover { background: #66efff; transform: skewX(-8deg) translateX(6px); }

	.about-selector { display: flex; flex-direction: column; gap: 8px; }
	.about-selector button { position: relative; display: grid; grid-template-columns: 38px 1fr 18px; align-items: center; gap: 10px; width: 100%; min-height: 58px; padding: 0 14px; overflow: hidden; border: 0; color: rgba(227, 247, 255, 0.54); background: rgba(4, 11, 42, 0.66); clip-path: polygon(0 0, 95% 0, 100% 100%, 5% 100%); cursor: pointer; transition: color 0.24s ease, background 0.24s ease, transform 0.38s cubic-bezier(0.22, 1, 0.36, 1); animation: selector-enter 0.58s cubic-bezier(0.16, 1, 0.3, 1) var(--item-delay) backwards; }
	.about-selector button > span { position: relative; z-index: 1; }
	.about-selector button::after { content: ''; position: absolute; inset: -40% auto -40% -55%; width: 32%; background: linear-gradient(90deg, transparent, rgba(104, 239, 255, 0.3), transparent); transform: skewX(-18deg); transition: left 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
	.about-selector button:hover::after, .about-selector button.active::after { left: 120%; }
	.about-selector button:hover { color: #fff; transform: translateX(5px); }
	.about-selector button.active { color: #06113b; background: #f7fbff; transform: translateX(12px); box-shadow: -8px 6px 0 #ff4165; }
	.selector-code { font-family: 'Anton', sans-serif; font-size: 23px; color: #66edff; }
	.active .selector-code { color: #ff4165; }
	.selector-label { text-align: left; font-size: 16px; font-weight: 700; letter-spacing: 2px; }
	.selector-arrow { font-size: 28px; line-height: 1; }

	.about-detail { position: relative; min-height: 510px; display: flex; align-items: center; }
	.character-slice { position: absolute; inset: -8% -5% -4% 28%; overflow: hidden; opacity: 0.18; clip-path: polygon(26% 0, 100% 0, 74% 100%, 0 100%); filter: saturate(0.45) contrast(1.2); pointer-events: none; }
	.character-slice img { width: 100%; height: 100%; object-fit: cover; will-change: transform, opacity; animation: character-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both, character-float 6s ease-in-out 0.55s infinite alternate; }
	.detail-card { position: relative; z-index: 2; width: 100%; padding: 30px 30px 34px; background: rgba(4, 10, 37, 0.86); border-left: 5px solid var(--section-accent); box-shadow: 18px 16px 0 rgba(1, 5, 22, 0.42); clip-path: polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%); animation: detail-in 0.46s cubic-bezier(0.16, 1, 0.3, 1) both; backdrop-filter: blur(14px); }
	.detail-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
	.detail-heading span { display: grid; place-items: center; width: 52px; height: 48px; background: var(--section-accent); color: #06113b; font-family: 'Anton', sans-serif; font-size: 28px; transform: rotate(-5deg); }
	.detail-heading p { color: rgba(160, 235, 255, 0.5); font-size: 11px; font-weight: 700; letter-spacing: 3px; }
	h2 { max-width: 520px; font-family: 'Anton', sans-serif; font-size: clamp(42px, 4vw, 68px); font-weight: 400; line-height: 0.95; text-transform: uppercase; }
	.detail-description { margin-top: 18px; color: rgba(232, 248, 255, 0.72); font-size: 19px; line-height: 1.42; }
	ul { display: flex; flex-direction: column; gap: 8px; margin-top: 28px; list-style: none; }
	li { display: flex; align-items: center; gap: 13px; min-height: 44px; padding: 0 14px; background: rgba(40, 103, 196, 0.18); border-bottom: 1px solid rgba(104, 235, 255, 0.16); color: #f5fcff; font-size: 16px; font-weight: 700; letter-spacing: 1px; }
	li span { color: var(--section-accent); font-size: 11px; letter-spacing: 2px; }

	@keyframes detail-in { from { opacity: 0; transform: translateX(38px) skewX(-3deg); } to { opacity: 1; transform: translateX(0) skewX(0); } }
	@keyframes character-in { from { opacity: 0; transform: translateX(40px) scale(1.06); } to { opacity: 1; transform: translateX(0) scale(1); } }
	@keyframes character-float { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(-8px, -7px, 0) scale(1.025); } }
	@keyframes column-enter { from { opacity: 0; transform: translate3d(-28px, 12px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
	@keyframes selector-enter { from { opacity: 0; transform: translate3d(28px, 14px, 0) skewX(-2deg); } to { opacity: 1; transform: translate3d(0, 0, 0) skewX(0); } }
	@keyframes status-pulse { 50% { opacity: 0.42; transform: scale(0.82); } }

	@media (max-width: 1100px) {
		.about-layout { grid-template-columns: 1fr 0.72fr; padding-top: 120px; }
		.about-detail { grid-column: 1 / -1; min-height: auto; }
		.character-slice { display: none; }
	}

	@media (max-width: 800px) {
		.about-layout { grid-template-columns: 1fr; gap: 28px; padding: 150px 20px 90px; }
		h1 { font-size: clamp(64px, 23vw, 104px); }
		.intro-meta { grid-template-columns: 1fr; }
		.about-selector { flex-direction: row; overflow-x: auto; padding: 8px; }
		.about-selector button { min-width: 180px; }
		.about-detail { min-height: 420px; }
	}

	@media (prefers-reduced-motion: reduce) {
		.about-intro, .about-selector button, .availability span, .character-slice img, .detail-card { animation: none; }
	}
</style>
