import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

export const MainNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo />
            <NavLinks />
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};