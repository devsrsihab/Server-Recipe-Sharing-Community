import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

// send payment info to utils
const sendPaymentInfoToUtils = catchAsync(async (req, res) => {
  const { userEmail } = req.body;
  const result = await PaymentServices.sendPaymentInfoToUtils(userEmail as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Redirect Successfully',
    data: result,
  });
});

// Create
const showSuccessPage = catchAsync(async (req, res) => {
  const { userEmail, tran_id, status } = req.query;
  const result = await PaymentServices.confirmationServiceMembership(
    userEmail as string,
    tran_id as string,
    status as string,
  );

  // Render the appropriate template with the result data
  res.render(result.filePath, {
    userFullName: result.userFullName,
    homeLink: result.homeLink,
  });
});

export const PaymentControllers = { showSuccessPage, sendPaymentInfoToUtils };
