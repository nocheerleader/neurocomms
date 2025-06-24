export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
}

export const products: Product[] = [
  {
    id: 'prod_SYcqeKN9nMV7I6',
    priceId: 'price_1RdVb3E9sWWwOMdjyjm5reN3',
    name: 'Premium',
    description: 'Neurocomms Premium Subscription',
    mode: 'subscription',
    price: 19.00,
    currency: 'usd',
    interval: 'month',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};