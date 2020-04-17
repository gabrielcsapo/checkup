import { TaskIdentifier } from './types';

export default abstract class BaseMetaTaskResult {
  meta: TaskIdentifier;

  constructor(meta: TaskIdentifier) {
    this.meta = meta;
  }
}
