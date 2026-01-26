import type { AST, ASTInlineNode } from '../parser';

import type { MarkdownCSSClasses } from './types';
import { htmlTags } from './constants';

/**
 *
 * @param tokens
 * @param cssClasses
 *
 * @returns
 */
export const generate = (AST: AST, cssClasses: MarkdownCSSClasses): string => {
    let generated = '';
    /**
     * The body of AST.program
     */
    const body = AST.program.body;

    const bodyLength = body.length;

    let pos = 0;
    while (pos < bodyLength) {
        pos++;
    }

    return generated;
};

const generateInline = (
    inlineNodes: ASTInlineNode[],

    cssClasses: MarkdownCSSClasses,
): string => {
    let generated = '';

    const nodesLength = inlineNodes.length;

    let pos = 0;
    while (pos < nodesLength) {
        const currentNode = inlineNodes[pos];

        if (currentNode.type === 'Text') {
            generated += currentNode.value;

            pos++;

            continue;
        }

        if (currentNode.type === 'Bold') {
            generated +=
                htmlTags.openedStrong +
                cssClasses.bold +
                '">' +
                currentNode.value +
                htmlTags.closedStrong;

            pos++;
            continue;
        }

        if (currentNode.type === 'Italic') {
            generated +=
                htmlTags.openedEm +
                cssClasses.italic +
                '">' +
                currentNode.value +
                htmlTags.closedEm;

            pos++;

            continue;
        }

        if (currentNode.type === 'BoldItalic') {
            generated +=
                htmlTags.openedEm +
                cssClasses.italic +
                '">' +
                htmlTags.openedStrong +
                cssClasses.bold +
                '">' +
                currentNode.value +
                htmlTags.closedStrong +
                htmlTags.closedEm;

            pos++;

            continue;
        }

        if (currentNode.type === 'InlineCode') {
            generated +=
                htmlTags.openedCode +
                cssClasses.code +
                '">' +
                currentNode.value +
                htmlTags.closedCode;

            pos++;

            continue;
        }

        pos++;
    }

    return generated;
};
