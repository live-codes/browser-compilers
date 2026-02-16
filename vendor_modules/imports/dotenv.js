import { parse } from 'dotenv';
import { expand } from 'dotenv-expand';

export { parse, expand };
export const parseAndExpand = (/** @type {string} */ env) =>
  expand({ parsed: parse(env || '') }).parsed;
