<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '../components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { RegisterDto } from '../../types';
	import { register } from '@/hooks/register';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import Check from '@lucide/svelte/icons/check';
	import Cross from '@lucide/svelte/icons/x';

	import Spinner from './ui/spinner/spinner.svelte';
	import { checkUsername } from '@/hooks/checkUsername';
	import { checkEmail } from '@/hooks/checkEmail';

	let { showAlert = $bindable() } = $props();

	let cargando = $state(false);

	let repetirContraseña = $state('');

	let checkeandoUsuario: boolean | null = $state(null);
	let esUsuarioValido = $state(false);

	let checkeandoEmail: boolean | null = $state(null);
	let esEmailValido = $state(false);

	async function checkUsuario() {
		checkeandoUsuario = true;
		esUsuarioValido = await checkUsername(dto.username);
		checkeandoUsuario = false;
	}

	async function checkEmaill() {
		checkeandoEmail = true;
		esEmailValido = await checkEmail(dto.email);
		checkeandoEmail = false;
	}
	const setAlert = () => (showAlert = true);

	let dto: RegisterDto = $state({ password: '', username: '', email: '', displayName: '' });

	const handleSubmit = async (e: SubmitEvent) => {
		if (esUsuarioValido == false) return;
		if (repetirContraseña !== dto.password) return;

		cargando = true;
		await register(e, dto, setAlert);
		cargando = false;
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Registrarse</Card.Title>
		<hr />
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleSubmit}>
			<Field.Group>
				<Field.Field>
					<div class="flex justify-between">
						<Field.Label for="name">Nombre de Usuario</Field.Label>
						{#if checkeandoUsuario == null}
							<div hidden></div>
						{:else if checkeandoUsuario == true}
							<Spinner></Spinner>
						{:else if esUsuarioValido}
							<Check class="text-green-500" />
						{:else}
							<Cross class="text-red-500" />
						{/if}
					</div>
					<Input
						id="name"
						bind:value={dto.username}
						type="text"
						placeholder="JPepe"
						required
						onchange={checkUsuario}
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="name">Nombre Visible</Field.Label>
					<Input type="text" bind:value={dto.displayName} placeholder="Juan Pepe" required />
				</Field.Field>

				<Field.Field>
					<div class="flex justify-between">
						<Field.Label for="email">Email</Field.Label>
						{#if checkeandoEmail == null}
							<div hidden></div>
						{:else if checkeandoEmail == true}
							<Spinner></Spinner>
						{:else if esEmailValido}
							<Check class="text-green-500" />
						{:else}
							<Cross class="text-red-500" />
						{/if}
					</div>
					<Input
						id="email"
						type="email"
						bind:value={dto.email}
						placeholder="m@ejemplo.com"
						required
						onchange={checkEmaill}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Contraseña</Field.Label>
					<Input id="password" type="password" bind:value={dto.password} required />
					<Field.Description>Debe de tener por lo menos 8 caracteres.</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="confirm-password">Confirmar Contraseña</Field.Label>
					<Input id="confirm-password" type="password" required bind:value={repetirContraseña} />
					<Field.Description>Confirma la contraseña</Field.Description>
				</Field.Field>
				<Field.Group>
					<Field.Field>
						<Button type="submit" disabled={cargando}>
							{#if cargando}
								Creando Cuenta...
								<Loader2Icon class="animate-spin" />
							{:else}
								Crear Cuenta
							{/if}
						</Button>
						<Field.Description class="px-6 text-center">
							Tenes una cuenta? <a href="/login">Iniciar Sesion</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</Field.Group>
		</form>
	</Card.Content>
</Card.Root>
