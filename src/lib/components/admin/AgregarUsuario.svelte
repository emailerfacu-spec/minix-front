<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Dialog, DialogTitle, DialogContent, DialogHeader } from '../ui/dialog';
	import InputGroup from '../ui/input-group/input-group.svelte';
	import InputGroupInput from '../ui/input-group/input-group-input.svelte';
	import InputGroupAddon from '../ui/input-group/input-group-addon.svelte';
	import Button from '../ui/button/button.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import { register } from '@/hooks/register';
	import type { RegisterDto } from '../../../types';
	import { invalidate } from '$app/navigation';

	interface Prop {
		open: boolean;
	}

	let { open = $bindable() }: Prop = $props();

	let cargando = $state(false);
	let error = $state('');

	let dto = $state<RegisterDto>({
		username: '',
		email: '',
		password: '',
		displayName: ''
	});

	async function onsubmit(e: SubmitEvent) {
		cargando = true;
		error = '';

		await register(
			e,
			dto,
			() => {
				error = 'Error al registrar el usuario';
			},
			true
		);
		if (error == '') {
			invalidate('admin:load');
			open = false;
			dto = {
				username: '',
				email: '',
				password: '',
				displayName: ''
			};
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
				<DialogTitle>Agregar Usuario</DialogTitle>
			</DialogHeader>

			<form {onsubmit}>
				<div class="flex flex-col gap-3">
					<InputGroup>
						<InputGroupInput disabled={cargando} bind:value={dto.username} />
						<InputGroupAddon>Usuario</InputGroupAddon>
					</InputGroup>

					<InputGroup>
						<InputGroupInput type="email" disabled={cargando} bind:value={dto.email} />
						<InputGroupAddon>Email</InputGroupAddon>
					</InputGroup>

					<InputGroup>
						<InputGroupInput disabled={cargando} bind:value={dto.displayName} />
						<InputGroupAddon>Nombre visible</InputGroupAddon>
					</InputGroup>

					<InputGroup>
						<InputGroupInput type="password" disabled={cargando} bind:value={dto.password} />
						<InputGroupAddon>Contraseña</InputGroupAddon>
					</InputGroup>

					<hr class="my-2" />

					<div class="flex justify-between">
						<Button type="submit" disabled={cargando}>
							{#if cargando}
								<Spinner /> Creando...
							{:else}
								Crear
							{/if}
						</Button>

						<Button variant="secondary" disabled={cargando} onclick={() => (open = false)}>
							Cancelar
						</Button>
					</div>
				</div>
			</form>
		</DialogContent>
	</Dialog>
</div>

<div transition:fade>
	<Dialog open={error !== ''} onOpenChange={() => (error = '')}>
		<DialogContent>{error}</DialogContent>
	</Dialog>
</div>
