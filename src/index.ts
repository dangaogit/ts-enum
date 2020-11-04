export interface EnumOption<V> {
  value: V;
  label: string;
}

export class Enum<T extends Record<string, EnumOption<V>>, K extends keyof T = keyof T, V extends string | number | symbol = T[K]["value"]> {
  /**
   * Record<value, key>;
   */
  public get vk() {
    return this._vk as Readonly<Record<V, K>>;
  }
  private _vk = {} as Record<V, K>;
  /**
   * Record<key, value>;
   */
  public get kv() {
    return this._kv as { readonly [Key in K]: T[Key]["value"] };
  }
  private _kv = {} as {
    [Key in K]: T[Key]["value"];
  };
  /**
   * Record<key, label>;
   */
  public get kl() {
    return this._kl as Readonly<Record<keyof T, string>>;
  }
  private _kl = {} as Record<keyof T, string>;
  /**
   * Record<value, label>;
   */
  public get vl() {
    return this._vl as Readonly<Record<V, string>>;
  }
  private _vl = {} as Record<V, string>;

  constructor(private _enum: T) {
    Object.entries(_enum).forEach(([k, v]) => {
      const key = k as keyof T;
      (this._kv as any)[key] = v.value;
      this._vk[v.value] = key as K;
      this._kl[key] = v.label;
      this._vl[v.value] = v.label;
    });
  }

  public getValueByName(name: K) {
    return this.kv[name];
  }

  public getNameByValue(value: V) {
    return this.vk[value];
  }

  public getLabelByName(name: keyof T) {
    return this.kl[name];
  }

  public getLabelByValue(value: V) {
    return this.vl[value];
  }

  public iteration<T>(call: (value: { key: K; option: EnumOption<V> }, index: number) => T): T[] {
    return Object.entries(this._enum).map(([key, option], index) => {
      return call({ key: key as K, option }, index);
    });
  }
}
