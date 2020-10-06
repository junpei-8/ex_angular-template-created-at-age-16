import { Store } from './store';
import { InjectionToken } from '@angular/core';


export type MediaQueryPlatformState = 'pc' | 'mp';
type PlatformActionType = 'PC' | 'MP';
export type MediaQueryPlatformStore = Store<MediaQueryPlatformState, PlatformActionType>;
export const MEDIA_QUERY_PLATFORM_STORE = new InjectionToken('Store', {
  providedIn: 'root',
  factory: () => new Store<MediaQueryPlatformState, PlatformActionType>({
    initialState: 'pc',
    reducer: (state, action) => {
      switch (action.type) {
        case 'PC':
          return 'pc';
        case 'MP':
          return 'mp';
      }
    }
  })
});


export type MediaQuerySizeState = 'medium' | 'small';
type SizeActionType = 'MEDIUM' | 'SMALL';
export type MediaQuerySizeStore = Store<MediaQuerySizeState, SizeActionType>;
export const MEDIA_QUERY_SIZE_STORE = new InjectionToken('Store', {
  providedIn: 'root',
  factory: () => new Store<MediaQuerySizeState, SizeActionType>({
    initialState: 'medium',
    reducer: (state, action) => {
      switch (action.type) {
        case 'MEDIUM':
          return 'medium';
        case 'SMALL':
          return 'small';
      }
    }
  })
});

