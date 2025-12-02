<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Dialog, DialogTitle, DialogContent, DialogHeader } from '../ui/dialog';
	import InputGroup from '../ui/input-group/input-group.svelte';
	import InputGroupInput from '../ui/input-group/input-group-input.svelte';
	import InputGroupAddon from '../ui/input-group/input-group-addon.svelte';
	import Button from '../ui/button/button.svelte';
	import type { UserResponseDto } from '../../../types';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	import Label from '../ui/label/label.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import { updateUsuario } from '@/hooks/updateUsuario';

	interface Prop {
		open: boolean;
		usuario: UserResponseDto | null;
	}
	let { open = $bindable(), usuario = $bindable() }: Prop = $props();

	let imagen = $state(!!usuario?.profileImageUrl);
	let fallback = usuario?.displayName;

	let cargando = $state(false);
	let error = $state('');
	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		cargando = true;
		let ret: { displayName: string } | string = await updateUsuario({
			id: usuario?.id || '',
			bio: usuario?.bio || '',
			displayName: usuario?.displayName || '',
			oldImageUrl: usuario?.profileImageUrl || '',
			profileImage: imagen
		});
		if (typeof ret === 'string') {
			error = ret;
		} else {
			usuario!.displayName = ret.displayName;
			open = false;
		}
		cargando = false;
	}
</script>

<div transition:fade>
	<Dialog
		{open}
		onOpenChange={() => {
			open = !open;
		}}
	>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Modificar Usuario</DialogTitle>
			</DialogHeader>
			<form {onsubmit}>
				<div class="flex flex-col gap-3">
					<InputGroup>
						<InputGroupInput disabled={cargando} bind:value={usuario!.displayName} />
						<InputGroupAddon>Nombre</InputGroupAddon>
					</InputGroup>
					<InputGroup>
						<InputGroupInput disabled={cargando} bind:value={usuario!.bio} />
						<InputGroupAddon>Bio</InputGroupAddon>
					</InputGroup>
					<div class="ms-1 flex gap-2">
						<Checkbox disabled={usuario?.profileImageUrl == null || cargando} bind:checked={imagen}
						></Checkbox>
						<Label>
							{#if usuario?.profileImageUrl == null}
								No tiene imagen de perfil
							{:else if imagen}
								Borrar imagen
							{:else}
								Mantener imagen
							{/if}
						</Label>
					</div>
					<hr class="my-2" />
					<div class="flex justify-between">
						<Button type="submit" disabled={cargando}>
							{#if cargando}
								<Spinner /> Cargando...
							{:else}
								Aceptar
							{/if}
						</Button>
						<Button variant="secondary" disabled={cargando}>Cerrar</Button>
					</div>
				</div>
			</form>
		</DialogContent>
	</Dialog>
</div>
<div transition:fade>
	<Dialog open={error != ''} onOpenChange={() => (error = '')}>
		<DialogContent>
			{error}
		</DialogContent>
	</Dialog>
</div>
