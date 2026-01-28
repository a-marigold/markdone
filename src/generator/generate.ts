import type { AST, ASTInlineNode } from '../parser';

import type { MarkdownCSSClasses } from './types';

// TODO: remove the htmlTags constant
/**
 *
 *
 * @param {AST} AST
 * @param {MarkdownCSSClasses} cssClasses
 *
 * @returns
 */
export const generate = (AST: AST, cssClasses: MarkdownCSSClasses): string => {
    let generated = '';
    /**
     *
     * The body of `AST.program`
     */
    const body = AST.body;

    const bodyLength = body.length;

    let pos = 0;

    while (pos < bodyLength) {
        const currentNode = body[pos];

        if (currentNode.type === 'Paragraph') {
            generated +=
                '<p class="' +
                cssClasses.paragraph +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</p>';

            pos++;

            continue;
        }

        if (currentNode.type === 'Heading') {
            generated +=
                '<h' +
                currentNode.level +
                ' class="' +
                cssClasses.heading +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</h' +
                currentNode.level +
                '>';

            pos++;

            continue;
        }
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
                '<strong class="' +
                cssClasses.bold +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</strong>';

            pos++;
            continue;
        }

        if (currentNode.type === 'Italic') {
            generated +=
                '<em class="' +
                cssClasses.italic +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</em>';

            pos++;

            continue;
        }

        if (currentNode.type === 'BoldItalic') {
            generated +=
                '<em class="' +
                cssClasses.italic +
                '">' +
                '<strong class="' +
                cssClasses.bold +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</strong></em>';

            pos++;

            continue;
        }

        if (currentNode.type === 'InlineCode') {
            generated +=
                '<code class=' +
                cssClasses.code +
                '">' +
                currentNode.value +
                '</code>';

            pos++;

            continue;
        }

        pos++;
    }

    return generated;
};
