<script lang="ts">
	import TableBody from '@/components/ui/table/table-body.svelte';
	import TableCell from '@/components/ui/table/table-cell.svelte';
	import TableHead from '@/components/ui/table/table-head.svelte';
	import TableHeader from '@/components/ui/table/table-header.svelte';
	import TableRow from '@/components/ui/table/table-row.svelte';
	import Table from '@/components/ui/table/table.svelte';
	import type { UserResponseDto } from '../../../types';

	interface Props {
		usuarios: UserResponseDto[];
	}

	let { usuarios }: Props = $props();
</script>

<Table>
	<TableHeader>
		<TableRow>
			<TableHead>Usuario</TableHead>
			<TableHead>Nombre</TableHead>
			<TableHead>Cantidad de posts</TableHead>
			<TableHead>Fecha de Creacion</TableHead>
			<TableHead>Acciones</TableHead>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each usuarios as usuario}
			<TableRow>
				<TableCell>@{usuario.username}</TableCell>
				<TableCell>{usuario.displayName}</TableCell>
				<TableCell>?</TableCell>
				<TableCell>{usuario.createdAt.replace('Z', ' ').replace('T', ' | ')}</TableCell>
				<TableCell>?</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
