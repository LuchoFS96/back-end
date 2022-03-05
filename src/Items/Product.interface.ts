export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: string;
  stock: number;
  categoriesId: string[];
  shopId: string;
}

export interface Products {
  [key: number]: Product;
}