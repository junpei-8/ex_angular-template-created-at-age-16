import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalOutletService } from './modal-outlet.service';

@Component({
  selector: 'modal-outlet',
  templateUrl: './modal-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalOutletComponent {
  constructor(public di: ModalOutletService) { }
}
