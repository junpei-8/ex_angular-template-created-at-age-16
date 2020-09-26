// 参照： https://qiita.com/Tsuyoshi84/items/0524ab994745e9acd5ab

/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = PickType<Person, 'parent'>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    father?: string;
 *    mother?: string;
 *  }
 */
export declare type PickType<T, K extends keyof T> = T[K];


/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = PickProps<Person, 'id' | 'name'>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: number;
 *    name: string;
 *  }
 */
export declare type PickProps<T, K extends keyof T> = { [P in Extract<keyof T, K>]: T[P] };


/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = RemoveProps<Person, 'id' | 'parent'>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    name: string;
 *  }
 */
export declare type RemoveProps<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };


/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = PropsWithType<Person, string>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: string;
 *    name: string;
 *    parent: string;
 *  }
 */
export declare type PropsWithType<T, TYPE> = { [P in keyof T]: TYPE }



/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *  interface Pet {
 *    name: string;
 *    parent: string;
 *  }

 *
 *  type xxx = Intersection<Person, pet>;
 *  type yyy = Intersection<Pet, Person>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: string;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  // yyy は以下と同義
 *  interface yyy {
 *    id: string;
 *    name: string;
 *    parent: string;
 *  }
 */
export declare type Intersection<T, T2> = { [P in keyof T & keyof T2]: T[P] };



/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = UnionProp<Person, 'id', string>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: string | number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 */
export declare type UnionProp<T, KEY extends keyof T, TYPE> = {
  [P in keyof T]: (P extends KEY ? T[P] | TYPE : T[P])
};

export declare type RemoveUnionProp<T, KEY extends keyof T, TYPE> = {
  [P in keyof T]: (P extends KEY ? T[P] : T[P])
}


/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = PickPropsWithType<Person, number | { father?: string; mother?: string; }>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: number;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    };
 *  }
 */
export declare type PickPropsWithType<T, TYPES> = {
  [P in { [K in keyof T]: T[K] extends TYPES ? K : never }[keyof T]]: T[P]
};

/**
 * @example
 *  interface Person {
 *    id: number;
 *    name: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = DeepConvert<Person, string, number>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: number;
 *    name: number;
 *    parent: {
 *      father?: number;
 *      mother?: number;
 *    }
 *  }
 */
export declare type DeepConvert<T, T1, T2> = {
  [P in keyof T]: T[P] extends T1
  ? T2 :
  T[P] extends Array<infer R>
  ? Array<DeepConvert<R, T1, T2>> :
  T[P] extends object
  ? DeepConvert<T[P], T1, T2> :
  T[P]
};



/**
 * @example
 *  interface Person {
 *    id: number;
 *    name?: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = DeepRequired<Person>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    readonly id: number;
 *    readonly name: number;
 *    readonly parent: {
 *      readonly father?: number;
 *      readonly mother?: number;
 *    }
 *  }
 */
export declare type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T;
declare interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
declare type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]>; };


/**
 * @example
 *  interface Person {
 *    readonly id: number;
 *    readonly name?: string;
 *    readonly parent: {
 *      readonly father?: string;
 *      readonly mother?: string;
 *    }
 *  }
 *
 *  type xxx = DeepRequired<Person>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: number;
 *    name: number;
 *    parent: {
 *      father?: number;
 *      mother?: number;
 *    }
 *  }
 */
export declare type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

/**
 * @example
 *  interface Person {
 *    id?: number;
 *    name?: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = Required<Person>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: number;
 *    name: number;
 *    parent: {
 *      father?: number;
 *      mother?: number;
 *    }
 *  }
 */
export declare type Required<T> = {
  [P in keyof T]-? : T[P]
}


/**
 * @example
 *  interface Person {
 *    id?: number;
 *    name?: string;
 *    parent: {
 *      father?: string;
 *      mother?: string;
 *    }
 *  }
 *
 *  type xxx = DeepRequired<Person>;
 *
 *  // xxx は以下と同義
 *  interface xxx {
 *    id: number;
 *    name: number;
 *    parent: {
 *      father: number;
 *      mother: number;
 *    }
 *  }
 */
export declare type DeepRequired<T> = {
  [P in keyof T]-? :
    T[P] extends object ?
      Required<T[P]> : T[P]
};


export declare type RequiredKeepUndefined<T> =
  {[K in keyof T]-?: [T[K]] } extends infer U ?
      U extends Record<keyof U, [any]> ?
        { [K in keyof U]
        : U[K][0]} : never : never;



declare interface Person { // <= For test
  id?: number;
  name?: string;
  parent: {
    father?: string;
    mother?: string;
  }
}
