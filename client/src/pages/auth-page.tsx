import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext"; // Assuming this context exists
import { LanguageSelector } from "@/components/LanguageSelector"; // Assuming this component exists

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useLanguage(); // Use the translation hook

  if (user) {
    navigate("/");
    return null;
  }

  const loginForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-4xl mx-4 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <img src="/APP.png" alt="Company Logo" className="h-10 w-auto" />
          </div>
          <p className="text-lg text-muted-foreground">
            A comprehensive business management system for your company.
            Manage clients, inventory, reservations, and billing all in one place.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.welcome')}</CardTitle> {/* Example translation */}
            <CardDescription>{t('auth.loginOrRegister')}</CardDescription> {/* Example translation */}
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <LanguageSelector />
            </div>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('login.title')}</TabsTrigger>
                <TabsTrigger value="register">{t('register.title')}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit((data) =>
                      loginMutation.mutate(data)
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('login.username')}</FormLabel> {/* Example translation */}
                          <FormControl>
                            <Input placeholder={t('login.usernamePlaceholder')} {...field} /> {/* Example translation */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('login.password')}</FormLabel> {/* Example translation */}
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('login.passwordPlaceholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? t('login.loggingIn') : t('login.login')} {/* Example translation */}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit((data) =>
                      registerMutation.mutate(data)
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('register.username')}</FormLabel> {/* Example translation */}
                          <FormControl>
                            <Input placeholder={t('register.usernamePlaceholder')} {...field} /> {/* Example translation */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('register.password')}</FormLabel> {/* Example translation */}
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('register.passwordPlaceholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending
                        ? t('register.creatingAccount')
                        : t('register.createAccount')} {/* Example translation */}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}