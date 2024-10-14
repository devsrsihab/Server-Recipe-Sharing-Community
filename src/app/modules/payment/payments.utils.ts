/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import config from '../../config';

type PaymentData = {
  userEmail: string;
  amount: number;
  tran_id: string;
};

export const initialPayment = async (paymentData: PaymentData) => {
  const payload = {
    store_id: config.store_id,
    signature_key: config.signature_key,
    cus_name: 'Customer Name',
    cus_email: paymentData.userEmail,
    cus_phone: '01870******',
    amount: paymentData.amount,
    currency: 'BDT',
    tran_id: paymentData.tran_id,
    desc: `Payment for ${paymentData.userEmail} membership.`,
    success_url: `${config.server_base_url}/api/v1/payment/confirmation?userEmail=${paymentData.userEmail}&tran_id=${paymentData.tran_id}&status=Successful`,
    fail_url: `${config.server_base_url}/api/v1/payment/confirmation?userEmail=${paymentData.userEmail}&tran_id=${paymentData.tran_id}&status=Failed`,
    cancel_url: config.client_base_url,
    type: 'json',
  };

  const response = await axios.post(config.payment_url!, payload);
  return response.data;
};

// verify payment
export const verifyPayment = async (tran_id: any) => {
  const response = await axios.get(config.payment_verify_url!, {
    params: {
      store_id: config.store_id,
      signature_key: config.signature_key,
      request_id: tran_id,
      type: 'json',
    },
  });
  return response.data;
};
