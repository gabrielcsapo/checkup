import {
  CheckupProject,
  stdout,
  getTaskContext,
  clearFilePaths,
  isActionEnabled,
} from '@checkup/test-helpers';

import TemplateLintDisableTask from '../src/tasks/template-lint-disable-task';
import TemplateLintDisableTaskResult from '../src/results/template-lint-disable-task-result';

describe('template-lint-disable-task', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('foo', '0.0.0');
    project.files['index.hbs'] = `
    {{! template-lint-disable no-inline-styles }}
    <div style="color:blue">
      <h1>Checkup</h1>
      {{! template-lint-disable img-alt-attributes }}
      <img src="foo"/>
    </div>

    {{! template-lint-disable bare-strings }}
    WHATEVER MAN
    `;

    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('finds all instances of template-lint-disable and outputs to the console', async () => {
    const result = await new TemplateLintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const templateLintDisableTaskResult = <TemplateLintDisableTaskResult>result;

    templateLintDisableTaskResult.toConsole();

    expect(stdout()).toMatchInlineSnapshot(`
      "template-lint-disable Usages Found: 3

      "
    `);
  });

  it('finds all instances of template-lint-disable and outputs to json', async () => {
    const result = await new TemplateLintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const templateLintDisableTaskResult = <TemplateLintDisableTaskResult>result;

    const json = templateLintDisableTaskResult.toJson();
    expect({
      ...json,
      ...{ result: clearFilePaths(json.result.templateLintDisables) },
    }).toMatchInlineSnapshot(`
      Object {
        "meta": Object {
          "friendlyTaskName": "Number of template-lint-disable Usages",
          "taskClassification": Object {
            "category": "linting",
            "group": "ember",
          },
          "taskName": "template-lint-disables",
        },
        "result": Array [
          Object {
            "data": Array [
              1,
            ],
          },
          Object {
            "data": Array [
              1,
            ],
          },
          Object {
            "data": Array [
              1,
            ],
          },
        ],
      }
    `);
  });

  it('returns action item if there are more than 2 instances of template-lint-disable', async () => {
    const result = await new TemplateLintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const templateLintDisableTaskResult = <TemplateLintDisableTaskResult>result;

    expect(
      isActionEnabled(
        templateLintDisableTaskResult.actionList.enabledActions,
        'num-template-lint-disables'
      )
    ).toEqual(true);
    expect(templateLintDisableTaskResult.actionList.actionMessages).toMatchInlineSnapshot(`
      Array [
        "There are 3 instances of 'template-lint-disable', there should be at most 2.",
      ]
    `);
  });
});
