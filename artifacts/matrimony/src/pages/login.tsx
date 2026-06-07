import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useRegister } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User, Heart, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ onClose, defaultTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onLogin = (data: LoginValues) => {
    loginMutation.mutate({ data: { email: data.email, password: data.password } }, {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast({ title: "Welcome back!", description: "You have successfully signed in." });
        onClose();
        setLocation("/my-profile");
      },
      onError: (err: any) => {
        const msg = err?.data?.error || err?.message || "Invalid email or password.";
        toast({ title: "Sign in failed", description: msg, variant: "destructive" });
      },
    });
  };

  const onRegister = (data: RegisterValues) => {
    registerMutation.mutate({ data: { name: data.name, email: data.email, password: data.password } }, {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast({ title: "Account created!", description: "Welcome to Anurup Sathi. Complete your profile below." });
        onClose();
        setLocation("/my-profile");
      },
      onError: (err: any) => {
        const msg = err?.data?.error || err?.message || "Registration failed. Please try again.";
        toast({ title: "Registration failed", description: msg, variant: "destructive" });
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-background rounded-3xl shadow-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary px-8 pt-8 pb-6 text-primary-foreground">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="font-serif text-lg font-bold">Anurup Sathi</span>
          </div>
          <h2 className="text-3xl font-serif font-bold">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-primary-foreground/70 text-sm mt-1">
            {tab === "login" ? "Sign in to continue your journey" : "Join thousands of families finding the perfect match"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "login" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "register" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        <div className="p-8">
          {tab === "login" ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="your@email.com" className="pl-9" {...field} />
                        </div>
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
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loginMutation.isPending} className="w-full py-6 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg">
                  {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-primary font-semibold hover:underline">
                    Register now
                  </button>
                </p>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Your full name" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="your@email.com" className="pl-9" {...field} />
                        </div>
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
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="password" placeholder="At least 6 characters" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="password" placeholder="Repeat your password" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={registerMutation.isPending} className="w-full py-6 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg mt-2">
                  {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-primary font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </form>
            </Form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
