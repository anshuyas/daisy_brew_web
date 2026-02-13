export type Category = 
  | "Coffee"
  | "Matcha"
  | "Smoothies"
  | "Bubble Tea"
  | "Tea";

export interface MenuItem {
  name: string;
  price: number;
  image: string;
  category: Category;
}
