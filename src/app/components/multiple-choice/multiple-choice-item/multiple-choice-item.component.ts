import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

export interface MultipleChoiceItem {
  id: string;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-multiple-choice-item',
  templateUrl: './multiple-choice-item.component.html',
  styleUrls: ['./multiple-choice-item.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class MultipleChoiceItemComponent implements OnInit {
  multipleChoiceItem!: MultipleChoiceItem;

  @Input() input!: MultipleChoiceItem;
  @Input() disabled = false;
  @Output() output = new EventEmitter<MultipleChoiceItem>();

  ngOnInit() {
    this.multipleChoiceItem = this.input;
  }

  toggleItemSelected() {
    this.multipleChoiceItem.selected = !this.multipleChoiceItem.selected;
  }

  sendUpdate() {
    this.output.emit(this.multipleChoiceItem);
  }
}
