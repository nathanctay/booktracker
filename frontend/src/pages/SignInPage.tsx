import { useNavigate } from "react-router"
import { signIn } from "../utils/auth-client"
import { useState } from "react"



function SignInPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignIn = async () => {
        const { data, error } = await signIn.email({
            email,
            password,
            callbackURL: "/home",
            /**
             * remember the user session after the browser is closed. 
             * @default true
             */
            rememberMe: false
        }, {
            nRequest: () => {
                // Show loading spinner
            },
            onSuccess: () => {
                navigate('/home', { replace: true })
            },
            onError: (ctx) => {
                alert(ctx.error.message)
            }
        })
    }
    return (
        <div>SignInPage</div>
    )
}
export default SignInPage