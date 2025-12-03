<script lang="ts">
	import { page } from '$app/state';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<Card>
			<CardContent>
				<h1 class="mb-4 text-center text-3xl font-bold text-gray-800">
					{page.status}
				</h1>
				<p class="text-center">
					{page.error!.message}
				</p>
			</CardContent>
		</Card>
	</div>
</div>
