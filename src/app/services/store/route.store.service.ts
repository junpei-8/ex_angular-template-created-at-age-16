import { InjectionToken } from '@angular/core';
import { storeFactory, StoreService } from './store';
import { AppRouteData } from '../../app-routing';

export type RouteState = {
  pathname: string,
  fragment: string | null,
  data: AppRouteData
};
interface RouteStoreActionType {
  'CHANGE_PATHNAME': AppRouteData;
  'CHANGE_FRAGMENT': string;
}
export type RouteStore = StoreService<RouteState, RouteStoreActionType>;
export const ROUTE_STORE = new InjectionToken('Store: RouteStore', {
  providedIn: 'root',
  factory: () => storeFactory<RouteState, RouteStoreActionType>({
    state: {
      pathname: '',
      fragment: null,
      data: { key: '' }
    },
    reducer: (state, action) => {
      switch (action.type) {
        case 'CHANGE_PATHNAME':
          return { ...state, pathname: location.pathname, data: action.payload };
        case 'CHANGE_FRAGMENT':
          return { ...state, fragment: action.payload };
      }
    }
  }, 'normal')
});

