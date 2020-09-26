import {
  AfterContentInit,
  AfterViewInit,
  Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject,
  Input, NgZone, OnDestroy, OnInit, Output, QueryList, TemplateRef
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { timeStringToMillisecond } from 'src/app/common';
import { RENDERER, RendererService } from 'src/app/services/renderer.service';
import { TabLiteComponent } from './tab-lite.component';
import { isThemePalette } from '../../common';

type Template = TemplateRef<TabLiteComponent>;
interface Color {
  label: SafeStyle;
  ripple: string;
  inkBar: SafeStyle;
}
export interface TabData {
  label: string;
  index: number;
}
@Component({
  selector: 'mat-tab-group-lite',
  templateUrl: './tab-group-lite.component.html',
  styleUrls: ['./tab-group-lite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabGroupLiteComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {
  @ContentChildren(TabLiteComponent) tabs: QueryList<TabLiteComponent>;


  @Input('activeColor') set setActiveColor(_color: string | { label: string, ripple: string, inkBar: string }) {
    if (typeof _color === 'object') {
      this.activeColor = {
        label: (() => {
          const colorIsThemePalette = isThemePalette(_color.label);
          const color = (colorIsThemePalette) ? `var(--theme-${_color.label})` : _color.label;
          return colorIsThemePalette ? this._sanitizer.bypassSecurityTrustStyle(color) : color;
        })(),
        ripple: isThemePalette(_color.ripple) ? `var(--theme-${_color.ripple}` : _color.ripple,
        inkBar: isThemePalette(_color.inkBar) ? `var(--theme-${_color.inkBar}` : _color.inkBar,
      };
    } else {
      const colorIsThemePalette = isThemePalette(_color);
      const color = (colorIsThemePalette) ? `var(--theme-${_color})` : _color;

      this.activeColor =
        (_color === 'simple') ?
          {
            label: this._sanitizer.bypassSecurityTrustStyle('var(--theme-text)'),
            ripple: 'var(--theme-opposite-base)',
            inkBar: color
          } :

        (_color === 'simple-label') ?
          {
            label: this._sanitizer.bypassSecurityTrustStyle('var(--theme-text)'),
            ripple: color,
            inkBar: color
          } :

        // default
          {
            label: (colorIsThemePalette) ? this._sanitizer.bypassSecurityTrustStyle(color) : color,
            ripple: color,
            inkBar: color
          };

      this._setMatInkBarStyle();
    }
  }
  activeColor: Color;


  @Input('gcDelay') set setGcDelay(_gcDelay: string | number) {
    this._gcDelay = (typeof _gcDelay === 'string') ? timeStringToMillisecond(_gcDelay, 0) : _gcDelay;
  }
  private _gcDelay: number = 0;
  private _gcDelayTimeout: number;

  /** 縦のタブにするためのclassを <mat-tab-group-lite> に付与する */
  @Input('verticalTabs') set setMatVariableTabs(_isEnabled: boolean | '') {
    if (_isEnabled || _isEnabled === '') {
      this._renderer.addClass(this._elementRef.nativeElement, 'mat-vertical-tabs');
      this._isMatVerticalTabs = true;
    } else {
      this._renderer.removeClass(this._elementRef.nativeElement, 'mat-vertical-tabs');
      this._isMatVerticalTabs = false;
    }

    this._setMatInkBarStyle();
  }
  private _isMatVerticalTabs: boolean;


  @Input('stretchTabs') set setMatStretchTabs(_isEnabled: boolean | '') {
    if (_isEnabled || _isEnabled === '') {
      this._renderer.addClass(this._elementRef.nativeElement, 'mat-stretch-tabs');
      this._isMatStretchTabs = true;
    } else {
      this._renderer.removeClass(this._elementRef.nativeElement, 'mat-stretch-tabs');
      this._isMatStretchTabs = false;
    }

    this._setMatInkBarStyle();
  }
  private _isMatStretchTabs: boolean;


  @Input() disableHover: boolean | '';


  @Input('matInkBarPosition') set setMatInkBarPosition(position: 'before' | 'after') {
    this._matInkBarPosition = position;
    this._setMatInkBarStyle();
  }
  private _matInkBarPosition: 'before' | 'after' = 'after';

  @Output() selectedTabChange: EventEmitter<{label: string, index: number, primaryShows: boolean}> = new EventEmitter();

  private _ngAfterViewInitialized: boolean;

  hasShownPrimary: boolean;
  primaryTemplate: Template | null;
  secondaryTemplate: Template | null;

  selectedIndex: number;
  tabsData: TabData[] = [];

  private _matInkBarRef: Element;
  private _tabRefs: HTMLCollectionOf<Element>;

  private _contentChangesSubscription: Subscription | undefined;

  constructor(
    @Attribute('startIndex') startIndex: number,
    @Attribute('mutableTabs') private _mutableTabs: boolean | '',
    private _elementRef: ElementRef<HTMLElement>,
    private _zone: NgZone,
    private _sanitizer: DomSanitizer,
    private _changeDetector: ChangeDetectorRef,
    @Inject(RENDERER) private _renderer: RendererService
  ) { this.selectedIndex = startIndex || 0; }

  ngOnInit(): void {
    if (!this.activeColor) {
      const color = `var(--theme-primary)`;

      this.activeColor = {
        label: this._sanitizer.bypassSecurityTrustStyle('var(--theme-text)'),
        ripple: color,
        inkBar: color
      };
    }
  }

  ngOnDestroy(): void {
    if (this._contentChangesSubscription) { this._contentChangesSubscription.unsubscribe(); }
  }

  ngAfterContentInit(): void {
    this._tabsDataInit();

    if (this._mutableTabs || this._mutableTabs === '') {
      this._contentChangesSubscription = this.tabs.changes
        .subscribe(() => {
          const prevTabLength = this.tabsData.length;
          this._tabsDataInit();
          const nowTabLength = this.tabsData.length;

          setTimeout(() => {
            // 中身が減ってて、かつ、前回選択していたのが最後のタブであった場合
            if ((prevTabLength > nowTabLength) && prevTabLength - 1 === this.selectedIndex) {
              // Change detection を発火させるため、即時setTimeoutを用いる
              this.selectedIndex = nowTabLength - 1;
              this.selectTab(null, undefined, true);
            }
            this._setMatInkBarStyle();
          });
        });
    }
  }

  ngAfterViewInit(): void {
    this._matInkBarRef = this._elementRef.nativeElement.getElementsByClassName('mat-ink-bar')[0];
    this._tabRefs = this._elementRef.nativeElement.getElementsByClassName('mat-tab-lite-label');
    this.selectTab(null);
    this._changeDetector.detectChanges();

    this._ngAfterViewInitialized = true;
  }

  /**
   * @description タブを切り替える
   * @param
   *  index 切り替えたいタブのindexを入れる。すでに選択済みだった場合、処理はキャンセルされる。
   *  nullを代入した場合、処理は必ず実行される。
   */
  selectTab(index: number | null, selectedLabel?: string, skipSettingInkBarStyle?: boolean): void {
    if (index === this.selectedIndex) { return; }
    if (index === null) { index = this.selectedIndex; }

    this.selectedIndex = index;
    const selectedTabComponent = this.tabs.find(component => component.index === index) as TabLiteComponent;


    if (this.hasShownPrimary) {
      this.secondaryTemplate = selectedTabComponent.templateRef;
    } else {
      this.primaryTemplate = selectedTabComponent.templateRef;
    }
    this.hasShownPrimary = !this.hasShownPrimary;


    if (this._ngAfterViewInitialized) {
      this.selectedTabChange.emit({
        label: selectedLabel || selectedTabComponent.label,
        index,
        primaryShows: this.hasShownPrimary
      });
    }

    if (!skipSettingInkBarStyle) { this._setMatInkBarStyle(); }

    // 使わなくなったPortalの中身のガベージコレクションをする
    clearTimeout(this._gcDelayTimeout);
    this._zone.runOutsideAngular(() => {
      this._gcDelayTimeout = setTimeout(() => {
        (this.hasShownPrimary) ? this.secondaryTemplate = null : this.primaryTemplate = null;
      }, this._gcDelay);
    });
  }


  /** @description 子要素にアクセスし、子要素の変数に直接変更を加え、こちらの変数も更新する */
  private _tabsDataInit(): void {
    this.tabs.forEach((component, index) => {
      if (component.label) {
        this.tabsData = [...this.tabsData, { label: component.label, index }];
        component.index = index;
      }
    });
  }


  private _setMatInkBarStyle(): void {
    if (!this._tabRefs?.[0]) { return; }

    if (this._isMatVerticalTabs) {
      if (this._isMatStretchTabs) {
        const matInkBarHeight = this._tabRefs[this.selectedIndex].getBoundingClientRect().height;
        this._renderer.setAttribute(this._matInkBarRef, 'style',
          `height:${matInkBarHeight}px;transform:translateY(${matInkBarHeight * this.selectedIndex}px);${this._matInkBarPosition === 'after' ? 'right' : 'left'}:0;background:${this.activeColor.inkBar}`
        );
      } else {
         // for文で回される変数なので、スコープチェーンの検索を最低限にする
        const _tabRefs = this._tabRefs;
        const _selectedIndex = this.selectedIndex;

        const maxIndex = _tabRefs.length - 1;
        let topOffset = 0;

        // i を 後に参照して使用する必要があるので while を 使用
        let i = 0;
        while (i < maxIndex && i < _selectedIndex) {
          topOffset += _tabRefs[i].getBoundingClientRect().height;
          i = (i + 1) | 0;
        }

        this._renderer.setAttribute(this._matInkBarRef, 'style',
          `height:${_tabRefs[i].getBoundingClientRect().height}px;transform:translateY(${topOffset}px);${this._matInkBarPosition === 'after' ? 'right' : 'left'}:0;background:${this.activeColor.inkBar}`
        );
      }

    } else {
      if (this._isMatStretchTabs) {
        const matInkBarWidth = this._tabRefs[this.selectedIndex].getBoundingClientRect().width;
        this._renderer.setAttribute(this._matInkBarRef, 'style',
          `width:${matInkBarWidth}px;transform:translateX(${matInkBarWidth * this.selectedIndex}px);${this._matInkBarPosition === 'after' ? 'bottom' : 'top'}:0;background:${this.activeColor.inkBar}`
        );
      } else {
        const _tabRefs = this._tabRefs;
        const _selectedIndex = this.selectedIndex;

        const maxIndex = _tabRefs.length - 1;
        let leftOffset = 0;

        let i = 0;
        while (i < maxIndex && i < _selectedIndex) {
          leftOffset += _tabRefs[i].getBoundingClientRect().width;
          i = (i + 1) | 0;
        }

        this._renderer.setAttribute(this._matInkBarRef, 'style',
          `width:${_tabRefs[i].getBoundingClientRect().width}px;transform:translateX(${leftOffset}px);${this._matInkBarPosition === 'after' ? 'bottom' : 'top'}:0;background:${this.activeColor.inkBar}`
        );
      }
    }
  }
}
