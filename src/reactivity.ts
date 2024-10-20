import { cloneDeep, isEqual, isFunction, isNil, isNotNil, isObject } from './shared';

type Effect = () => void;
type Dep = Set<Effect>;
type KeyToDepMap = Map<any, Dep>;

const targetMap = new WeakMap<object, KeyToDepMap>();
let activeEffect: Effect | null = null;

const track = (target: any, key: string) => {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
};

const trigger = (target: any, key: string) => {
  targetMap
    .get(target)
    ?.get(key)
    ?.forEach((effect) => effect());
};

const registerEffect = (effect: Effect) => {
  activeEffect = effect;
  effect();
  activeEffect = null;
};

const reactive = <T extends object>(target: T): T => {
  return new Proxy(target, {
    get(target: T, key: string, receiver: T): any {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target: T, key: string, newValue: T, receiver: T): boolean {
      const oldValue = Reflect.get(target, key, receiver);
      const success = Reflect.set(target, key, newValue, receiver);
      if (oldValue !== newValue) {
        trigger(target, key);
      }
      return success;
    },
  });
};

interface RefImpl<T> {
  value: T;
}
const ref = <T>(value: T): RefImpl<T> => {
  if (isObject(value)) {
    let reactiveValue = reactive(value);
    return {
      get value() {
        return reactiveValue;
      },
      set value(newValue: T) {
        if (isObject(newValue)) {
          reactiveValue = reactive(newValue);
        }
      },
    };
  }
  return reactive({ value });
};

type ComputedGetter<T> = () => T;
type ComputedSetter<T> = (value: T) => void;
type ComputedProps<T> = ComputedGetter<T> | { get: ComputedGetter<T>; set: ComputedSetter<T> };
const isEffectGetter = <T>(effect: ComputedProps<T>): effect is ComputedGetter<T> => {
  return isFunction(effect);
};
const computed = <T>(props: ComputedProps<T>) => {
  let getter: ComputedGetter<T>;
  let setter: ComputedSetter<T>;
  let computedRef: T;

  if (isEffectGetter(props)) {
    getter = props;
  } else {
    getter = props.get;
    setter = props.set;
  }

  registerEffect(() => {
    if (isNil(getter)) return;

    const result = getter();
    if (isNotNil(result) && computedRef !== result) {
      computedRef = result;
    }
  });

  return {
    get value(): T {
      return computedRef;
    },
    set value(newValue: T) {
      if (isNotNil(setter)) {
        setter(newValue);
      }
    },
  };
};

interface WatchOptions {
  immediate?: boolean;
  deep?: boolean;
}
const watch = <T>(
  source: () => T,
  cb: (value: T, oldValue: T | undefined, onCleanup: (cleanupFn: () => void) => void) => void,
  options?: WatchOptions
) => {
  let { immediate = false, deep = false } = options ?? {};
  let oldValue: T | undefined;
  let cleanup: (() => void) | undefined;

  const onCleanup = (fn: () => void) => {
    cleanup = fn;
  };

  const runner = () => {
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }

    const value = source();
    if (deep ? !isEqual(value, oldValue) : value !== oldValue) {
      cb(value, oldValue, onCleanup);
      oldValue = deep ? cloneDeep(value) : value;
    }
  };

  registerEffect(() => {
    if (immediate) {
      runner();
    } else {
      immediate = true;
      oldValue = source();
    }
  });
};

export { reactive, ref, computed, watch };
