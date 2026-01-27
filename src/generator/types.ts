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

    code: string;
    fencedCodeBlock: string;

    orderedList: string;

    bold: string;
    italic: string;
}>;
