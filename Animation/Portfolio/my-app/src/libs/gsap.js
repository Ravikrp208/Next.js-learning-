import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "./SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { ScrollTrigger, SplitText, useGSAP };
export default gsap;