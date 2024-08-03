import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {CommonModule} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {provideNativeDateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, RouterLink, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss', '../app.component.scss']
})
export class DataEntryComponent {
  public inputForm = new FormGroup({
    income: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
  });

  constructor(private dataService: DataService) {
  }

  public submitForm() {
    this.dataService.saveData(this.inputForm.value.income, this.inputForm.value.date)
    this.resetForm()
  }
  public resetForm() {
    this.inputForm.reset();
  }
}
