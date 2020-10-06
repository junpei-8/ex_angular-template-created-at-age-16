import { DeepWriteable } from '../typings';

/**
 *  @description スプレッド構文を使った DeepCopy
 *  @methodType 非破壊的
 *  @sideEffect Object.freeze は解除される
 */
export function deepCopy<T>(obj: T): DeepWriteable<T> {
  // プリミティブの場合はそのまま返却
  if (!(typeof obj === 'object' && obj)) { return obj; }

  // Arrayのときの処理
  if (Array.isArray(obj)) {
    const newArr: any = [];
    const arrLength = obj.length;

    for (let i = 0; i < arrLength; i = (i + 1) | 0) {
      newArr[i] = deepCopy(obj[i]);
    }

    // @ts-ignore
    return [...newArr];


  // Objectのときの処理
  } else {
    // @ts-ignore
    const newObj: DeepWriteable<T> = {};
    const keys = Object.keys(obj);
    const keyLength = keys.length;

    for (let i = 0; i < keyLength; i = (i + 1) | 0) {
      const key = keys[i];
      // @ts-ignore
      newObj[key] = deepCopy(obj[key]);
    }

    return { ...newObj };
  }
}
