export interface DrinkOption {
  size: "Small" | "Medium" | "Large";
  temperature: "Hot" | "Iced";
  sugar: "No Sugar" | "Less Sugar" | "Normal" | "Extra Sugar";
  milk: "None" | "Oat milk" | "Soy milk" | "Almond milk";
  quantity: number;
}

export interface CartItem extends DrinkOption {
  name: string;
  price: number;
  image: string; 
}