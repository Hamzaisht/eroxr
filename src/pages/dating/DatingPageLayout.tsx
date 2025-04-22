
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { HomeLayout } from "@/components/home/HomeLayout";
import { DatingHeader } from "@/components/dating/DatingHeader";
import { DatingToolbar } from "@/components/dating/DatingToolbar";
import { DatingMainContent } from "../DatingMainContent";
import { useInView } from "react-intersection-observer";
import { nordicCountries } from "@/components/dating/utils/datingUtils";
import { type Database } from "@/integrations/supabase/types";
import { DatingAd, FilterOptions } from "@/components/ads/types/dating";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface DatingPageLayoutProps {
  datingAds: DatingAd[] | undefined;
  isLoading: boolean;
  userProfile: DatingAd | null;
  filterOptions: FilterOptions;
  setFilterOptions: (o: FilterOptions) => void;
  selectedCountry: NordicCountry | null;
  setSelectedCountry: (c: NordicCountry | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  selectedSeeker: string | null;
  setSelectedSeeker: (v: string | null) => void;
  selectedLookingFor: string | null;
  setSelectedLookingFor: (v: string | null) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  isFilterCollapsed: boolean;
  setIsFilterCollapsed: (v: boolean) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  handleAdCreationSuccess: () => void;
  handleTagClick: (tag: string) => void;
  handleResetFilters: () => void;
  handleFilterToggle: () => void;
  defaultSearchCategories: Array<{ seeker: string; lookingFor: string; label: string; }>;
  nordicCountries: NordicCountry[];
  headerRef: (node?: Element | null | undefined) => void;
  navigate: any;
}

export function DatingPageLayout(props: DatingPageLayoutProps) {
  return (
    <HomeLayout>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-16 pb-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div ref={props.headerRef}>
            <DatingHeader
              canAccessBodyContact={true}
              onAdCreationSuccess={props.handleAdCreationSuccess}
              activeTab={props.activeTab}
              onTabChange={props.setActiveTab}
            />
            <DatingToolbar
              onBack={() => props.navigate('/home')}
              onResetFilters={props.handleResetFilters}
              showFilters={props.showFilters}
              setShowFilters={props.setShowFilters}
            />
          </div>
          <DatingMainContent
            isFilterCollapsed={props.isFilterCollapsed}
            setIsFilterCollapsed={props.setIsFilterCollapsed}
            showFilters={props.showFilters}
            setShowFilters={props.setShowFilters}
            selectedCountry={props.selectedCountry}
            setSelectedCountry={props.setSelectedCountry}
            selectedCity={props.selectedCity}
            setSelectedCity={props.setSelectedCity}
            selectedSeeker={props.selectedSeeker}
            selectedLookingFor={props.selectedLookingFor}
            setSelectedSeeker={props.setSelectedSeeker}
            setSelectedLookingFor={props.setSelectedLookingFor}
            filterOptions={props.filterOptions}
            setFilterOptions={props.setFilterOptions}
            defaultSearchCategories={props.defaultSearchCategories}
            nordicCountries={props.nordicCountries}
            selectedTag={props.selectedTag}
            setSelectedTag={props.setSelectedTag}
            datingAds={props.datingAds}
            isLoading={props.isLoading}
            activeTab={props.activeTab}
            userProfile={props.userProfile}
            handleAdCreationSuccess={props.handleAdCreationSuccess}
            handleTagClick={props.handleTagClick}
            handleTabChange={props.setActiveTab}
            handleFilterToggle={props.handleFilterToggle}
          />
        </div>
      </motion.main>
      <Footer />
    </HomeLayout>
  );
}
