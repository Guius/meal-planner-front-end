import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-label',
  templateUrl: './select-label.component.html',
  styleUrls: ['./select-label.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class SelectLabelComponent {
  @Input() label: string = '';
  @Input() align: 'left' | 'centre' | 'right' = 'centre';
}
