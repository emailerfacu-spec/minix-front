<script>
	import Button from '../ui/button/button.svelte';
	import DialogContent from '../ui/dialog/dialog-content.svelte';
	import DialogHeader from '../ui/dialog/dialog-header.svelte';
	import DialogTitle from '../ui/dialog/dialog-title.svelte';
	import Dialog from '../ui/dialog/dialog.svelte';

	let { open = $bindable(), usuario } = $props();
</script>

<Dialog {open} onOpenChange={() => (open = false)}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Confirmar Admin</DialogTitle>
		</DialogHeader>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				
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
