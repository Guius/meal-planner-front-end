import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MultipleChoiceItemComponent } from './multiple-choice-item/multiple-choice-item.component';
import { MultipleChoiceItem } from './types';
import { SelectLabelComponent } from '../select-label/select-label.component';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    MultipleChoiceItemComponent,
    SelectLabelComponent,
  ],
})
export class MultipleChoiceComponent {
  @Input() items: MultipleChoiceItem[] = [];

  itemsSelected: MultipleChoiceItem[] = [];

  trackByItemId(index: number, item: MultipleChoiceItem): string {
    return item.id;
  }

  multipleChoiceItemUpdate(item: MultipleChoiceItem) {
    // Toggle the selected state of the item
    if (item.selected) {
      // Add item to selected array if it's now selected
      this.itemsSelected.push(item);
    } else {
      // Remove item from selected array if it's now unselected
      const index = this.itemsSelected.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );
      if (index > -1) {
        this.itemsSelected.splice(index, 1);
      }
    }
  }
}
