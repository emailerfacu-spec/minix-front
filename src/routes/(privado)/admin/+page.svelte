<script lang="ts">
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import CardDescription from '@/components/ui/card/card-description.svelte';
	import TablaUsuarios from '@/components/TablaUsuarios.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import type { UserResponseDto } from '../../../types';

	interface Prop {
		data: {
			usuarios?: UserResponseDto[];
			hayMas: boolean;
			error: boolean;
		};
	}

	let { data }: Prop = $props();
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<Card class={data.error ? 'border-red-400' : ''}>
			<CardHeader class="w-full">
				<CardTitle class="rounded-full bg-accent-foreground/10">
					<h1 class="mt-3 mb-4 scroll-m-20 text-center text-2xl font-extrabold tracking-tight">
						Gestion Usuarios
					</h1>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{#if data.usuarios?.length === 0}
					<CardDescription>No hay usuarios que mostar</CardDescription>
				{:else}
					<TablaUsuarios usuarios={data.usuarios || []} hayMas={data.hayMas}></TablaUsuarios>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
