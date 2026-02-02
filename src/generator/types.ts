/**
 *
 *
 *
 *
 * Type of object with classes of every generated HTML element from markdown
 *
 *
 *
 *
 */

export type MarkdownCSSClasses = Partial<{
    heading: string;

    paragraph: string;

    /**
     * Classname of `<code>` (Inline code).
     *
     * Syntax in markdown - \`some inline code\`
     */
    inlineCode: string;

    /**
     * Classname of `<pre>` in `FencedCodeBlock`
     */
    fencedCodeBlockPre: string;

    /**
     * Classname of '<code>' in `FencedCodeBlock`
     */
    fencedCodeBlockCode: string;

    blockQuote: string;

    unorderedList: string;
    orderedList: string;
    listItem: string;

    bold: string;
    italic: string;
}>;
