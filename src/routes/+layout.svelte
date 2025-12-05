<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '@/head/Header.svelte';
	import { TooltipProvider } from '@/components/ui/tooltip';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Mini X</title>
</svelte:head>
<ModeWatcher />
<Header />
<TooltipProvider>
	{@render children()}
</TooltipProvider>
