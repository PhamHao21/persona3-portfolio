<script>
	import { onMount } from 'svelte';
	import PortfolioShell from '$lib/components/PortfolioShell.svelte';
	import { skillGroups } from '$lib/data/portfolio.js';

	let active = $state(0);
	let current = $derived(skillGroups[active]);

	onMount(() => {
		const onKey = (event) => {
			if (event.key === 'ArrowUp') active = Math.max(0, active - 1);
			if (event.key === 'ArrowDown') active = Math.min(skillGroups.length - 1, active + 1);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<PortfolioShell section="TECH" pageCode="03" kicker="ABILITY // LOADOUT">
	<section class="tech-layout">
		<div class="tech-lead">
			<p class="tech-overline">EQUIPPED ABILITIES</p>
			<h1>TECH<br /><span>LOADOUT</span></h1>
			<p class="tech-summary">
				A practical stack for building visual interfaces—from structure and state to motion and
				deployment.
			</p>
			<div class="tech-total"><strong>12</strong><span>CORE<br />ABILITIES</span></div>
		</div>

		<div class="skill-deck">
			{#each skillGroups as group, index}
				<button
					type="button"
					class:active={active === index}
					style={`--item-delay: ${150 + index * 65}ms`}
					onclick={() => (active = index)}
					onmouseenter={() => (active = index)}
					onfocus={() => (active = index)}
				>
					<span class="skill-code">{group.code}</span>
					<span class="skill-name"><strong>{group.label}</strong><small>{group.subtitle}</small></span>
					<span class="skill-rank"><small>RANK</small>{group.rank}</span>
				</button>
			{/each}
		</div>

		{#key active}
			<article class="skill-panel">
				<div class="panel-head">
					<div><span>SELECTED LOADOUT</span><h2>{current.label}</h2></div>
					<strong>{current.rank}</strong>
				</div>
				<p class="panel-description">{current.description}</p>

				<div class="ability-list">
					{#each current.skills as skill, index}
						<div class="ability" style={`--level: ${skill.level}%; --delay: ${index * 80}ms`}>
							<div class="ability-row">
								<span>{String(index + 1).padStart(2, '0')}</span>
								<strong>{skill.name}</strong>
								<em>{skill.level}</em>
							</div>
							<div class="ability-track"><i></i></div>
							<p>{skill.note}</p>
						</div>
					{/each}
				</div>
			</article>
		{/key}
	</section>
</PortfolioShell>

<style>
	.tech-layout { min-height: 100%; display: grid; grid-template-columns: minmax(280px, 0.62fr) minmax(330px, 0.78fr) minmax(420px, 1fr); gap: clamp(24px, 3vw, 54px); align-items: center; padding: 100px 5vw 70px 7vw; }
	.tech-lead { position: relative; animation: lead-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.06s both; }
	.tech-overline { margin-bottom: 10px; color: #6af0ff; font-size: 12px; font-weight: 700; letter-spacing: 4px; }
	h1 { font-family: 'Anton', sans-serif; font-size: clamp(70px, 7.5vw, 122px); font-style: italic; font-weight: 400; letter-spacing: -3px; line-height: 0.78; color: #f6fbff; text-shadow: 9px 7px 0 rgba(8, 54, 157, 0.8); }
	h1 span { color: #67efff; }
	.tech-summary { max-width: 450px; margin-top: 27px; padding-left: 17px; border-left: 4px solid #ff4669; color: rgba(230, 248, 255, 0.72); font-size: 19px; line-height: 1.4; }
	.tech-total { display: flex; align-items: center; gap: 12px; margin-top: 24px; }
	.tech-total strong { font-family: 'Anton', sans-serif; font-size: 62px; font-style: italic; line-height: 1; color: #fff; }
	.tech-total span { color: rgba(116, 235, 255, 0.58); font-size: 11px; font-weight: 700; line-height: 1.1; letter-spacing: 2px; }

	.skill-deck { display: flex; flex-direction: column; gap: 10px; }
	.skill-deck button { position: relative; display: grid; grid-template-columns: 54px 1fr 58px; align-items: center; gap: 13px; min-height: 82px; padding: 10px 17px; overflow: hidden; border: 1px solid rgba(114, 234, 255, 0.15); background: rgba(4, 11, 46, 0.72); color: #eafaff; clip-path: polygon(0 0, 96% 0, 100% 100%, 4% 100%); cursor: pointer; transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), background 0.24s ease; animation: deck-enter 0.56s cubic-bezier(0.16, 1, 0.3, 1) var(--item-delay) backwards; }
	.skill-deck button::after { content: ''; position: absolute; inset: 0 auto 0 -50%; width: 26%; background: linear-gradient(90deg, transparent, rgba(104, 239, 255, 0.27), transparent); transform: skewX(-18deg); transition: left 0.48s cubic-bezier(0.16, 1, 0.3, 1); }
	.skill-deck button:hover::after, .skill-deck button.active::after { left: 120%; }
	.skill-deck button > span { position: relative; z-index: 1; }
	.skill-deck button:hover { transform: translateX(6px); background: rgba(9, 33, 102, 0.86); }
	.skill-deck button.active { color: #05113a; background: #f7fbff; transform: translateX(14px); box-shadow: -10px 7px 0 #ff4669; }
	.skill-code { font-family: 'Anton', sans-serif; font-size: 31px; font-style: italic; color: #63edff; text-align: center; }
	.active .skill-code { color: #ff4669; }
	.skill-name { min-width: 0; text-align: left; }
	.skill-name strong, .skill-name small { display: block; }
	.skill-name strong { font-family: 'Anton', sans-serif; font-size: 27px; font-weight: 400; letter-spacing: 1px; line-height: 1; }
	.skill-name small { margin-top: 5px; color: rgba(164, 231, 255, 0.5); font-size: 10px; font-weight: 700; letter-spacing: 1.8px; }
	.active .skill-name small { color: rgba(5, 17, 58, 0.55); }
	.skill-rank { display: flex; flex-direction: column; align-items: center; font-family: 'Anton', sans-serif; font-size: 35px; line-height: 0.9; }
	.skill-rank small { margin-bottom: 5px; color: #ff5372; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 1.5px; }

	.skill-panel { position: relative; padding: 28px 30px 34px; background: rgba(3, 10, 40, 0.88); border-top: 4px solid #63efff; clip-path: polygon(0 0, 100% 0, calc(100% - 32px) 100%, 0 100%); box-shadow: 18px 17px 0 rgba(0, 3, 20, 0.45); backdrop-filter: blur(13px); animation: panel-in 0.48s cubic-bezier(0.16, 1, 0.3, 1) both; }
	.panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
	.panel-head span { color: rgba(135, 234, 255, 0.5); font-size: 10px; font-weight: 700; letter-spacing: 3px; }
	h2 { margin-top: 5px; font-family: 'Anton', sans-serif; font-size: clamp(48px, 4.4vw, 74px); font-weight: 400; line-height: 0.9; }
	.panel-head > strong { font-family: 'Anton', sans-serif; font-size: 82px; font-style: italic; line-height: 0.8; color: #ff496c; text-shadow: 5px 4px 0 rgba(255, 255, 255, 0.12); }
	.panel-description { margin-top: 20px; color: rgba(229, 247, 255, 0.68); font-size: 18px; line-height: 1.4; }
	.ability-list { display: flex; flex-direction: column; gap: 20px; margin-top: 30px; }
	.ability { animation: ability-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both; }
	.ability-row { display: grid; grid-template-columns: 28px 1fr auto; align-items: baseline; gap: 9px; }
	.ability-row span { color: #64ecff; font-size: 10px; letter-spacing: 1px; }
	.ability-row strong { font-size: 20px; letter-spacing: 1px; text-transform: uppercase; }
	.ability-row em { color: #fff; font-family: 'Anton', sans-serif; font-size: 25px; font-style: italic; }
	.ability-track { height: 9px; margin-top: 7px; padding: 2px; background: rgba(103, 235, 255, 0.11); transform: skewX(-12deg); overflow: hidden; }
	.ability-track i { display: block; width: var(--level); height: 100%; background: linear-gradient(90deg, #0a56d5, #69f2ff 75%, #fff); transform-origin: left; animation: meter-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) + 100ms) both; }
	.ability > p { margin: 6px 0 0 37px; color: rgba(178, 226, 244, 0.47); font-size: 12px; letter-spacing: 1.2px; }

	@keyframes panel-in { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
	@keyframes ability-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
	@keyframes meter-in { from { transform: skewX(12deg) scaleX(0); } to { transform: skewX(12deg) scaleX(1); } }
	@keyframes lead-enter { from { opacity: 0; transform: translate3d(-30px, 12px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
	@keyframes deck-enter { from { opacity: 0; transform: translate3d(30px, 14px, 0) skewX(-2deg); } to { opacity: 1; transform: translate3d(0, 0, 0) skewX(0); } }

	@media (max-width: 1100px) {
		.tech-layout { grid-template-columns: 0.7fr 1fr; padding-top: 130px; }
		.tech-lead { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; align-items: end; }
		.tech-summary { grid-column: 2; grid-row: 1 / span 2; }
		.tech-total { display: none; }
	}

	@media (max-width: 800px) {
		.tech-layout { grid-template-columns: 1fr; padding: 155px 20px 90px; }
		.tech-lead { display: block; }
		h1 { font-size: clamp(62px, 22vw, 96px); }
		.skill-deck { flex-direction: row; overflow-x: auto; padding: 8px 8px 14px; scroll-snap-type: x mandatory; }
		.skill-deck button { min-width: min(310px, calc(100vw - 64px)); scroll-snap-align: start; }
		.skill-deck button.active { transform: translateX(4px); }
		.skill-panel { min-height: 450px; }
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-lead, .skill-deck button, .skill-panel, .ability, .ability-track i { animation: none; }
	}
</style>
