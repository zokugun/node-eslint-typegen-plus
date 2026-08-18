import type { RulesTypeGenOptions } from './types.js';

import { ESLint, Rule } from 'eslint';

import { compileRule } from './utils/compile-rule.js';

export async function pluginsToRulesDTS(plugins: Record<string, ESLint.Plugin>, options: RulesTypeGenOptions = {}): Promise<string> {
	const {
		compileOptions = {},
		typeName = 'RuleOptions',
		includeAugmentation = true,
		includeIgnoreComments = true,
		includeTypeImports = true,
	} = options;

	const rules: [name: string, rule: Rule.RuleModule][] = [];

	for (const [pluginName, plugin] of Object.entries(plugins)) {
		for (const [ruleName, rule] of Object.entries(plugin.rules || {})) {
			if (rule?.meta == null || typeof rule.meta === 'object') {
				rules.push([pluginName.length > 0 ? `${pluginName}/${ruleName}` : ruleName, rule]);
			}
		}
	}

	rules.sort(([a], [b]) => a.localeCompare(b));

	const resolved = await Promise.all(rules.map(([name, rule]) => compileRule(name, rule, compileOptions)));

	let output: string[] = [];

	if(includeIgnoreComments) {
		output.push('/* eslint-disable */', '/* prettier-ignore */');
	}

	if(includeTypeImports) {
		output.push(`import type { Linter } from 'eslint'`);
	}

	if(includeAugmentation) {
		if(output.length > 0) {
			output.push('');
		}

		output.push(
			`declare module 'eslint' {`,
			`  namespace Linter {`,
			`    interface RulesRecord extends ${typeName} {}`,
			`  }`,
			`}`,
		);
	}

	if(output.length > 0) {
		output.push('');
	}

	output.push(`export interface ${typeName} {`);

	for(const {typeName, name, jsdoc} of resolved) {
		if(jsdoc?.length) {
			output.push(`  /**\n${jsdoc.map(i => `   * ${i}`).join('\n').replaceAll(/\*\//g, '*\\/')}\n   */`)
		}

		output.push(`  '${name}'?: Linter.RuleEntry<${typeName}>`)
	}

	output.push('}', '', '/* ======= Declarations ======= */');

	for(const {typeDeclarations} of resolved) {
		output.push(...typeDeclarations)
	}

	output.push('');

	return output.join('\n');
}
