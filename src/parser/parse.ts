import type { AST, ASTInlineNode, HeadingLevel } from './types';
import { MAX_HEADING_LEVEL } from './constants';

import { checkHasContent, checkStartOfLine } from './utils';

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
 * @param {number} sourceStart Start position of part of `source` to be checked.
 * @param {number} sourceEnd End position of part of `source` to be checked.
 *
 *
 *
 * @returns {AST} AST with markdown nodes from `source`.
 *
 *
 * @examples
 *
 * ```typescript
 * const source = '# heading **bold**';
 * const AST = parse(source, 0, source.length);
 *
 *
 *
 * ```
 *
 *
 *
 */

export const parse = (
    source: string,
    sourceStart: number,
    sourceEnd: number,
): AST => {
    const AST: AST = { body: [] };

    /**
     * The `body` of the `AST`
     *
     *
     */

    const body = AST.body;

    /**
     * Last position of `Paragraph` start.
     *
     *
     * Should be moved every time when the `pos` might be a `Paragraph` start.
     *
     *
     *
     *
     * @example
     *
     * ```typescripts
     *
     * if(source[pos] === '#') {
     *   // ...(heading handling logic)
     *
     *   // the heading ends
     *
     *   lastParagraphStart = end; // move the `lastParagraphStart` because there can be new `Paragraph` after end of heading
     *
     * }
     * ```
     *
     *
     */

    let lastParagraphStart: number = 0;

    let pos: number = sourceStart;

    main: while (pos < sourceEnd) {
        const char = source[pos];

        if (char === '\n' || char === '\r') {
            if (char === '\r') {
                pos++;
            }

            pos++;

            let newParagraphEnd: number = lastParagraphStart;

            let newLineCount: number = 1;

            while (
                pos < sourceEnd &&
                (source[pos] === ' ' ||
                    source[pos] === '\t' ||
                    source[pos] === '\n' ||
                    source[pos] === '\r')
            ) {
                if (source[pos] === '\n') {
                    newLineCount++;
                }
                if (newLineCount === 2) {
                    newParagraphEnd = pos;
                }

                pos++;
            }

            if (newLineCount > 1) {
                if (
                    checkHasContent(source, lastParagraphStart, newParagraphEnd)
                ) {
                    body[body.length] = {
                        type: 'Paragraph',

                        children: parseInline(
                            source,
                            lastParagraphStart,
                            newParagraphEnd,
                        ),
                    };
                }

                lastParagraphStart = pos;
            }
            continue main;
        }

        if (char === '#' && checkStartOfLine(source, sourceStart, pos - 1)) {
            const start = pos;

            pos++;

            let level = 1;

            while (
                pos < sourceEnd &&
                source[pos] === '#' &&
                source[pos] !== ' '
            ) {
                level++;

                pos++;
            }

            if (level <= MAX_HEADING_LEVEL && source[pos] === ' ') {
                pos++;

                const headingStart = pos;

                while (
                    pos < sourceEnd &&
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

            continue main;
        }

        if (
            source[pos] === '`' &&
            source[pos + 1] === '`' &&
            source[pos + 2] === '`' &&
            checkStartOfLine(source, sourceStart, pos - 1)
        ) {
            const paragraphEnd = pos;

            pos += 3;

            const codeStart = pos;

            while (
                pos < sourceEnd &&
                source[pos] !== ' ' &&
                source[pos] !== '\t' &&
                source[pos] !== '\n' &&
                source[pos] !== '\r'
            ) {
                pos++;
            }

            const language = source.slice(codeStart, pos);

            fencedCodeBlock: while (pos < sourceEnd) {
                if (
                    source[pos] === '`' &&
                    source[pos + 1] === '`' &&
                    source[pos + 2] === '`' &&
                    checkStartOfLine(source, sourceStart, pos - 1)
                ) {
                    break fencedCodeBlock;
                }

                pos++;
            }

            const codeEnd = pos;

            pos += 3;

            if (checkHasContent(source, lastParagraphStart, paragraphEnd)) {
                body[body.length] = {
                    type: 'Paragraph',
                    children: parseInline(
                        source,
                        lastParagraphStart,
                        paragraphEnd,
                    ),
                };
            }

            body[body.length] = {
                type: 'FencedCodeBlock',

                language,

                value: source.slice(codeStart, codeEnd),
            };

            lastParagraphStart = pos;

            continue;
        }

        if (char === '>' && checkStartOfLine(source, sourceStart, pos - 1)) {
            let checkPos = pos - 1;
            checkBlockQuote: while (checkPos > sourceStart) {
                const checkChar = source[checkPos];

                if (
                    checkChar !== ' ' &&
                    checkChar !== '\t' &&
                    checkChar !== '\n' &&
                    checkChar !== '\r'
                ) {
                    pos++;

                    continue main;
                }

                if (checkChar === '\n' || checkPos === sourceStart) {
                    break checkBlockQuote;
                }
                checkPos--;
            }

            const start = pos;

            pos++;

            let blockQuoteContent: string = '';

            let lastBlockQuoteStart: number = pos;

            blockQuote: while (pos < sourceEnd) {
                if (source[pos] === '\n' || source[pos] === '\r') {
                    if (source[pos] === '\r') {
                        pos++;
                    }
                    pos++;

                    const blockQuoteEnd = pos;

                    blockQuoteContent += source.slice(
                        lastBlockQuoteStart,

                        blockQuoteEnd,
                    );

                    while (pos < sourceEnd) {
                        let blockQuoteChar = source[pos];

                        if (blockQuoteChar === '>') {
                            pos++;

                            lastBlockQuoteStart = pos;

                            continue blockQuote;
                        }

                        if (
                            blockQuoteChar !== ' ' &&
                            blockQuoteContent !== '\t'
                        ) {
                            break blockQuote;
                        }

                        pos++;
                    }
                }

                pos++;
            }

            if (checkHasContent(source, lastParagraphStart, start)) {
                body[body.length] = {
                    type: 'Paragraph',
                    children: parseInline(source, lastParagraphStart, start),
                };
            }
            body[body.length] = {
                type: 'BlockQuote',
                children: parse(blockQuoteContent, 0, blockQuoteContent.length)
                    .body,
            };

            lastParagraphStart = pos;

            continue main;
        }

        // fallback
        pos++;
    }

    if (lastParagraphStart < sourceEnd) {
        body[body.length] = {
            type: 'Paragraph',

            children: parseInline(source, lastParagraphStart, sourceEnd),
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
