import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

import {
	PUBLIC_f_apiKey,
	PUBLIC_f_appId,
	PUBLIC_f_authDomain,
	PUBLIC_f_messagingSenderId,
	PUBLIC_f_projectId,
	PUBLIC_f_storageBucket
} from '$env/static/public';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const firebaseConfig = {
	apiKey: PUBLIC_f_apiKey,
	authDomain: PUBLIC_f_authDomain,
	projectId: PUBLIC_f_projectId,
	storageBucket: PUBLIC_f_storageBucket,
	messagingSenderId: PUBLIC_f_messagingSenderId,
	appId: PUBLIC_f_appId
};

export function getFirebaseApp(): FirebaseApp {
	if (!app) {
		app = initializeApp(firebaseConfig);
	}
	return app;
}

export function getFirebaseAuth(): Auth {
	if (!auth) {
		auth = getAuth(getFirebaseApp());
	}
	return auth;
}