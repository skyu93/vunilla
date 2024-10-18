import { reactive, ref } from '../reactivity';

describe('반응형(reactivity) 테스트', () => {
  test('reactive 선언 테스트', () => {
    const information = reactive({
      libName: 'vunilla',
      author: 'skyu93',
      version: '1.0.0',
    });
    expect(information).not.toBeNull();
    expect(information.libName).toBe('vunilla');
    expect(information.author).toBe('skyu93');
    expect(information.version).toBe('1.0.0');
  });

  test('ref 선언 테스트', () => {
    const temp = ref(1);
    expect(temp.value).toBeDefined();
    expect(temp.value).toBe(1);
  });
});
