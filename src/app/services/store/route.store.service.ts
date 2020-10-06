import { InjectionToken } from '@angular/core';
import { Store } from './store';
import { AppRouteData } from '../../app-routing';

export type RouteStoreState = {
  pathname: string,
  fragment: string | null,
  data: AppRouteData
};
interface RouteStoreAction {
  'CHANGE_PATHNAME': { pathname: string, data: AppRouteData };
  'CHANGE_FRAGMENT': string;
}
export type RouteStore = Store<RouteStoreState, RouteStoreAction>;
export const ROUTE_STORE = new InjectionToken('Store: RouteStore', {
  providedIn: 'root',
  factory: () => new Store<RouteStoreState, RouteStoreAction>({
    initialState: {
      pathname: '',
      fragment: null,
      data: { key: [''] }
    },
    reducer: (state, action) => {
      switch (action.type) {
        case 'CHANGE_PATHNAME':
          return { ...state, pathname: action.payload.pathname, data: action.payload.data };
        case 'CHANGE_FRAGMENT':
          return { ...state, fragment: action.payload };
      }
    }
  })
});

