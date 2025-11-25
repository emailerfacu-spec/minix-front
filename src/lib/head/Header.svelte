<script>
	import { Button } from '../components/ui/button';
	import ButtonTheme from './ButtonTheme.svelte';
	import ButtonGroup from '@/components/ui/button-group/button-group.svelte';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { sesionStore } from '@/stores/usuario';
	import { onMount } from 'svelte';
	import { apiBase } from '@/stores/url';
	import { goto } from '$app/navigation';
	import AvatarButton from './AvatarButton.svelte';

	let menuOpen = $state(false);
	const toggleMenu = () => (menuOpen = !menuOpen);

	let showCerrarSesion = $state(false);

	onMount(() => {
		sesionStore.subscribe((value) => {
			showCerrarSesion = !!value?.accessToken;
		});
	});

	async function cerrarSesion() {
		try {
			const req = await fetch($apiBase + '/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$sesionStore?.accessToken}`
				},
				credentials: 'include'
			});
			if (req.ok) {
				sesionStore.reset();
				menuOpen = false;
			}
		} catch {
			console.log('fallo el lougout');
		} finally {
			sesionStore.reset();
			goto('/');
		}
	}
</script>

<header class="border-b bg-background/95 backdrop-blur">
	<div class="mx-4 ms-2 flex h-12 items-center justify-between">
		<div class="flex items-center">
			<a href="/" class="mr-6 flex items-center space-x-2">
				<p class="leading-7 not-first:mt-6">Mini-X</p>
			</a>
			<nav class="me-2 items-center space-x-6 text-sm font-medium md:flex">
				<ButtonTheme />
			</nav>
			<div class="md:hidden">
				{#if $sesionStore !== null}
					<AvatarButton></AvatarButton>
				{/if}
			</div>
		</div>

		<!-- Desktop menu -->
		<div class="hidden flex-1 items-center justify-end md:flex">
			{#if showCerrarSesion}
				{#if $sesionStore !== null}
					<AvatarButton></AvatarButton>
				{/if}
			{:else}
				<ButtonGroup>
					<Button
						variant={page.url.pathname !== '/login' ? 'outline' : 'secondary'}
						href="/login"
						class="text-foreground/60 transition-colors hover:text-foreground/80"
						>Iniciar Sesion
					</Button>
					<Button
						variant={page.url.pathname !== '/register' ? 'outline' : 'secondary'}
						href="/register"
						class="text-foreground/60 transition-colors hover:text-foreground/80"
						>Registrarse
					</Button>
				</ButtonGroup>
			{/if}
		</div>

		<!-- Mobile menu button -->
		<button class="me-3 rounded-md md:hidden" onclick={toggleMenu} aria-label="Toggle menu">
			{#if menuOpen}
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{:else}
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			{/if}
		</button>
	</div>

	<!-- Mobile menu -->
	{#if menuOpen}
		<div class="md:hidden" transition:slide>
			<div class="space-y-1 border-t bg-background/95 px-2 pt-2 pb-3">
				<!---
				{#if showCerrarSesion}{:else}
				-->
				<Button
					variant={page.url.pathname !== '/login' ? 'outline' : 'secondary'}
					href="/login"
					class="mb-2 w-full justify-start text-foreground/60 transition-colors hover:text-foreground/80"
					onclick={() => (menuOpen = false)}>Iniciar Sesion</Button
				>
				<Button
					variant={page.url.pathname !== '/register' ? 'outline' : 'secondary'}
					href="/register"
					class="w-full justify-start text-foreground/60 transition-colors hover:text-foreground/80"
					onclick={() => (menuOpen = false)}
					>Registrarse
				</Button>
				<!-- {/if} -->
			</div>
		</div>
	{/if}
</header>
