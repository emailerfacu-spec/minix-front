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
	import Busqueda from './Busqueda.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';

	let menuOpen = $state(false);
	const toggleMenu = () => (menuOpen = !menuOpen);

	let showCerrarSesion = $state(false);

	onMount(() => {
		sesionStore.subscribe((value) => {
			showCerrarSesion = !!value?.username;
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
				<Avatar
					class="h-8 w-8 transform rounded-sm! transition-transform duration-300 ease-in-out hover:scale-130 hover:rotate-12"
				>
					<AvatarImage src="/x.png" alt="minix" />
				</Avatar>
			</a>
			<!-- <nav class="me-2 items-center space-x-6 text-sm font-medium md:flex">
				<ButtonTheme />
			</nav> -->
		</div>

		<!-- Desktop menu -->
		<div class="flex items-center justify-end gap-2 md:flex">
			<Busqueda></Busqueda>
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
	</div>
</header>
