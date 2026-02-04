import type { AST, ASTInlineNode, List } from '../parser';

import type { MarkdownCSSClasses, CodeHighlighter } from './types';

/**
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

        if (currentNode.type === 'List') {
            generated += generateUnorderedList(currentNode.items, cssClasses);

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
 * #### Generates markdown `Emphasis` like `Bold`, `Italic` and `InlineCode`.
 *
 * @param inlineNodes Array with `ASTInlineNode`.
 * @param cssClasses Object with classes for HTML nodes.
 *
 * @returns {string} String with generated HTML.
 *
 * @example
 *
 * ```typescript
 *
 * ```
 *
 */
export const generateInline = (
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
                cssClasses.inlineCode +
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

/**
 *
 * #### Generates HTML with `<ul>...</ul>` from `List['items']` AST Node.
 *
 * @param rootItems Entrypoint with `List['items']`.
 * @param cssClasses Object with classes of markdown HTML nodes.
 *
 *
 * @returns {string} String with `<ul>...</ul>` html struct.
 *
 *
 *
 *
 *
 *
 */
export const generateUnorderedList = (
    rootItems: List['items'],
    cssClasses: MarkdownCSSClasses,
): string => {
    let generated: string = '<ul class="' + cssClasses.unorderedList + '">';

    /**
     * Used for better performance because reading `cssClasses` object in items loop is heavy operation
     */
    const openedLi = '<li class="' + cssClasses.listItem + '">';
    const closedLi = '</li>';

    const listLength = rootItems.length;

    let itemIndex = 0;
    while (itemIndex < listLength) {
        const currentItems = rootItems[itemIndex].items;

        generated +=
            openedLi +
            generate(rootItems[itemIndex].children, cssClasses) +
            (currentItems.length
                ? generateUnorderedList(currentItems, cssClasses)
                : '') +
            closedLi;
        itemIndex++;
    }

    generated += '</ul>';

    return generated;
};
