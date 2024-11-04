"use client";

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useScroll,
  useTransform,
} from "framer-motion";
import Lenis from "lenis";
import { BugIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import BlurIn from "@/components/ui/BlurIn";
import { Button } from "@/components/ui/Button";
import { CanvasRevealEffect } from "@/components/ui/CanvasRevealEffect";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import { HyperText } from "@/components/ui/HyperText";
import { TextHoverEffect } from "@/components/ui/TextHoverEffect";
import TextRevealByWord from "@/components/ui/TextRevealByWord";
import EncryptButton from "@/components/EncryptButton";
import HamburgerIcon from "@/components/icons/HamburgerIcon";

import arrowRight from "@/assets/arrowRight.svg";
import dribbleLogo from "@/assets/dribbleLogo.svg";
import gigachad from "@/assets/gigachad.jpg";
import linkedinLogo from "@/assets/linkedinLogo.svg";
import Logo from "@/assets/Logo.png";
import xLogo from "@/assets/xLogo.svg";

const navigationLinks = [
  "Tools",
  "Our Team",
  "Client Reviews",
  "Common Questions",
];

const teamMembers: TeamMember[] = [
  {
    image: gigachad.src,
    name: "Chad the Penetrator",
    role: "Penetration Tester",
    bio: "Former consultant at SecureLabs. Specializes in network security and vulnerability assessments for Fortune 500 clients.",
    socials: [
      {
        icon: xLogo,
        name: "x",
        link: "x.com",
      },
      {
        icon: linkedinLogo,
        name: "linkedin",
        link: "linkedin.com",
      },
      {
        icon: dribbleLogo,
        name: "dribble",
        link: "dribble.com",
      },
    ],
  },
  {
    image: gigachad.src,
    name: "Chad the Penetrator",
    role: "Penetration Tester",
    bio: "Former consultant at SecureLabs. Specializes in network security and vulnerability assessments for Fortune 500 clients.",
    socials: [
      {
        icon: xLogo,
        name: "x",
        link: "x.com",
      },
      {
        icon: linkedinLogo,
        name: "linkedin",
        link: "linkedin.com",
      },
      {
        icon: dribbleLogo,
        name: "dribble",
        link: "dribble.com",
      },
    ],
  },
  {
    image: gigachad.src,
    name: "Chad the Penetrator",
    role: "Penetration Tester",
    bio: "Former consultant at SecureLabs. Specializes in network security and vulnerability assessments for Fortune 500 clients.",
    socials: [
      {
        icon: xLogo,
        name: "x",
        link: "x.com",
      },
      {
        icon: linkedinLogo,
        name: "linkedin",
        link: "linkedin.com",
      },
      {
        icon: dribbleLogo,
        name: "dribble",
        link: "dribble.com",
      },
    ],
  },
  {
    image: gigachad.src,
    name: "Chad the Penetrator",
    role: "Penetration Tester",
    bio: "Former consultant at SecureLabs. Specializes in network security and vulnerability assessments for Fortune 500 clients.",
    socials: [
      {
        icon: xLogo,
        name: "x",
        link: "x.com",
      },
      {
        icon: linkedinLogo,
        name: "linkedin",
        link: "linkedin.com",
      },
      {
        icon: dribbleLogo,
        name: "dribble",
        link: "dribble.com",
      },
    ],
  },
];

type TeamMember = {
  image: string;
  name: string;
  role: string;
  bio: string;
  socials: {
    icon: any;
    name: string;
    link: string;
  }[];
};

const tools = [
  {
    icon: (hovered: boolean) => {
      const animation = {
        initial: { pathLength: 1 },
        animate: hovered ? { pathLength: [0, 1] } : { pathLength: 1 },
        transition: { duration: 0.5, ease: "easeInOut" },
      };

      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          color={hovered ? "white" : "black"}
          fill={hovered ? "black" : "white"}
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <motion.path
            {...animation}
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
          />
          <motion.path
            {...animation}
            d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4"
          />
          <motion.path
            {...animation}
            d="M11.5 3a16.989 16.989 0 0 0 -1.826 4"
          />
          <motion.path {...animation} d="M12.5 3a16.989 16.989 0 0 1 1.828 4" />
          <motion.path
            {...animation}
            d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4"
          />
          <motion.path
            {...animation}
            d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4"
          />
          <motion.path
            {...animation}
            d="M12.5 21a16.989 16.989 0 0 0 1.828 -4"
          />
          <motion.path {...animation} d="M2 10l1 4l1.5 -4l1.5 4l1 -4" />
          <motion.path {...animation} d="M17 10l1 4l1.5 -4l1.5 4l1 -4" />
          <motion.path {...animation} d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4" />
        </svg>
      );
    },
    title: "Website Scanner",
    description:
      "Analyze websites for common vulnerabilities, outdated software, and security misconfigurations to identify potential risks.",

    colors: [[0, 128, 128]],
  },
  {
    icon: (hovered: boolean) => {
      const animation = {
        initial: { pathLength: 1 },
        animate: hovered ? { pathLength: [0, 1] } : { pathLength: 1 },
        transition: { duration: 0.5, ease: "easeInOut" },
      };

      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          color={hovered ? "white" : "black"}
          fill={hovered ? "black" : "white"}
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <motion.path
            {...animation}
            d="M17 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
          />
          <motion.path
            {...animation}
            d="M3 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
          />
          <motion.path
            {...animation}
            d="M10 2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
          />
          <motion.path
            {...animation}
            d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"
          />
          <motion.path {...animation} d="M12 12V8" />
        </svg>
      );
    },
    title: "Network Scanner",
    description:
      "Explore and map out network environments, detecting active devices, open ports, and potential weaknesses in the network infrastructure.",

    colors: [[70, 130, 180]],
  },
  {
    icon: (hovered: boolean) => {
      const animation = {
        initial: { pathLength: 1 },
        animate: hovered ? { pathLength: [0, 1] } : { pathLength: 1 },
        transition: { duration: 0.5, ease: "easeInOut" },
      };
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          color={hovered ? "white" : "black"}
          fill={hovered ? "black" : "white"}
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <motion.path {...animation} d="M21 6H3" />
          <motion.path {...animation} d="M10 12H3" />
          <motion.path {...animation} d="M10 18H3" />
          <motion.path {...animation} d="M17 12a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
          <motion.path {...animation} d="m21 19-1.9-1.9" />
        </svg>
      );
    },
    title: "Subdomain Finder",
    description:
      "Identify hidden or less visible subdomains associated with a target domain, often used to discover unmonitored or vulnerable assets.",
    colors: [[138, 43, 226]],
  },
  {
    icon: (hovered: boolean) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        color={hovered ? "white" : "black"}
        fill={hovered ? "black" : "white"}
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <motion.path
          initial={{ pathLength: 1 }}
          animate={hovered ? { pathLength: [0, 1] } : { pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z"
        />
        <path d="M6 8v1" />
        <path d="M10 8v1" />
        <path d="M14 8v1" />
        <path d="M18 8v1" />
      </svg>
    ),
    title: "Port Scanner",
    description:
      "Scan a target for open ports to identify services running and potential entry points for attackers.",
    colors: [[50, 205, 50]],
  },
  {
    icon: (hovered: boolean) => {
      const animation = {
        initial: { pathLength: 1 },
        animate: hovered ? { pathLength: [0, 1] } : { pathLength: 1 },
        transition: { duration: 0.5, ease: "easeInOut" },
      };
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          color={hovered ? "white" : "black"}
          fill={hovered ? "black" : "white"}
        >
          <motion.path
            {...animation}
            d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <motion.path
            {...animation}
            d="M8.56854 12L7.71068 11.1421C6.76311 10.1946 6.76311 8.65825 7.71068 7.71068C8.65825 6.76311 10.1946 6.76311 11.1421 7.71068L16.2893 12.8579C17.2369 13.8054 17.2369 15.3418 16.2893 16.2893C15.3418 17.2369 13.8054 17.2369 12.8579 16.2893L10.9277 14.3591C9.51688 12.9483 11.5463 11.0463 13 12.5L14 13.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    },
    title: "URL Fuzzer",
    description:
      "Search for hidden directories and files on a web server by brute-forcing potential URLs, helping uncover security misconfigurations.0.",
    colors: [[0, 255, 255]],
  },
  {
    icon: (hovered: boolean) => {
      const animation = {
        initial: { pathLength: 1 },
        animate: hovered ? { pathLength: [0, 1] } : { pathLength: 1 },
        transition: { duration: 0.5, ease: "easeInOut" },
      };

      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          color={hovered ? "white" : "black"}
          fill={hovered ? "black" : "white"}
        >
          <motion.path
            {...animation}
            d="M2.5 12.0001C2.5 7.52178 2.5 5.28261 3.89124 3.89136C5.28249 2.50012 7.52166 2.50012 12 2.50012C16.4783 2.50012 18.7175 2.50012 20.1088 3.89136C21.5 5.28261 21.5 7.52178 21.5 12.0001C21.5 16.4785 21.5 18.7176 20.1088 20.1089C18.7175 21.5001 16.4783 21.5001 12 21.5001C7.52166 21.5001 5.28249 21.5001 3.89124 20.1089C2.5 18.7176 2.5 16.4785 2.5 12.0001Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <motion.path
            {...animation}
            d="M7.5 9.00012L8.5 16.0001C10.5 14.8001 12 10.8335 12.5 9.00012L14 16.0001C16 14.4001 17.1667 10.6668 17.5 9.00012"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    },
    title: "WordPress Scanner",
    description:
      "Specifically designed to detect vulnerabilities in WordPress installations, such as outdated plugins, themes, or misconfigurations, ensuring better WordPress security.",
    colors: [[75, 0, 130]],
  },
];

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis();

    let animationFrameID: number | undefined;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameID = requestAnimationFrame(raf);
    }

    animationFrameID = requestAnimationFrame(raf);

    return () => {
      if (animationFrameID) {
        cancelAnimationFrame(animationFrameID);
      }
    };
  }, []);

  const blackbg_sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: scrollYProgress_start } = useScroll({
    target: blackbg_sectionRef,
    offset: ["start end", "start start"],
  });

  const { scrollYProgress: scrollYProgress_end } = useScroll({
    target: blackbg_sectionRef,
    offset: ["end end", "end start"],
  });

  const [openHamburgerMenu, setOpenHamburgerMenu] = useState(false);

  return (
    <>
      <motion.div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: "0",
          left: "0",
          backgroundColor: "#000",
          opacity: scrollYProgress_start,
          zIndex: -12,
        }}
      />
      <motion.div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: "0",
          left: "0",
          backgroundColor: "#fff",
          opacity: scrollYProgress_end,
          zIndex: -11,
        }}
      />
      <motion.div
        style={{
          overflowY: openHamburgerMenu ? "hidden" : undefined,
        }}
      >
        <nav className="px-4 py-1 flex justify-between items-center">
          <Link href="/home">
            <img src={Logo.src} className="h-16" />
          </Link>
          <button
            aria-label={
              openHamburgerMenu ? "Close the sidebar" : "Open the sidebar"
            }
            onClick={() => setOpenHamburgerMenu((prev) => !prev)}
            className=" rotate-180 z-50 "
          >
            <HamburgerIcon open={openHamburgerMenu} />
          </button>

          <div
            data-state={openHamburgerMenu ? "open" : "closed"}
            className="fixed inset-0 z-40 hidden bg-black/80 fill-mode-forwards data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:block md:hidden"
          ></div>
          <nav
            data-state={openHamburgerMenu ? "open" : "closed"}
            className="fixed bg-white pt-14 inset-y-0 right-0 z-40 flex min-h-screen w-screen flex-col justify-between border-l border-solid border-l-gray-200  px-4 py-8 transition ease-in-out fill-mode-forwards data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-right sm:max-w-[50%] md:w-full"
          >
            <div className="flex justify-between h-full flex-col">
              <ul className="flex flex-col gap-2">
                {navigationLinks.map((link) => (
                  <li key={link} className="py-2 flex items-center gap-2 px-2">
                    <a
                      onClick={() => setOpenHamburgerMenu(false)}
                      href={`#${link}_section`}
                      className="font-semibold text-[#475467]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button className="w-1/2" variant={"secondary"}>
                  Signupf
                </Button>
                <Button className="w-1/2">Login</Button>
              </div>
            </div>
          </nav>
        </nav>
        <main className="flex flex-col pt-16">
          <div className="flex flex-col gap-12">
            <div className="px-4 flex gap-4 flex-col">
              <h1 className="text-gray-900 font-semibold text-4xl leading-[44px] tracking-[-0.76px]">
                Fortify Your Digital Defenses
              </h1>
              <p className="text-[18px] leading-7 text-gray-600">
                Uncover vulnerabilities before attackers do. Our cutting-edge
                pen testing tools empower you to scan networks, websites, and
                systems with the precision of a skilled hacker and the ethics of
                a trusted guardian.
              </p>
              <EncryptButton />
            </div>
            <div className="px-4">
              <video
                muted
                autoPlay
                playsInline
                preload={"none"}
                aria-label="Demo of the web app"
                className="aspect-video w-full rounded-lg"
                loop
              >
                <source src="demo.webm" type="video/webm"></source>
              </video>
            </div>
          </div>

          <div className="h-screen"></div>

          <motion.section
            ref={blackbg_sectionRef}
            className="flex flex-col text-white"
          >
            <TextRevealByWord
              renderNumberTicker={true}
              text="Cyber Attacks Targeted Businesses This Year"
            />
            <TextRevealByWord2
              firstText="Every 39 Seconds, Another Business Falls Victim."
              secondText="Watch as Cyber Attacks Rain Down on Businesses Nationwide. How Long Until One Hits You?"
            />

            <TextRevealByWord
              renderNumberTicker={false}
              text="60% of Small Businesses Close Within 6 Months of a Cyber Attack"
            />
            <TextRevealByWord
              renderNumberTicker={false}
              text="Your Business Could Be Next. Are You Prepared?"
            />
            <TextRevealByWord
              renderNumberTicker={false}
              text="Don't Become a Statistic. Secure Your Business Today With Our Advanced Penetration Testing Suite."
            />
          </motion.section>
          <div style={{ height: "100vh" }}></div>

          <div className="px-4 pt-16 flex gap-4 flex-col">
            <div className="flex flex-col gap-3">
              <h2 className="font-semibold text-sm text-red-500">Tools</h2>
              <h3 className="font-semibold text-3xl text-gray-900">
                Advanced Penetration Testing Suite
              </h3>
            </div>
            <p className="mt-1 text-[18px] leading-7 text-gray-600">
              Equip yourself with our comprehensive suite of pen testing tools.
              From website vulnerability scanners to network analyzers, cloud
              security assessments to system configuration checks, our platform
              offers everything you need to identify and mitigate potential
              threats across your entire digital ecosystem.
            </p>
            <div className="grid grid-cols-1 gap-4 mt-8">
              {tools.map(({ colors, ...props }) => (
                <Card key={props.title} {...props}>
                  <CanvasRevealEffect
                    animationSpeed={5.1}
                    containerClassName={"bg-black"}
                    colors={colors}
                  />
                </Card>
              ))}
            </div>
          </div>

          {/* <div className="px-4 pt-16 flex gap-4 flex-col">
            <div className="flex flex-col gap-3">
              <h2 className="font-semibold text-sm text-red-500">The Team</h2>
              <h3 className="font-semibold text-3xl text-gray-900">
                Meet The Team Behind IMS Technology
              </h3>
            </div>
            <p className="mt-1 text-[18px] leading-7 text-gray-600">
              Our dedicated team of cybersecurity professionals combines
              expertise in pentesting and innovative technology. With a passion
              for security, we're committed to providing you with the best tools
              to protect your business.
            </p>
            <div>
              <div className="grid grid-cols-1 gap-4 mt-8">
                {team.map((member) => (
                  <TeamCard member={member} />
                ))}
              </div>
              <div className="flex gap-4">
                <button className="rounded-full border border-solid border-gray-200 flex items-center justify-center w-12 h-12">
                  <img src={arrowRight.src} alt="" className="rotate-180" />
                </button>
                <button className="rounded-full border border-solid border-gray-200 flex items-center justify-center w-12 h-12">
                  <img src={arrowRight.src} alt="" />
                </button>
              </div>
            </div>
          </div> */}
          <TeamSection />
        </main>
      </motion.div>
    </>
  );
}

const TeamSection = () => {
  const [sliderPosition, setSliderPosition] = useState(0);

  const goToNextSlide = () => {};

  const goToPreviousSlide = () => {};

  return (
    <div className="px-4 pt-16 flex gap-4 flex-col">
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-sm text-red-500">The Team</h2>
        <h3 className="font-semibold text-3xl text-gray-900">
          Meet The Team Behind IMS Technology
        </h3>
      </div>
      <p className="mt-1 text-[18px] leading-7 text-gray-600">
        {
          " Our dedicated team of cybersecurity professionals combines expertise in pentesting and innovative technology. With a passion for security, we're committed to providing you with the best tools to protect your business."
        }
      </p>
      <div>
        <Carousel className="cursor-grab active:cursor-grabbing">
          <CarouselContent>
            {teamMembers.map((teamMember, index) => {
              return (
                <CarouselItem key={index} className="group">
                  <TeamMemberCard teamMember={teamMember} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <Footer />
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="px-4 py-12 flex flex-col gap-4 mt-40">
      <div>
        <img src={Logo.src} className="h-16" />
      </div>

      <ul className="grid grid-cols-1 smx:grid-cols-2 gap-3">
        {navigationLinks.map((link) => (
          <li key={link}>
            <Link href={`#${link}_section`} className="font-semibold ">
              {link}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4">© 2024 IMS Technolog. All rights reserved.</div>
    </div>
  );
};

const TeamMemberCard = ({ teamMember }: { teamMember: TeamMember }) => {
  const { image, role, name, socials, bio } = teamMember;
  return (
    <div className="relative overflow-hidden w-[280px] h-[432px] rounded-lg ">
      <img src={image} className="object-cover h-full rounded-lg" />
      <div className="px-5 py-6 flex flex-col gap-6 absolute bottom-0 z-10 group-hover:translate-y-0 group-hover:opacity-100 opacity-0 transition duration-500 translate-y-full left-0 bg-white bg-opacity-30  backdrop-blur rounded-b-lg w-full ">
        <div className="flex flex-col gap-3">
          <div className="font-semibold text-2xl text-white">{name}</div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-base text-white">{role}</div>
            <div className="text-sm text-white">{bio}</div>
          </div>
        </div>

        <ul className="flex gap-5">
          {socials.map(({ name, link, icon }) => (
            <li key={name}>
              <Link aria-label={`${name} profile link`} href={link}>
                <img
                  src={icon.src}
                  alt=""
                  className={name === "x" ? "w-4 h-5" : "w-5 h-5"}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Card = ({
  title,
  description,
  icon,
  children,
}: {
  children?: React.ReactNode;
  title: string;
  description: string;
  icon: (hovered: boolean) => JSX.Element;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col justify-between h-[350px] p-4 border border-solid border-[#E0E0E0] rounded-lg"
    >
      <div
        style={{
          backgroundColor: hovered ? "black" : "",
          borderColor: hovered ? "#333333" : "#E0E0E0",
        }}
        className="w-14 h-14 transition-colors border border-solid text-gray-600 rounded-lg flex items-center justify-center"
      >
        {icon(hovered)}
      </div>
      <div className="flex gap-1 flex-col">
        <h4
          className={`font-semibold text-xl transition-colors ${hovered ? "text-white" : "text-[#101828]"}`}
        >
          {title}
        </h4>
        <p
          className={`font-medium  transition-colors ${hovered ? "text-gray-300" : "text-gray-700"}`}
        >
          {description}
        </p>
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0 -z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// /*0322*/
// const Globe = () => {
//   const targetRef = useRef<HTMLDivElement | null>(null);

//   const { scrollYProgress } = useScroll({
//     target: targetRef,
//   });

//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   const phiProgress = useTransform(scrollYProgress, [0, 1], [0, 4.56]);

//   // const zoomProgress = useTransform(scrollYProgress, [0, 1], []);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     let phi = 0;
//     let scale = 0;

//     const globe = createGlobe(canvasRef.current, {
//       devicePixelRatio: 2,
//       width: canvasRef.current.width,
//       height: canvasRef.current.height,
//       phi: 0,
//       theta: 0.21,
//       dark: 1,
//       scale: 0,
//       diffuse: 1.2,
//       mapSamples: 16000,
//       mapBrightness: 6,
//       baseColor: [0.3, 0.3, 0.3],
//       markerColor: [0.1, 0.8, 1],
//       glowColor: [0.8745, 0.1255, 0.1961],
//       markers: [],

//       onRender: (state) => {
//         // Called on every animation frame.
//         // `state` will be an empty object, return updated params.
//         // state.phi = phi;
//         // phi += 0.01;
//         state.scale = scale;
//         state.phi = phi;
//       },
//     });

//     scrollYProgress.on("change", (value) => {
//       scale = value;
//     });

//     phiProgress.on("change", (value) => {
//       phi = value;
//     });

//     return () => {
//       globe.destroy();
//     };
//   }, []);

//   return (
//     <div ref={targetRef} className={"h-[200vh]"}>
//       <div
//         className={
//           "sticky top-0 left-0 mx-auto flex h-1/2 max-w-4xl items-center bg-transparent px-4 py-5"
//         }
//       >
//         <canvas
//           ref={canvasRef}
//           style={{
//             width: "100%",
//             maxWidth: "100vw",
//             aspectRatio: 1,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

interface TextRevealByWordProps {
  firstText: string;
  className?: string;
  secondText: string;
}

const TextRevealByWord2: FC<TextRevealByWordProps> = ({
  firstText,
  secondText,
  className,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const [words, setWords] = useState(firstText.split(" "));

  const paragraphOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.45, 0.5],
    [1, 0, 1],
  );

  scrollYProgress.on("change", (v) => {
    if (v > 0.45) {
      setWords((prev) => {
        if (prev[0] === "Watch") {
          return prev;
        }
        return secondText.split(" ");
      });

      return;
    }
    setWords((prev) => {
      if (prev[0] === "Every") {
        return prev;
      }
      return firstText.split(" ");
    });
  });

  const scrollYProgress_2 = useTransform(
    scrollYProgress,
    [0, 0.4, 0.45, 1],
    [0, 0.4, 0, 0.4],
  );

  const positionZ = useTransform(scrollYProgress, [0.45, 0.7], [12000, 300]);
  const rotation = useTransform(scrollYProgress, [0.45, 0.7], [263, 0]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={targetRef} className={cn("h-[800vh]", className)}>
      <div
        className={
          "sticky flex-col top-0 left-0 mx-auto flex h-fit max-w-4xl bg-transparent px-4 py-5"
        }
      >
        <motion.p
          style={{ opacity: paragraphOpacity }}
          className={
            "flex flex-wrap h-fit justify-center text-[46px] font-bold md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl"
          }
        >
          {words.map((word, i) => {
            const start = (i / words.length) * (2 / 5);
            const end = start + 2 / 5 / words.length;
            console.log("start: ", start, "///", "end: ", end);
            return (
              <Word key={i} progress={scrollYProgress_2} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </motion.p>
        <motion.div ref={containerRef} className="h-[70vh]">
          <World
            containerRef={containerRef}
            positionZ={positionZ}
            rotation={rotation}
          />
        </motion.div>
      </div>
    </div>
  );
};

const World = dynamic(
  () => import("@/components/ui/Globe").then((m) => m.World),
  {
    ssr: false,
  },
);

interface WordProps {
  children: ReactNode;
  progress: any;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  // opacity.on("change", (v) => {
  //   console.log("opacity: " + v + key);
  // });
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className={"absolute opacity-30"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-black dark:text-white"}
      >
        {children}
      </motion.span>
    </span>
  );
};
