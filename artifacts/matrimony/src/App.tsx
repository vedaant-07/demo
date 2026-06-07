import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { Browse } from "@/pages/browse";
import { ProfileDetail } from "@/pages/profile";
import { Stories } from "@/pages/stories";
import { Register } from "@/pages/register";
import { Interests } from "@/pages/interests";
import { SubmitStory } from "@/pages/submit-story";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/profile/:id" component={ProfileDetail} />
      <Route path="/stories" component={Stories} />
      <Route path="/submit-story" component={SubmitStory} />
      <Route path="/register" component={Register} />
      <Route path="/interests" component={Interests} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
