<script lang="ts">
	import TableBody from '@/components/ui/table/table-body.svelte';
	import TableCell from '@/components/ui/table/table-cell.svelte';
	import TableHead from '@/components/ui/table/table-head.svelte';
	import TableHeader from '@/components/ui/table/table-header.svelte';
	import TableRow from '@/components/ui/table/table-row.svelte';
	import Table from '@/components/ui/table/table.svelte';
	import type { UserResponseDto } from '../../types';
	import Button from './ui/button/button.svelte';
	import KeyIcon from '@lucide/svelte/icons/key';
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Shield from '@lucide/svelte/icons/shield';
	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import { Tooltip } from './ui/tooltip';
	import TooltipTrigger from './ui/tooltip/tooltip-trigger.svelte';
	import TooltipContent from './ui/tooltip/tooltip-content.svelte';
	import RecuperarContraseña from './admin/RecuperarContraseña.svelte';
	import ModificarUsuario from './admin/ModificarUsuario.svelte';
	import Trash_2 from '@lucide/svelte/icons/trash-2';
	import BorrarUsuario from './BorrarUsuario.svelte';
	import InputGroup from './ui/input-group/input-group.svelte';
	import InputGroupAddon from './ui/input-group/input-group-addon.svelte';
	import InputGroupInput from './ui/input-group/input-group-input.svelte';
	import AgregarUsuario from './admin/AgregarUsuario.svelte';
	import DarAdmin from './admin/DarAdmin.svelte';
	import { busquedaAdminUsuarios } from '@/hooks/busquedaAdminUsuarios';
	import { invalidate, replaceState } from '$app/navigation';

	interface Props {
		usuarios: UserResponseDto[];
		hayMas: boolean;
	}

	let { usuarios = $bindable(), hayMas }: Props = $props();

	let paginaActual = $derived.by(() => {
		const url = new URL(window.location.href);
		return Number(url.searchParams.get('p')) || 1;
	});
	let search = $derived.by(() => {
		const url = new URL(window.location.href);
		let ret = url.searchParams.get('q') || '';
		return ret;
	});
	let hayMass = $derived(hayMas);

	let open = $state(false);
	let openModificarUsuario = $state(false);
	let openDarAdmin = $state(false);
	let openBorrar = $state(false);
	let opencrearUsuario = $state(false);

	let usuarioBorrar: UserResponseDto | null = $state(null);
	let usuarioCambioPass: UserResponseDto | null = $state(null);
	let usuarioModificar: UserResponseDto | null = $state(null);
	let usuarioDarAdmin: UserResponseDto | null = $state(null);

	type SortKey = 'username' | 'displayName' | 'postsCount' | 'createdAt';
	let sortBy = $state<SortKey | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	let usuariosFiltrados = $derived(usuarios);

	function ordenarPor(campo: SortKey) {
		if (sortBy === campo) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = campo;
			sortDirection = 'asc';
		}
		usuariosFiltrados = usuariosFiltrados.toSorted((a, b) => {
			if (!sortBy) return 0;

			const key: SortKey = sortBy;

			if (key === 'createdAt') {
				const ta = new Date(a.createdAt).getTime();
				const tb = new Date(b.createdAt).getTime();
				return sortDirection === 'asc' ? ta - tb : tb - ta;
			}

			if (key === 'postsCount') {
				return sortDirection === 'asc' ? a.postsCount - b.postsCount : b.postsCount - a.postsCount;
			}

			const sa = a[key].toString().toLowerCase();
			const sb = b[key].toString().toLowerCase();
			return sortDirection === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
		});
		paginaActual = 1;
	}

	function getSortIcon(campo: SortKey) {
		if (sortBy !== campo) return '';
		return sortDirection === 'asc' ? '↑' : '↓';
	}

	// $inspect(usuarios);
	let timeoutId: ReturnType<typeof setTimeout> | number | undefined;
	function buscarUsuarios() {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(async () => {
			const url = new URL(window.location.href);
			if (!search.trim()) {
				url.searchParams.delete('q');
			} else {
				url.searchParams.set('q', search);
			}
			replaceState(url, {});

			let ret = await busquedaAdminUsuarios(search, ITEMS_POR_PAGINA, paginaActual);
			usuariosFiltrados = ret.usuarios;
			// invalidate('admin:load');
			hayMass = ret.hayMas;
		}, 200);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}
	const ITEMS_POR_PAGINA = 5;

	// const usuariosPaginados = $derived(
	// 	usuariosFiltrados.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA)
	// );
