/* eslint-disable @typescript-eslint/no-explicit-any */
import { initialPayment, verifyPayment } from './payments.utils';
import { User } from '../user/user.model';
import { randomUUID } from 'crypto';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import config from '../../config';

// send utils with userinfo
const sendPaymentInfoToUtils = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // is user already premium
  if (user?.isPremium) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already have in a membership');
  }

  const userData = {
    userEmail: user?.email,
    amount: 8500,
    tran_id: randomUUID(),
  };

  const paymentInfo = initialPayment(userData);
  return paymentInfo;
};

const confirmationServiceMembership = async (
  userEmail: string,
  tran_id: string,
  status: string,
) => {
  const verifyResponse = await verifyPayment(tran_id);
  // if payment is successful
  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    const membershipStart = new Date();
    const membershipEnd = new Date(membershipStart);
    membershipEnd.setFullYear(membershipEnd.getFullYear() + 1);

    await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { isPremium: true, membershipStart: membershipStart, membershipEnd: membershipEnd } },
    );
  }

  // get user info
  const user = await User.findOne({ email: userEmail }).select('name');
  const userFullName = user?.name?.firstName + ' ' + user?.name?.lastName;

  // Use different paths depending on the environment
  if (status === 'Successful') {
    // render ejs success template
    return {
      filePath: 'orderSuccessful',
      userFullName: userFullName,
      homeLink: config.client_base_url,
    };
  } else {
    // render ejs failed template
    return {
      filePath: 'orderFailed',
      userFullName: userFullName,
      homeLink: config.client_base_url,
    };
  }
};

export const PaymentServices = { confirmationServiceMembership, sendPaymentInfoToUtils };
