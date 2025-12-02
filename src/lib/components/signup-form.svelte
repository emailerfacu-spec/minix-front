<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '../components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { RegisterDto } from '../../types';
	import { register } from '@/hooks/register';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	let { showAlert = $bindable() } = $props();

	let cargando = $state(false);

	const setAlert = () => (showAlert = true);

	let dto: RegisterDto = $state({ password: '', username: '', email: '', displayName: '' });

	const handleSubmit = async (e: SubmitEvent) => {
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
					<Field.Label for="name">Nombre de Usuario</Field.Label>
					<Input id="name" bind:value={dto.username} type="text" placeholder="JPepe" required />
				</Field.Field>

				<Field.Field>
					<Field.Label for="name">Nombre Visible</Field.Label>
					<Input type="text" bind:value={dto.displayName} placeholder="Juan Pepe" required />
				</Field.Field>

				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input
						id="email"
						type="email"
						bind:value={dto.email}
						placeholder="m@ejemplo.com"
						required
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Contraseña</Field.Label>
					<Input id="password" type="password" bind:value={dto.password} required />
					<Field.Description>Debe de tener por lo menos 8 caracteres.</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="confirm-password">Confirmar Contraseña</Field.Label>
					<Input id="confirm-password" type="password" required />
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
