import { useState } from "react"
import axiosClient from "@/api/axiosClient"
import { useNavigate } from "react-router-dom"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useQueryClient } from "@tanstack/react-query"

const Login = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axiosClient.post("/auth/login", {
        email,
        password
      })

      // IMPORTANT: refresh auth state via React Query
      await queryClient.invalidateQueries({ queryKey: ["auth"] })
      await queryClient.refetchQueries({ queryKey: ["auth"] })

      navigate("/dashboard")
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit">
          Login
        </Button>
      </form>
    </div>
  )
}

export default Login