</script>

<div class="mb-4 flex gap-2">
	<InputGroup>
		<InputGroupAddon align="inline-start"><Search></Search></InputGroupAddon>
		<InputGroupInput
			type="text"
			placeholder="Buscar usuario..."
			bind:value={search}
			oninput={() => buscarUsuarios()}
		/>
	</InputGroup>
	<Button
		onclick={() => (opencrearUsuario = !opencrearUsuario)}
		variant="secondary"
		class="bg-blue-500/20"><Plus /></Button
	>
</div>

<Table>
	<TableHeader>
		<TableRow>
			<TableHead onclick={() => ordenarPor('username')} class="cursor-pointer select-none">
				Usuario {getSortIcon('username')}
			</TableHead>
			<TableHead onclick={() => ordenarPor('displayName')} class="cursor-pointer select-none">
				Nombre {getSortIcon('displayName')}
			</TableHead>
			<TableHead onclick={() => ordenarPor('postsCount')} class="cursor-pointer select-none">
				Cantidad de posts {getSortIcon('postsCount')}
			</TableHead>
			<TableHead onclick={() => ordenarPor('createdAt')} class="cursor-pointer select-none">
				Fecha de Creacion {getSortIcon('createdAt')}
			</TableHead>
			<TableHead>Acciones</TableHead>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#if usuariosFiltrados.length == 0}
			<TableRow>
				<TableCell colspan={5}>
					<p class="text-center">No hay usuarios por el nombre de: {search}</p>
				</TableCell>
			</TableRow>{:else}
			{#each usuariosFiltrados as usuario}
				<TableRow>
					<TableCell
						>@<a href={'/' + usuario.username}>
							{usuario.username}
						</a>
					</TableCell>
					<TableCell>{usuario.displayName}</TableCell>
					<TableCell class="text-center">{usuario.postsCount}</TableCell>
					<TableCell>{usuario.createdAt.replace('Z', ' ').replace('T', ' | ')}</TableCell>
					<TableCell class="flex gap-2">
						<Tooltip>
							<TooltipTrigger>
								<Button
									onclick={() => {
										open = true;
										usuarioCambioPass = usuario;
									}}><KeyIcon></KeyIcon></Button
								>
							</TooltipTrigger>
							<TooltipContent>
								<p>Recuperar Contraseña</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<Button
									onclick={() => {
										openModificarUsuario = true;
										usuarioModificar = usuario;
									}}><UserPen /></Button
								>
							</TooltipTrigger>
							<TooltipContent>
								<p>Modificar Usuario</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<Button
									disabled={usuario.isAdmin}
									onclick={() => {
										openBorrar = true;
										usuarioBorrar = usuario;
									}}
									variant="destructive"><Trash_2 /></Button
								>
							</TooltipTrigger>
							<TooltipContent>
								{#if usuario.isAdmin}
									No se pueden eliminar usuarios Admin
								{:else}
									Eliminar Usuario
								{/if}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger>
								<Button
									onclick={() => {
										openDarAdmin = true;
										usuarioDarAdmin = usuario;
									}}
									variant={usuario.isAdmin ? 'destructive' : 'default'}
								>
									<Shield />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{#if usuario.isAdmin}
									Sacar admin
								{:else}
									Dar Admin
								{/if}
							</TooltipContent>
						</Tooltip>
					</TableCell>
				</TableRow>
			{/each}
		{/if}
	</TableBody>
</Table>
<div class="mt-4 flex items-center justify-between">
	<Button
		disabled={paginaActual === 1}
		onclick={() => {
			const url = new URL(window.location.href);
			url.searchParams.set('p', String(--paginaActual));
			replaceState(url, {});
			buscarUsuarios();
		}}
		variant="secondary"
	>
		Anterior
	</Button>

	<Button
		disabled={!hayMass}
		onclick={() => {
			const url = new URL(window.location.href);
			url.searchParams.set('p', String(++paginaActual));
			replaceState(url, {});
			buscarUsuarios();
		}}
		variant="secondary">Siguiente</Button
	>
</div>
<BorrarUsuario bind:open={openBorrar} usuario={usuarioBorrar} />
<RecuperarContraseña bind:open usuario={usuarioCambioPass} />
<ModificarUsuario bind:open={openModificarUsuario} bind:usuario={usuarioModificar} />
<AgregarUsuario bind:open={opencrearUsuario} />
<DarAdmin bind:open={openDarAdmin} usuario={usuarioDarAdmin} />
