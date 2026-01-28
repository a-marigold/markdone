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
 */

export const parse = (source: string): AST => {
    const AST: AST = { body: [] };

    const body = AST.body;

    const sourceLength = source.length;

    let lastParagraphStart = 0;

    let pos = 0;

    while (pos < sourceLength) {
        const char = source[pos];

        if (char === '\n' || char == '\r') {
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

                        children: parseInline(
                            source.slice(lastParagraphStart, pos),
                        ),
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
                            source.slice(lastParagraphStart, start),
                        ),
                    };
                }

                body[body.length] = {
                    type: 'Heading',

                    level: level as HeadingLevel,

                    children: parseInline(
                        source.slice(headingStart, headingEnd),
                    ),
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

            children: parseInline(source.slice(lastParagraphStart)),
        };
    }

    return AST;
};

/**
 * #### Parses Inline markdown (Emphasis, Text).
 *
 * @param {string} source Source string of line to be parsed.
 * @returns {ASTInlineNode[]} Array with `ASTInlineNode`\`s.
 *
 */
const parseInline = (source: string): ASTInlineNode[] => {
    const inlineNode: ASTInlineNode[] = [];

    const sourceLength = source.length;

    let lastTextStart = 0;

    let pos = 0;

    while (pos < sourceLength) {
        const char = source[pos];

        if (char === '*') {
            const start = pos;

            pos++;

            if (source[pos] === '*' && source[pos + 1] === '*') {
                pos += 2;

                const boldItalicStart = pos;

                while (
                    pos < sourceLength &&
                    !(
                        source[pos] === '*' &&
                        source[pos + 1] === '*' &&
                        source[pos + 2] === '*' &&
                        source[pos + 3] !== '*'
                    )
                ) {
                    pos++;
                }

                if (pos === sourceLength) {
                    pos = boldItalicStart;
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',

                        value: source.slice(lastTextStart, start),
                    };

                    inlineNode[inlineNode.length] = {
                        type: 'BoldItalic',

                        children: parseInline(
                            source.slice(boldItalicStart, pos),
                        ),
                    };

                    pos += 3;

                    lastTextStart = pos;
                }
            } else if (source[pos] === '*') {
                pos++;

                const boldStart = pos;

                while (
                    pos < sourceLength &&
                    !(source[pos] === '*' && source[pos + 1] === '*')
                ) {
                    pos++;
                }

                if (pos === sourceLength) {
                    pos = boldStart;
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',
                        value: source.slice(lastTextStart, start),
                    };

                    inlineNode[inlineNode.length] = {
                        type: 'Bold',
                        children: parseInline(source.slice(boldStart, pos)),
                    };

                    pos += 2;
                    lastTextStart = pos;
                }
            } else {
                const italicStart = pos;

                while (pos < sourceLength && source[pos] !== '*') {
                    pos++;
                }

                if (pos === sourceLength) {
                    pos = italicStart;
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',

                        value: source.slice(lastTextStart, start),
                    };

                    inlineNode[inlineNode.length] = {
                        type: 'Italic',

                        children: parseInline(source.slice(italicStart, pos)),
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

            while (pos < sourceLength && source[pos] !== '`') {
                pos++;
            }

            if (pos === sourceLength) {
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

    if (lastTextStart < sourceLength) {
        inlineNode[inlineNode.length] = {
            type: 'Text',

            value: source.slice(lastTextStart),
        };
    }

    return inlineNode;
};
