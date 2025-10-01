import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-form-button',
  templateUrl: './form-button.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class FormButtonComponent {
  @Input() text: string = '';

  @Output() clicked = new EventEmitter<void>();

  buttonClicked() {
    this.clicked.emit();
  }
}
