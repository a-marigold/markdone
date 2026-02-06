import { describe, it, expect } from 'bun:test';

import type { AST, ASTBlockType, ListItem } from '../../parser';

import { parse } from '../../parser';

describe('parse', () => {
    it('should work only with range that is from `sourceStart` to `sourceEnd` arguments', () => {
        const source = 'abc\n\n### g\n\nabc';

        const ast = parse(source, 3, 10);
        expect(ast.body.length).toBe(1);
        expect(ast.body[0].type).toBe('Heading');
    });

    it('should handle every `ASTBlockType` correctly', () => {
        const markdownSources: { type: ASTBlockType; source: string }[] = [
            { type: 'Paragraph', source: 'abcdefghijklmnopqrstu' },
            { type: 'Heading', source: '### abcdefghijklmnopqrstu' },
            { type: 'BlockQuote', source: '> > abcdefghijklmnopqrstu\n>\n>' },
            {
                type: 'FencedCodeBlock',
                source: '```typescript\n abcdefghijklmnopqrstu',
            },
            {
                type: 'List',
                source: `- abcdefghijklmnopqrstu
 - abc
  - n`,
            },
        ];
        for (const markdownSource of markdownSources) {
            const source = markdownSource.source;

            const astBody = parse(source, 0, source.length).body;
            expect(astBody.length).toBe(1);
            expect(astBody[0].type).toBe(markdownSource.type);
        }
    });

    it('should handle every way of List defining identically', () => {
        const dashSource = `- hello
  - hello
    - hello`;

        const starSource = `* hello
  * hello
    * hello`;

        const plusSource = `+ hello
  + hello
    + hello`;

        const getListItemShape = (items: ListItem['items']): ListItem => ({
            type: 'ListItem',
            children: [
                {
                    type: 'Paragraph',
                    children: [{ type: 'Text', value: 'hello' }],
                },
            ],
            items,
        });

        const expectedAstBodyShape: AST['body'] = [
            {
                type: 'List',

                items: [
                    getListItemShape([
                        getListItemShape([getListItemShape([])]),
                    ]),
                ],
            },
        ];

        expect(parse(dashSource, 0, dashSource.length).body).toEqual(
            expectedAstBodyShape,
        );

        expect(parse(starSource, 0, dashSource.length).body).toEqual(
            expectedAstBodyShape,
        );

        expect(parse(starSource, 0, dashSource.length).body).toEqual(
            expectedAstBodyShape,
        );
    });
});
