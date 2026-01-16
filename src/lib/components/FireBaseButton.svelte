<script>
	import { getFirebaseAuth } from '$lib/stores/firebase.ts';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import Button from './ui/button/button.svelte';

	const handleGoogleSignIn = async () => {
		const auth = getFirebaseAuth();
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error('Error signing in with Google:', error);
		}
	};
</script>

<Button onclick={handleGoogleSignIn}>Sign in with Google</Button>
