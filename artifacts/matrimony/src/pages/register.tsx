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
  gender: z.string().min(1, "Gender is required"),
  religion: z.string().min(1, "Religion is required"),
  caste: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  bio: z.string().min(10, "Please provide a short bio"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function Register() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createProfile = useCreateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: 25,
      gender: "",
      religion: "",
      caste: "",
      city: "",
      state: "",
      education: "",
      profession: "",
      bio: "",
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    createProfile.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Profile Ban Gaya!",
          description: "Anurup Sathi mein aapka swagat hai. Aapka safar shuru hota hai.",
        });
        setLocation("/browse");
      },
      onError: () => {
        toast({
          title: "Registration Failed",
          description: "Please check your information and try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-background flex flex-col items-center justify-center relative">
      <div className="absolute top-0 w-full h-[40vh] bg-primary/90 pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto glass-panel p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 bg-background/95 dark:bg-background/80"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-serif text-primary mb-3">Apna Profile Banayein</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Anurup Sathi ke saath judein aur apne jeewan saathi ki talash shuru karein.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Age</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus:ring-0 focus:border-primary px-0 pb-2 h-auto text-lg">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Religion</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus:ring-0 focus:border-primary px-0 pb-2 h-auto text-lg">
                            <SelectValue placeholder="Select religion" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Hindu">Hindu</SelectItem>
                          <SelectItem value="Muslim">Muslim</SelectItem>
                          <SelectItem value="Sikh">Sikh</SelectItem>
                          <SelectItem value="Christian">Christian</SelectItem>
                          <SelectItem value="Jain">Jain</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">City</FormLabel>
                      <FormControl>
                        <Input placeholder="Current city" className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Profession</FormLabel>
                      <FormControl>
                        <Input placeholder="Your occupation" className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">About You</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your values, interests, and what you seek in a partner..." 
                        className="resize-none bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={createProfile.isPending}
                className="w-full py-8 text-lg font-serif tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl transition-all hover:-translate-y-1"
              >
                {createProfile.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Profile Submit Karein"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
