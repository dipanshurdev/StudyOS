import { Hero7 } from "@/components/ui/modern-hero";

type HeroProps = {
  user: unknown;
};

const Hero = ({ user }: HeroProps) => {
  return (
    <Hero7
      primary={{
        text: user ? "Go to dashboard" : "Get started free",
        url: user ? "/dashboard" : "/login",
      }}
      secondary={{
        text: user ? "Explore features" : "Watch demo",
        url: user ? "#features" : "#demo",
      }}
    />
  );
};

export default Hero;
