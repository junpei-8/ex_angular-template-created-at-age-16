import { Observable, Subject } from 'rxjs';

export declare class ExpService {
  readonly experiencing: () => void;
  get state(): boolean;
  get experiences(): Observable<boolean> | null;
}

export function expFactory(): ExpService {
  let _state: boolean = false;
  let _subject: Subject<boolean> | null = new Subject();
  let _observable: Observable<boolean> | null = _subject.asObservable();

  return {
    experiencing(): void {
      if (_state) { return; }
      _state = true;
      _observable = null;

      _subject.next(true);
      _subject.complete();

      _subject = null;
    },
    get state(): boolean {
      return _state;
    },
    get experiences(): Observable<boolean> | null {
      return _observable;
    }
  };
}
