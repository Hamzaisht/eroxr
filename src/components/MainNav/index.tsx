import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MainNav = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Eroxr
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost">Discover</Button>
              <Button variant="ghost">Categories</Button>
              <Button variant="ghost">About</Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators..."
                className="w-[300px] pl-9"
              />
            </div>
            {session ? (
              <Avatar>
                <AvatarImage src={session.user.user_metadata.avatar_url} />
                <AvatarFallback>
                  {session.user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button onClick={() => navigate("/login")}>Sign up</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};