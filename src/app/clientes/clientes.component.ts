import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { ClienteService } from '../services/cliente.service';
import { cloneDeep } from 'lodash';
import { TransacaoService } from '../services/transacao.service';
import { formatStringDateDayMonthYear } from '../util/convert-dates';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ClientesComponent implements OnInit{

  clientList: any[] = [];
  selectedClients: any[] = [];
  clientDialog: boolean = false;
  refreshSubscription: any;

  newClient: any = {};
  selectedClientId: any;

  transferClientDialog: boolean = false;
  valorTransferencia: any;
  selectedClientsCopy: any[] = [];

  extratoDialog: boolean = false;
  extrato: any[] = [];


  constructor(
    private clienteService: ClienteService,
    private transacaoService: TransacaoService,
    private ms: MessageService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.loadClients();
    this.startAutoRefresh();

    this.primengConfig.ripple = true;
  }

  loadClients() {
    this.clienteService.getTodosClientes().subscribe((data: any) => {
      this.clientList = data;
    }, (err: any) => {
        this.ms.add({
          severity: 'error',
          detail: err.error.mensagem ? err.error.mensagem : 'Algo deu errado ao buscar os dados.',
        });
    });
  }

  openNewClientDialog() {
    this.clientDialog = true;
    this.newClient = {
      nome: '',
      idade: 0,
      email: '',
      numeroConta: '',
      saldo: 0
    };
  }

  hideClientDialog() {
    this.clientDialog = false;
  }

  editClient(clientId: any) {
    this.selectedClientId = clientId
    this.clienteService.getClienteById(clientId).subscribe((client: any) => {
      this.newClient = client;
      this.newClient.numeroConta = client.conta.numeroConta;
      this.newClient.saldo = client.conta.saldo;
    }, (error) => {
      console.error('Erro ao buscar o cliente por ID:', error);
    });
    this.clientDialog = true;
  }

  deleteClient(client: any) {
    this.confirmationService.confirm({
      message: "Deseja excluir o registro selecionado?", header: 'Exclusão', icon: 'pi pi-trash',
      accept: () => {
        this.clienteService.deleteCliente(client.id).subscribe((data: any) => {
            this.ms.add({
              severity: "success",
              detail: "Cliente excluído com sucesso.",
            });
            this.loadClients();
          }, (err: any) => {
            this.ms.add({
              severity: 'error',
              detail:  err.error.message? err.error.message : 'Algo deu errado ao deletar os dados.',
            });
          }
        );
      },
      reject: () => { }
    });
  }

  saveClient() {

    const param: any = {
      nome: this.newClient?.nome,
      idade: this.newClient?.idade,
      email: this.newClient?.email,
      conta: {
        numeroConta: this.newClient?.numeroConta,
        saldo: this.newClient?.saldo
      }
    }

    if(this.selectedClientId === null) {
      this.clienteService.postClient(param).subscribe((data: any) => {
          this.ms.add({
            severity: "success",
            detail: "Cliente criado com sucesso.",
          });
          this.loadClients();
          this.clientDialog = false;
        },
        (err: any) => {
          this.ms.add({
            severity: 'error',
            detail:  err.error.errors[0].defaultMessage ? err.error.errors[0].defaultMessage : 'Algo deu errado ao salvar os dados.',
          });
        }
      );
    } else {
      this.clienteService.putCliente(this.selectedClientId, param).subscribe((data: any) => {
        this.ms.add({
          severity: "success",
          detail: "Cliente editado com sucesso.",
        });
        this.loadClients();
        this.selectedClientId = null;
        this.clientDialog = false;
      },
      (err: any) => {
        this.ms.add({
          severity: 'error',
          detail:  err.error.errors[0].defaultMessage ? err.error.errors[0].defaultMessage : 'Algo deu errado ao editar os dados.',
        });
      }
    );
    }

  }

  startAutoRefresh() {
    this.refreshSubscription = this.clienteService.getClientesAutoRefresh().subscribe(
      data => {
        this.clientList = data;
      },
      error => {
        console.error('Erro ao atualizar clientes:', error);
      }
    );
  }

  stopAutoRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }


  openTransferClientDialog() {
    if (this.selectedClients.length === 2) {
      this.selectedClientsCopy = cloneDeep(this.selectedClients);
      this.transferClientDialog = true;
    } else {
      this.ms.add({severity:'warn', summary:'Atenção', detail:'Selecione exatamente dois clientes para realizar a transferência.'});
    }
  }

  cancelTransfer() {
    this.transferClientDialog = false;
  }

  saveTransfer() {
    const transferData = {
      contaOrigemId: this.selectedClientsCopy[0]?.conta?.id,
      contaDestinoId: this.selectedClientsCopy[1]?.conta?.id,
      valor: this.valorTransferencia
    };

    this.transacaoService.postLancarTransferenciaFinanceira(transferData)
      .subscribe(
        (response) => {
          console.log('Transferência realizada com sucesso!');
          this.transferClientDialog = false;
          this.ms.add({severity:'success', summary:'Sucesso', detail:'Transferência realizada com sucesso.'});
          this.loadClients();
        },
        (error) => {
          console.error('Erro ao realizar a transferência:', error);
          this.ms.add({severity:'error', summary:'Erro', detail:'Ocorreu um erro ao realizar a transferência.'});
        }
      );  }

  isTransferValid() {
    return this.valorTransferencia && this.valorTransferencia > 0;
  }


  openExtratoDialog(contaId: any) {
    this.extratoDialog = true;
    this.transacaoService.getExtratoContaCliente(contaId).subscribe(extrato => {
      this.extrato = extrato;
    });
  }

  closeExtratoDialog() {
    this.extratoDialog = false;
  }

  formatarData(value: any) {
    return formatStringDateDayMonthYear(value);
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }
}
