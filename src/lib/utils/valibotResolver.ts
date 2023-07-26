import { toNestError, validateFieldsNatively } from "@hookform/resolvers";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  ResolverOptions,
  ResolverResult,
} from "react-hook-form";
import * as v from "valibot";

export type Resolver = <T extends v.BaseSchema | v.BaseSchemaAsync>(
  schema: T,
  factoryOptions?: {
    /**
     * Use this option to preprocess the values before they are passed to the
     * validation schema.
     * @default undefined
     */
    preProcess?: (values: { [K in keyof v.Input<T>]: unknown }) =>
      | unknown
      | Promise<unknown>;
    /**
     * Return the raw input values rather than the parsed values.
     * @default false
     */
    raw?: boolean;
  }
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>
) => Promise<ResolverResult<TFieldValues>>;

const getIssuePath = (issue: v.Issue) => {
  return issue.path?.map((i) => i.key).join(".");
};

export const parseValiError = (
  error: v.ValiError
): Record<string, FieldError> => {
  const errors: Record<string, FieldError> = {};

  for (const issue of error.issues) {
    const path = getIssuePath(issue);

    if (path) {
      errors[path] = {
        message: issue.message,
        type: issue.reason,
      };
    }
  }

  return errors;
};

const valibotResolver: Resolver = (schema, resolverOptions) => {
  return async (values, _, options) => {
    try {
      const data = schema.async
        ? await v.parseAsync(schema, values)
        : v.parse(schema, values);

      options.shouldUseNativeValidation && validateFieldsNatively({}, options);

      return {
        errors: {} as FieldErrors,
        values: resolverOptions?.raw == true ? values : data,
      };
    } catch (error) {
      if (error instanceof v.ValiError) {
        return {
          errors: toNestError(parseValiError(error), options),
          values: {},
        };
      } else {
        throw error;
      }
    }
  };
};

export default valibotResolver;
