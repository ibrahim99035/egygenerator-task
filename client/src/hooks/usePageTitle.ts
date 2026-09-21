import { useEffect } from 'react';

export const APP_NAME = 'EgyGenerator';

/**
 * Sets the browser tab title for the current page and restores the
 * base title when the component unmounts. Re-runs whenever `title`
 * changes, so pages can pass dynamic values.
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} – ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}