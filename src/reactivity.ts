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

const reactive = <T extends object>(target: T): T => {
  return new Proxy(target, {
    get(target: T, key: string, receiver: T): any {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target: T, key: string, newValue: T, receiver: T): boolean {
      const oldValue = Reflect.get(target, key, receiver);
      const setNewValueResult = Reflect.set(target, key, newValue, receiver);
      if (oldValue !== newValue) {
        trigger(target, key);
      }
      return setNewValueResult;
    },
  });
};

interface RefImpl<T> {
  value: T;
}
const ref = <T>(value: T): RefImpl<T> => {
  return reactive({ value });
};

export { reactive, ref };
