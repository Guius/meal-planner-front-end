import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MultipleChoiceItemComponent } from './multiple-choice-item/multiple-choice-item.component';

export interface MultipleChoiceItem {
  id: string;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
  standalone: true,
  imports: [IonicModule, MultipleChoiceItemComponent],
})
export class MultipleChoiceComponent {
  testItem: MultipleChoiceItem = {
    id: '123',
    label: 'No specific diet',
    selected: true,
  };
}
