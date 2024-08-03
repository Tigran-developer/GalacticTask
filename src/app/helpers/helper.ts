import {Record} from "../models/models";

export const getLastIndex = (name: string) => {
  return Object.keys(localStorage).filter((i => i.toString().includes(name))).length
}

export const calculateTotalIncome = (records: Record[]) =>{
  return records.map(t => t.income).reduce((acc, value) => acc + value, 0);
}
