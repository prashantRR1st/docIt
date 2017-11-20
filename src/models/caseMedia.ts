export class CaseMedia {

  id: number;
  name: string;
  type: string;
  msgCount: number;
  time: string;
  date: string;
  fileName: string;
  duration: string;
  message: string;
  imgUrl: string;

  constructor(fields: any) {
      // Quick and dirty extend/assign fields to this model
      for (const f in fields) {
        this[f] = fields[f];
      }
  }

}
