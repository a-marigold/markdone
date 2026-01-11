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

    whitespace: string;

    codeBlock: string;
    fencedCodeBlock: string;

    orderedList: string;
}>;
