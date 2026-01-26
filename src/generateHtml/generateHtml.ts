import type { MarkdownCSSClasses } from '../generator/types';

import { parse } from '../parser';
import { generate } from '../generator';

export const generateHtml = (
    source: string,
    cssClasses: MarkdownCSSClasses,
) => {
    return generate(parse(source), cssClasses);
};
