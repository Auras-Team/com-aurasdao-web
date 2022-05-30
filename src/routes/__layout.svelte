<script>
	import { page } from '$app/stores';

	import '../app.css';

	$: tokenPath = $page.routeId && $page.routeId.includes('token');
	$: infoPath = $page.routeId && $page.routeId.includes('info');
	$: roadmapPath = $page.routeId && $page.routeId.includes('roadmap');
	$: storyPath = $page.routeId && $page.routeId.includes('story');
</script>

<div class="box box-size box-base">
	<div class="box-size base-back" />
</div>
<div class="box box-size box-focus">
	<div class="box-size focus-back" />
</div>
<div class="box box-size box-navi">
	<div class="navi navi-lt">
		{#if tokenPath}
			<a href="/" class="text-2xl font-light opacity-75">home</a>
		{:else}
			<a href="/token" class="text-2xl font-light opacity-75">mint</a>
		{/if}
	</div>
	<div class="navi navi-rt">
		{#if infoPath}
			<a href="/" class="text-2xl font-light opacity-75">home</a>
		{:else}
			<a href="/info" class="text-2xl font-light opacity-75">info</a>
		{/if}
	</div>
	<div class="navi navi-lb">
		{#if roadmapPath}
			<a href="/" class="text-2xl font-light opacity-75">home</a>
		{:else}
			<a href="/roadmap" class="text-2xl font-light opacity-75">roadmap</a>
		{/if}
	</div>
	<div class="navi navi-rb">
		{#if storyPath}
			<a href="/" class="text-2xl font-light opacity-75">home</a>
		{:else}
			<a href="/story" class="text-2xl font-light opacity-75">story</a>
		{/if}
	</div>
</div>

<div class="box box-size box-content">
	<div class="flex flex-col items-center justify-center py-16 pb-32 bg-slate-500">
		<slot />
	</div>
</div>
