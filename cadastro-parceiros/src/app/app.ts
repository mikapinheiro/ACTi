import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PartnerFormComponent } from './form/form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PartnerFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cadastro-parceiros');
}
