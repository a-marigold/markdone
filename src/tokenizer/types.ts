/**
 * Type of every markdown entity
 */

export type Token = {
    type: TokenType;

    value: string;
};

export type TokenType =
    | 'Heading'
    | 'Bold'
    | 'Italic'
    | 'BoldItalic'
    | 'OrderedListItem'
    | 'CodeBlock'
    | 'FencedCodeBlock'
    | 'LineBreak'
    | 'WhiteSpace';
