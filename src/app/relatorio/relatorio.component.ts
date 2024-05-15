import { Component, OnInit } from '@angular/core';
import { TransacaoService } from '../services/transacao.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class RelatorioComponent implements OnInit {

  selectedDate: any;
  transferList: any[] = [];

  constructor(private transacaoService: TransacaoService) { }

  ngOnInit(): void {
    this.selectedDate = new Date();
  }

  searchTransfers(): void {
    this.transferList = [];
    this.transacaoService.getRelatorioTransferenciasDia(this.selectedDate).subscribe(
      (data: any[]) => {
        this.transferList = data;
      },
      (error) => {
        console.error('Erro ao buscar transferências do dia:', error);
      }
    );
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.transferList);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName: string = 'relatorio_transferencias.xlsx';
    const file: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(file, fileName);
  }

}
