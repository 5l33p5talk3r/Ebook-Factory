import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { 
  ShoppingBag, 
  Trash2, 
  X, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Lock, 
  BookOpen, 
  ArrowRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { CartItem, CompletedOrder } from '../types/factory';
import { toast } from 'sonner';

interface CommerceCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onCompleteOrder: (order: CompletedOrder) => void;
  onNavigateToLibrary: () => void;
}

export const CommerceCheckout: React.FC<CommerceCheckoutProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
  onCompleteOrder,
  onNavigateToLibrary
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [customerEmail, setCustomerEmail] = useState<string>('reader@example.com');
  const [customerName, setCustomerName] = useState<string>('Valued Reader');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const rawPaypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const isPayPalConfigured = Boolean(
    rawPaypalClientId && 
    rawPaypalClientId.trim() !== "" && 
    rawPaypalClientId !== "test"
  );

  const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-xl bg-[#11131C] border-l border-[#232738] h-full flex flex-col justify-between text-slate-100 font-sans overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#232738] flex items-center justify-between bg-[#141724]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E5C158]" />
              <h2 className="text-xl font-serif font-bold text-white">
                {step === 'cart' && 'Your Shopping Cart'}
                {step === 'checkout' && 'Secure Checkout'}
                {step === 'confirmation' && 'Order Confirmed!'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1B1F2E] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Step 1: Cart Items */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-slate-400 font-serif">Your shopping cart is empty.</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-[#201D13] border border-[#584B28] text-[#E5C158] text-xs font-semibold cursor-pointer"
                    >
                      Browse Ebooks
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-4 rounded-xl bg-[#161924] border border-[#232738] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.coverUrl}
                            alt={item.product.title}
                            className="w-12 h-16 object-cover rounded-md border border-slate-700"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-white">{item.product.title}</h4>
                            <p className="text-xs text-slate-400">By {item.product.author}</p>
                            <p className="text-xs text-[#E5C158] font-mono mt-1">${item.product.price.toFixed(2)}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Step 2: Checkout Form & PayPal */}
            {step === 'checkout' && (
              <div className="space-y-6">
                
                {/* Buyer Details */}
                <div className="bg-[#161924] border border-[#232738] rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Buyer Information</h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0D12] border border-[#2A2E42] text-xs text-white focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email (for digital download receipt)</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0D12] border border-[#2A2E42] text-xs text-white focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                </div>

                {/* PayPal Smart Buttons or Environment Setup Notice */}
                <div className="bg-[#161924] border border-[#232738] rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#E5C158]" />
                      Payment Method
                    </span>
                    <span className="text-[10px] text-slate-400 bg-[#0B0D12] px-2 py-0.5 rounded border border-slate-700">
                      256-Bit SSL Encrypted
                    </span>
                  </div>

                  {isPayPalConfigured ? (
                    <PayPalScriptProvider options={{ clientId: rawPaypalClientId!, currency: "USD" }}>
                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                        createOrder={async () => {
                          try {
                            const res = await fetch("/api/paypal/create-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                items: cart.map(i => ({
                                  product: i.product,
                                  quantity: i.quantity
                                }))
                              })
                            });
                            const data = await res.json();
                            if (!data.success || !data.orderId) {
                              throw new Error(data.error || "PayPal order creation failed on server");
                            }
                            return data.orderId;
                          } catch (err: any) {
                            console.error("Error initiating PayPal order:", err);
                            toast.error(err.message || "Could not initiate PayPal checkout. Cart items preserved.");
                            throw err;
                          }
                        }}
                        onApprove={async (data) => {
                          setIsProcessing(true);
                          try {
                            const res = await fetch("/api/paypal/capture-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                orderId: data.orderID,
                                items: cart.map(i => ({
                                  product: i.product,
                                  quantity: i.quantity
                                })),
                                customerEmail,
                                customerName
                              })
                            });
                            const captureData = await res.json();
                            if (captureData.success && captureData.status === "COMPLETED") {
                              const newOrder: CompletedOrder = {
                                id: captureData.orderId,
                                receiptId: captureData.receiptId,
                                customerEmail: captureData.customerEmail || customerEmail,
                                customerName: captureData.customerName || customerName,
                                totalAmount: captureData.totalAmount || totalAmount,
                                items: [...cart],
                                entitlements: captureData.entitlements,
                                purchasedAt: captureData.purchasedAt || new Date().toISOString()
                              };
                              setCompletedOrder(newOrder);
                              onCompleteOrder(newOrder);
                              onClearCart();
                              setStep('confirmation');
                              toast.success("PayPal Payment Verified & Completed!");
                            } else {
                              throw new Error(captureData.error || `Payment capture returned status: ${captureData.status || "FAILED"}`);
                            }
                          } catch (err: any) {
                            console.error("PayPal capture error:", err);
                            toast.error(err.message || "Payment capture failed. Cart items remain in your cart.");
                          } finally {
                            setIsProcessing(false);
                          }
                        }}
                        onError={(err) => {
                          console.error("PayPal SDK error:", err);
                          toast.error("PayPal SDK error occurred. Your cart has not been modified.");
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#1C1810] border border-[#584B20] text-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-[#E5C158] font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 text-[#E5C158]" />
                        <span>PayPal Checkout Requires Environment Configuration</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        To enable live PayPal payments, please configure <code className="text-[#E5C158] font-mono px-1.5 py-0.5 bg-black/40 rounded">VITE_PAYPAL_CLIENT_ID</code>, <code className="text-[#E5C158] font-mono px-1.5 py-0.5 bg-black/40 rounded">PAYPAL_CLIENT_ID</code>, and <code className="text-[#E5C158] font-mono px-1.5 py-0.5 bg-black/40 rounded">PAYPAL_CLIENT_SECRET</code> in your server environment variables.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Cart items are securely preserved until valid payment credentials are provided.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Step 3: Confirmation & Digital Downloads */}
            {step === 'confirmation' && completedOrder && (
              <div className="space-y-6">
                <div className="text-center py-4 bg-[#141A14] border border-[#234A23] rounded-2xl p-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                  <h3 className="text-xl font-serif font-bold text-white">Payment Received!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Receipt <strong className="text-[#E5C158] font-mono">{completedOrder.receiptId}</strong> sent to {completedOrder.customerEmail}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Digital Downloads</h4>
                  {completedOrder.items.map((item) => (
                    <div key={item.product.id} className="p-4 rounded-xl bg-[#161924] border border-[#232738] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-[#E5C158]" />
                        <div>
                          <p className="font-serif font-bold text-sm text-white">{item.product.title}</p>
                          <p className="text-xs text-slate-400">PDF & EPUB Format</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toast.success(`Downloading PDF for ${item.product.title}...`)}
                          className="px-3 py-1.5 rounded-lg bg-[#201D13] border border-[#584B28] text-[#E5C158] text-xs font-semibold hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </button>
                        <button
                          onClick={() => toast.success(`Downloading EPUB for ${item.product.title}...`)}
                          className="px-3 py-1.5 rounded-lg bg-[#1D2233] border border-[#3A3F58] text-slate-200 text-xs font-semibold hover:bg-[#2A314A] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          EPUB
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToLibrary();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B58A28] text-black font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 fill-black" />
                  Access in My Library
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* Footer Summary Bar */}
          {step !== 'confirmation' && cart.length > 0 && (
            <div className="p-6 border-t border-[#232738] bg-[#141724] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Price ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                <span className="text-2xl font-serif font-bold text-[#E5C158]">${totalAmount.toFixed(2)}</span>
              </div>

              {step === 'cart' && (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B58A28] text-black font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
