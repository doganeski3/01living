import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/products';

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: { nl: string | null, en: string | null };
  selectedColor?: { nl: string | null, en: string | null };
  selectedSize?: { nl: string | null, en: string | null };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variantId?: string, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (isOpen: boolean) => set({ isOpen }),

      addItem: (product: Product, variantId?: string, quantity: number = 1) => {
        set((state) => {
          const variant = product.variants?.find(v => v.id === variantId);
          const price = variant ? variant.price : product.price;
          
          const existingItem = state.items.find(
            (item) => item.id === product.id && item.selectedVariantId === variantId
          );

          if (existingItem && existingItem.quantity >= 5) return state;

          const addedQuantity = Math.min(quantity, 5 - (existingItem?.quantity || 0));

          const newItems = existingItem
            ? state.items.map((item) =>
                item.id === product.id && item.selectedVariantId === variantId
                  ? { ...item, quantity: item.quantity + addedQuantity }
                  : item
              )
            : [
                ...state.items, 
                { 
                  ...product, 
                  price, // Use variant price if selected
                  quantity: addedQuantity, 
                  selectedVariantId: variantId,
                  selectedVariantName: variant?.name || null,
                  selectedColor: variant?.color || null,
                  selectedSize: variant?.size || null
                }
              ];
          
          return { items: newItems, isOpen: true };
        });
      },

      removeItem: (productId: string, variantId?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === productId && item.selectedVariantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number, variantId?: string) => {
        set((state) => {
          if (quantity <= 0) {
            return { 
              items: state.items.filter(
                (item) => !(item.id === productId && item.selectedVariantId === variantId)
              ) 
            };
          }
          const limitedQuantity = Math.min(quantity, 5);

          return {
            items: state.items.map((item) =>
              item.id === productId && item.selectedVariantId === variantId
                ? { ...item, quantity: limitedQuantity } 
                : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: '01-living-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
