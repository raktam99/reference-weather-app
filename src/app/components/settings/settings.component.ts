import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  ngOnInit() {
    document.documentElement.style.setProperty(
      '--main-bg-color',
      'linear-gradient(to bottom, gray, gray)'
    );
  }
}
