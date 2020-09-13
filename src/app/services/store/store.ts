import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DeepWriteable, DeepReadonly } from '../../typings';
import { deepCopy } from '../../common';

export declare class StoreService<S, A> {
  stateChanges: Observable<DeepWriteable<S>>;
  get state(): DeepWriteable<S>;
  dispatch(type: Action<A>): void;
}

export function storeLiteFactory<S, A>(
  store: ConstructorStore<S, Action<A>>,
  subjectType: 'normal' | 'behavior' = 'behavior'
): StoreService<S, A> {
  // @ts-ignore
  const _deepCopy: (obj: DeepReadonly<S> | S) => DeepWriteable<S> = deepCopy;

  const _subject: BehaviorSubject<DeepWriteable<S>> | Subject<DeepWriteable<S>> =
    subjectType ? new BehaviorSubject(_deepCopy(store.state)) : new Subject();

  const _state = store.state;
  const _reducer = store.reducer;

  return {
    stateChanges: _subject.asObservable(),
    get state(): DeepWriteable<S> {
      return _deepCopy(_state);
    },
    dispatch(type: Action<A>): void {
      const newState = _deepCopy(_reducer(_state, type));
      _subject.next(newState);

      // @ts-ignore: 書き込み
      _state = newState;
    },
  };
}

type Action<A extends { [key: string]: any; } | string> = A extends string ?
  {
    [key in A]: { type: key }
  }[A]
:
  {
    [key in keyof A]: A[key] extends null | undefined ? { type: key } : { type: key, payload: A[key] }
  }[keyof A];

interface ConstructorStore<S, A> {
  state: S;
  reducer: (state: S, action: A) => S;
}
