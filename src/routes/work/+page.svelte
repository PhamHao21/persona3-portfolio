<script>
	import PageTransition from '$lib/components/PageTransition.svelte';
	import PageKeyNavigation from '$lib/components/PageKeyNavigation.svelte';
	import Work from '$lib/components/Work.svelte';
</script>

<svelte:head>
	<title>Work | Thorwen Pham</title>
	<meta name="description" content="Current work status, featured builds, and professional focus." />
</svelte:head>

<PageTransition variant="work">
	<Work />
	<PageKeyNavigation />
</PageTransition>
