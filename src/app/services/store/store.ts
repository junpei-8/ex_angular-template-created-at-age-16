import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { deepCopy } from '../../common';


export interface StoreService<S, A> {
  readonly stateChanges: Observable<State<S, A>>;
  readonly state: State<S, A>;
  dispatch(action: Action<A>): void;
}

export type State<S, AT> = S & {
  actionType: Action<AT>['type'] | null;
};

type Action<A extends { [key: string]: any; } | string> = A extends string ?
  { [key in A]: { type: key } }[A]
:
  { [key in keyof A]: A[key] extends null | undefined ? { type: key } : { type: key, payload: A[key] } }[keyof A];

interface ConstructorStore<S, A> {
  state: S;
  reducer: (state: S, action: A) => S;
}

export function storeFactory<S, A>(
  store: ConstructorStore<S, Action<A>>,
  subjectType: 'normal' | 'behavior' = 'behavior'
): StoreService<S, A> {
  let _state: State<S, A> = { ...store.state, actionType: null };

  const _subject: BehaviorSubject<State<S, A>> | Subject<State<S, A>> =
    (subjectType === 'behavior') ?
        new BehaviorSubject(deepCopy(_state) as State<S, A>)
      : new Subject();

  const _reducer = store.reducer;

  return {
    stateChanges: _subject.asObservable(),
    get state(): State<S, A> {
      return deepCopy(_state) as State<S, A>;
    },
    dispatch(action: Action<A>): void {
      const newState = {
        ..._reducer(_state, action),
        actionType: action.type
      };
      const cloneState = deepCopy(newState) as State<S, A>;

      _subject.next(cloneState);
      _state = newState;
    },
  };
}
