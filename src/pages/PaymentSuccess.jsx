import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessView from '../components/SuccessView';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    if (clearCart) {
      clearCart();
    }
  }, [clearCart]);

  return (
    <SuccessView 
      title="Order Placed!"
      message="Your order has been placed successfully. Please ensure you have made the EFT payment using your order number as the reference. Our team will contact you once the funds clear."
      continueText="Track My Order"
      onContinue={() => navigate('/track-order')}
    />
  );
};

export default PaymentSuccess;
