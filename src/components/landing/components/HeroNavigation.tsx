import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RollingText } from "./RollingText";
import { WaveButton } from "./WaveButton";
interface HeroNavigationProps {
  headerBg: any;
}
export const HeroNavigation = ({
  headerBg
}: HeroNavigationProps) => {
  return <motion.nav style={{
    backgroundColor: headerBg
  }} className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-white">Eroxr</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <RollingText href="/explore">Explore</RollingText>
              <RollingText href="/pricing">Pricing</RollingText>
              <RollingText href="/creators">Creators</RollingText>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <WaveButton className="bg-transparent hover:bg-luxury-primary/10 transition-all duration-300">
                  Log In
                </WaveButton>
              </Link>
              
              <Link to="/register">
                <WaveButton className="bg-luxury-primary">
                  Sign Up
                </WaveButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>;
};