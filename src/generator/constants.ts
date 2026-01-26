// TODO: add docs

import type { MarkdownCSSClasses } from './types';

/**
 * #### Strings with opened HTML tags with opened `class` attribute and their closed versions.
 *
 * @example
 * ```typescript
 * htmlTags.openedSpan; // '<span class="'
 * htmlTags.closedSpan; // '</span>'
 * ```
 *
 *
 *
 *
 *  */
export const htmlTags = {
    openedSpan: '<span class="',
    closedSpan: '</span>',

    openedCode: '<code class="',

    closedCode: '</code>',

    openedPre: '<pre class="',
    closedPre: '</pre>',

    openedEm: '<em class="',
    closedEm: '</em',

    openedStrong: '<strong class="',
    closedStrong: '</strong>',
};
