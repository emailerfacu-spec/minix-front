<script lang="ts">
	import * as Alert from '@/components/ui/alert';
	import LoginForm from '@/components/ui/login-form/login-form.svelte';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { fade, fly } from 'svelte/transition';
	import Info from '@lucide/svelte/icons/info';

	let { data } = $props();

	let showAlert: boolean = $state(false);

	let message = $state(data.message);

	$effect(() => {
		resetAlert();
		if (data.message) {
			history.replaceState(history.state, '', '/login');
			setTimeout(() => {
				message = '';
			}, 7000);
		}
	});

	async function resetAlert() {
		if (showAlert == true) {
			await new Promise((res) => setTimeout(res, 2000));
			showAlert = false;
		}
	}
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm">
		{#if message}
			<div class="mb-2" transition:fly>
				<Alert.Root>
					<Info />
					<Alert.Title>Info</Alert.Title>
					<Alert.Description>Ingrese las credenciales de la cuenta recien creada</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
		<LoginForm bind:showAlert id="1" />
		{#if showAlert}
			<div class="mt-2" transition:fade>
				<Alert.Root variant="destructive">
					<AlertCircleIcon />
					<Alert.Title>No se pudo iniciar sesion</Alert.Title>
					<Alert.Description>Revise su usuario o contraseña</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
	</div>
</div>
