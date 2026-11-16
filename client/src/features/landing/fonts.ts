import { Montserrat, BBH_Bogle } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-landing-body",
  display: "swap",
});

export const bbhBogle = BBH_Bogle({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-landing-display",
  display: "swap",
});
