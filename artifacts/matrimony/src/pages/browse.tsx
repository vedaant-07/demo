import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListProfiles, getListProfilesQueryKey } from "@workspace/api-client-react";
import { ProfileCard } from "@/components/profile-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Loader2, X, ChevronDown } from "lucide-react";

export function Browse() {
  const [filters, setFilters] = useState({
    gender: "all",
    religion: "all",
    ageRange: [21, 55] as number[],
    city: "",
  });

  const [debouncedCity, setDebouncedCity] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {};
    if (filters.gender !== "all") params.gender = filters.gender;
    if (filters.religion !== "all") params.religion = filters.religion;
    params.minAge = filters.ageRange[0];
    params.maxAge = filters.ageRange[1];
    if (debouncedCity) params.city = debouncedCity;
    return params;
  }, [filters, debouncedCity]);

  const { data: profiles, isLoading } = useListProfiles(queryParams as never, {
    query: { queryKey: getListProfilesQueryKey(queryParams as never) },
  });

  const activeFilterCount = [
    filters.gender !== "all",
    filters.religion !== "all",
    filters.ageRange[0] !== 21 || filters.ageRange[1] !== 55,
    !!debouncedCity,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilters({ gender: "all", religion: "all", ageRange: [21, 55], city: "" });
    setDebouncedCity("");
  };

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary/5 border-b border-border py-8 md:py-14">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs uppercase tracking-widest text-primary/70 mb-2 font-medium">Anurup Sathi</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-foreground mb-3">
              Profiles Dhundein
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
              Apni pasand ke mutabiq filters lagayein aur apne jeewan saathi se milein. Lakhs verified profiles aapka intezaar kar rahe hain.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter Karein
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary gap-1 text-sm">
              <X className="w-3.5 h-3.5" /> Reset
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence initial={false}>
            {(showFilters) && (
              <motion.aside
                key="mobile-filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:hidden overflow-hidden"
              >
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  debouncedCity={debouncedCity}
                  setDebouncedCity={setDebouncedCity}
                  onReset={resetFilters}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Desktop sidebar - always visible */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                debouncedCity={debouncedCity}
                setDebouncedCity={setDebouncedCity}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Profile Grid */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Profiles dhundhe ja rahe hain..." : (
                  <><span className="font-semibold text-foreground">{profiles?.length ?? 0}</span> profiles mile</>
                )}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="hidden lg:flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <X className="w-3 h-3" /> Filters Hatayein
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="w-full h-64 flex flex-col items-center justify-center text-primary">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Profiles Dhundhe Ja Rahe Hain...</p>
              </div>
            ) : profiles && profiles.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                <AnimatePresence>
                  {profiles.map((profile, i) => (
                    <motion.div
                      layout
                      key={profile.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <ProfileCard profile={profile} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border bg-muted/20">
                <h3 className="text-2xl font-serif text-primary mb-2">Koi Profile Nahi Mila</h3>
                <p className="text-muted-foreground text-sm mb-4">Apne filters badlein aur dobara dhundein.</p>
                <Button onClick={resetFilters} variant="outline" size="sm">Filters Reset Karein</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  setFilters,
  debouncedCity,
  setDebouncedCity,
  onReset,
}: {
  filters: { gender: string; religion: string; ageRange: number[]; city: string };
  setFilters: React.Dispatch<React.SetStateAction<typeof filters>>;
  debouncedCity: string;
  setDebouncedCity: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6 bg-card p-5 md:p-6 rounded-2xl border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-foreground">Filter Karein</h2>
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Reset
        </button>
      </div>

      {/* City Search */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase tracking-wider">Shahar se Dhundein</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Mumbai, Delhi, Bangalore..."
            className="pl-9"
            value={filters.city}
            onChange={(e) => {
              setFilters((p) => ({ ...p, city: e.target.value }));
              const val = e.target.value;
              setTimeout(() => setDebouncedCity(val), 400);
            }}
          />
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase tracking-wider">Ling (Gender)</Label>
        <div className="grid grid-cols-3 gap-2">
          {["all", "Male", "Female"].map((g) => (
            <button
              key={g}
              onClick={() => setFilters((p) => ({ ...p, gender: g }))}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${filters.gender === g ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {g === "all" ? "Sab" : g === "Male" ? "Var" : "Vadhu"}
            </button>
          ))}
        </div>
      </div>

      {/* Religion */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase tracking-wider">Dharm</Label>
        <Select value={filters.religion} onValueChange={(v) => setFilters((p) => ({ ...p, religion: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Dharm Chunein" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Koi Bhi</SelectItem>
            <SelectItem value="Hindu">Hindu</SelectItem>
            <SelectItem value="Muslim">Muslim</SelectItem>
            <SelectItem value="Sikh">Sikh</SelectItem>
            <SelectItem value="Christian">Christian</SelectItem>
            <SelectItem value="Jain">Jain</SelectItem>
            <SelectItem value="Buddhist">Buddhist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Age Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-semibold text-primary uppercase tracking-wider">Aayu (Age)</Label>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {filters.ageRange[0]} – {filters.ageRange[1]} saal
          </span>
        </div>
        <Slider
          defaultValue={[21, 55]}
          max={70}
          min={18}
          step={1}
          value={filters.ageRange}
          onValueChange={(v) => setFilters((p) => ({ ...p, ageRange: v }))}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>18 saal</span>
          <span>70 saal</span>
        </div>
      </div>

      <Button className="w-full" onClick={onReset} variant="outline">
        Sab Filters Hatayein
      </Button>
    </div>
  );
}
