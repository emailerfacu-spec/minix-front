<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ComponentProps } from 'svelte';

	let { ...restProps }: ComponentProps<typeof Card.Root> = $props();
</script>

<Card.Root {...restProps}>
	<Card.Header>
		<Card.Title>Registrarse</Card.Title>
		<hr />
	</Card.Header>
	<Card.Content>
		<form>
			<Field.Group>
				<Field.Field>
					<Field.Label for="name">Nombre Completo</Field.Label>
					<Input id="name" type="text" placeholder="Juan Pepe" required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input id="email" type="email" placeholder="m@ejemplo.com" required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Contraseña</Field.Label>
					<Input id="password" type="password" required />
					<Field.Description>Debe de tener por lo menos 8 caracteres.</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="confirm-password">Confirmar Contraseña</Field.Label>
					<Input id="confirm-password" type="password" required />
					<Field.Description>Confirma la contraseña</Field.Description>
				</Field.Field>
				<Field.Group>
					<Field.Field>
						<Button type="submit">Crear Cuenta</Button>
						<Field.Description class="px-6 text-center">
							Tenes una cuenta? <a href="/login">Iniciar Sesion</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</Field.Group>
		</form>
	</Card.Content>
</Card.Root>
