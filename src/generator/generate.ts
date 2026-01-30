import type { AST, ASTInlineNode } from '../parser';

import type { MarkdownCSSClasses } from './types';

/**
 * #### Generates HTML from provided `AST` with markdown nodes
 *
 *
 * @param {AST['body']} ASTBody Abstract Syntax Tree body (`AST['body']`) with markdown nodes
 *
 * @param {MarkdownCSSClasses} cssClasses object with CSS classes for markdown nodes
 *
 *
 *
 *
 *
 * @returns {string}
 *
 * @example
 * ```typescript
 * const ast = parse('### heading 3');
 * const html = generate(ast.body, { heading: 'heading-classname' });
 * ```
 * Real output:
 * ```html
 * <h3 class='heading-classname'>heading 3</h3>
 * ```
 *
 * @example
 * ```typescript
 * const markdownContainer = document.querySelector('.markdown-container');
 *
 * const input = document.querySelector('input');
 * input.addEventListener('input', (event) => {
 *   markdownContainer.setHTMLUnsafe(generate(parse(event.target.value).body, {}));
 * })
 *
 */

export const generate = (
    ASTBody: AST['body'],
    cssClasses: MarkdownCSSClasses,
): string => {
    let generated = '';

    const bodyLength = ASTBody.length;

    let pos = 0;

    while (pos < bodyLength) {
        const currentNode = ASTBody[pos];

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

        if (currentNode.type === 'BlockQuote') {
            generated +=
                '<blockquote class="' +
                cssClasses.blockQuote +
                '">' +
                generate(currentNode.children, cssClasses) +
                '</blockquote>';

            continue;
        }

        // fallback
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
                '<code class="' +
                cssClasses.code +
                '">' +
                currentNode.value +
                '</code>';

            pos++;

            continue;
        }

        // fallback
        pos++;
    }

    return generated;
};
