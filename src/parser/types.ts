export type AST = {
    program: Program;
};

type Program = ASTNodeBase<'Program'> & {
    body: (Paragraph | FencedCodeBlock | Heading | List | BlockQuote)[];
};

// Blocks

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

type ASTNodeBase<T extends 'Program' | ASTBlockType> = { type: T };

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Inline

export type ASTInlineNode = Text | Bold | Italic | BoldItalic | InlineCode;

type Text = ASTInlineNodeBase<'Text'> & { value: string };

type Bold = ASTInlineNodeBase<'Bold'> & { children: ASTInlineNode[] };

type Italic = ASTInlineNodeBase<'Italic'> & { children: ASTInlineNode[] };

type BoldItalic = ASTInlineNodeBase<'BoldItalic'> & {
    children: ASTInlineNode[];
};
type InlineCode = ASTInlineNodeBase<'InlineCode'> & { value: string };

type ASTInlineNodeType =
    | 'Text'
    | 'Bold'
    | 'Italic'
    | 'BoldItalic'
    | 'InlineCode';

/**
 * The basic type of `ASTInlineNode`.
 *
 * `T` - `ASTInlineNodeType` (Text, Bold, Italic)
 * `V` - Node content. That can be nested `ASTInlineNode` or just `string`
 */
type ASTInlineNodeBase<T extends ASTInlineNodeType> = { type: T };
