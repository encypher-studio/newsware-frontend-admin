import { AuthContext } from "@/lib/context/auth"
import { useContext, useState } from "react"
import Section from "../section/section"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export default function Auth() {
    const [apiKey, setApiKey] = useState("")
    const { logIn } = useContext(AuthContext)

    const handleLogIn = () => {
        logIn(apiKey)
    }

    return (
        <main className="p-6">
            <Section title="Log in">
                <Input className="mb-6" type="text" placeholder="API key" onChange={(e) => setApiKey(e.target.value)} />
                <Button onClick={handleLogIn}>Log in</Button>
            </Section>
        </main>

    )
}
