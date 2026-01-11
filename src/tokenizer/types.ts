/**
 * Type of every markdown entity
 */

export type Token = {
    type: TokenType;

    value: string;
};

export type TokenType =
    | 'Heading'
    | 'Paragraph'
    | 'Bold'
    | 'Italic'
    | 'BoldItalic'
    | 'LineBreak'
    | 'WhiteSpace';
