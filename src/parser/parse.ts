import type { AST, ASTInlineNode, HeadingLevel } from './types';
import { MAX_HEADING_LEVEL } from './constants';

import { checkHasContent } from './utils';

/**
 *
 * #### Parses provided `source` to AST.
 * #### Also parses all the nested Inline markdown (Emphasis, Text).
 * #### The AST can be used straight for generating HTML and the like.
 *
 * @param {string} source Source markdown string to be parsed.
 *
 *
 *
 * @returns {AST} AST with markdown nodes from `source`.
 *
 *
 * @examples
 *
 * ```typescript
 * const AST = parse('# heading **bold**');
 * ```
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

export const parse = (source: string): AST => {
    const AST: AST = { body: [] };

    const body = AST.body;

    const sourceLength = source.length;

    let lastParagraphStart = 0;

    let pos = 0;

    while (pos < sourceLength) {
        const char = source[pos];

        if (char === '\n' || char === '\r') {
            if (char === '\r') {
                pos++;
            }
            pos++;

            let newLineCount = 1;

            while (
                pos < sourceLength &&
                (source[pos] === ' ' ||
                    source[pos] === '\n' ||
                    source[pos] === '\r')
            ) {
                if (source[pos] === '\n') {
                    newLineCount++;
                }

                pos++;
            }

            if (newLineCount > 1) {
                if (checkHasContent(source, lastParagraphStart, pos)) {
                    body[body.length] = {
                        type: 'Paragraph',

                        children: parseInline(source, lastParagraphStart, pos),
                    };
                }

                lastParagraphStart = pos;
            }

            continue;
        }

        if (char === '#' && (pos === 0 || source[pos - 1] !== '\n')) {
            const start = pos;

            pos++;

            let level = 1;

            while (
                pos < sourceLength &&
                source[pos] === '#' &&
                source[pos] !== ' '
            ) {
                level++;

                pos++;
            }

            if (level <= MAX_HEADING_LEVEL && source[pos] !== ' ') {
                pos++;

                const headingStart = pos;

                while (
                    pos < sourceLength &&
                    source[pos] !== '\n' &&
                    source[pos] !== '\r'
                ) {
                    pos++;
                }

                const headingEnd = pos;

                if (source[pos] === '\r') {
                    pos++;
                }

                pos++;

                if (checkHasContent(source, lastParagraphStart, start)) {
                    body[body.length] = {
                        type: 'Paragraph',

                        children: parseInline(
                            source,

                            lastParagraphStart,

                            start,
                        ),
                    };
                }

                body[body.length] = {
                    type: 'Heading',

                    level: level as HeadingLevel,

                    children: parseInline(source, headingStart, headingEnd),
                };

                lastParagraphStart = pos;
            }

            continue;
        }

        pos++;
    }

    if (lastParagraphStart < sourceLength) {
        body[body.length] = {
            type: 'Paragraph',

            children: parseInline(source, lastParagraphStart, sourceLength),
        };
    }

    return AST;
};

/**
 * #### Parses Inline markdown (Emphasis, Text).
 *
 * @param {string} source Source string of line to be parsed.
 * @param {number} start start position of part of `source` to be parsed.
 * @param {number} end end position of part of `source` to be parsed.
 *
 * @returns {ASTInlineNode[]} Array with `ASTInlineNode`\`s.
 *
 */
const parseInline = (
    source: string,
    start: number,
    end: number,
): ASTInlineNode[] => {
    const inlineNode: ASTInlineNode[] = [];

    let lastTextStart = start;

    let pos = start;

    while (pos < end) {
        const char = source[pos];

        if (char === '*') {
            const start = pos;

            pos++;

            if (source[pos] === '*' && source[pos + 1] === '*') {
                pos += 2;

                const boldItalicStart = pos;

                while (
                    pos < end &&
                    !(
                        source[pos] === '*' &&
                        source[pos + 1] === '*' &&
                        source[pos + 2] === '*' &&
                        source[pos + 3] !== '*'
                    )
                ) {
                    pos++;
                }

                if (pos === end) {
                    pos = boldItalicStart;
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',

                        value: source.slice(lastTextStart, start),
                    };

                    inlineNode[inlineNode.length] = {
                        type: 'BoldItalic',

                        children: parseInline(source, boldItalicStart, pos),
                    };

                    pos += 3;

                    lastTextStart = pos;
                }
            } else if (source[pos] === '*') {
                pos++;

                const boldStart = pos;

                while (
                    pos < end &&
                    !(source[pos] === '*' && source[pos + 1] === '*')
                ) {
                    pos++;
                }

                if (pos === end) {
                    pos = boldStart;
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',

                        value: source.slice(lastTextStart, start),
                    };

                    inlineNode[inlineNode.length] = {
                        type: 'Bold',
                        children: parseInline(source, boldStart, pos),
                    };

                    pos += 2;
                    lastTextStart = pos;
                }
            } else {
                const italicStart = pos;

                while (pos < end && source[pos] !== '*') {
                    pos++;
                }

                if (pos === end) {
                    pos = italicStart;
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',

                        value: source.slice(lastTextStart, start),
                    };

                    inlineNode[inlineNode.length] = {
                        type: 'Italic',

                        children: parseInline(source, italicStart, pos),
                    };

                    pos++;
                    lastTextStart = pos;
                }
            }

            continue;
        }

        if (char === '`') {
            const start = pos;

            pos++;

            const codeStart = pos;

            while (pos < end && source[pos] !== '`') {
                pos++;
            }

            if (pos === end) {
                pos = codeStart;
            } else {
                inlineNode[inlineNode.length] = {
                    type: 'Text',
                    value: source.slice(lastTextStart, start),
                };

                inlineNode[inlineNode.length] = {
                    type: 'InlineCode',
                    value: source.slice(codeStart, pos),
                };

                pos++;

                lastTextStart = pos;
            }

            continue;
        }

        // fallback
        pos++;
    }

    if (lastTextStart < end) {
        inlineNode[inlineNode.length] = {
            type: 'Text',

            value: source.slice(lastTextStart, end),
        };
    }

    return inlineNode;
};
