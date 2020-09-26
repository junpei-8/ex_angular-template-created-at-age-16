import { Injectable, Inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MEDIA_QUERY_PLATFORM_STORE, MEDIA_QUERY_SIZE_STORE,
  MediaQueryPlatformStore, MediaQuerySizeStore
} from '../store';

type Breakpoint = { [key in 'platform' | 'size']: ['min-width' | 'max-width', number]; };
const BREAKPOINT: Breakpoint = {
  platform: ['min-width', 1024],
  size: ['min-width', 500]
};

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {

  private _platformSubscription: Subscription | null = null;
  private _sizeSubscription: Subscription | null = null;


  platform = {
    subscribe: () => {
      if (this._platformSubscription) { return; }
      const bpRef = BREAKPOINT.platform;
      this._platformSubscription = this._breakpointObserver
        .observe([`(${bpRef[0]}: ${bpRef[1] + (bpRef[0] === 'min-width' ? 1 : 0)}px)`])
        .pipe(map(state => state.matches))
        .subscribe(matches => {
          if (matches) {
            this._mqPlatformStore.dispatch({ type: 'PC' });
          } else {
            this._mqPlatformStore.dispatch({ type: 'MP' });
          }
        });
    },
    unsubscribe: () => {
      if (!this._platformSubscription) { return; }
      this._platformSubscription.unsubscribe();
      this._platformSubscription = null;
    }
  };


  size = {
    subscribe: () => {
      if (this._sizeSubscription) { return; }

      const bpRef = BREAKPOINT.size;

      this._sizeSubscription = this._breakpointObserver
        .observe([`(${bpRef[0]}: ${bpRef[1] + (bpRef[0] === 'min-width' ? 1 : 0)}px)`])
        .pipe(map(state => state.matches))
        .subscribe(matches => {
          if (matches) {
            this._mqSizeStore.dispatch({ type: 'MEDIUM' });
          } else {
            this._mqSizeStore.dispatch({ type: 'SMALL' });
          }
        });
    },
    unsubscribe: () => {
      if (!this._sizeSubscription) { return; }
      this._sizeSubscription.unsubscribe();
      this._sizeSubscription = null;
    }
  };

  constructor(
    private _breakpointObserver: BreakpointObserver,
    @Inject(MEDIA_QUERY_PLATFORM_STORE) private _mqPlatformStore: MediaQueryPlatformStore,
    @Inject(MEDIA_QUERY_SIZE_STORE) private _mqSizeStore: MediaQuerySizeStore
  ) {}

}
