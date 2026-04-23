import { useState } from "react";
import { signUp } from "../utils/auth-client";
import { useNavigate } from "react-router";
import { useForm } from '@tanstack/react-form'
import z from "zod";

export default function SignUpPage() {
    const navigate = useNavigate()
    // const [email, setEmail] = useState("")
    // const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")
    // const [confirmPassword, setConfirmPassword] = useState("")

    const signUpSchema = z.object({
        email: z.email(),
        username: z.string(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

    const signUpForm = useForm({
        defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
        validators: { onSubmit: signUpSchema },
        onSubmit: async ({ value }) => {
            await signUp.email({
                email: value.email,
                password: value.password,
                name: "New User",
            }, {
                onRequest: () => {
                    // Show loading spinner
                },
                onSuccess: () => {
                    navigate('/home', { replace: true })
                },
                onError: (ctx) => {
                    alert(ctx.error.message)
                }
            })
        },
    })

    const FieldInfo = ({ field }) => {
        return (
            <>
                {field.state.meta.touchedErrors ? (
                    <small className="text-red-400 font-mono text-xs italic">
                        {field.state.meta.touchedErrors}
                    </small>
                ) : null}
            </>
        );
    };

    return (
        <div>
            <signUpForm.Field
                name="email"
                children={(field) => {
                    <>
                        <input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                    </>
                }}
            >
            </signUpForm.Field>
            <signUpForm.Field
                name="username"
                children={(field) => {
                    <>
                        <input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                    </>
                }}
            >
            </signUpForm.Field>
            <signUpForm.Field
                name="password"
                children={(field) => {
                    <>
                        <input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                    </>
                }}
            >
            </signUpForm.Field>
            <signUpForm.Field
                name="confirmPassword"
                children={(field) => {
                    <>
                        <input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                    </>
                }}
            >
            </signUpForm.Field>
            <button onClick={handleSignUp}>Sign Up Now</button>
        </div>
    );
}