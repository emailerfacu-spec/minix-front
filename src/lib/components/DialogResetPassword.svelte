<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { Dialog } from './ui/dialog';
	import DialogTrigger from './ui/dialog/dialog-trigger.svelte';
	import DialogContent from './ui/dialog/dialog-content.svelte';
	import DialogHeader from './ui/dialog/dialog-header.svelte';
	import DialogTitle from './ui/dialog/dialog-title.svelte';
	import Input from './ui/input/input.svelte';
	import Field from './ui/field/field.svelte';
	import FieldLabel from './ui/field/field-label.svelte';
	import FieldGroup from './ui/field/field-group.svelte';
	import DialogFooter from './ui/dialog/dialog-footer.svelte';
	import Spinner from './ui/spinner/spinner.svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { cambiarContraseñaUsuario } from '@/hooks/cambiarContraseñaUsuario';

	let { data = $bindable(), children } = $props();

	let passwordData = $state({
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	let cargando = $state(false);
	let open = $state(false);

	let mensajeError = $state('');

	const coinsiden = $derived(
		passwordData.newPassword === passwordData.confirmPassword &&
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W_]*$/.test(
				passwordData.newPassword
			) &&
			passwordData.newPassword.length > 8
	);

	async function onsubmit(e: SubmitEvent | null) {
		if (e != null) e.preventDefault();
		if (!coinsiden) {
			mensajeError = 'Las contraseñas no coinciden o no cumplen con los requisitos';
			return;
		}
		cargando = true;
		try {
			await cambiarContraseñaUsuario(data.id, passwordData.oldPassword, passwordData.newPassword);
			cargando = false;
			open = false;
			passwordData.oldPassword = '';
			passwordData.newPassword = '';
			passwordData.confirmPassword = '';
			await invalidate(page.url);
		} catch (error) {
			cargando = false;
			mensajeError = 'Error al cambiar la contraseña';
		}
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 'Enter') {
			onsubmit(null);
		}
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
		{@render children?.()}
	</DialogTrigger>
	<DialogContent>
		<form {onsubmit}>
			<DialogHeader>
				<DialogTitle>
					<h1 class="text-2xl font-bold">Resetear Contraseña</h1>
				</DialogTitle>
			</DialogHeader>
			{#if mensajeError}
				<div class="mb-4 rounded bg-red-100 p-4 text-red-700">
					{mensajeError}
				</div>
			{/if}
			<FieldGroup {onkeydown}>
				<Field>
					<FieldLabel>Contraseña Actual</FieldLabel>
					<Input id="oldPassword" type="password" bind:value={passwordData.oldPassword} required />
				</Field>
				<Field>
					<FieldLabel>Nueva Contraseña</FieldLabel>
					<Input id="newPassword" type="password" bind:value={passwordData.newPassword} required />
					<p class="mt-1 text-sm text-gray-500">
						La contraseña debe contener al menos una mayúscula, una minúscula, un número y un
						carácter especial. Además de 8 caracteres de longitud.
					</p>
				</Field>
				<Field>
					<FieldLabel>Confirmar Contraseña</FieldLabel>
					<Input
						id="confirmPassword"
						type="password"
						bind:value={passwordData.confirmPassword}
						required
					/>
				</Field>
			</FieldGroup>
			<Button type="submit" disabled={!coinsiden || cargando}>
				{#if cargando}
					<Spinner />
				{:else}
					Resetear Contraseña
				{/if}
			</Button>
		</form>
	</DialogContent>
</Dialog>
