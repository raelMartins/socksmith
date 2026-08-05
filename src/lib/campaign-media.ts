/** Primary campaign creative — stored in `public/images/campaign` (+ `public/videos`). */

export type CampaignMediaKind = "image" | "video";

export type CampaignMedia = {
  id: string;
  kind: CampaignMediaKind;
  /** Public path under `/` */
  src: string;
  alt: string;
  /** Hover / gallery caption */
  caption: string;
};

export function campaignImageSrc(filename: string): string {
  return encodeURI(`/images/campaign/${filename}`);
}

export const CAMPAIGN_VIDEO: CampaignMedia = {
  id: "socksmight-video",
  kind: "video",
  src: "/videos/Socksmight.mp4",
  alt: "Socksmith campaign film",
  caption: "😊 Good Energy",
};

/**
 * Full campaign set for lookbook / gallery.
 * Captions prefer the colourway names when a clear match exists;
 * otherwise use the editorial line from the file / creative.
 */
export const CAMPAIGN_MEDIA: CampaignMedia[] = [
  {
    id: "bold",
    kind: "image",
    src: campaignImageSrc("Bold.jpg"),
    alt: "Pink socks on orange",
    caption: "🩷 Pink Theory",
  },
  {
    id: "just-socks",
    kind: "image",
    src: campaignImageSrc("Just_socks.jpg"),
    alt: "Red and pink graphic socks",
    caption: "💗 Candy Rush",
  },
  {
    id: "sock-essential",
    kind: "image",
    src: campaignImageSrc("Sock_Essential.jpg"),
    alt: "Blue socks on tennis court",
    caption: "🔵 Blue Static",
  },
  {
    id: "comfort-2",
    kind: "image",
    src: campaignImageSrc("Comfort_2.jpg"),
    alt: "Cream socks comfort style",
    caption: "🟡 Morning Haze",
  },
  {
    id: "cosy",
    kind: "image",
    src: campaignImageSrc("Cosy.jpg"),
    alt: "Cosy cream socks",
    caption: "😊 Soft Mischief",
  },
  {
    id: "cosy-in-air",
    kind: "image",
    src: campaignImageSrc("Cosy_in_air.jpg"),
    alt: "Socks in the air outdoors",
    caption: "🔵 Coastal Drift",
  },
  {
    id: "quality",
    kind: "image",
    src: campaignImageSrc("Quality.jpg"),
    alt: "Quality outdoor socks",
    caption: "🌿 Spring Melt",
  },
  {
    id: "pink",
    kind: "image",
    src: campaignImageSrc("Pink.jpg"),
    alt: "Pink gradient socks outdoors",
    caption: "🩷 Pink Theory",
  },
  {
    id: "feet-in-the-air",
    kind: "image",
    src: campaignImageSrc("Feet_in_the_air.jpg"),
    alt: "Pink socks against the sky",
    caption: "💗 Candy Rush",
  },
  {
    id: "no-off-days",
    kind: "image",
    src: campaignImageSrc("No_off_days.jpg"),
    alt: "White socks on orange court",
    caption: "🟠 Summer Churn",
  },
  {
    id: "big-feeling",
    kind: "image",
    src: campaignImageSrc("Big_feeling.jpg"),
    alt: "Cream socks on yellow",
    caption: "😊 Good Energy",
  },
  {
    id: "wear-socksmith",
    kind: "image",
    src: campaignImageSrc("Wear_Socksmith.jpg"),
    alt: "Green gradient socks",
    caption: "🟢 Fresh Signal",
  },
  {
    id: "wear-cream",
    kind: "image",
    src: campaignImageSrc("Wear_Socksmith_2_cream.jpg"),
    alt: "Cream gradient socks",
    caption: "🟩 Field Notes",
  },
  {
    id: "luxury",
    kind: "image",
    src: campaignImageSrc("Luxury.jpg"),
    alt: "Luxury cream socks on leather",
    caption: "🟡 Morning Haze",
  },
  {
    id: "pop",
    kind: "image",
    src: campaignImageSrc("POP.jpg"),
    alt: "Yellow socks with red ball",
    caption: "♦️ Golden Frequency",
  },
  {
    id: "jeans",
    kind: "image",
    src: campaignImageSrc("Jeans.jpg"),
    alt: "Red socks with jeans",
    caption: "♦️ Autumn Static",
  },
  {
    id: "statement",
    kind: "image",
    src: campaignImageSrc("Statement.jpg"),
    alt: "Socksmith statement packaging",
    caption: "😊 Soft Mischief",
  },
  {
    id: "sweat-the-details",
    kind: "image",
    src: campaignImageSrc("Sweat_the_details.jpg"),
    alt: "Close-up sock details",
    caption: "🟩 Field Notes",
  },
  {
    id: "heels",
    kind: "image",
    src: campaignImageSrc("Heels.jpg"),
    alt: "Heels and socks detail",
    caption: "😊 Soft Mischief",
  },
  {
    id: "socksmith-01",
    kind: "image",
    src: campaignImageSrc("Socksmith-01.jpg"),
    alt: "Black mesh no-show socks",
    caption: "♦️ Autumn Static",
  },
  {
    id: "socksmith-07",
    kind: "image",
    src: campaignImageSrc("Socksmith-07.jpg"),
    alt: "Light mesh socks on asphalt",
    caption: "🔵 Coastal Drift",
  },
  {
    id: "socksmith-08",
    kind: "image",
    src: campaignImageSrc("Socksmith-08.jpg"),
    alt: "Pink to blue gradient socks",
    caption: "🩷 Pink Theory",
  },
  CAMPAIGN_VIDEO,
];

/** Hero composition — matches the design mockup cards. */
export const HERO_CAMPAIGN = {
  left: {
    src: campaignImageSrc("Bold.jpg"),
    alt: "Soft pink socks on bold orange",
    caption: "Soft never looked so bold.",
  },
  right: {
    src: campaignImageSrc("Just_socks.jpg"),
    alt: "Graphic red and pink sock campaign",
    caption: "Just socks, they said.",
  },
  small: {
    src: campaignImageSrc("Sock_Essential.jpg"),
    alt: "Blue sock essentials on court",
    caption: "Sock essentials for every occasion.",
  },
} as const;

/** Testimonial feature strip under the quote cards. */
export const TESTIMONIAL_FEATURES = [
  {
    src: campaignImageSrc("Cosy.jpg"),
    alt: "Cosy cream socks lifestyle",
    caption: "Cosy is always in season.",
  },
  {
    src: campaignImageSrc("Comfort_2.jpg"),
    alt: "Pulling on cream socks",
    caption: "Comfort style.",
  },
] as const;
