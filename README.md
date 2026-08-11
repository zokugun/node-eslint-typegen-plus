[@zokugun/eslint-typegen-plus](https://github.com/zokugun/node-eslint-typegen-plus)
===================================================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@zokugun/eslint-typegen-plus.svg?colorB=green)](https://www.npmjs.com/package/@zokugun/eslint-typegen-plus)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

> Generate accurate TypeScript types from ESLint plugin rules. It transforms rule schemas into usable types while preserving documentation and custom options.

About this project
------------------

`@zokugun/eslint-typegen-plus` is a fork of [`antfu/eslint-typegen`](https://github.com/antfu/eslint-typegen) with the following differences:

- simplified API;
- shipped as CommonJS and native ES modules.

Features
--------

- **JSON Schema**: Converts JSON schemas into TypeScript types automatically.
- **Automatic File Generation**: Creates `.d.ts` files directly in your project structure.
- **JSDoc Preservation**: Includes descriptions, URLs, and deprecation notices in generated types.
- **Overwrite Control**: Choose whether to overwrite existing definition files during builds.
- **Customizable Exports**: Define your own names for exported rule interfaces.
- **Type Safety**: Ensures strict typing for linter configurations across your codebase.
- **Easy Integration**: Works with standard ESLint plugin structures.

Installation
------------

```bash
npm add @zokugun/eslint-typegen-plus
```

Quick Start
-----------

```typescript
import { buildTypeGen } from '@zokugun/eslint-typegen-plus';
import regexp from 'eslint-plugin-regexp';

await buildTypeGen('regexp', regexp, null, { overwrite: true });
// generates `src/typegens/regexp.d.ts`
```

API reference
-------------

```typescript
function buildTypeGen(name: string, plugin: ESLint.Plugin, filename?: string | null, options?: {
    cwd?: string;
    overwrite?: boolean;
}): Promise<void>;

type RulesTypeGenOptions = {
    includeTypeImports?: boolean;
    includeIgnoreComments?: boolean;
    includeAugmentation?: boolean;
    exportTypeName?: string;
    compileOptions?: Partial<CompileOptions>;
};
function pluginsToRulesDTS(plugins: Record<string, ESLint.Plugin>, options?: RulesTypeGenOptions): Promise<string>
```

Contributions
-------------

Contributions are most welcome. Please:
- Open issues and feature requests under the repository discussions.
- Follow the [`CONTRIBUTING.md`](./CONTRIBUTING.md).

Donations
---------

Support this project by becoming a financial contributor.

<table>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_kofi.png" alt="Ko-fi" width="80px" height="80px"></td>
        <td><a href="https://ko-fi.com/daiyam" target="_blank">ko-fi.com/daiyam</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_liberapay.png" alt="Liberapay" width="80px" height="80px"></td>
        <td><a href="https://liberapay.com/daiyam/donate" target="_blank">liberapay.com/daiyam/donate</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_paypal.png" alt="PayPal" width="80px" height="80px"></td>
        <td><a href="https://paypal.me/daiyam99" target="_blank">paypal.me/daiyam99</a></td>
    </tr>
</table>

License
-------

Copyright &copy; 2026-present Baptiste Augrain

Licensed under the [MIT license](https://opensource.org/licenses/MIT).
