<script lang="ts">
	import Key from '@lucide/svelte/icons/key';
	import { Dialog } from '../ui/dialog';
	import DialogContent from '../ui/dialog/dialog-content.svelte';
	import InputGroupAddon from '../ui/input-group/input-group-addon.svelte';
	import InputGroupInput from '../ui/input-group/input-group-input.svelte';
	import InputGroup from '../ui/input-group/input-group.svelte';
	import DialogTitle from '../ui/dialog/dialog-title.svelte';
	import type { UserResponseDto } from '../../../types';
	import DialogHeader from '../ui/dialog/dialog-header.svelte';
	import { fade } from 'svelte/transition';
	import { cambiarContraseña } from '@/hooks/cambiarContraseña';
	import Button from '../ui/button/button.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';

	interface Prop {
		open: boolean;
		usuario: UserResponseDto | null;
	}
	let { open = $bindable(), usuario }: Prop = $props();

	let cargando = $state(false);
	let error = $state('');
	let nuevapass = $state('');
	let openMensaje = $state(false);

	async function onsubmit(e: SubmitEvent) {
		cargando = true;
		error = await cambiarContraseña(usuario!, nuevapass);
		if (error === '') {
			open = false;
			nuevapass = '';
		}
		openMensaje = true;
		cargando = false;
	}
</script>

<div transition:fade>
	<Dialog open={open && !!usuario} onOpenChange={() => (open = !open)}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle><p>Cambiar Contraseña</p></DialogTitle>
			</DialogHeader>
			<form {onsubmit}>
				<InputGroup>
					<InputGroupInput
						disabled={cargando}
						type="password"
						name=""
						minlength={8}
						bind:value={nuevapass}
					/>
					<InputGroupAddon><Key /></InputGroupAddon>
					<InputGroupAddon align="inline-end">
						<p
							class={{
								'text-red-500': nuevapass.length < 8,
								'text-blue-500': nuevapass.length >= 8
							}}
						>
							{nuevapass.length}
						</p>
						/ 8
					</InputGroupAddon>
				</InputGroup>
				<div class="mt-2 flex justify-between">
					<Button type="submit" disabled={cargando}>
						{#if cargando}
							<Spinner />
						{:else}
							Aceptar
						{/if}
					</Button>
					<Button variant="secondary" onclick={() => (open = false)} disabled={cargando}
						>Cerrar</Button
					>
				</div>
			</form>
		</DialogContent>
	</Dialog>
</div>
<div transition:fade>
	<Dialog open={openMensaje} onOpenChange={() => (openMensaje = false)}>
		<!-- {$inspect(error)} -->
		<DialogContent>{error === '' ? 'Se modificó el usuario' : error}</DialogContent>
	</Dialog>
</div>
