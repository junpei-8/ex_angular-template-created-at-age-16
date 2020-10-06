import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ComponentType } from 'src/app/typings';
import { RENDERER, RendererService } from '../../services/renderer.service';


type RefType = 'template' | 'component';

export interface ModalOutletOutputData {
  refType: RefType;
  index: number;
  backdropClick: () => Observable<void>;
  keydownEvents: () => Observable<KeyboardEvent>;
}

interface OutputConfig {
  needUseOverlay?: boolean;
}
interface ConfigAfterOutput extends OutputConfig {
  hasSubscribedBackdropClick?: boolean;
  hasSubscribedKeydownEvents?: boolean;
}

type RefData<T> = { ref: T, config: ConfigAfterOutput };
type TemplateRefData = RefData<TemplateRef<any>>;
type ComponentRefData = RefData<ComponentType<any>>;

export type ModalOutletPrivateTemplates = (TemplateRefData | null)[];
export type ModalOutletPrivateComponents = (ComponentRefData | null)[];

export type ModalOutletTemplates = TemplateRefData[];
export type ModalOutletComponents = ComponentRefData[];

type AnyRefs = ModalOutletTemplates | ModalOutletComponents;

@Injectable({
  providedIn: 'root'
})
export class ModalOutletService {
  // Boolean
  private _needUseOverlay: boolean | undefined;

  private _templates: ModalOutletPrivateTemplates = [];
  templates$ = new Subject<ModalOutletTemplates>();

  private _components: ModalOutletPrivateComponents = [];
  components$ = new Subject<ModalOutletComponents>();

  // Elements
  private _modalOutletElement: Element | null;

  private _backdropClickSubject: Subject<void> | null;
  private _backdropClickHandler: (() => void) | null;

