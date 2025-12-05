<script lang="ts">
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import CardDescription from '@/components/ui/card/card-description.svelte';
	import { page } from '$app/state';
	import TablaUsuarios from '@/components/TablaUsuarios.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import CardHeader from '@/components/ui/card/card-header.svelte';

	let cargando = $state(true);
	let usuarios = $state(page.data.usuarios);
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<Card class={page.data.error ? 'border-red-400' : ''}>
			<CardHeader class="w-full">
				<CardTitle class="rounded-full bg-accent-foreground/10">
					<h1 class="mt-3 mb-4 scroll-m-20 text-center text-2xl font-extrabold tracking-tight">
						Gestion Usuarios
					</h1>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{#if page.data.usuarios.length === 0}
					<CardDescription>No hay posts que mostar</CardDescription>
				{:else}
					<TablaUsuarios bind:usuarios></TablaUsuarios>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
