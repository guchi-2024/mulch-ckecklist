export interface ListItems {
  id: string,
  ship: string,
  area: string,
  position: string,
  name: string,
  number: number,
  startDate: string,
  endDate: string
}

export interface MenuList {
  shipName: string,
  path: string,
  areaBtn: string[],
  ARR?: string,
  DEP?: string,
  flightNo?: string,
  shipNo?: string
}



export interface FlightShip {
  company: string;
  flights: {
    id?: string;
    No?: number;
    ARR: string;
    DEP: string;
    ship: string;
    shipNo: string;
    memo?: string;
  }[];
}

export interface Flight {
  id?: string;
  No?: number;
  company?: string;
  ARR: string;
  DEP: string;
  ship: string;
  shipNo: string;
  memo?: string;
}


export interface CompanyShips {
  [key: string]: string[];
}

export interface ShipNumbers {
  [key: string]: string[];
}

export interface TransferRecord {
  id?: string;
  ARR: string;
  DEP: string;
  shipNo: string;
  area: string;
  position: string;
  day: string;
  memo?: string;
  name: string;
}

export interface RecordDays  {
  ARR: string;
  DEP: string;
  No: number;
  day: string;
  memo: string;
  responsiblePerson: string;
  ship: string;
  shipNo: string;
}

 

