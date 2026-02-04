import type { MarkdownCSSClasses, CodeHighlighter } from '../generator/types';

import { parse } from '../parser';
import { generate } from '../generator';

/**
 * #### Generates HTML from provided markdown string.
 *
 * @param {string} source String with MarkDown.
 * @param {MarkdownCSSClasses | undefined} cssClasses Object with CSS classes for MarkDown HTML elements.
 *
 * @returns {string} Generated HTML from provided markdown string.
 *
 *
 *
 * @example
 *
 * ```typescript
 * generateHtml('### heading 3 **bold**', { heading: 'heading-classname', bold: 'bold-class' });
 * ```
 *
 * Output:
 *
 * ```html
 * <h3 class="heading-classname">heading 3 <strong class="bold-class">bold</strong>
 * ```
 *
 * @example
 *
 * ```typescript
 * const markdownContainer = document.querySelector('.markdown-container');
 *
 * const input = document.querySelector('input');
 * input.addEventListener('input', (event) => {
 *   markdownContainer.setHTMLUnsafe(generateHTMl(event.target.value, {}));
 * })
 * ```
 *
 *
 *
 */

export const generateHtml = (
    source: string,

    cssClasses?: MarkdownCSSClasses,

    codeHighlighter?: CodeHighlighter,
): string => {
    return generate(
        parse(source, 0, source.length).body,

        cssClasses || {},

        codeHighlighter,
    );
};
