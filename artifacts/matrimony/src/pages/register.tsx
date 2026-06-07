import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCreateProfile } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(18, "Must be at least 18").max(90, "Invalid age"),
  gender: z.string().min(1, "Please select gender"),
  religion: z.string().min(1, "Please select religion"),
  caste: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  bio: z.string().min(10, "Please write a short bio (at least 10 characters)"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function Register() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createProfile = useCreateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", age: 25, gender: "", religion: "", caste: "", city: "", state: "", education: "", profession: "", bio: "" },
  });

  const onSubmit = (data: ProfileFormValues) => {
    createProfile.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Profile Created!", description: "Welcome to Anurup Sathi. Your journey begins now." });
        setLocation("/browse");
      },
      onError: () => {
        toast({ title: "Registration Failed", description: "Please check your information and try again.", variant: "destructive" });
      },
    });
  };

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-background">
      <div className="bg-primary py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary-foreground mb-3">Create Your Profile</h1>
          <p className="text-primary-foreground/80 font-semibold max-w-xl mx-auto">Join thousands of families finding their perfect match on Anurup Sathi</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto bg-card p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl border border-border"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name *</FormLabel>
                    <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age *</FormLabel>
                    <FormControl><Input type="number" placeholder="25" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male (Groom)</SelectItem>
                        <SelectItem value="Female">Female (Bride)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="religion" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Religion *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select religion" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Hindu">Hindu</SelectItem>
                        <SelectItem value="Muslim">Muslim</SelectItem>
                        <SelectItem value="Sikh">Sikh</SelectItem>
                        <SelectItem value="Christian">Christian</SelectItem>
                        <SelectItem value="Jain">Jain</SelectItem>
                        <SelectItem value="Buddhist">Buddhist</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="caste" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Caste (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g. Brahmin, Rajput, Nair" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City *</FormLabel>
                    <FormControl><Input placeholder="e.g. Mumbai, Delhi" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g. Maharashtra, Karnataka" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="education" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g. MBA, B.Tech, MBBS" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="profession" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profession (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g. Software Engineer, Doctor" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About You *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your values, hobbies, and what you're looking for in a life partner..."
                      className="resize-none min-h-[120px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                disabled={createProfile.isPending}
                className="w-full py-7 text-base font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl transition-all hover:-translate-y-1"
              >
                {createProfile.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create My Profile"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
