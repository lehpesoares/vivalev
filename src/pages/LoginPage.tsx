import React, { useState } from 'react'
import { authClient } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

interface LoginPageProps {
  onNavigateToRegister: () => void
  onSuccess: () => void
}

export function LoginPage({ onNavigateToRegister, onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, preencha o email e a senha.')
      return
    }

    try {
      setIsLoading(true)
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (res.error) {
        if (
          res.error.message?.toLowerCase().includes('invalid') ||
          res.error.message?.toLowerCase().includes('credential') ||
          res.error.status === 401
        ) {
          setErrorMessage('Email ou senha incorretos. Por favor, verifique os dados.')
        } else {
          setErrorMessage(
            res.error.message ||
              'Não foi possível realizar o login. Verifique suas credenciais e tente novamente.'
          )
        }
        setIsLoading(false)
        return
      }

      onSuccess()
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          'Ocorreu um erro inesperado ao conectar com o servidor. Tente novamente mais tarde.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50/60 via-stone-50 to-amber-50/40">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="lg" />
        </div>

        <Card className="border-stone-200/90 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-stone-900 font-serif">
              Acesse sua conta
            </CardTitle>
            <CardDescription className="text-stone-600">
              Gerencie seus pacientes e planos alimentares com segurança
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                  <div className="leading-tight">{errorMessage}</div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nutricionista@exemplo.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha secreta"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium h-11 text-base shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-stone-600 pt-1">
                Não tem conta?{' '}
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Cadastre-se
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-8 text-center text-xs text-stone-500">
          VivaLev &copy; {new Date().getFullYear()} — Plataforma de Gestão Nutricional
        </p>
      </div>
    </div>
  )
}

