/** The admin's category selection controls both the badge and filtering.
 * Fall back to the legacy field for older content without a tag.
 */
export function getEventCategory(event: { tag?: string; category?: string }): string {
  return (event.tag?.trim() || event.category?.trim() || '').toLowerCase();
}
