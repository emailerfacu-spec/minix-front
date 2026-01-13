<script lang="ts">
	import { apiBase } from '@/stores/url';
	import Button from '../ui/button/button.svelte';
	import DialogContent from '../ui/dialog/dialog-content.svelte';
	import DialogHeader from '../ui/dialog/dialog-header.svelte';
	import DialogTitle from '../ui/dialog/dialog-title.svelte';
	import Dialog from '../ui/dialog/dialog.svelte';
	import type { UserResponseDto } from '../../../types';
	import { invalidate } from '$app/navigation';
	import { sesionStore } from '@/stores/usuario';

	interface Props {
		open: boolean;
		usuario: UserResponseDto | null;
	}

	let { open = $bindable(), usuario }: Props = $props();

	let mensajeResultado = $state('');
	let mostrarResultado = $state(false);
	let esExitoso = $state(false);
</script>

{#if mostrarResultado}
	<Dialog
		open={mostrarResultado}
		onOpenChange={() => {
			mostrarResultado = false;
			open = false;
		}}
	>
		<DialogContent>
			<div
				class={esExitoso
					? 'rounded border border-green-400 bg-green-100/10 px-4 py-3 text-green-700'
					: 'rounded border border-red-400 bg-red-100/10 px-4 py-3 text-red-700'}
			>
				{mensajeResultado}
			</div>
		</DialogContent>
	</Dialog>
{/if}
<Dialog {open} onOpenChange={() => (open = false)}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Confirmar Admin</DialogTitle>
		</DialogHeader>
		<form
			onsubmit={async (e) => {
				e.preventDefault();
				try {
					const req = await fetch(`${$apiBase}/api/admin/give`, {
						method: 'PATCH',
						body: JSON.stringify({ isAdmin: usuario?.isAdmin || false, id: usuario?.id || '' }),
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${$sesionStore?.accessToken}`
						}
					});
					if (req.ok) {
						esExitoso = true;
						mensajeResultado = 'Operación realizada con éxito';
						mostrarResultado = true;
						invalidate('admin:load');
					} else {
						const res = await req.json();
						esExitoso = false;
						mensajeResultado = res.message || 'Error desconocido';
						mostrarResultado = true;
					}
				} catch {
					esExitoso = false;
					mensajeResultado = 'Error de conexión';
					mostrarResultado = true;
				}
			}}
		>
			{#if usuario}
				<p>
					{usuario.isAdmin
						? '¿Estás seguro que quieres sacarle acceso de administrador al usuario '
						: '¿Estás seguro que quieres dar acceso de administrador al usuario '}
					<strong>{usuario.displayName}</strong>
					(@{usuario.username})?
				</p>
			{/if}
			<div class="mt-4 flex justify-between gap-2">
				<Button type="submit">Confirmar</Button>
				<Button variant="secondary" onclick={() => (open = false)}>Cancelar</Button>
			</div>
		</form>
	</DialogContent>
</Dialog>
