import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

export interface ExpService {
  readonly exp: () => void;
  readonly experiences: Observable<boolean> | null;
  readonly hasExperienced: boolean;
}

export function expFactory(): ExpService {
  let _hasExperienced: boolean = false;
  let _subject: Subject<boolean> | null = new Subject();
  let _observable: Observable<boolean> | null = _subject.asObservable().pipe(first());

  return {
    exp(): void {
      if (_hasExperienced) { return; }
      _hasExperienced = true;
      _observable = null;

      // @ts-ignore: subjectは確実に存在するため
      _subject.next(true); _subject.unsubscribe();

      _subject = null;
    },
    get experiences(): Observable<boolean> | null {
      return _observable;
    },
    get hasExperienced(): boolean {
      return _hasExperienced;
    }
  };
}
