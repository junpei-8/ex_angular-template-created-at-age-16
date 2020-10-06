import { state, style, transition, animate, query, group, sequence, animation } from '@angular/animations';
import { AMT_DISPLAY_STYLES } from './common.animation';


/**
 * @description 親要素に指定する
 * @note 子要素には共通の width style をつけるのを忘れないようにする
 * @param timing  アニメーションのタイミングを指定する
 */
export const opacityFadeOutInForChild = animation(
  (() => {
    const displayStyles = AMT_DISPLAY_STYLES;
    return (
      group([
        query(':leave', [
          style({ ...displayStyles.show, opacity: 1 }),
          sequence([
            animate('{{ duration }} {{ function }}', style({ opacity: 0 })),
            style( displayStyles.hide )
          ])
        ], { optional: true }),
        query(':enter', [
          style({ ...displayStyles.hide, opacity: 0 }),
          sequence([
            animate('0.0001ms {{ duration }}', style( displayStyles.show )),
            animate('{{ duration }} {{ function }}', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    );
  })()
);


/**
 * @description 親要素に指定する。
 * @param timing  アニメーションのタイミングを指定する
 */
export const opacityFadeOutInForSelf = {
  out: animation([
    style({ ...AMT_DISPLAY_STYLES.show, opacity: 1 }),
    animate('{{ duration }} {{ function }}', style({ opacity: 0 })),
  ]),
  in: animation([
    sequence([
      animate('0.0001ms {{ duration }}', style( AMT_DISPLAY_STYLES.show )),
      animate('{{ duration }} {{ function }}', style({ opacity: 1 })),
    ])
  ])
} as const;


/** @note "Opacity style"は、"display style"が指定されていないと反映されない */
export const opacityFadeForSelf = {
  out: animation([
    animate('{{ duration }} {{ function }}', style({ opacity: 0 }))
  ]),
  in: animation([
    style({ opacity: 0 }),
    animate('{{ duration }} {{ function }}', style({ opacity: 1 }))
  ])
} as const;
