import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {provideNativeDateAdapter} from "@angular/material/core";
import {DataService} from "../../services/data.service";
import {Subject, switchMap, takeUntil, tap} from "rxjs";
import {calculateTotalIncome} from "../../helpers/helper";
import {BaseChartDirective} from 'ng2-charts';
import {Chart, ChartConfiguration, registerables} from "chart.js";


@Component({
  selector: 'app-date-interpretation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, RouterOutlet, MatCardModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule,
    BaseChartDirective, RouterLink],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dataInterpretation.component.html',
  styleUrls: ['./dataInterpretation.component.scss', '../app.component.scss']
})
export class DataInterpretationComponent {
  public dateRangeForm: FormGroup = new FormGroup({
    from: new FormControl(null),
    to: new FormControl(null),
  });
  public lineChart!: Chart;
  public lineChartConfig!: ChartConfiguration
  public filteredTotalIncome!: number;

  private destroy$ = new Subject<void>;

  constructor(private dataService: DataService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.lineChartConfig = {
      type: 'line',
      data: {
        datasets: [{
          data: [],
          fill: 'origin',
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.3,

        }],
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
    this.onFormChange().subscribe(_ => this.updateChart())
    this.dateRangeForm.updateValueAndValidity();
  }

  onFormChange() {
    return this.dateRangeForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(range => this.dataService.getDataByDate(range.from, range.to)),
        tap(records => {
          this.filteredTotalIncome = calculateTotalIncome(records)
          this.lineChartConfig.data.labels =[];
          this.lineChartConfig.data.datasets[0].data =[];
          records.forEach(record => {
            this.lineChartConfig.data.labels?.push(new Date(record.date).toLocaleDateString());
            this.lineChartConfig.data.datasets[0].data.push(record.income);
          })
        })
      )
  }

  updateChart() {
    // @ts-ignore
    const ctx = document.getElementById('line-chart')?.getContext('2d');
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    this.lineChart = new Chart(ctx, this.lineChartConfig);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
