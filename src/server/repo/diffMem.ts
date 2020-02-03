import { Session, Diffs } from '../types';
import Nedb from 'nedb';

export interface DiffMem {
  create(data: Session & Diffs): Promise<Diffs>;
  get(id: string): Promise<Diffs>;
  update(id: string, diffData: string): Promise<void>;
  remove(id: string): Promise<void>;
}

export class NEDB implements DiffMem {
  private db: Nedb;

  constructor() {
    this.db = new Nedb();
  }

  create(data: Session & Diffs) {
    return new Promise<Diffs>((res, rej) => {
      this.db.insert(data, (err, doc) => (err ? rej(err) : res(doc)));
    });
  }

  get(id: string) {
    return new Promise<Diffs>((res, rej) => {
      this.db.findOne({ sessionId: id }, (err, doc) =>
        err ? rej(err) : res(doc)
      );
    });
  }

  update(id: string, diffData: string) {
    return new Promise<void>((res, rej) => {
      this.db.update(
        { sessionId: id },
        { $push: { diffs: diffData } },
        {},
        err => (err ? rej(err) : res())
      );
    });
  }

  remove(id: string) {
    return new Promise<void>((res, rej) => {
      this.db.remove({ sessionId: id }, {}, err => (err ? rej(err) : res()));
    });
  }
}
