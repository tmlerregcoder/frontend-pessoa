import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { PessoaListaComponent } from './app/pessoa-lista/pessoa-lista.component';
import { PessoaFormComponent } from './app/pessoa-form/pessoa-form.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

const routes: Routes = [
  { path: 'pessoas', component: PessoaListaComponent },
  { path: 'pessoas/form', component: PessoaFormComponent },
  { path: 'pessoas/form/:id', component: PessoaFormComponent },
  { path: '', redirectTo: '/pessoas', pathMatch: 'full' },
];

registerLocaleData(localePt, 'pt');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideProtractorTestingSupport(),
  ],
}).catch((err) => console.error(err));
