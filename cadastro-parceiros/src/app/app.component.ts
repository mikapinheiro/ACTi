import { Component } from '@angular/core';
import { FormComponent } from './form/form.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  onSubmit() {
    // Aqui da para integrar com o método onSubmit() do FormComponent
    console.log('Botão ENVIAR clicado no layout principal');
  }
}
