/**
 * Type of every markdown entity
 */

export type Token = {
    type: TokenType;

    value: string;

    start: number;

    end: number;
};

export type TokenType =
    | 'Heading'
    | 'Paragraph'
    | 'LineBreak'
    | 'Bold'
    | 'Italic';
