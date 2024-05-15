import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { RelatorioComponent } from './relatorio/relatorio.component';

const routes: Routes = [
  {path:'',redirectTo:'clientes',pathMatch:'full'},
  {path:'clientes',component: ClientesComponent},
  {path:'relatorio',component: RelatorioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
