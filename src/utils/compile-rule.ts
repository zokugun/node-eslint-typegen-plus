import type { Options as CompileOptions } from 'json-schema-to-typescript-lite'
import type { JSONSchema4 } from 'json-schema'

import { Rule } from 'eslint';
import { compile as compileSchema, normalizeIdentifier } from 'json-schema-to-typescript-lite'

export async function compileRule(ruleName: string, rule: Rule.RuleModule, compileOptions: Partial<CompileOptions> = {}) {
	const meta = rule.meta ?? {};
	let schemas = meta.schema as JSONSchema4[] ?? [];
	if (!Array.isArray(schemas))
		schemas = [schemas];

	const id = normalizeIdentifier(ruleName);

	const jsdoc: string[] = [];
	if (meta.docs?.description)
		jsdoc.push(meta.docs.description);
	if (meta.docs?.url)
		jsdoc.push(`@see ${meta.docs.url}`);
	if (meta.deprecated)
		jsdoc.push('@deprecated');

	if (!meta.schema || !schemas.length) {
		return {
			jsdoc,
			name: ruleName,
			typeName: '[]',
			typeDeclarations: [],
		};
	}

	let lines: string[] = [];

	const schema: JSONSchema4 = Array.isArray(meta.schema)
		? { type: 'array', items: meta.schema, definitions: meta.schema?.[0]?.definitions }
		: meta.schema;

	let overriddenRootSchemaId: string | undefined;
	let isRootSchema = true;

	try {
		const compiled = await compileSchema(schema, id, {
			unreachableDefinitions: false,
			strictIndexSignatures: true,
			customName(schema, keyName) {
				const canOverrideRootSchemaId = isRootSchema;
				isRootSchema = false;

				const resolved = schema.title || schema.$id || keyName;
				if (resolved === id)
					return id;
				if (!resolved)
					return undefined!;

				const normalizedName = `_${normalizeIdentifier(`${id}_${resolved}`)}`;
				if (canOverrideRootSchemaId)
					overriddenRootSchemaId = normalizedName;

				return normalizedName;
			},
			...compileOptions,
		});
		lines.push(
			compiled
				.replace(/\/\*[\s\S]*?\*\//g, ''),
		);
	}
	catch (error) {
		console.warn(`Failed to compile schema ${ruleName} for rule ${ruleName}. Falling back to unknown.`);
		console.error(error);
		lines.push(`export type ${id} = unknown\n`);
	}

	lines = lines
		.join('\n')
		.split('\n')
		.map(line => line.replace(/^(export )/, ''))
		.filter(Boolean);

	lines.unshift(`// ----- ${ruleName} -----`);

	return {
		name: ruleName,
		jsdoc,
		typeName: overriddenRootSchemaId ?? id,
		typeDeclarations: lines,
	};
}
