import type { AST, ASTInlineNode, UnorderedList } from '../parser';

import type { MarkdownCSSClasses, CodeHighlighter } from './types';

/**
 *
 * #### Generates HTML from provided `AST` with markdown nodes.
 *
 *
 * @param {AST['body']} astBody Abstract Syntax Tree body (`AST['body']`) with markdown nodes.
 *
 * @param {MarkdownCSSClasses} cssClasses Object with CSS classes for markdown nodes.
 *
 *
 *
 *
 * @param {CodeHighlighter} codeHighlighter Function that receives `source` (string with source code) and `language?` (string with specified language). Should return completed string with HTML.
 *
 *
 * @returns {string} String with generated HTML
 *
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
 *
 *
 */

export const generate = (
    astBody: AST['body'],

    cssClasses: MarkdownCSSClasses,

    codeHighlighter?: CodeHighlighter,
): string => {
    let generated = '';

    const bodyLength = astBody.length;

    let bodyPos = 0;

    while (bodyPos < bodyLength) {
        const currentNode = astBody[bodyPos];

        if (currentNode.type === 'Paragraph') {
            generated +=
                '<p class="' +
                cssClasses.paragraph +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</p>';

            bodyPos++;

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

            bodyPos++;

            continue;
        }

        if (currentNode.type === 'FencedCodeBlock') {
            generated +=
                '<pre class="' +
                cssClasses.fencedCodeBlockPre +
                '"><code class="' +
                cssClasses.fencedCodeBlockCode +
                '">' +
                (codeHighlighter
                    ? codeHighlighter(currentNode.source, currentNode.language)
                    : currentNode.source) +
                '</code></pre>';

            bodyPos++;

            continue;
        }

        if (currentNode.type === 'UnorderedList') {
            generated += '<ul class="' + cssClasses.unorderedList + '">';

            const openedLi = '<li class="' + cssClasses.listItem + '">';
            const closedLi = '</li>';

            const items = currentNode.items;
            const itemsLength = items.length;

            let itemIndex = 0;
            while (itemIndex < itemsLength) {
                generated +=
                    openedLi +
                    generate(items[itemIndex].children, cssClasses) +
                    closedLi;

                itemIndex++;
            }

            generated += '</ul>';

            bodyPos++;
            continue;
        }

        if (currentNode.type === 'BlockQuote') {
            generated +=
                '<blockquote class="' +
                cssClasses.blockQuote +
                '">' +
                generate(currentNode.children, cssClasses) +
                '</blockquote>';

            bodyPos++;

            continue;
        }

        // fallback

        bodyPos++;
    }

    return generated;
};

/**
 *
 *
 *
 * #### Generates markdown `Emphasis` like `Bold`, `Italic` and `InlineCode`.
 *
 *
 * @param inlineNodes Array with `ASTInlineNode`.
 *
 * @param cssClasses Object with classes for HTML nodes.
 *
 * @returns {string} String with generated HTML.
 *
 * @example
 *
 *
 *
 * ```typescript
 * const inlineNodes = parseInline('**`cde`**');
 *
 * generateInline(inlineNodes, { bold: 'bold-class', inlineCode: 'code' });
 * ```
 *
 *
 * Output:
 *
 * ```html
 * <strong class="bold-class">
 *   <code class="code">cde</code>
 * </strong>
 * ```
 *
 *
 *
 *
 *
 *
 *
 *
 */
export const generateInline = (
    inlineNodes: ASTInlineNode[],

    cssClasses: MarkdownCSSClasses,
): string => {
    let generated = '';

    const nodesLength = inlineNodes.length;

    let nodePos = 0;

    while (nodePos < nodesLength) {
        const currentNode = inlineNodes[nodePos];

        if (currentNode.type === 'Text') {
            generated += currentNode.value;

            nodePos++;

            continue;
        }

        if (currentNode.type === 'Bold') {
            generated +=
                '<strong class="' +
                cssClasses.bold +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</strong>';

            nodePos++;

            continue;
        }

        if (currentNode.type === 'Italic') {
            generated +=
                '<em class="' +
                cssClasses.italic +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</em>';

            nodePos++;

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

            nodePos++;

            continue;
        }

        if (currentNode.type === 'InlineCode') {
            generated +=
                '<code class="' +
                cssClasses.inlineCode +
                '">' +
                currentNode.value +
                '</code>';

            nodePos++;

            continue;
        }

        if (currentNode.type === 'Link') {
            generated +=
                '<a href="' +
                currentNode.url +
                '" class="' +
                cssClasses.link +
                '">' +
                generateInline(currentNode.children, cssClasses) +
                '</a>';

            nodePos++;

            continue;
        }

        if (currentNode.type === 'Image') {
            generated +=
                '<img src="' +
                currentNode.url +
                '" class="' +
                cssClasses.image +
                '"/>';

            nodePos++;

            continue;
        }

        // fallback

        nodePos++;
    }

    return generated;
};
