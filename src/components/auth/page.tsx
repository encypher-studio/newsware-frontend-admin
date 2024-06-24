import { useAuthContext } from "@/lib/context/auth"
import { Icons } from "@/lib/icons/icons"
import { useState } from "react"
import Section from "../section/section"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { signIn: logIn } = useAuthContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleLogIn = (e: React.SyntheticEvent) => {
        e.preventDefault();

        (async () => {
            setIsLoading(true)
            await logIn({
                type: "email",
                email,
                password
            })
            setIsLoading(false)
        })()
    }

    const handleGoogleLogIn = (e: React.SyntheticEvent) => {
        e.preventDefault();

        (async () => {
            setIsLoading(true)
            await logIn({
                type: "google"
            })
            setIsLoading(false)
        })()
    }

    return (
        <Section title="Log in">
            <div className={"grid gap-6"}>
                <form onSubmit={handleLogIn}>
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
                        <div className="grid gap-1">
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect="off"
                                disabled={isLoading}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign In with Email
                        </Button>
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleLogIn}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}{" "}
                    Google
                </Button>
            </div>
        </Section>
    )
}
