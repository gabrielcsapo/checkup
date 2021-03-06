import { Task, TaskResult, BaseTask, toTaskItemData } from '@checkup/core';

import EmberTypesTaskResult from '../results/ember-types-task-result';

const SEARCH_PATTERNS = [
  { patternName: 'components', pattern: ['**/components/**/*.js'] },
  { patternName: 'controllers', pattern: ['**/controllers/**/*.js'] },
  { patternName: 'helpers', pattern: ['**/helpers/**/*.js'] },
  { patternName: 'initializers', pattern: ['**/initializers/**/*.js'] },
  { patternName: 'instance-initializers', pattern: ['**/instance-initializers/**/*.js'] },
  { patternName: 'mixins', pattern: ['**/mixins/**/*.js'] },
  { patternName: 'models', pattern: ['**/models/**/*.js'] },
  { patternName: 'routes', pattern: ['**/routes/**/*.js'] },
  { patternName: 'services', pattern: ['**/services/**/*.js'] },
  { patternName: 'templates', pattern: ['**/templates/**/*.hbs'] },
];

export default class EmberTypesTask extends BaseTask implements Task {
  meta = {
    taskName: 'ember-types',
    friendlyTaskName: 'Ember Types',
    taskClassification: {
      category: 'metrics',
      group: 'ember',
    },
  };

  async run(): Promise<TaskResult> {
    let result = new EmberTypesTaskResult(this.meta, this.config);
    result.types = SEARCH_PATTERNS.map((pattern) => {
      return toTaskItemData(pattern.patternName, this.context.paths.filterByGlob(pattern.pattern));
    });

    return result;
  }
}
