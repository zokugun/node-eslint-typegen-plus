import type { ESLint } from 'eslint';
import type { RulesTypeGenOptions } from './types.js';

import process from 'node:process';

import fse from '@zokugun/fs-extra-plus/async';
import { kebabCase, pascalCase } from 'es-toolkit/string';

import { pluginsToRulesDTS } from './plugins-to-rules-dts.js';

type Options = RulesTypeGenOptions & {
	cwd?: string;
	fileName?: string;
	name: string;
	overwrite?: boolean;
	plugin: ESLint.Plugin
};

export async function buildTypeGen(options: Options): Promise<void> {
	const {
		cwd = process.cwd(),
		name = '',
		fileName,
		typeName,
		plugin,
		overwrite = false,
	} = options;

	const filePath = fse.join(cwd, 'src', 'typegens', fileName ?? `${kebabCase(name)}.d.ts`);

	if(!overwrite && await fse.isExisting(filePath)) {
		return;
	}

	const dts = await pluginsToRulesDTS({ [name]: plugin }, { ...options, typeName: typeName ?? `${pascalCase(name)}RuleOptions`});
	const result = await fse.outputFile(filePath, dts, 'utf8');

	if(result.fails) {
		throw result.error;
	}
}
