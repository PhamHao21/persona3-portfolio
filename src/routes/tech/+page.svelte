<script>
	import PageKeyNavigation from '$lib/components/PageKeyNavigation.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import Tech from '$lib/components/Tech.svelte';
</script>

<svelte:head>
	<title>Tech | Thorwen Pham</title>
	<meta name="description" content="Frontend development, interaction, design, and workflow capabilities." />
</svelte:head>

<PageTransition variant="tech">
	<Tech />
	<PageKeyNavigation />
</PageTransition>
