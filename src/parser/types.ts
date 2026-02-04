export type AST = {
    body: (Paragraph | FencedCodeBlock | Heading | List | BlockQuote)[];
};

//
// Blocks

type Paragraph = ASTBlockBase<'Paragraph'> & { children: ASTInlineNode[] };

type Heading = ASTBlockBase<'Heading'> & {
    level: HeadingLevel;

    children: ASTInlineNode[];
};

// TODO: add docs for ListItem
export type List = ASTBlockBase<'List'> & { items: ListItem[] };
/**
 * Type of item in `List['items']`
 */
export type ListItem = ASTBlockBase<'ListItem'> & {
    /**
     * `children` property means an array with content of `ListItem`.
     * @example
     * ```markdown
     * - abc - THIS 'abc' WILL BE IN `children`
     *   - nested - THIS ITEM '- nested' WILL BE IN `items`
     * ```
     */
    children: AST['body'];
    /**
     * `items` property means an array with nested items to `ListItem`
     */
    items: List['items'];
};

type FencedCodeBlock = ASTBlockBase<'FencedCodeBlock'> & {
    language: string;

    value: string;
};

type BlockQuote = ASTBlockBase<'BlockQuote'> & {
    children: AST['body'];
};

type ASTBlockType =
    | 'Paragraph'
    | 'Heading'
    | 'List'
    | 'ListItem'
    | 'FencedCodeBlock'
    | 'BlockQuote';

/**
 *
 * The basic type of AST
 */
type ASTBlockBase<T extends ASTBlockType> = { type: T };

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
