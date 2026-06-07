import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListProfiles, getListProfilesQueryKey } from "@workspace/api-client-react";
import { ProfileCard } from "@/components/profile-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

export function Browse() {
  const [filters, setFilters] = useState({
    gender: "all",
    religion: "all",
    ageRange: [21, 55],
    city: ""
  });
  
  const [debouncedCity, setDebouncedCity] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // In a real app, we'd debounce the city input before passing to query
  // For this demo, we'll fetch all and filter locally for instantaneous feel, 
  // or pass params to API. The API supports gender, religion, minAge, maxAge, city.
  
  const queryParams = useMemo(() => {
    const params: any = {};
    if (filters.gender !== "all") params.gender = filters.gender;
    if (filters.religion !== "all") params.religion = filters.religion;
    params.minAge = filters.ageRange[0];
    params.maxAge = filters.ageRange[1];
    if (debouncedCity) params.city = debouncedCity;
    return params;
  }, [filters, debouncedCity]);

  const { data: profiles, isLoading } = useListProfiles(queryParams, {
    query: {
      queryKey: getListProfilesQueryKey(queryParams)
    }
  });

  return (
    <div className="pt-24 pb-32 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Discover Profiles</h1>
          <p className="text-muted-foreground max-w-2xl">Refine your search to find the perfect match tailored to your preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <Button 
            variant="outline" 
            className="lg:hidden w-full flex items-center justify-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" /> 
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full lg:w-80 lg:shrink-0 space-y-8 glass-panel p-6 rounded-2xl border border-primary/10 shadow-xl overflow-hidden lg:h-fit lg:sticky lg:top-28"
              >
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-primary uppercase tracking-wider">Search by City</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. Mumbai, Delhi..." 
                      className="pl-9 bg-white/50 dark:bg-black/20"
                      value={filters.city}
                      onChange={(e) => {
                        setFilters(p => ({ ...p, city: e.target.value }));
                        // Debounce logic would go here
                        setTimeout(() => setDebouncedCity(e.target.value), 500);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-primary uppercase tracking-wider">Gender</Label>
                  <Select value={filters.gender} onValueChange={(v) => setFilters(p => ({ ...p, gender: v }))}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/20">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-primary uppercase tracking-wider">Religion</Label>
                  <Select value={filters.religion} onValueChange={(v) => setFilters(p => ({ ...p, religion: v }))}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/20">
                      <SelectValue placeholder="Select Religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Muslim">Muslim</SelectItem>
                      <SelectItem value="Sikh">Sikh</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Jain">Jain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold text-primary uppercase tracking-wider">Age Range</Label>
                    <span className="text-sm text-muted-foreground">{filters.ageRange[0]} - {filters.ageRange[1]} yrs</span>
                  </div>
                  <Slider
                    defaultValue={[21, 55]}
                    max={70}
                    min={18}
                    step={1}
                    value={filters.ageRange}
                    onValueChange={(v) => setFilters(p => ({ ...p, ageRange: v }))}
                    className="py-4"
                  />
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    setFilters({ gender: "all", religion: "all", ageRange: [21, 55], city: "" });
                    setDebouncedCity("");
                  }}
                >
                  Reset Filters
                </Button>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Profile Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="w-full h-64 flex flex-col items-center justify-center text-primary">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Curating Profiles...</p>
              </div>
            ) : profiles && profiles.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 preserve-3d"
              >
                <AnimatePresence>
                  {profiles.map((profile, i) => (
                    <motion.div
                      layout
                      key={profile.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <ProfileCard profile={profile} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center text-center p-8 glass-panel rounded-2xl border border-white/10">
                <h3 className="text-2xl font-serif text-primary mb-2">No Profiles Found</h3>
                <p className="text-muted-foreground">Adjust your filters to discover more matches.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
