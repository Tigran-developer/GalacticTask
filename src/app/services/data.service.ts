import {Injectable} from '@angular/core';
import {getLastIndex} from "../helpers/helper";
import {Record} from "../models/models";
import {filter, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public readonly KEY = 'record';

  constructor() {
  }

  public getAllData(): Observable<Record[]> {
    const values: Record[] = [];
    const keys = Object.keys(localStorage).filter((i => i.toString().includes(this.KEY)));
    let i = keys.length;
    while (i--) {
      if (localStorage.getItem(keys[i])) {
        values.push(JSON.parse(localStorage.getItem(keys[i]) as string));
      }
    }
    values.sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    });
    return of(values);
  }

  public getDataByDate(from: Date | undefined | null, to: Date | undefined | null) {
    return this.getAllData().pipe(
      map((items: Record[]) => items.filter(item =>{
        if(!from && !to){
          return item;
        }
        let date = new Date(item.date)
        return (from ? date >= from : true) && (to ? date <= to : true);
      }))
    );
  }

  public saveData(income: number | null | undefined, date: Date | null | undefined): boolean {
    if (income && date) {
      date = new Date(date.toLocaleString());
      let id = getLastIndex(this.KEY) + 1;
      localStorage.setItem(`${this.KEY} ${id}`, JSON.stringify({income: income, date: date}));
      return !!localStorage.getItem(`${this.KEY} ${id}`);
    }
    return false;
  }
}
