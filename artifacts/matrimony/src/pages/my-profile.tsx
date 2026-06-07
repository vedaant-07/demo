import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateProfile,
  useGetProfile,
  useUpdateProfile,
  getGetProfileQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  User, Mail, MapPin, GraduationCap, Briefcase, Heart, Edit3,
  CheckCircle, Loader2, BookOpen, Home, Star, Phone, Calendar,
  Save, X, AlertCircle
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const PROFILE_ID_KEY = "anurup_sathi_profile_id";

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
  photo: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const RELIGIONS = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Other"];

function ProfileCompleteness({ values }: { values: ProfileFormValues }) {
  const fields = [
    values.name, values.age, values.gender, values.religion,
    values.city, values.bio, values.caste, values.state,
    values.education, values.profession,
  ];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  const color = pct < 40 ? "bg-red-500" : pct < 70 ? "bg-amber-500" : "bg-green-500";

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-foreground">Profile Completeness</span>
        <span className={`text-sm font-bold ${pct < 40 ? "text-red-600" : pct < 70 ? "text-amber-600" : "text-green-600"}`}>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2 font-medium">
        {pct < 70 ? "Complete your profile to get more matches" : "Great! Your profile looks complete"}
      </p>
    </div>
  );
}

export function MyProfile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(() => {
    const stored = localStorage.getItem(PROFILE_ID_KEY);
    return stored ? parseInt(stored) : null;
  });

  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();

  const { data: profile, isLoading: profileLoading } = useGetProfile(profileId || 0, {
    query: {
      enabled: !!profileId,
      queryKey: getGetProfileQueryKey(profileId || 0),
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      age: 25,
      gender: "",
      religion: "",
      caste: "",
      city: "",
      state: "",
      education: "",
      profession: "",
      bio: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        religion: profile.religion,
        caste: profile.caste || "",
        city: profile.city,
        state: profile.state || "",
        education: profile.education || "",
        profession: profile.profession || "",
        bio: profile.bio,
        photo: profile.photo || "",
      });
    } else if (user && !profileId) {
      form.setValue("name", user.name);
      setEditing(true);
    }
  }, [profile, user, profileId]);

  const onSubmit = (data: ProfileFormValues) => {
    if (profileId && profile) {
      updateProfile.mutate({ id: profileId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey(profileId) });
          toast({ title: "Profile Updated!", description: "Your matrimonial profile has been saved." });
          setEditing(false);
        },
        onError: () => {
          toast({ title: "Update Failed", description: "Please check your details and try again.", variant: "destructive" });
        },
      });
    } else {
      createProfile.mutate({ data }, {
        onSuccess: (newProfile) => {
          localStorage.setItem(PROFILE_ID_KEY, String(newProfile.id));
          setProfileId(newProfile.id);
          queryClient.invalidateQueries();
          toast({ title: "Profile Created!", description: "Your matrimonial profile is now live." });
          setEditing(false);
        },
        onError: () => {
          toast({ title: "Creation Failed", description: "Please check your details and try again.", variant: "destructive" });
        },
      });
    }
  };

  const isPending = createProfile.isPending || updateProfile.isPending;
  const formValues = form.watch();

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-3">Sign In Required</h1>
        <p className="text-muted-foreground font-semibold mb-6">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 bg-muted/30">
      {/* Header Banner */}
      <div className="bg-primary py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/60 text-xs uppercase tracking-widest font-bold mb-1">My Account</p>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground">
                {user?.name}
              </h1>
              <p className="text-primary-foreground/70 text-sm mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full text-sm font-bold transition-colors border border-white/20"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile photo card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                {profile?.photo ? (
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground px-4 text-center">
                      {editing ? "Add a photo URL below" : "No photo added yet"}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-serif font-bold text-xl text-foreground text-center">{profile?.name || user?.name}</p>
                {profile && (
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    {profile.age} yrs · {profile.city}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Completeness */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProfileCompleteness values={formValues} />
            </motion.div>

            {/* Account info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-card border border-border rounded-2xl p-5 space-y-3"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Account Info</h3>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground font-medium truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-foreground font-medium">Email Verified</span>
              </div>
              {profile && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Star className="w-4 h-4 text-secondary shrink-0" />
                  <span className="text-foreground font-medium">Active Member</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {!profile && !editing ? (
              /* No profile yet */
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Profile Incomplete</h2>
                <p className="text-muted-foreground font-medium mb-6 max-w-sm mx-auto">
                  Create your matrimonial profile to start connecting with compatible matches.
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Edit3 className="w-4 h-4" /> Create Matrimonial Profile
                </button>
              </div>
            ) : editing ? (
              /* Edit form */
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    {profile ? "Edit Profile" : "Create Matrimonial Profile"}
                  </h2>
                  {profile && (
                    <button
                      onClick={() => setEditing(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Basic Info */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Basic Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select religion" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {RELIGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="caste" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Caste</FormLabel>
                            <FormControl><Input placeholder="e.g. Brahmin, Rajput, Nair" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Location
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="city" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City *</FormLabel>
                            <FormControl><Input placeholder="e.g. Mumbai, Delhi" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="state" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State</FormLabel>
                            <FormControl><Input placeholder="e.g. Maharashtra, Karnataka" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    {/* Education & Career */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" /> Education & Career
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="education" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education</FormLabel>
                            <FormControl><Input placeholder="e.g. MBA, B.Tech, MBBS" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="profession" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profession</FormLabel>
                            <FormControl><Input placeholder="e.g. Software Engineer, Doctor" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    {/* Photo URL */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5" /> Profile Photo
                      </h3>
                      <FormField control={form.control} name="photo" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Photo URL</FormLabel>
                          <FormControl><Input placeholder="https://example.com/your-photo.jpg" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* About */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" /> About You
                      </h3>
                      <FormField control={form.control} name="bio" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself — your values, hobbies, family background, and what you're looking for in a life partner..."
                              className="resize-none min-h-[140px] text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 py-6 text-base font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl transition-all hover:-translate-y-0.5"
                      >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <span className="flex items-center gap-2">
                            <Save className="w-4 h-4" /> {profile ? "Save Changes" : "Create Profile"}
                          </span>
                        )}
                      </Button>
                      {profile && (
                        <Button type="button" variant="outline" onClick={() => setEditing(false)} className="py-6 px-6 rounded-xl font-bold">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            ) : (
              /* View profile */
              <div className="space-y-4">
                {/* About */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" /> About Me
                  </h3>
                  <p className="text-foreground leading-relaxed font-medium">
                    {profile?.bio || "No bio added yet."}
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Personal Details
                    </h4>
                    <ul className="space-y-2.5">
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Age</span>
                        <span className="font-bold text-foreground">{profile?.age} years</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Gender</span>
                        <span className="font-bold text-foreground">{profile?.gender || "—"}</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Religion</span>
                        <span className="font-bold text-foreground">{profile?.religion || "—"}</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Caste</span>
                        <span className="font-bold text-foreground">{profile?.caste || "Not specified"}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </h4>
                    <ul className="space-y-2.5">
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">City</span>
                        <span className="font-bold text-foreground">{profile?.city || "—"}</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">State</span>
                        <span className="font-bold text-foreground">{profile?.state || "Not specified"}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Education & Career
                    </h4>
                    <ul className="space-y-2.5">
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Education</span>
                        <span className="font-bold text-foreground">{profile?.education || "Not specified"}</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Profession</span>
                        <span className="font-bold text-foreground">{profile?.profession || "Not specified"}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" /> Profile Status
                    </h4>
                    <ul className="space-y-2.5">
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Status</span>
                        <span className="font-bold text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Featured</span>
                        <span className="font-bold text-foreground">{profile?.featured ? "Yes" : "No"}</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Member Since</span>
                        <span className="font-bold text-foreground">
                          {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">My Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {[profile?.religion, profile?.caste, profile?.gender, `${profile?.age} yrs`, profile?.city, profile?.education, profile?.profession]
                      .filter(Boolean)
                      .map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
