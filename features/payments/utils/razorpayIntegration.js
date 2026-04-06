import { createSSRPayment, verifyPaymentSignature } from "@/features/payments/store/paymentSlice";
import toast from "react-hot-toast";

/**
 * Initiates the Razorpay checkout process.
 * 
 * @param {Object} params - Configuration and dependencies for the checkout.
 * @param {string} params.ssrId - The Server-Side Render (SSR) internal ID.
 * @param {number} params.blockAmount - Amount to be blocked.
 * @param {Function} params.dispatch - Redux dispatch function.
 * @param {Object} params.router - Next.js router instance.
 * @param {Function} params.setIsProcessing - State setter to handle UI loading state.
 */
export const handleRazorpayCheckout = async ({
    ssrId,
    blockAmount,
    dispatch,
    router,
    setIsProcessing
}) => {
    if (!ssrId) {
        toast.error("SSR ID not found. Please try again.");
        return;
    }

    setIsProcessing(true);
    try {
        const resultAction = await dispatch(createSSRPayment({ ssr: ssrId, amount: blockAmount }));
        
        if (createSSRPayment.fulfilled.match(resultAction)) {
            const paymentData = resultAction.payload;
            // Extract user info for prefill if available
            const userEmail = resultAction.payload.email || ""; 
            const userContact = resultAction.payload.contact || "";
            const userName = resultAction.payload.name || "";
            
            // Expected options format by Razorpay
            const options = {
                key: paymentData.key_id || "rzp_test_pj1LggiG8p44XK", 
                amount: paymentData.amount, // Amount returned from API (already in paise if backend follows Razorpay)
                currency: paymentData.currency || "INR",
                name: "WeAssist",
                description: `Payment for ${ssrId}`,
                order_id: paymentData.id,
                handler: async function (response) {
                    try {
                        setIsProcessing(true);
                        // Verify signature on backend
                        const verifyAction = await dispatch(verifyPaymentSignature({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            ssr: ssrId,
                        }));

                        if (verifyPaymentSignature.fulfilled.match(verifyAction)) {
                            router.push(`/post-payment?status=success&payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`);
                        } else {
                            toast.error(verifyAction.payload || "Payment verification failed");
                            router.push(`/post-payment?status=error`);
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        toast.error("An error occurred during verification");
                        router.push(`/post-payment?status=error`);
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: userContact,
                },
                theme: {
                    color: "#1DA1FA",
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error("Payment failed: " + response.error.description);
                router.push("/post-payment?status=error");
            });
            rzp.open();
        } else {
            toast.error(resultAction.payload || "Failed to initiate payment");
            setIsProcessing(false);
        }
    } catch (error) {
        console.error("Payment Error:", error);
        toast.error("An unexpected error occurred");
        setIsProcessing(false);
    }
};
