import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MultipleChoiceItemComponent } from './multiple-choice-item/multiple-choice-item.component';
import { MultipleChoiceItem } from './types';
import { SelectLabelComponent } from '../select-label/select-label.component';
import { FormButtonComponent } from '../form-button/form-button.component';

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
    FormButtonComponent,
  ],
})
export class MultipleChoiceComponent implements OnInit {
  @Input() items: MultipleChoiceItem[] = [];
  @Output() multipleChoiceSaved = new EventEmitter<MultipleChoiceItem[]>();

  itemsSelected: MultipleChoiceItem[] = [];
  exclusiveItemSelected = false;

  ngOnInit() {
    // Initialize itemsSelected with pre-selected items
    this.itemsSelected = this.items.filter((item) => item.selected);

    const exclusiveItemSelectedOnInit = this.items.find(
      (x) => x.selected === true && x.exclusive === true
    );
    if (exclusiveItemSelectedOnInit !== undefined) {
      this.exclusiveItemSelected = true;
    }
  }

  trackByItemId(index: number, item: MultipleChoiceItem): string {
    return item.id;
  }

  multipleChoiceItemUpdate(item: MultipleChoiceItem) {
    // Toggle the selected state of the item
    if (item.selected) {
      // If item being selected is exclusive
      if (item.exclusive === true) {
        // Deselect all other items
        this.items.forEach((otherItem) => {
          if (otherItem.id !== item.id) {
            otherItem.selected = false;
          }
        });
        // Clear itemsSelected array and add only the exclusive item
        this.itemsSelected = [item];
        this.exclusiveItemSelected = true;
      } else {
        // If non-exclusive item is being selected
        // Only allow selection if no exclusive item is currently selected
        if (!this.exclusiveItemSelected) {
          this.itemsSelected.push(item);
        } else {
          // Prevent selection if exclusive item is selected
          item.selected = false;
          return;
        }
      }
    } else {
      // Item is being unselected
      const index = this.itemsSelected.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );
      if (index > -1) {
        this.itemsSelected.splice(index, 1);
      }

      // If item being unselected is exclusive, allow other selections
      if (item.exclusive === true) {
        this.exclusiveItemSelected = false;
      }
    }
  }

  multipleChoiceSaveClicked() {
    this.multipleChoiceSaved.emit(this.itemsSelected);
  }
}
