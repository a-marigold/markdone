import { describe, it, expect } from 'bun:test';

import { parseInline } from '../../parser/parse';
import type { ASTInlineNodeType } from '../../parser';

describe('parseInline', () => {
    it('should work only with range that is from `start` and `end` parameters', () => {
        const source = 'a *b* c';

        const inlineNodes = parseInline(source, 2, 5);

        expect(inlineNodes.length).toBe(1);
        expect(inlineNodes[0]).toEqual({
            type: 'Italic',

            children: [{ type: 'Text', value: 'b' }],
        });
    });

    it('should handle every type of Emphasis correctly', () => {
        const emphasisSources: { type: ASTInlineNodeType; source: string }[] = [
            { type: 'Text', source: 'abcdef and just text*\ ' },
            { type: 'Bold', source: '**abc**' },
            { type: 'Italic', source: '*abc*' },
            { type: 'BoldItalic', source: '***abc***' },
            { type: 'InlineCode', source: '`code`' },
            { type: 'Link', source: '[]()' },
            { type: 'Image', source: '![]()' },
        ];

        for (const emphasisSource of emphasisSources) {
            const source = emphasisSource.source;

            const inlineNodes = parseInline(source, 0, source.length);

            expect(inlineNodes.length).toBe(1);

            expect(inlineNodes[0].type).toBe(emphasisSource.type);
        }
    });

    it('should not handle content inside `InlineCode` as Emphasis', () => {
        const codeContent = '**bold** *italic* ***boldItalic*** ()[] text';

        const source = '`' + codeContent + '`';

        const inlineNodes = parseInline(source, 0, source.length);

        console.log(JSON.stringify(inlineNodes));

        expect(inlineNodes.length).toBe(1);

        expect(inlineNodes[0]).toEqual({
            type: 'InlineCode',
            value: codeContent,
        });
    });

    it('should distinguish `Link` and `Image`', () => {
        const source = '[link](#id) ![image](url)';

        const inlineNodes = parseInline(source, 0, source.length);

        expect(inlineNodes.length).toBe(2);
    });
});
