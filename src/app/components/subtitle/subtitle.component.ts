import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-subtitle',
  templateUrl: './subtitle.component.html',
  styleUrls: ['./subtitle.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppSubtitleComponent {
  @Input() subtitle: string = '';
}
