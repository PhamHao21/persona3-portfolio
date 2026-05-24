<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import ControlHints from '$lib/components/ControlHints.svelte';
	import { playRippleTransition } from '$lib/utils/rippleTransition.js';

	const routeOrder = ['/about', '/project', '/tech', '/work'];

	let currentPath = $derived(page.url.pathname.replace(/\/$/, '') || '/');
	let currentIndex = $derived(routeOrder.indexOf(currentPath));
	let previousTarget = $derived(currentIndex <= 0 ? '/' : routeOrder[currentIndex - 1]);
	let nextTarget = $derived(currentIndex === routeOrder.length - 1 ? '/' : routeOrder[currentIndex + 1] || '/');

	let navigating = false;

	async function navigateTo(target, source) {
		if (navigating) return;

		navigating = true;
		await playRippleTransition(source);
		await goto(target, { noScroll: true });
		navigating = false;
	}

	onMount(() => {
		const onKey = (event) => {
			if (event.defaultPrevented) return;
			if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

			const tag = document.activeElement?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

			event.preventDefault();
			const x = event.key === 'ArrowLeft' ? window.innerWidth * 0.18 : window.innerWidth * 0.82;
			const y = window.innerHeight * 0.42;
			navigateTo(event.key === 'ArrowLeft' ? previousTarget : nextTarget, { x, y });
		};

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<ControlHints rows={[{ key: 'Left/Right', label: 'Navigate' }]} />
