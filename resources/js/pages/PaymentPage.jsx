import React,{useState} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PaymentPage = () => {
  const { method } = useParams();
  const { total } = useCart();
  const navigate = useNavigate(); 
  const { finalizePayment } = useCart();

  const [mobile, setMobile] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const PaymentHandle = () => {
    // Basic validation per method
    const m = method.toLowerCase();
    if (m === "bkash" || m === "nagad") {
      if (!mobile) {
        alert("Please enter your mobile number");
        return;
      }
    } else if (m === "card") {
      if (!cardNumber) {
        alert("Please enter your card number");
        return;
      }
    }

    // finalize the payment in cart context (creates invoice & clears cart)
    finalizePayment({ meta: { mobile: mobile || null, card: cardNumber || null } });

    // navigate to invoice page which will read lastInvoice from context
    navigate("/payment/invoice");
  }
  return (
    <div className='container py-5'>
       <div className='card shadow-lg p-4 rounded-4'>
        <h3 className='text-center fw-bold mb-4'>{method.toUpperCase()}</h3>
        <h5 className='text-center fw-bold mb-4'>Total Amount: ৳{total}</h5>
        {(method === "bkash" || method === "nagad") && (
          <div className='mb-3'>
            <label className='form-label'>Mobile Number</label>
            <input
              type="text"
              className='form-control'
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder='01XXXXXXXXX'
            />
            <label className='form-label mt-2'>Amount</label>
            <input
              type="text"
              className='form-control'
              value={total}
              disabled
            />
          </div>
        )}
        {(method === "card") && (
          <div className='mb-3'>
            <label className='form-label'>Card Number</label>
            <input
              type="text"
              className='form-control'
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder='0000 0000 0000 0000'
            />
              <label className='form-label mt-2'>Amount</label>
            <input
              type="text"
              className='form-control'
              value={total}
              disabled
            />
          </div>
        )}
        <button className='btn btn-success w-100' onClick={PaymentHandle}>Confirm Payment</button>
       </div>
    </div>
  )
}

export default PaymentPage
