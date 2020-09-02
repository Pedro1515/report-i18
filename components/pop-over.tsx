import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import classNames from "classnames";

interface PopOverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  origin?: string;
}

export const PopOver = React.forwardRef(
  (
    { children, origin, ...props }: PopOverProps & HTMLMotionProps<"div">,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const variants = {
      visible: { opacity: 1, scale: 1 },
      hidden: { opacity: 0, scale: 0.95 },
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className={classNames(
          "absolute",
          "w-56",
          "rounded-md",
          "shadow-lg",
          "origin-top-right",
          "right-0",
          "mt-2",
          "z-10"
        )}
        {...props}
      >
        <div className="rounded-md bg-white shadow-xs">{children}</div>
      </motion.div>
    );
  }
);
