
//
// If we extended `AttachmentType` to `'media' | 'documents' | 'links'` the code
// above would trigger a compiler error stating that `'links'` has not been
// handled by our `switch` / `case` statement which is useful for code
// maintenance and system evolution.
export const missingCaseError = (x: never): TypeError => new TypeError(`Unhandled case: ${x}`);
