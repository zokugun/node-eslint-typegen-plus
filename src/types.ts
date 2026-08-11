import type { Options as CompileOptions } from 'json-schema-to-typescript-lite'

export type RulesTypeGenOptions = {
  /**
   * Insert type imports for the generated types.
   *
   * @default true
   */
  includeTypeImports?: boolean;

  /**
   * Include comments to disable ESLint and Prettier.
   *
   * @default true
   */
  includeIgnoreComments?: boolean;

  /**
   * Augment the interface to ESLint's `Linter.RulesRecord`.
   *
   * @default true
   */
  includeAugmentation?: boolean;

  /**
   * The name of the exported type.
   *
   * @default 'RuleOptions'
   */
  exportTypeName?: string;

  /**
   * Options for json-schema-to-typescript
   */
  compileOptions?: Partial<CompileOptions>;
}
