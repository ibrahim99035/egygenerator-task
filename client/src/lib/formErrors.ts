import type { FieldErrors } from 'react-hook-form';
import toast from 'react-hot-toast';

/**
 * Collects all validation messages from react-hook-form errors and
 * shows them in a single error toast (used as handleSubmit's onInvalid
 * callback, alongside the inline per-field messages).
 */
export function showValidationToasts<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
): void {
  const messages = Object.values(errors)
    .map((error) =>
      error && 'message' in error ? (error.message as string) : undefined,
    )
    .filter((message): message is string => Boolean(message));

  if (messages.length > 0) {
    toast.error(messages.join(' • '));
  }
}