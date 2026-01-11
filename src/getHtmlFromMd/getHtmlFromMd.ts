import type { MarkdownCSSClasses } from '../generator/types';

import { tokenize } from '../tokenizer';
import { generate } from '../generator';

export const getHtmlFromMd = (
    source: string,
    cssClasses: MarkdownCSSClasses
) => {
    return generate(tokenize(source), cssClasses);
};
