import * as React from "react"
import { cn } from "@/lib/utils"

interface ContentCardProps extends React.ComponentProps<"div"> {
  /**
   * If true, the card will have pt-0 to allow images to extend to the top edge.
   * If false, the card will have the default py-6 padding.
   */
  hasImage?: boolean
}

/**
 * ContentCard - A card component that handles padding based on whether it contains an image
 * 
 * - For cards WITH images at the top: use hasImage={true} to get pt-0 pb-6
 * - For cards WITHOUT images: leave hasImage={false} (default) to get py-6
 */
function ContentCard({ className, hasImage = false, ...props }: ContentCardProps) {
  return (
    <div
      data-slot="content-card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
        hasImage ? "pt-0 pb-6" : "py-6",
        className
      )}
      {...props}
    />
  )
}

function ContentCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function ContentCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function ContentCardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function ContentCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function ContentCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function ContentCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

/**
 * ContentCardImage - Container for the image at the top of the card
 * Use this when you have an image that should span edge-to-edge at the top
 */
function ContentCardImage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-image"
      className={cn("overflow-hidden rounded-t-xl", className)}
      {...props}
    />
  )
}

export {
  ContentCard,
  ContentCardHeader,
  ContentCardFooter,
  ContentCardTitle,
  ContentCardAction,
  ContentCardDescription,
  ContentCardContent,
  ContentCardImage,
}
