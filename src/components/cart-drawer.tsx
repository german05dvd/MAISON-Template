import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, useCartItems, useCartTotal } from "@/stores/cart-store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartItems();
  const total = useCartTotal();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // Bloqueo de scroll cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const formatPrice = (n: number) => `€ ${n.toLocaleString("es-ES")}`;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-background shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
            <h2 className="font-serif text-xl tracking-wide">Tu carrito</h2>
            <button type="button" onClick={onClose} className="p-2 hover:opacity-60">
              <X strokeWidth={1} className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <ShoppingBag strokeWidth={1} className="h-16 w-16 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-5">
                    <div className="h-28 w-24 shrink-0 overflow-hidden bg-muted">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <h3 className="font-serif text-base">{item.name}</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                          <span className="px-3 text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border/60 px-6 py-6 bg-background">
              <div className="flex justify-between mb-6">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif text-xl">{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" onClick={onClose} className="flex w-full justify-center bg-black py-4 text-[11px] uppercase tracking-[0.28em] text-background">
                Finalizar pedido
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}