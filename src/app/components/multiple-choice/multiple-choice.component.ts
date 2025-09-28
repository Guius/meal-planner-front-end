import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MultipleChoiceItemComponent } from './multiple-choice-item/multiple-choice-item.component';
import { MultipleChoiceItem } from './types';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, MultipleChoiceItemComponent],
})
export class MultipleChoiceComponent {
  @Input() items: MultipleChoiceItem[] = [];

  trackByItemId(index: number, item: MultipleChoiceItem): string {
    return item.id;
  }
}
