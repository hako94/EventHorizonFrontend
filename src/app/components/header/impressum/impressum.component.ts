import { Component } from '@angular/core';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss']
})
export class ImpressumComponent {
  showDatenschutz: boolean = false;

  toggleDatenschutz(): void{
    this.showDatenschutz = !this.showDatenschutz;
  }
}
