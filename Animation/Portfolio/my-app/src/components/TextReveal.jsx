"use client";

import gsap, { ScrollTrigger, SplitText, useGSAP } from "@/libs/gsap";
import { forwardRef, useImperativeHandle, useRef } from "react";

const TextReveal = forwardRef(
  (
    {
      children,
      className = "",
      trigger = "mount",
      scrollStart = "top 75%",
      splitBy = "lines",
      duration = 0.67,
      stagger = 0.085,
      delay = 0,
      ease = "power3.out",
    },
    ref,
  ) => {
    const wrapperRef = useRef(null);
    const splitRef = useRef(null);
    const tlRef = useRef(null);

    useImperativeHandle(ref, () => ({
      play: () => tlRef.current?.play(),
      reverse: () => tlRef.current?.reverse(),
      reset: () => tlRef.current?.pause(0),
    }));

    useGSAP(
      () => {
        splitRef.current = new SplitText(wrapperRef.current, {
          type: splitBy,
          lineThreshold: 0.3,
        });

        const elements = splitRef.current[splitBy];

        gsap.set(elements, {
          yPercent: 110,
        });

        tlRef.current = gsap.timeline({
          paused: true,
          defaults: { delay },
        });

        tlRef.current.to(elements, {
          yPercent: 0,
          opacity: 1,
          duration,
          ease,
          stagger: {
            each: stagger,
            from: "start",
          },
        });

        if (trigger === "mount") {
          tlRef.current.play();
        }

        if (trigger === "scroll") {
          ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: scrollStart,
            once: true,
            onEnter: () => tlRef.current?.play(),
          });
        }

        return () => {
          tlRef.current?.kill();
          splitRef.current?.revert();
        };
      },
      {
        scope: wrapperRef,
        dependencies: [splitBy, trigger, stagger, duration],
      },
    );

    return (
      <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
        {children}
      </div>
    );
  },
);

export default TextReveal;