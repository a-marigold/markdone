import { describe, it, expect } from 'bun:test';

import type { ASTBlockType } from '../../parser';

import { parse } from '../../parser';

describe('parse', () => {
    it('should work only with range that is from `sourceStart` to `sourceEnd` arguments', () => {
        const source = 'abc\n\n### g\n\nabc';

        const ast = parse(source, 3, 10);
        expect(ast.body.length).toBe(1);
        expect(ast.body[0].type).toBe('Heading');
    });

    it('should handle every `ASTBlockType` correctly', () => {
        const markdownSources: { type: ASTBlockType; source: string }[] = [];

        for (const markdownSource of markdownSources) {
            const source = markdownSource.source;

            const astBody = parse(source, 0, source.length).body;

            expect(astBody.length).toBe(1);
            expect(astBody[0].type).toBe(markdownSource.type);
        }
    });
});
