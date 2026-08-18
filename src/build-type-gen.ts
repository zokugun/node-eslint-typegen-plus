import type { ESLint } from 'eslint';
import type { RulesTypeGenOptions } from './types.js';

import process from 'node:process';

import fse from '@zokugun/fs-extra-plus/async';

import { pluginsToRulesDTS } from './plugins-to-rules-dts.js';

export async function buildTypeGen(name: string, plugin: ESLint.Plugin, filename?: string | null, options: RulesTypeGenOptions & { cwd?: string; overwrite?: boolean; } = {}): Promise<void> {
	const {
		cwd = process.cwd(),
		overwrite = false,
	} = options;

	const filePath = fse.join(cwd, 'src', 'typegens', filename ?? `${name}.d.ts`);

	if(!overwrite && await fse.isExisting(filePath)) {
		return;
	}

	const dts = await pluginsToRulesDTS({ [name]: plugin }, options);
	const result = await fse.outputFile(filePath, dts, 'utf8');

	if(result.fails) {
		throw result.error;
	}
}
