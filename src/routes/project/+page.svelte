<script>
	import PageKeyNavigation from '$lib/components/PageKeyNavigation.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import Project from '$lib/components/Project.svelte';
</script>

<svelte:head>
	<title>Projects | Thorwen Pham</title>
	<meta name="description" content="Selected frontend, interaction, and creative development projects." />
</svelte:head>

<PageTransition variant="projects">
	<Project />
	<PageKeyNavigation />
</PageTransition>
