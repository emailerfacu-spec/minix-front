<script lang="ts">
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import TableBody from '@/components/ui/table/table-body.svelte';
	import TableHead from '@/components/ui/table/table-head.svelte';
	import TableHeader from '@/components/ui/table/table-header.svelte';
	import TableRow from '@/components/ui/table/table-row.svelte';
	import Table from '@/components/ui/table/table.svelte';
	import type { User } from '../../../types';
	import CardDescription from '@/components/ui/card/card-description.svelte';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import TableCell from '@/components/ui/table/table-cell.svelte';
	import { page } from '$app/state';
	import TablaUsuarios from '@/components/TablaUsuarios.svelte';

	let cargando = $state(true);
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<h1
			class="mb-4 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance underline"
		>
			Gestion Usuarios
		</h1>
		<Card class={page.data.error ? 'border-red-400' : ''}>
			<CardContent>
				{#if page.data.usuarios.length === 0}
					{#if page.data.error}
						<CardDescription class="flex items-center justify-center space-x-2 text-destructive">
							<span class="text-sm">Error al cargar usuarios.</span>
						</CardDescription>
					{:else}
						<CardDescription>No hay posts que mostar</CardDescription>
					{/if}
				{:else}
					<TablaUsuarios usuarios={page.data.usuarios}></TablaUsuarios>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
