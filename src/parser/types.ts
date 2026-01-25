export type AST = {
    program: Program;
};

export type ASTInlineNode = {
    type: ASTInlineNodeType;
    value: string;
};

type Program = ASTNodeBase<'Program'> & {
    body: (Paragraph | FencedCodeBlock | Heading | List | BlockQuote)[];
};

type Paragraph = ASTNodeBase<'Paragraph'> & { children: ASTInlineNode[] };

type Heading = ASTNodeBase<'Heading'> & {
    level: HeadingLevel;
    children: ASTInlineNode[];
};

type List = ASTNodeBase<'List'> & { items: ListItem[] };
type ListItem = ASTNodeBase<'ListItem'> & {
    children: (List | ASTInlineNode)[];
};

type FencedCodeBlock = ASTNodeBase<'FencedCodeBlock'> & {
    language: string;
    value: string;
};

type BlockQuote = ASTNodeBase<'BlockQuote'> & {
    children: ASTInlineNode;
};

type ASTBlockType =
    | 'Paragraph'
    | 'Heading'
    | 'List'
    | 'ListItem'
    | 'FencedCodeBlock'
    | 'BlockQuote';

type ASTInlineNodeType =
    | 'Bold'
    | 'Italic'
    | 'BoldItalic'
    | 'Text'
    | 'InlineCode';

type ASTNodeBase<T extends 'Program' | ASTBlockType> = { type: T };

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
