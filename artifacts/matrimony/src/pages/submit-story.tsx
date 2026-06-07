import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCreateStory } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const storySchema = z.object({
  coupleName: z.string().min(2, "Couple name is required"),
  marriageYear: z.coerce.number().min(1950).max(new Date().getFullYear()),
  city: z.string().min(2, "City is required"),
  story: z.string().min(20, "Please share more about your beautiful journey"),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function SubmitStory() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createStory = useCreateStory();

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      coupleName: "",
      marriageYear: new Date().getFullYear(),
      city: "",
      story: "",
    }
  });

  const onSubmit = (data: StoryFormValues) => {
    createStory.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Story Submitted",
          description: "Thank you for sharing your beautiful journey with us.",
        });
        setLocation("/stories");
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "Please check your information and try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-background flex flex-col items-center justify-center relative">
      <div className="absolute top-0 w-full h-[40vh] bg-secondary/20 pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto glass-panel p-8 md:p-12 rounded-3xl shadow-2xl border border-primary/10 bg-background/95"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-primary mb-3">Share Your Story</h1>
            <p className="text-muted-foreground">Inspire others by sharing how you found your soulmate.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="coupleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Couple Names</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rahul & Priya" className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="marriageYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Marriage Year</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Wedding City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Udaipur" className="bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Your Journey</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us how you met, what drew you together, and your wedding..." 
                        className="resize-none bg-transparent border-b-2 border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 h-auto text-lg min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={createStory.isPending}
                className="w-full py-8 text-lg font-serif tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl transition-all hover:-translate-y-1"
              >
                {createStory.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Story"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
