/**
 * Global Result<T, E> helper utilities
 *
 * Pattern:
 *  - ok(value)  -> { ok: true, value }
 *  - err(error) -> { ok: false, error }
 *
 * Utilities:
 *  - isOk, isErr
 *  - map, mapError
 *  - unwrapOr
 *
 * Notes:
 *  - Avoids `any` usage.
 *  - Functional style helpers for convenience.
 */

export type Ok<T> = Readonly<{ ok: true; value: T }>
export type Err<E> = Readonly<{ ok: false; error: E }>

export type Result<T, E> = Ok<T> | Err<E>

/**
 * Create a success result.
 */
export const ok = <T, E = never>(value: T): Result<T, E> => ({
  ok: true,
  value,
})

/**
 * Create an error result.
 */
export const err = <T = never, E = string>(error: E): Result<T, E> => ({
  ok: false,
  error,
})

/**
 * Type guard: is the result Ok?
 */
export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.ok === true

/**
 * Type guard: is the result Err?
 */
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r.ok === false

/**
 * Transform the inner value when Result is Ok.
 */
export const map = <T, U, E>(
  r: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => (isOk(r) ? ok<U, E>(fn(r.value)) : err<U, E>(r.error))

/**
 * Transform the error type when Result is Err.
 */
export const mapError = <T, E, F>(
  r: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> => (isErr(r) ? err<T, F>(fn(r.error)) : ok<T, F>(r.value))

/**
 * Unwrap value or return fallback if Err.
 */
export const unwrapOr = <T, E>(r: Result<T, E>, fallback: T): T =>
  isOk(r) ? r.value : fallback
