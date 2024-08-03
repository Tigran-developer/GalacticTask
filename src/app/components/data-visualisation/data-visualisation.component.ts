import {Component, ViewChild} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef, MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {AsyncPipe, CurrencyPipe, DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {Record} from "../../models/models";
import {DataService} from "../../services/data.service";
import {delay, map, noop, pipe, Subject, takeUntil, tap, timeout, timer} from "rxjs";
import {RouterLink} from "@angular/router";
import {calculateTotalIncome} from "../../helpers/helper";

@Component({
  selector: 'app-data-visualisation',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatFooterCell,
    MatRow,
    MatHeaderRow,
    MatFooterRow,
    MatRowDef,
    MatHeaderRowDef,
    MatFooterRowDef,
    MatCellDef,
    MatFooterCellDef,
    MatHeaderCellDef,
    CurrencyPipe,
    MatNoDataRow,
    MatPaginator,
    DatePipe,
    AsyncPipe,
    RouterLink

  ],
  templateUrl: './data-visualisation.component.html',
  styleUrls: ['./data-visualisation.component.scss', '../app.component.scss']
})
export class DataVisualisationComponent {
  dataSource!: MatTableDataSource<Record>;
  displayedColumns: string[] = ['date', 'income'];

  destroy$ = new Subject<void>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private dataService: DataService) {
  }
  getTotalIncome() {
    return calculateTotalIncome(this.dataSource.data);
  }
  ngOnInit(){
    this.dataService.getAllData()
      .pipe(
        takeUntil(this.destroy$),
        tap((items: Record[])=>this.dataSource = new MatTableDataSource(items))
      ).subscribe(_=>_);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
