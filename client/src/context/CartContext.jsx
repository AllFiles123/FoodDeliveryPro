import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_KEY = "fooddeliverypro-cart";
const LEGACY_CART_KEY = "cart";

function normalizeItem(item) {
  if (!item || item.id == null) return null;

  const price =
    typeof item.price === "number"
      ? item.price
      : Number(
          String(item.price ?? 0)
            .replace(/[৳$,\s]/g, "")
        ) || 0;

  const qtyValue =
    item.qty ?? item.quantity ?? 1;

  const qty = Math.max(
    1,
    Number(qtyValue) || 1
  );

  return {
    ...item,
    price,
    qty,
  };
}

function loadInitialCart() {
  try {
    const currentSaved =
      localStorage.getItem(CART_KEY);

    if (currentSaved) {
      const parsed = JSON.parse(currentSaved);

      if (Array.isArray(parsed)) {
        return parsed
          .map(normalizeItem)
          .filter(Boolean);
      }
    }

    /*
     * Backward compatibility:
     * HomePage-এর পুরোনো "cart" storage থাকলে
     * সেটাও একবার migrate হবে।
     */
    const legacySaved =
      localStorage.getItem(LEGACY_CART_KEY);

    if (legacySaved) {
      const parsed = JSON.parse(legacySaved);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) =>
            normalizeItem({
              ...item,
              qty:
                item.qty ??
                item.quantity ??
                1,
            })
          )
          .filter(Boolean);
      }
    }
  } catch (error) {
    console.error(
      "Failed to load cart:",
      error
    );
  }

  return [];
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(
    loadInitialCart
  );

  /*
   * Persist cart.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
      );

      /*
       * Keep old storage key synchronized temporarily
       * so older components do not create a second cart.
       */
      localStorage.setItem(
        LEGACY_CART_KEY,
        JSON.stringify(
          cart.map((item) => ({
            ...item,
            quantity: item.qty,
          }))
        )
      );

      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            cart,
            totalItems: cart.reduce(
              (sum, item) =>
                sum + (Number(item.qty) || 0),
              0
            ),
          },
        })
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart]);

  /*
   * Add item.
   */
  const addToCart = (item) => {
    const normalizedItem =
      normalizeItem(item);

    if (!normalizedItem) return;

    setCart((prev) => {
      const existing = prev.find(
        (cartItem) =>
          String(cartItem.id) ===
          String(normalizedItem.id)
      );

      if (existing) {
        return prev.map((cartItem) =>
          String(cartItem.id) ===
          String(normalizedItem.id)
            ? {
                ...cartItem,
                ...normalizedItem,
                qty:
                  (Number(cartItem.qty) || 1) +
                  1,
              }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          ...normalizedItem,
          qty: 1,
        },
      ];
    });
  };

  /*
   * Add a specific quantity.
   */
  const addMultipleToCart = (
    item,
    quantity = 1
  ) => {
    const normalizedItem =
      normalizeItem(item);

    const amount = Math.max(
      1,
      Number(quantity) || 1
    );

    if (!normalizedItem) return;

    setCart((prev) => {
      const existing = prev.find(
        (cartItem) =>
          String(cartItem.id) ===
          String(normalizedItem.id)
      );

      if (existing) {
        return prev.map((cartItem) =>
          String(cartItem.id) ===
          String(normalizedItem.id)
            ? {
                ...cartItem,
                ...normalizedItem,
                qty:
                  (Number(cartItem.qty) || 1) +
                  amount,
              }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          ...normalizedItem,
          qty: amount,
        },
      ];
    });
  };

  /*
   * Increase quantity.
   */
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              qty:
                (Number(item.qty) || 1) + 1,
            }
          : item
      )
    );
  };

  /*
   * Decrease quantity.
   */
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(id)
            ? {
                ...item,
                qty:
                  (Number(item.qty) || 1) - 1,
              }
            : item
        )
        .filter(
          (item) =>
            (Number(item.qty) || 0) > 0
        )
    );
  };

  /*
   * Set exact quantity.
   */
  const setItemQty = (id, quantity) => {
    const amount = Math.max(
      0,
      Number(quantity) || 0
    );

    setCart((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(id)
            ? {
                ...item,
                qty: amount,
              }
            : item
        )
        .filter(
          (item) =>
            (Number(item.qty) || 0) > 0
        )
    );
  };

  /*
   * Remove item.
   */
  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          String(item.id) !== String(id)
      )
    );
  };

  /*
   * Clear entire cart.
   */
  const clearCart = () => {
    setCart([]);

    try {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(
        LEGACY_CART_KEY
      );

      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            cart: [],
            totalItems: 0,
          },
        })
      );
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );
    }
  };

  /*
   * Total item quantity.
   */
  const totalItems = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          (Number(item.qty) || 0),
        0
      ),
    [cart]
  );

  /*
   * Total price.
   */
  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          (Number(item.price) || 0) *
            (Number(item.qty) || 0),
        0
      ),
    [cart]
  );

  /*
   * Individual cart item count.
   */
  const getItemQty = (id) => {
    const item = cart.find(
      (cartItem) =>
        String(cartItem.id) ===
        String(id)
    );

    return item
      ? Number(item.qty) || 0
      : 0;
  };

  const value = {
    cart,

    addToCart,
    addMultipleToCart,

    increaseQty,
    decreaseQty,
    setItemQty,

    removeFromCart,
    clearCart,

    getItemQty,

    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
