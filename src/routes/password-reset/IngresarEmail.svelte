<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import { checkEmail } from '@/hooks/checkEmail';
	import Check from '@lucide/svelte/icons/check';
	import Cross from '@lucide/svelte/icons/x';
	import { slide } from 'svelte/transition';

	let { estado = $bindable(), email = $bindable() } = $props();

	let checkeado = $state<Boolean | null>(null);
	let esEmailExistente = $state<boolean>(false);

	$effect(() => {
		if (email == '') {
			checkeado = null;
			return;
		}
		(async () => {
			checkeado = true;
			await Promise.all([checkEmaill(), new Promise((resolve) => setTimeout(resolve, 100))]);
			checkeado = false;
		})();
	});

	async function checkEmaill() {
		esEmailExistente = !(await checkEmail(email));
	}
</script>

<div transition:slide>
	<Card>
		<CardContent>
			<div class="flex flex-col gap-4">
				<h2 class="flex items-center justify-between text-xl font-semibold">
					Ingresa tu correo electrónico
					{#if checkeado == null}
						<div hidden></div>
					{:else if checkeado == true}
						<Spinner></Spinner>
					{:else if esEmailExistente}
						<Check class="text-green-500" />
					{:else}
						<Cross class="text-red-500" />
					{/if}
				</h2>
				<Input type="email" placeholder="correo@ejemplo.com" bind:value={email} />
				<Button
					disabled={!esEmailExistente}
					onclick={async () => {
						///WIP
						estado = 'otp';
					}}
				>
					Enviar código
				</Button>
			</div>
		</CardContent>
	</Card>
</div>
