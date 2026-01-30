<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '@/head/Header.svelte';
	import { TooltipProvider } from '@/components/ui/tooltip';
	import { resolve } from '$app/paths';

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
<footer
	class="fixed right-0 bottom-0 left-0 border-t bg-background p-2 text-center text-sm text-muted-foreground"
>
	<p>
		&copy; {new Date().getFullYear()} Mini X. Todos los derechos reservados.
		<a class="text-blue-500 underline" href={resolve('/about')}>Sobre Nosotros</a>
	</p>
</footer>
