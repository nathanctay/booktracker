import { useState } from "react";
import { signIn } from "../utils/auth-client";
import { useNavigate } from "react-router";
import { useForm } from '@tanstack/react-form'
import z from "zod";

export default function SignInPage() {
    const navigate = useNavigate()
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    const signInSchema = z.object({
        username: z.union([z.email(), z.string()]),
        password: z.string().min(8, "Password must be at least 8 characters"),
    });

    type SignInValues = z.infer<typeof signInSchema>;

    const callbacks = {
        onRequest: () => setPending(true),
        onSuccess: () => navigate('/home', { replace: true }),
        onError: (ctx) => {
            setError(ctx.error.message)
            setPending(false)
        }
    }

    const signInForm = useForm({
        defaultValues: {
            username: '',
            password: '',
        } as SignInValues,
        validators: {
            onSubmit: signInSchema
        },
        onSubmit: async ({ value }) => {
            const isEmail = z.email().safeParse(value.username).success
            if (isEmail) {
                await signIn.email({
                    password: value.password,
                    email: value.username
                }, callbacks)
            } else {
                await signIn.username({
                    password: value.password,
                    username: value.username
                }, callbacks)
            }
        },
    })

    const FieldError = ({ field }) => {
        return (
            <>
                {!field.state.meta.isValid && (
                    <small className="text-red-400 text-sm">
                        {field.state.meta.errors[0]?.message}
                    </small>
                )}
            </>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="auth-card">
                <div className="card-header">
                    <p className="text-3xl"> Welcome back!</p>
                </div>
                <form
                    className="auth-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        signInForm.handleSubmit()
                    }}>
                    <signInForm.Field
                        name="username"
                        children={(field) => (
                            <div>
                                <label>Username</label>
                                <input
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldError field={field} />
                            </div>
                        )}
                    />
                    <signInForm.Field
                        name="password"
                        children={(field) => (
                            <div>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldError field={field} />
                            </div>
                        )}
                    />
                    {error && (
                        <p className="text-red-400">
                            {error}
                        </p>
                    )}
                    <button disabled={pending} type="submit" className="bg-[var(--primary)] rounded-lg py-1 mt-4 text-white cursor-pointer shadow-md hover:shadow-none">Sign In</button>
                    <p className="text-center">Don't have an account yet? <a href="/signup" className="underline">Sign up</a></p>
                </form>
            </div>

        </div >
    );
}