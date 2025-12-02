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
	import { Tooltip } from './ui/tooltip';
	import TooltipTrigger from './ui/tooltip/tooltip-trigger.svelte';
	import TooltipContent from './ui/tooltip/tooltip-content.svelte';
	import RecuperarContraseña from './admin/RecuperarContraseña.svelte';
	import { Dialog } from './ui/dialog';
	import DialogContent from './ui/dialog/dialog-content.svelte';
	import ModificarUsuario from './admin/ModificarUsuario.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		usuarios: UserResponseDto[];
	}

	let { usuarios = $bindable() }: Props = $props();

	let open = $state(false);
	let openModificarUsuario = $state(false);

	//si ponia contraseña en español quedaba muy largo el nombre
	let usuarioCambioPass: UserResponseDto | null = $state(null);

	let usuarioModificar: UserResponseDto | null = $state(null);

	$effect(() => {
		if (!open) {
			usuarioCambioPass = null;
		}
	});

	function handleCambiarContraseña(usuario: UserResponseDto) {
		open = true;
		usuarioCambioPass = usuario;
	}

	function handleModificar(usuario: UserResponseDto) {
		openModificarUsuario = true;
		usuarioModificar = usuario;
	}
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
							<Button onclick={() => handleCambiarContraseña(usuario)}><KeyIcon></KeyIcon></Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Recuperar Contraseña</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<Button onclick={() => handleModificar(usuario)}><UserPen /></Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Modificar Usuario</p>
						</TooltipContent>
					</Tooltip>
					<Button></Button>
				</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
<RecuperarContraseña bind:open usuario={usuarioCambioPass} />
<ModificarUsuario bind:open={openModificarUsuario} bind:usuario={usuarioModificar} />
