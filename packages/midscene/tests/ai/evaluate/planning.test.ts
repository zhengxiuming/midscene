import { plan } from '@/ai-model';
/* eslint-disable max-lines-per-function */
import { describe, expect, it, vi } from 'vitest';
import { modelList } from '../util';
import { getPageDataOfTestName } from './test-suite/util';

vi.setConfig({
  testTimeout: 180 * 1000,
  hookTimeout: 30 * 1000,
});

modelList.forEach((model) => {
  describe(`automation - planning ${model}`, () => {
    it('basic run', async () => {
      const { context } = await getPageDataOfTestName('todo');

      const { actions } = await plan(
        'type "Why is the earth a sphere?", wait 3.5s, hit Enter',
        {
          context,
        },
        model,
      );
      expect(actions.length).toBe(3);
      expect(actions[0].type).toBe('Input');
      expect(actions[1].type).toBe('Sleep');
      expect(actions[1].param).toMatchSnapshot();
      expect(actions[2].type).toBe('KeyboardPress');
      expect(actions[2].param).toMatchSnapshot();
    });

    it('instructions of to-do mvc', async () => {
      const { context } = await getPageDataOfTestName('todo');
      const instructions = [
        '在任务框 input 输入 今天学习 JS，按回车键',
        '在任务框 input 输入 明天学习 Rust，按回车键',
        '在任务框 input 输入后天学习 AI，按回车键',
        '将鼠标移动到任务列表中的第二项，点击第二项任务右边的删除按钮',
        '点击第二条任务左边的勾选按钮',
        '点击任务列表下面的 completed 状态按钮',
      ];

      for (const instruction of instructions) {
        const { actions } = await plan(instruction, { context }, model);
        expect(actions).toBeTruthy();
        expect(actions[0].locate?.id).toBeTruthy();
      }
    });
  });
});
