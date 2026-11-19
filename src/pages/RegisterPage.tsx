import { useState } from 'react'
import { authClient } from '@/lib/auth'
import { syncNutricionista } from '@/lib/db'
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
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react'

interface RegisterPageProps {
  onNavigateToLogin: () => void
  onSuccess: () => void
}

export function RegisterPage({ onNavigateToLogin, onSuccess }: RegisterPageProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!fullName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.')
      return
    }

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu email.')
      return
    }

    // Regra: A senha deve ter no mínimo 9 caracteres
    if (password.length < 9) {
      setErrorMessage('A senha deve ter no mínimo 9 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Digite novamente.')
      return
    }

    try {
      setIsLoading(true)

      const res = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password: password,
      })

      if (res.error) {
        if (
          res.error.message?.toLowerCase().includes('already') ||
          res.error.message?.toLowerCase().includes('exists')
        ) {
          setErrorMessage('Este email já está cadastrado no sistema. Tente fazer login.')
        } else {
          setErrorMessage(
            res.error.message ||
              'Não foi possível criar sua conta. Verifique os dados informados e tente novamente.'
          )
        }
        setIsLoading(false)
        return
      }

      // Salvar na tabela nutricionistas do Neon
      const userId = (res.data as any)?.user?.id || (res.data as any)?.id
      await syncNutricionista({
        id: userId,
        name: fullName.trim(),
        email: email.trim(),
      })

      onSuccess()
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          'Ocorreu um erro ao processar o cadastro. Tente novamente mais tarde.'
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
              Criar sua conta
            </CardTitle>
            <CardDescription className="text-stone-600">
              Junte-se ao VivaLev e otimize seus atendimentos
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
                <Label htmlFor="fullName">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Dra. Ana Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email profissional</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="dra.ana@vivalev.com"
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
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo de 9 caracteres"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-0.5 pl-1">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      password.length >= 9
                        ? 'text-emerald-700'
                        : 'text-stone-300'
                    }`}
                  />
                  <span>Mínimo de 9 caracteres</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Criar conta
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-stone-600 pt-1">
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Faça login
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
