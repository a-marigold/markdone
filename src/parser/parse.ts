import type { AST, ASTInlineNode, HeadingLevel } from './types';
import { MAX_HEADING_LEVEL } from './constants';

export const parse = (source: string): AST => {
    const AST: AST = { program: { type: 'Program', body: [] } };

    const programBody = AST.program.body;

    const sourceLength = source.length;

    let pos = 0;

    while (pos < sourceLength) {
        if (source[pos] === '\n' || source[pos] === '\r') {
        }

        if (source[pos] === '#') {
            const start = pos;

            pos++;

            let level = 0;

            while (pos < sourceLength && source[pos] !== ' ') {
                level++;

                pos++;
            }
            pos++;

            if (level > MAX_HEADING_LEVEL) {
                while (
                    pos < sourceLength &&
                    source[pos] !== '\n' &&
                    source[pos] !== '\r'
                ) {
                    pos++;
                }

                const paragraphEnd = pos;

                if (source[pos] === '\r') {
                    pos++;
                }
                pos++;

                programBody[programBody.length] = {
                    type: 'Paragraph',

                    children: parseInline(source.slice(start, paragraphEnd)),
                };
            } else {
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

                programBody[programBody.length] = {
                    type: 'Heading',
                    level: level as HeadingLevel,
                    children: parseInline(
                        source.slice(headingStart, headingEnd),
                    ),
                };
            }

            pos++;

            continue;
        }

        pos++;
    }

    return AST;
};

const parseInline = (source: string): ASTInlineNode[] => {
    const inlineNode: ASTInlineNode[] = [];

    const sourceLength = source.length;

    let currentText = '';

    let pos = 0;
    while (pos < sourceLength) {
        const char = source[pos];

        if (char === '*') {
            pos++;

            if (source[pos] === '*' && source[pos + 1] === '*') {
                pos++;

                const boldItalicStart = pos;

                while (
                    pos < sourceLength &&
                    !(
                        source[pos] === '*' &&
                        source[pos + 1] === '*' &&
                        source[pos + 2] === '*'
                    )
                ) {
                    pos++;
                }

                if (pos === sourceLength) {
                    pos = boldItalicStart;
                    currentText += '***';
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'BoldItalic',
                        value: source.slice(boldItalicStart, pos),
                    };

                    pos += 3;
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

                    currentText += '**';
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',
                        value: currentText,
                    };

                    currentText = '';

                    inlineNode[inlineNode.length] = {
                        type: 'Bold',
                        value: source.slice(boldStart, pos),
                    };

                    pos += 2;
                }
            } else {
                const italicStart = pos;

                while (pos < sourceLength && source[pos] !== '*') {
                    pos++;
                }

                if (pos === sourceLength) {
                    pos = italicStart;
                    currentText += '*';
                } else {
                    inlineNode[inlineNode.length] = {
                        type: 'Text',
                        value: currentText,
                    };
                    currentText = '';
                    inlineNode[inlineNode.length] = {
                        type: 'Italic',
                        value: source.slice(italicStart, pos),
                    };
                    pos++;
                }
            }

            continue;
        }

        if (char === '`') {
            pos++;

            const codeStart = pos;

            while (pos < sourceLength && source[pos] !== '`') {
                pos++;
            }

            if (pos === sourceLength) {
                pos = codeStart;
                currentText += '`';
            } else {
                inlineNode[inlineNode.length] = {
                    type: 'Text',
                    value: currentText,
                };

                currentText = '';

                inlineNode[inlineNode.length] = {
                    type: 'InlineCode',
                    value: source.slice(codeStart, pos),
                };

                pos++;
            }

            continue;
        }

        currentText += source[pos];

        pos++;

        continue;
    }

    return inlineNode;
};
