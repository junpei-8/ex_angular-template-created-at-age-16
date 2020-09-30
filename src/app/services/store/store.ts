import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { deepCopy } from '../../common';


export interface StoreService<S, A> {
  readonly storeChanges: Observable<StoreChanges<S, A>>;
  readonly state: S;
  dispatch(action: Action<A>): void;
}

type Action<A extends { [key: string]: any; } | string> = A extends string ?
  { [key in A]: { type: key } }[A]
:
  { [key in keyof A]: A[key] extends null | undefined ? { type: key } : { type: key, payload: A[key] } }[keyof A];

interface StoreConfig<S, A> {
  state: S;
  reducer: (state: S, action: A) => S;
}
interface StoreChanges<S, A> {
  state: S;
  actionType: Action<A>['type'] | null;
}

export function storeFactory<S, A>(
  storeConfig: StoreConfig<S, Action<A>>,
  subjectType: 'normal' | 'behavior' = 'behavior'
): StoreService<S, A> {
  let _state: S = storeConfig.state;
  let _lastActionType: Action<A>['type'] | null = null;
  const _reducer = storeConfig.reducer;


  const _subject: BehaviorSubject<StoreChanges<S, A>> =
    new BehaviorSubject({ state: deepCopy(_state), actionType: null } as StoreChanges<S, A>);


  return {
    storeChanges: _subject.asObservable(),

    get state(): S {
      return deepCopy(_state) as S;
    },

    dispatch(action: Action<A>): void {
      if (_lastActionType === action.type) { return; }

      const newState = _reducer(_state, action);
      const cloneState = deepCopy(newState) as S;

      _subject.next({state: cloneState, actionType: null});
      _state = newState;
      _lastActionType = action.type;
    },
  };
}
