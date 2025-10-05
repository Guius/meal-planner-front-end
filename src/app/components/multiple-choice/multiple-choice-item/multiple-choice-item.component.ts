import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MultipleChoiceItem } from '../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multiple-choice-item',
  templateUrl: './multiple-choice-item.component.html',
  styleUrls: ['./multiple-choice-item.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MultipleChoiceItemComponent implements OnInit {
  multipleChoiceItem!: MultipleChoiceItem;

  @Input() input!: MultipleChoiceItem;
  @Input() disabled = false;
  @Input() isLoading = false;
  @Output() output = new EventEmitter<MultipleChoiceItem>();

  ngOnInit() {
    this.multipleChoiceItem = this.input;
  }

  toggleItemSelected() {
    // Don't allow toggling if the item is disabled or loading
    if (this.disabled || this.isLoading) {
      return;
    }

    this.multipleChoiceItem.selected = !this.multipleChoiceItem.selected;
    this.sendUpdate();
  }

  sendUpdate() {
    this.output.emit(this.multipleChoiceItem);
  }
}
