import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "../../slices/authSlices";

const Backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const BASE_URL = `${Backend_url}/api/v1`;

export const buyPremium = async (token, user, navigate, dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
        // Create order on backend
        const res = await axios.post(
            `${BASE_URL}/payment/createOrder`,
            { amount: 50 },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!res.data.success) {
            throw new Error(res.data.message);
        }

        const options = {
            key: "rzp_test_R6VMtQTtVSy3Pz",
            currency: res.data.order.currency,
            amount: res.data.order.amount,
            order_id: res.data.order.id,
            name: "UniBuddy Premium",
            description: "Lifetime Unlimited Mock Interviews!",
            image: "/logo.png",
            handler: async function (response) {
                try {
                    const verificationRes = await axios.post(
                        `${BASE_URL}/payment/verifyPayment`,
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: user._id,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (verificationRes.data.success) {
                        toast.success("Welcome to Lifetime Premium!");
                        // Update local state if dispatch is provided
                        if (dispatch) {
                            const updatedUser = { ...user, isPremium: true };
                            dispatch(setUser(updatedUser));
                            localStorage.setItem("user", JSON.stringify(updatedUser));
                        }

                        setTimeout(() => {
                            if (navigate) navigate("/mock-interview");
                            else window.location.reload();
                        }, 1500);
                    }
                } catch (error) {
                    console.error("Verification Error:", error);
                    toast.error(error.response?.data?.message || "Payment verification failed");
                }
            },
            prefill: {
                name: user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.name || ""),
                email: user?.email || "",
                contact: user?.phone || "",
            },
            theme: {
                color: "#2563eb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (error) {
        console.error("Payment Error:", error);
        toast.error(error.response?.data?.message || "Could not process payment");
    }
    toast.dismiss(toastId);
};
