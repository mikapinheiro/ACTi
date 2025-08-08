import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Importa a função para inicializar a aplicação dinamicamente
import { AppComponent } from './app/app.component'; // Importa o componente raiz AppComponent
import { bootstrapApplication } from '@angular/platform-browser'; // Importa a função para bootstrap standalone

bootstrapApplication(AppComponent).catch(err => console.error(err)); // Inicializa a aplicação com AppComponent e lida com erros