<script lang="ts">
	import CardAction from '@/components/ui/card/card-action.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import TableBody from '@/components/ui/table/table-body.svelte';
	import TableHead from '@/components/ui/table/table-head.svelte';
	import TableHeader from '@/components/ui/table/table-header.svelte';
	import TableRow from '@/components/ui/table/table-row.svelte';
	import Table from '@/components/ui/table/table.svelte';
	import type { User } from '../../../types';
	import CardDescription from '@/components/ui/card/card-description.svelte';
	import Spinner from '@/components/ui/spinner/spinner.svelte';

	let usuarios: User[] = $state([]);
	let cargando = $state(true);
	let error = $state(true);
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<h1
			class="mb-4 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance underline"
		>
			Gestion Usuarios
		</h1>
		<Card class={error ? 'border-red-400' : ''}>
			<CardContent>
				{#if usuarios.length === 0}
					{#if error}
						<CardDescription class="flex items-center justify-center space-x-2 text-destructive">
							<span class="text-sm">Error al cargar usuarios.</span>
						</CardDescription>
					{:else if cargando}
						<CardDescription class="flex items-center justify-center space-x-2">
							<Spinner aria-label="Cargando usuarios" />
							<span class="text-md text-muted-foreground">Cargando usuarios...</span>
						</CardDescription>
					{:else}
						<CardDescription>No hay posts que mostar</CardDescription>
					{/if}
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Usuario</TableHead>
								<TableHead>Nombre</TableHead>
								<TableHead>Cantidad de posts</TableHead>
								<TableHead>Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody></TableBody>
					</Table>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
