"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import valibotResolver from "@/lib/utils/valibotResolver";

import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

/**
 * React Hook Form sends an empty string for empty inputs, this clashes with
 * length and optional validators. This function preprocesses empty strings to
 * undefined
 */
const preprocess = (values: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ])
  );
};

const formSchema = v.object({
  name: v.optional(
    v.string([
      v.minLength(2, "Name must be at least 2 characters."),
      v.maxLength(50, "Name must be less than 50 characters."),
    ])
  ),
  username: v.string([
    v.minLength(2, "Username must be at least 2 characters."),
  ]),
  email: v.string([v.email("Please enter a valid email address.")]),
  password: v.string([
    v.minLength(8, "Password must be at least 8 characters."),
    v.custom(
      (value) => value.match(/[a-z]/) !== null,
      "Password must contain at least one lowercase letter."
    ),
    v.custom(
      (value) => !value.match(/[A-Z]/) !== null,
      "Password must contain at least one uppercase letter."
    ),
    v.custom(
      (value) => value.match(/[0-9]/) !== null,
      "Password must contain at least one number."
    ),
    v.custom(
      (value) => !value.match(/[^a-zA-Z0-9]/),
      "Password must contain at least one special character."
    ),
  ]),
});

type FormValues = v.Output<typeof formSchema>;

function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: valibotResolver(formSchema, {
      preProcess: preprocess,
    }),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    shouldUseNativeValidation: false,
  });

  const { errors: formErrors } = useFormState({ control: form.control });
  const hasErrors = Object.keys(formErrors).length > 0;

  const { toast } = useToast();
  const [submittedValues, setSubmittedValues] = useState<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setSubmittedValues(values);
    toast({
      title: "Submit successful",
      variant: "success",
    });
  };

  const onSubmitError: SubmitErrorHandler<FormValues> = () => {
    toast({
      title: "Can't Submit Form",
      description: "Please check the form for errors.",
      variant: "destructive",
    });
  };

  return (
    <div>
      <div className="not-prose">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
            className="space-y-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Example Form</CardTitle>
                <CardDescription>
                  This is an example for a simple signup form. It does not
                  actually do anything. It just logs the values to the console.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Luca Schultz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="lucaschultz" {...field} />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="lucaschultz@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  disabled={hasErrors}
                  variant={hasErrors ? "destructive" : "default"}
                  className="w-full"
                  type="submit"
                >
                  Submit
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
      {submittedValues && (
        <>
          <p>These values where submitted:</p>
          <pre>{JSON.stringify(submittedValues, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default ExampleForm;
