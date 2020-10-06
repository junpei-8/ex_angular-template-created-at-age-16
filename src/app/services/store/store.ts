import { Observable, BehaviorSubject } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { deepCopy } from '../../common';

type Action<A extends { [key: string]: any; } | string> =
  A extends string ?
  { [key in A]: { type: key } }[A]
:
  {
    [key in keyof A]: A[key] extends null | undefined ?
      { type: key }
    : { type: key, payload: A[key] }
  }[keyof A];

interface StoreConfig<S, _A> {
  initialState: S;
  reducer: (state: S, action: Action<_A>) => S;
}

interface StoreChanges<S, _A> {
  state: S;
  actionType: Action<_A>['type'] | null;
}

export class Store<S, _A> {
  private _reducer: (state: S, action: Action<_A>) => S;
  private _subject: BehaviorSubject<StoreChanges<S, _A>>;
  private _observable: Observable<StoreChanges<S, _A>>;

  constructor(storeConfig: StoreConfig<S, _A>) {
    this._reducer = storeConfig.reducer;

    this._subject = new BehaviorSubject({
      state: storeConfig.initialState,
      actionType: null
    } as StoreChanges<S, _A>);

    this._observable = this._subject.asObservable();
  }

  get state(): S {
    return deepCopy(this._subject.value.state) as S;
  }

  get lastActionType(): Action<_A>['type'] | null {
    return this._subject.value.actionType;
  }

  storeChanges(nextOnSubscribe?: boolean): Observable<StoreChanges<S, _A>> {
    if (nextOnSubscribe) {
      return this._observable.pipe(
        skip(1),
        map(store => deepCopy(store) as StoreChanges<S, _A>)
      );
    } else {
      return this._observable.pipe(
        map(store => deepCopy(store) as StoreChanges<S, _A>)
      );
    }
  }

  dispatch(action: Action<_A>): void {
    this._subject.next({
      state: this._reducer(this._subject.value.state, action),
      actionType: action.type
    });
  }
}
