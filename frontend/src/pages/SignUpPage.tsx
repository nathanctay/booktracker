import { useState } from "react";
import { signUp } from "../utils/auth-client";
import { useNavigate } from "react-router";
import { useForm } from '@tanstack/react-form'
import z from "zod";

export default function SignUpPage() {
    const navigate = useNavigate()
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    const signUpSchema = z.object({
        email: z.email("Invalid Email Address"),
        firstName: z.string(),
        lastName: z.string(),
        username: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

    type SignUpValues = z.infer<typeof signUpSchema>;

    const signUpForm = useForm({
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: ''
        } as SignUpValues,
        // validatorAdapter: zodValidator,
        validators: {
            onSubmit: signUpSchema
        },
        onSubmit: async ({ value }) => {
            await signUp.email({
                email: value.email,
                name: `${value.firstName} ${value.lastName}`,
                password: value.password,
                username: value.username
            }, {
                onRequest: () => {
                    // Show loading spinner
                    setPending(true)
                },
                onSuccess: () => {
                    navigate('/home', { replace: true })
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                    setPending(false)
                }
            })
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
                    <p className="text-3xl"> Welcome to BookNook</p>
                </div>
                <form
                    className="auth-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        signUpForm.handleSubmit()
                    }}>
                    <signUpForm.Field
                        name="email"
                        children={(field) => (
                            <div>
                                <label>Email</label>
                                <input
                                    id={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldError field={field} />
                            </div>
                        )}
                    />
                    <div className="flex flex-row!">
                        <signUpForm.Field
                            name="firstName"
                            children={(field) => (
                                <div className="w-1/2 pr-1">
                                    <label>First Name</label>
                                    <input
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError field={field} />
                                </div>
                            )}
                        />
                        <signUpForm.Field
                            name="lastName"
                            children={(field) => (
                                <div className="w-1/2 pl-1">
                                    <label>Last Name</label>
                                    <input
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError field={field} />
                                </div>
                            )}
                        />
                    </div>
                    <signUpForm.Field
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
                    <signUpForm.Field
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
                    <signUpForm.Field
                        name="confirmPassword"
                        validators={{
                            onChange: ({ value, fieldApi }) => {
                                const password = fieldApi.form.getFieldValue('password')
                                if (value && value !== password) return { message: 'Passwords do not match' }
                                return undefined
                            }
                        }}
                        children={(field) => (
                            <div>
                                <label>Confirm Password</label>
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
                    <button disabled={pending} type="submit" className="bg-[var(--primary)] rounded-lg py-1 mt-4 text-white cursor-pointer shadow-md hover:shadow-none">Sign Up Now</button>
                    <p className="text-center">Already have an account? <a href="/login" className="underline">Sign in</a></p>
                </form>
            </div>

        </div >
    );
}