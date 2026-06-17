import { Hero7 } from "@/components/ui/modern-hero";

type HeroProps = {
  user: unknown;
};

const Hero = ({ user }: HeroProps) => {
  return (
    <Hero7
      heading="Turn any material into exam-ready in minutes"
      description="Upload notes, PDFs, and lecture material, then let StudyOS create summaries, flashcards, practice questions, and AI tutor explanations for your next exam sprint."
      button={{
        text: user ? "Go to dashboard" : "Get started free",
        url: user ? "/dashboard" : "/login",
      }}
      secondaryButton={{
        text: user ? "Explore features" : "Watch demo",
        url: user ? "#features" : "#demo",
      }}
      reviews={{
        count: 200,
        label: "student study sessions shaped",
        avatars: [
          {
           src: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
            alt: "Smiling student using StudyOS",
          },
          {
           src: "https://www.shadcnblocks.com/images/block/avatar-3.webp",
            alt: "Student reviewing AI flashcards",
          },
          {
            src: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
            alt: "Student preparing for exams",
          },
          {
            src: "https://www.shadcnblocks.com/images/block/avatar-5.webp",     
            alt: "Student studying with notes",
          },
          {
            src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
            alt: "Student planning a revision session",
          },
        ],
      }}
    />
  );
};

export default Hero;
