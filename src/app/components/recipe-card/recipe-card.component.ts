import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UnifiedRecipe } from 'src/app/core/types/unified-recipe.type';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class FormButtonComponent {
  @Input() recipe!: UnifiedRecipe;

  @Output() clicked = new EventEmitter<void>();

  buttonClicked() {
    this.clicked.emit();
  }
}
