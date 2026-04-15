import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'tmdb-dash',
        appId: '1:286213121351:web:8934d7addfb2951f851862',
        storageBucket: 'tmdb-dash.firebasestorage.app',
        apiKey: 'AIzaSyCkoEu7OptaLPMxCiOUF_j65DZ_mUDSzZo',
        authDomain: 'tmdb-dash.firebaseapp.com',
        messagingSenderId: '286213121351',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
