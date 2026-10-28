/*
 * CRAVE & SIP — PRODUCT CATALOGUE
 * These are provisional sample items/prices supplied for website development.
 * Confirm every product, description, size and price with the business owner before launch.
 * To edit the menu, update this array. Price values are integer naira amounts.
 */
window.CRAVE_CONFIG = {
  whatsappNumber: "2348024850065", // international format, digits only
  currency: "NGN",
  currencyLocale: "en-NG",
  businessName: "Crave & Sip",
  deliveryFee: null // Keep null until an explicit delivery pricing rule is confirmed.
};

window.CRAVE_PRODUCTS = [
  {
    id: "classic-zobo",
    name: "Classic Zobo",
    category: "zobo",
    description: "A familiar local favourite for a fruity refresh.",
    price: 1000,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of a red fruit drink; illustrative only",
    colour: "berry",
    badge: "Local favourite",
    available: true
  },
  {
    id: "zobo-ginger-twist",
    name: "Zobo Ginger Twist",
    category: "zobo",
    description: "A zobo sample with a little extra personality.",
    price: 1200,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1513558161293-cdac6e126e49?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of a citrus drink; illustrative only",
    colour: "mint",
    badge: "A little twist",
    available: true
  },
  {
    id: "classic-chapman",
    name: "Classic Chapman",
    category: "classic",
    description: "A colourful classic for a proper treat moment.",
    price: 1800,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1536935338788846bb9981813?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of a bright red drink; illustrative only",
    colour: "purple",
    badge: "Party mood",
    available: true
  },
  {
    id: "fresh-orange-juice",
    name: "Fresh Orange Juice",
    category: "juice",
    description: "A sunny citrus sip for your next craving.",
    price: 2000,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of orange juice; illustrative only",
    colour: "orange",
    badge: "Sunshine in a cup",
    available: true
  },
  {
    id: "pineapple-juice",
    name: "Pineapple Juice",
    category: "juice",
    description: "A bright tropical-style sample from the draft menu.",
    price: 1800,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of a yellow fruit drink; illustrative only",
    colour: "yellow",
    badge: "",
    available: true
  },
  {
    id: "watermelon-juice",
    name: "Watermelon Juice",
    category: "juice",
    description: "A rosy, fruit-forward idea for a refreshing break.",
    price: 1500,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1527761939622-911b9b4f9e8c?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of a pink summer drink; illustrative only",
    colour: "pink",
    badge: "Pink pick",
    available: true
  },
  {
    id: "tropical-fruit-blend",
    name: "Tropical Fruit Blend",
    category: "blend",
    description: "A colourful blend concept for the sample catalogue.",
    price: 2200,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of a mixed fruit smoothie; illustrative only",
    colour: "berry",
    badge: "Tropical mood",
    available: true
  },
  {
    id: "strawberry-smoothie",
    name: "Strawberry Smoothie",
    category: "blend",
    description: "A creamy-looking berry idea for the sample menu.",
    price: 2500,
    size: "50cl",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Temporary stock photo of a pink berry smoothie; illustrative only",
    colour: "pink",
    badge: "Berry good",
    available: true
  }
];
