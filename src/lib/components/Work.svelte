<script>
	import bgVideo from '$lib/assets/main1.mp4';
</script>

<div id="menu-screen">
	<video src={bgVideo} autoplay loop muted playsinline></video>
	<div class="side-title">SIDE PROJECTS</div>
</div>

<style>
	.side-title {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 10;
		font-family: 'Anton', sans-serif;
		font-size: clamp(64px, 10vw, 150px);
		font-style: italic;
		letter-spacing: 2px;
		line-height: 0.9;
		color: #fff;
		-webkit-text-stroke: 3px #06133b;
		paint-order: stroke fill;
		transform: translate(-50%, -50%) skewX(-8deg);
		text-shadow: 12px 10px 0 #c4001a;
		white-space: nowrap;
	}
</style>
