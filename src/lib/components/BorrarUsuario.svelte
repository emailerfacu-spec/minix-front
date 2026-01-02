<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Dialog } from './ui/dialog';
	import DialogContent from './ui/dialog/dialog-content.svelte';
	import DialogHeader from './ui/dialog/dialog-header.svelte';
	import DialogTitle from './ui/dialog/dialog-title.svelte';
	import Button from './ui/button/button.svelte';
	import Spinner from './ui/spinner/spinner.svelte';
	import { borrarUsuario } from '@/hooks/borrarUsuario';
	import { invalidate } from '$app/navigation';

	let cargando = $state(false);

	let { usuario, open = $bindable() } = $props();

	async function handleBorrar() {
		if (!usuario) return;

		await borrarUsuario(usuario.id);
		open = false;
		invalidate('admin:load');
	}
</script>

<div transition:fade>
	<Dialog {open} onOpenChange={() => (open = false)}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Borrar Usuario</DialogTitle>
			</DialogHeader>
			<p>¿Está seguro que desea borrar al usuario {usuario?.displayName}?</p>
			<div class="mt-4 flex justify-between">
				<Button variant="destructive" onclick={handleBorrar} disabled={cargando}>
					{#if cargando}
						<Spinner />
					{:else}
						Borrar
					{/if}
				</Button>
				<Button variant="secondary" onclick={() => (open = false)} disabled={cargando}>
					Cancelar
				</Button>
			</div>
		</DialogContent>
	</Dialog>
</div>