  private _keydownEventsSubject: Subject<KeyboardEvent> | null;
  private _keydownEventsHandler: (() => void) | null;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(RENDERER) private _renderer: RendererService
  ) {}


  /**
   * @description template もしくは componentを出力する
   * @returns 削除するための情報や、各イベントのSubjectのgetter
   * @param ref template もしくは component
   * @param config "true"にして使用
   *  - needUseOverlay
   */
  output<T extends RefType>(
    ref: T extends 'template' ? TemplateRef<any> : ComponentType<any>,
    config: OutputConfig = {}
  ): ModalOutletOutputData {
    if (!this._modalOutletElement) {
      this._modalOutletElement = this._document.getElementsByTagName('modal-outlet')[0] as Element;
    }

    const refType: 'template' | 'component' =
      (ref instanceof TemplateRef) ? 'template' :
        (typeof ref === 'function') ? 'component' : '' as any; // <= 型チェックを外す

    let configRef: ConfigAfterOutput;
    let index: number;
    if (refType === 'template') {
      const templates = [ ...this._templates, { ref: ref as TemplateRef<any>, config } ];
      this.templates$.next(templates.filter(v => v) as ModalOutletTemplates);
      this._templates = templates;

      index = this._templates.length - 1;
      // @ts-ignore: Non nullable
      configRef = this._templates[index].config;

    } else if (refType === 'component') {
      const components = [ ...this._components, { ref: ref as ComponentType<any>, config }];
      this.components$.next(components.filter(v => v) as ModalOutletComponents);
      this._components = components;

      index = this._components.length - 1;
      // @ts-ignore: Non nullable
      configRef = this._components[index].config;

    } else { throw new Error(''); }


    this._renderer.addClass(this._modalOutletElement, 'content-exists');

    if (config.needUseOverlay) {
      if (!this._needUseOverlay) {
        this._needUseOverlay = true;
        this._renderer.addClass(this._modalOutletElement, 'active-overlay');
      }
    }

    return {
      refType, index,

      backdropClick: () => {
        configRef.hasSubscribedBackdropClick = true;

        if (!this._backdropClickSubject) {
          this._backdropClickSubject = new Subject();

          // EventHandlerの追加
          this._backdropClickHandler = this._renderer
            .listen(this._modalOutletElement, 'click', () => {
              // @ts-ignore: Non nullable
              this._backdropClickSubject.next();
            });
        }

        return this._backdropClickSubject.asObservable();
      },

      keydownEvents: () => {
        configRef.hasSubscribedKeydownEvents = true;

        if (!this._keydownEventsSubject) {
          this._keydownEventsSubject = new Subject();

          // EventHandlerの追加
          this._keydownEventsHandler = this._renderer
            .listen(window, 'keydown', (keydownEvent) => {
              // @ts-ignore: Non nullable
              this._keydownEventsSubject.next(keydownEvent);
            });
        }

        return this._keydownEventsSubject.asObservable();
      }
    };
  }


  close(outputData: ModalOutletOutputData, renderingDelay?: number): void {
    let needUseOverlay: true | undefined;
    let hasSubscribedBackdropClick: true | undefined;
    let hasSubscribedKeydownEvents: true | undefined;

    // 一回限りの処理のため、下のforのスコープの外で行う
    (outputData.refType === 'template') ?
      this._templates[outputData.index] = null : this._components[outputData.index] = null;

    let processKey = outputData.refType;
    for (let i = 0; i < 2; i = (i + 1) | 0) {
      if (processKey === 'template') {
        const result = configChecker(this._templates);

        if (i === 0) {
          const rendering = () => this.templates$.next(result.nonNullableRefs);
          renderingDelay ? setTimeout(rendering, renderingDelay) : rendering();

          // 初回の実行でかつ、_templatesのConfigの中身がすべてTrueになっていなかったら
          if (!result.allTrue) { processKey = 'component'; }
        }

        // _templatesの中身がすべてnullだった場合GC
        // すべてnullである = configはすべてfalseであることが確定するので、_templatesの中身があるときのみconfigを整理する処理を行う
        if (!result.nonNullableRefs.length) {
          this._templates = [];
        } else {
          needUseOverlay = needUseOverlay || result.needUseOverlay;
          hasSubscribedBackdropClick = hasSubscribedBackdropClick || result.hasSubscribedBackdropClick;
          hasSubscribedKeydownEvents = hasSubscribedKeydownEvents || result.hasSubscribedKeydownEvents;
        }

      } else if (processKey === 'component') {
        const result = configChecker(this._components);

        // レンダリング処理
        if (i === 0) {
          const rendering = () => this.components$.next(result.nonNullableRefs);
          renderingDelay ? setTimeout(rendering, renderingDelay) : rendering();

          // 初回の実行でかつ、_componentsのConfigの中身がすべてTrueになっていなかったら
          if (!result.allTrue) { processKey = 'template'; }
        }

        // _componentsの中身がすべてnullだった場合
        // すべてnullである = configはすべてfalseであることが確定するので、_componentsの中身があるときのみconfigを整理する処理を行う
        if (!result.nonNullableRefs.length) {
          this._components = [];
        } else {
          needUseOverlay = needUseOverlay || result.needUseOverlay;
          hasSubscribedBackdropClick = hasSubscribedBackdropClick || result.hasSubscribedBackdropClick;
          hasSubscribedKeydownEvents = hasSubscribedKeydownEvents || result.hasSubscribedKeydownEvents;
        }
      }
    }

    const allEmpty: boolean = !(this._templates.length + this._components.length);

    if (allEmpty) {
      this._renderer.removeClass(this._modalOutletElement, 'content-exists');
    }

    this._needUseOverlay = needUseOverlay;
    if (!needUseOverlay) {
      this._renderer.removeClass(this._modalOutletElement, 'active-overlay');
    }

    if (!hasSubscribedBackdropClick && this._backdropClickHandler && this._backdropClickSubject) {
      // どれも、backdropClickSubjectをsubscribeしていなかったらBackdropClickObservableをGC
      this._backdropClickSubject.complete();
      this._backdropClickSubject = null;
      this._backdropClickHandler();
      this._backdropClickHandler = null;
    }

    if (!hasSubscribedKeydownEvents && this._keydownEventsHandler && this._keydownEventsSubject) {
      this._keydownEventsSubject.complete();
      this._keydownEventsSubject = null;
      this._keydownEventsHandler();
      this._keydownEventsHandler = null;
    }
  }

  closeAll(refType: RefType | 'all' = 'all'): void {
    // Template
    if (refType === 'all' || refType === 'template') {

    }

    // Component
    if (refType === 'all' || refType === 'component') {

    }
  }
}


type ConfigCheckerResult<R> = {
  allTrue: true | undefined,
  nonNullableRefs: R
} & {
  [key in NonNullable<keyof ConfigAfterOutput>]: true | undefined
};
function configChecker<
  T extends ModalOutletPrivateComponents | ModalOutletPrivateTemplates,
  R = T extends ModalOutletPrivateComponents ? ModalOutletComponents : ModalOutletTemplates
>(refs: T): ConfigCheckerResult<R> {
  let nonNullableRefs: any[] = []; // => 型が複雑なため any[] で

  let needUseOverlay: true | undefined;
  let hasSubscribedBackdropClick: true | undefined;
  let hasSubscribedKeydownEvents: true | undefined;

  const refLength = refs.length;
  for (let i = 0; i < refLength; i = (i + 1) | 0) {
    if (refs[i]) {
      nonNullableRefs = [ ...nonNullableRefs, refs[i] as any ];
      // @ts-ignore: 存在する
      const config = refs[i].config;

      if (config.needUseOverlay) { needUseOverlay = true; }
      if (config.hasSubscribedBackdropClick) { hasSubscribedBackdropClick = true; }
      if (config.hasSubscribedKeydownEvents) { hasSubscribedKeydownEvents = true; }
    }
  }

  return {
    allTrue: needUseOverlay && hasSubscribedBackdropClick,
    // @ts-ignore: 複雑な型なのでlintが正しく判断しないため
    nonNullableRefs,
    needUseOverlay,
    hasSubscribedBackdropClick,
    hasSubscribedKeydownEvents,
  };
}
