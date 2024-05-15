import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  items: MenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          { label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: '/' },
          { label: 'Relatório de Transações', icon: 'pi pi-fw pi-file-export', routerLink: '/relatorio' },
      ];
  }

}
