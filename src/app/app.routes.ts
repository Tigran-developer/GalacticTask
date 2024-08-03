import { Routes } from '@angular/router';
import {DataEntryComponent} from "./components/data-entry/data-entry.component";
import {DataInterpretationComponent} from "./components/date-interpretation/dataInterpretation.component";
import {DataVisualisationComponent} from "./components/data-visualisation/data-visualisation.component";

export const routes: Routes = [
  {path:'visualisation', component:DataVisualisationComponent},
  {path:'interpretation', component:DataInterpretationComponent},
  {path:'**', component:DataEntryComponent}
];
