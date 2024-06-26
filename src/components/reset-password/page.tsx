import Section from "@/components/section/section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/lib/context/auth"
import { Icons } from "@/lib/icons/icons"
import { AppPaths } from "@/lib/routes/paths"
import { useState } from "react"
import { Navigate } from "react-router-dom"


export const ResetPassword = () => {
    const [email, setEmail] = useState("")
    const { user, resetPassword } = useAuthContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [emailSent, setEmailSent] = useState<boolean>(false)

    if (user) {
        return <Navigate to={AppPaths.HOME} />
    }

    const handleResetPassword = (e: React.SyntheticEvent) => {
        e.preventDefault();

        (async () => {
            try {
                setIsLoading(true)
                await resetPassword(email)
                setIsLoading(false)
                setEmailSent(true)
            } catch (error: any) {
                setIsLoading(false)
            }
        })()
    }

    if (emailSent) {
        return <Navigate to={AppPaths.SIGN_IN} />
    }

    return (
        <Section title="Reset password">
            <div className={"grid gap-6"}>
                <form onSubmit={handleResetPassword}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Reset password
                        </Button>
                    </div>
                </form>
            </div>
        </Section>
    )
}
