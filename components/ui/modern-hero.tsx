import { Star } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  secondaryButton?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    label?: string;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero7 = ({
  heading = "Turn any material into exam-ready study tools",
  description = "StudyOS transforms notes, PDFs, and lectures into summaries, flashcards, practice questions, and AI tutor chats so revision feels focused instead of frantic.",
  button = {
    text: "Get started free",
    url: "/login",
  },
  secondaryButton = {
    text: "Watch demo",
    url: "#demo",
  },
  reviews = {
    count: 200,
    label: "early student workflows",
    avatars: [
       {
        src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
        alt: "Avatar 1",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
        alt: "Avatar 2",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-3.webp",
        alt: "Avatar 3",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
        alt: "Avatar 4",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
        alt: "Avatar 5",
      },
    ],
  },
}: Hero7Props) => {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <div className="mx-auto w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            AI-powered study workspace
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-xl md:leading-8">
            {description}
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-7 text-base shadow-lg">
            <a href={button.url}>{button.text}</a>
          </Button>
          {secondaryButton ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-7 text-base"
            >
              <a href={secondaryButton.url}>{secondaryButton.text}</a>
            </Button>
          ) : null}
        </div>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar) => (
              <Avatar
                key={avatar.src}
                className="size-14 border-2 border-background"
              >
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div>
            <div
              className="flex items-center justify-center gap-1 sm:justify-start"
              aria-label="Five star rating"
            >
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="text-center font-medium text-muted-foreground sm:text-left">
              from {reviews.count}+ {reviews.label ?? "reviews"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero7 };





// You are given a task to integrate an existing React component in the codebase

// The codebase should support:
// - shadcn project structure  
// - Tailwind CSS
// - Typescript

// If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

// Determine the default path for components and styles. 
// If default path for components is not /components/ui, provide instructions on why it's important to create this folder
// Copy-paste this component to /components/ui folder:
// ```tsx
// modern-hero.tsx
// import { Star } from "lucide-react";
// import React from "react";

// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// interface Hero7Props {
//   heading?: string;
//   description?: string;
//   button?: {
//     text: string;
//     url: string;
//   };
//   reviews?: {
//     count: number;
//     avatars: {
//       src: string;
//       alt: string;
//     }[];
//   };
// }

// const Hero7 = ({
//   heading = "A Collection of Components Built With Shadcn & Tailwind",
//   description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
//   button = {
//     text: "Discover all components",
//     url: "https://www.shadcnblocks.com",
//   },
//   reviews = {
//     count: 200,
//     avatars: [
//       {
//         src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
//         alt: "Avatar 1",
//       },
//       {
//         src: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
//         alt: "Avatar 2",
//       },
//       {
//         src: "https://www.shadcnblocks.com/images/block/avatar-3.webp",
//         alt: "Avatar 3",
//       },
//       {
//         src: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
//         alt: "Avatar 4",
//       },
//       {
//         src: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
//         alt: "Avatar 5",
//       },
//     ],
//   },
// }: Hero7Props) => {
//   return (
//     <section className="py-32">
//       <div className="container text-center">
//         <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
//           <h1 className="text-3xl font-extrabold lg:text-6xl">{heading}</h1>
//           <p className="text-balance text-muted-foreground lg:text-lg">
//             {description}
//           </p>
//         </div>
//         <Button asChild size="lg" className="mt-10">
//           <a href={button.url}>{button.text}</a>
//         </Button>
//         <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
//           <span className="mx-4 inline-flex items-center -space-x-4">
//             {reviews.avatars.map((avatar, index) => (
//               <Avatar key={index} className="size-14 border">
//                 <AvatarImage src={avatar.src} alt={avatar.alt} />
//               </Avatar>
//             ))}
//           </span>
//           <div>
//             <div className="flex items-center gap-1">
//               {[...Array(5)].map((_, index) => (
//                 <Star
//                   key={index}
//                   className="size-5 fill-yellow-400 text-yellow-400"
//                 />
//               ))}
//             </div>
//             <p className="text-left font-medium text-muted-foreground">
//               from {reviews.count}+ reviews
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export { Hero7 };


// demo.tsx
// import { Hero7 } from "@/components/blocks/modern-hero"

// const demoData = {
//   heading: "A Collection of Components Built With Shadcn & Tailwind",
//   description:
//     "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
//   button: {
//     text: "Discover all components",
//     url: "https://www.shadcnblocks.com",
//   },
//   reviews: {
//     count: 200,
//     avatars: [
    
//     ],
//   },
// };

// function Hero7Demo() {
//   return <Hero7 {...demoData} />;
// }

// export { Hero7Demo };

// ```

// Copy-paste these files for dependencies:
// ```tsx
// shadcn/avatar
// "use client"

// import * as React from "react"
// import * as AvatarPrimitive from "@radix-ui/react-avatar"

// import { cn } from "@/lib/utils"

// const Avatar = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Root
//     ref={ref}
//     className={cn(
//       "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
//       className,
//     )}
//     {...props}
//   />
// ))
// Avatar.displayName = AvatarPrimitive.Root.displayName

// const AvatarImage = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Image>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Image
//     ref={ref}
//     className={cn("aspect-square h-full w-full", className)}
//     {...props}
//   />
// ))
// AvatarImage.displayName = AvatarPrimitive.Image.displayName

// const AvatarFallback = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Fallback>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Fallback
//     ref={ref}
//     className={cn(
//       "flex h-full w-full items-center justify-center rounded-full bg-muted",
//       className,
//     )}
//     {...props}
//   />
// ))
// AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// export { Avatar, AvatarImage, AvatarFallback }

// ```
// ```tsx
// shadcn/button
// import * as React from "react"
// import { Slot } from "@radix-ui/react-slot"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "@/lib/utils"

// const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// )

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button"
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     )
//   },
// )
// Button.displayName = "Button"

// export { Button, buttonVariants }

// ```

// Install NPM dependencies:
// ```bash
// lucide-react, @radix-ui/react-avatar, @radix-ui/react-slot, class-variance-authority
// ```

// Implementation Guidelines
//  1. Analyze the component structure and identify all required dependencies
//  2. Review the component's argumens and state
//  3. Identify any required context providers or hooks and install them
//  4. Questions to Ask
//  - What data/props will be passed to this component?
//  - Are there any specific state management requirements?
//  - Are there any required assets (images, icons, etc.)?
//  - What is the expected responsive behavior?
//  - What is the best place to use this component in the app?

// Steps to integrate
//  0. Copy paste all the code above in the correct directories
//  1. Install external dependencies
//  2. Fill image assets with Unsplash stock images you know exist
//  3. Use lucide-react icons for svgs or logos if component requires them
