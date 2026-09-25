<script>
	import AboutMe from '$lib/components/AboutMe.svelte';
	import PageKeyNavigation from '$lib/components/PageKeyNavigation.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
</script>

<svelte:head>
	<title>About | Thorwen Pham</title>
	<meta name="description" content="Frontend developer profile, approach, and current focus." />
</svelte:head>

<PageTransition variant="about">
	<AboutMe />
	<PageKeyNavigation />
</PageTransition>
