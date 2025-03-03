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
import { Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // Added import
import LanguageSelector from "@/components/LanguageSelector"; // Added import

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useLanguage(); // Added language context

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
            <div className="flex justify-between items-center"> {/* Added div for LanguageSelector */}
              <CardTitle>{t('auth.welcome')}</CardTitle> {/* Replaced "Welcome" */}
              <CardDescription>{t('auth.loginOrRegister')}</CardDescription> {/* Replaced description */}
              <LanguageSelector /> {/* Added Language Selector */}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger> {/* Replaced "Login" */}
                <TabsTrigger value="register">{t('auth.register')}</TabsTrigger> {/* Replaced "Register" */}
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
                          <FormLabel>{t('auth.username')}</FormLabel> {/* Replaced "Username" */}
                          <FormControl>
                            <Input placeholder={t('auth.enterUsername')} {...field} /> {/* Replaced placeholder */}
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
                          <FormLabel>{t('auth.password')}</FormLabel> {/* Replaced "Password" */}
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('auth.enterPassword')} {...field} /> {/* Replaced placeholder */}
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
                      {loginMutation.isPending ? t('auth.loggingIn') : t('auth.login')} {/* Replaced text */}
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
                          <FormLabel>{t('auth.username')}</FormLabel> {/* Replaced "Username" */}
                          <FormControl>
                            <Input placeholder={t('auth.chooseUsername')} {...field} /> {/* Replaced placeholder */}
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
                          <FormLabel>{t('auth.password')}</FormLabel> {/* Replaced "Password" */}
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('auth.choosePassword')} {...field} /> {/* Replaced placeholder */}
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
                        ? t('auth.creatingAccount')
                        : t('auth.createAccount')} {/* Replaced text */}
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