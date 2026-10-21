const MAX_BUILD_PAGE_PATH_LENGTH: number = 256;
const BUILD_PAGE_PATH_PATTERN: RegExp = /^\/(?:[A-Za-z0-9][A-Za-z0-9_-]*(?:\/[A-Za-z0-9][A-Za-z0-9_-]*)*\/?)?$/;

/**
 * Mirrors the Builder's build-page path grammar without importing a runtime
 * dependency into generated customer apps. API targets are deliberately
 * narrower because they are application endpoints, not customer pages.
 * Shared by the preview click intercept and the publish link rewrite so a
 * target one side declines can never be rewritten by the other.
 */
export function isBuildablePagePath(path: string): boolean {
  return path.length > 0 &&
    path.length <= MAX_BUILD_PAGE_PATH_LENGTH &&
    BUILD_PAGE_PATH_PATTERN.test(path) &&
    path !== '/api' &&
    !path.startsWith('/api/');
}
