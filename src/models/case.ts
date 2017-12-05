export class Case {

  id: number;
  title: string;
  patientName: string;
  date: string;
  time: string;
  notes: number;
  voiceMemos: number;
  videos: number;
  photos: number;
  profilePic: string;
  about: string;


  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

  add(item: Case) {

  }

  }
