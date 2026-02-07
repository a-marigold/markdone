export type AST = {
    body: (
        | Paragraph
        | FencedCodeBlock
        | Heading
        | UnorderedList
        | OrderedList
        | BlockQuote
    )[];
};

//

// Blocks

type Paragraph = ASTBlockBase<'Paragraph'> & { children: ASTInlineNode[] };

type Heading = ASTBlockBase<'Heading'> & {
    level: HeadingLevel;

    children: ASTInlineNode[];
};

export type UnorderedList = ASTBlockBase<'UnorderedList'> & {
    items: UnorderedListItem[];
};

/**
 * Type of item in `List['items']`
 */
export type UnorderedListItem = {
    type: 'ListItem';

    /**
     *
     * `children` property means an array with content of `ListItem`.
     *
     * @example
     *
     *
     *
     * ```markdown
     * - abc - THIS 'abc' WILL BE IN `children`
     *   - nested - THIS ITEM '- nested' WILL BE IN `items`
     * ```
     *
     */

    children: AST['body'];

    /**
     *
     *
     *
     *
     * `items` property means an array with nested items to `ListItem`
     *
     */

    items: UnorderedList['items'];
};

export type OrderedList = ASTBlockBase<'OrderedList'> & {
    items: OrderedListItem[];
    /**
     *
     * content of `start` attribute of `ol` HTML element.
     *
     * @example
     * ```html
     * <ol start=""> <!-- `start` attribute is the `startNumber` -->
     * </ol>
     * ```
     *
     */

    startNumber: string;
};
export type OrderedListItem = {
    type: 'OrderedListItem';

    children: AST['body'];
};

// TODO: delete `type` property from Ordered and Unordered Lists

type FencedCodeBlock = ASTBlockBase<'FencedCodeBlock'> & {
    language: string;

    source: string;
};

type BlockQuote = ASTBlockBase<'BlockQuote'> & {
    children: AST['body'];
};

export type ASTBlockType =
    | 'Paragraph'
    | 'Heading'
    | 'UnorderedList'
    | 'OrderedList'
    | 'FencedCodeBlock'
    | 'BlockQuote';

/**
 *
 * The basic type of AST
 *
 *
 *
 */
type ASTBlockBase<T extends ASTBlockType> = { type: T };

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Inline

export type ASTInlineNode =
    | Text
    | Bold
    | Italic
    | BoldItalic
    | InlineCode
    | Link
    | Image;

type Text = ASTInlineNodeBase<'Text'> & { value: string };

type Bold = ASTInlineNodeBase<'Bold'> & { children: ASTInlineNode[] };

type Italic = ASTInlineNodeBase<'Italic'> & { children: ASTInlineNode[] };

type BoldItalic = ASTInlineNodeBase<'BoldItalic'> & {
    children: ASTInlineNode[];
};
type InlineCode = ASTInlineNodeBase<'InlineCode'> & { value: string };

type Link = ASTInlineNodeBase<'Link'> & {
    children: ASTInlineNode[];

    url: string;
};

type Image = ASTInlineNodeBase<'Image'> & { altText: string; url: string };

export type ASTInlineNodeType =
    | 'Text'
    | 'Bold'
    | 'Italic'
    | 'BoldItalic'
    | 'InlineCode'
    | 'Link'
    | 'Image';

/**
 * The basic type of `ASTInlineNode`.
 *
 * `T` - `ASTInlineNodeType` (Text, Bold, Italic).
 *
 * `V` - Node content. That can be nested `ASTInlineNode` or just `string`.
 */
type ASTInlineNodeBase<T extends ASTInlineNodeType> = { type: T };
