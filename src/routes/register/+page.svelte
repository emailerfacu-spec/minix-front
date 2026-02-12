<script lang="ts">
	import SignupForm from '@/components/signup-form.svelte';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import * as Alert from '@/components/ui/alert';
	import { fade } from 'svelte/transition';
	import FireBaseButton from '@/components/FireBaseButton.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Dialog from '@/components/ui/dialog/dialog.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import Spinner from '@/components/ui/spinner/spinner.svelte';

	let showAlert: boolean = $state(false);
	let openload = $state(false);

	$effect(() => {
		resetAlert();
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
		<SignupForm bind:showAlert />

		<Card class="mt-2">
			<CardContent onclick={() => (openload = true)}>
				<FireBaseButton mode="register" />
			</CardContent>
		</Card>
		{#if showAlert}
			<div class="mt-2" transition:fade>
				<Alert.Root variant="destructive">
					<AlertCircleIcon />
					<Alert.Title>No se pudo crear la cuenta</Alert.Title>
					<Alert.Description>Intente nuevamente.</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
	</div>
</div>

{#if openload}
	<Card class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
		<CardContent class="flex w-fit items-center justify-center p-8">
			<Spinner class="size-11" />
		</CardContent>
	</Card>
{/if}

<svelte:head>
	<meta property="og:title" content="Mini-x" />
	<meta property="og:description" content={`Registra un usuario`} />
	<meta property="og:image" content="https://minix-front.vercel.app/x.png" />
	<meta property="og:url" content="https://minix-front.vercel.app/" />
	<meta property="og:type" content="website" />
</svelte:head>
