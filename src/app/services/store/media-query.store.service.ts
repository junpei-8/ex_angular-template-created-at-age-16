import { storeFactory, StoreService } from './store';
import { InjectionToken } from '@angular/core';


export type MediaQueryPlatformState = 'pc' | 'mp';
type PlatformActionType = 'PC' | 'MP';
export type MediaQueryPlatformStore = StoreService<MediaQueryPlatformState, PlatformActionType>;
export const MEDIA_QUERY_PLATFORM_STORE = new InjectionToken('Store', {
  providedIn: 'root',
  factory: () => storeFactory<MediaQueryPlatformState, PlatformActionType>({
    state: 'pc',
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
export type MediaQuerySizeStore = StoreService<MediaQuerySizeState, SizeActionType>;
export const MEDIA_QUERY_SIZE_STORE = new InjectionToken('Store', {
  providedIn: 'root',
  factory: () => storeFactory<MediaQuerySizeState, SizeActionType>({
    state: 'medium',
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

