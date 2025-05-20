// * Accounting Admin Controller
// @ file: Handles all accounting-related operations

import { Payment } from "../models/Payment.js";

// * Payment Management Controllers

// ? Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Get student's payments
export const getStudentPayments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const payments = await Payment.find({ studentId });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payment records found" });
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      schoolYear,
      semester,
      term, // 'midterm' or 'final'
      status,
      receiptNumber,
    } = req.body;

    // * Find or create payment record
    let payment = await Payment.findOne({
      studentId,
      schoolYear,
      semester,
    });

    if (!payment) {
      payment = new Payment({
        studentId,
        schoolYear,
        semester,
      });
    }

    // * Update specific term payment
    if (term === "midterm") {
      payment.midterm = {
        status,
        datePaid: status === "Paid" ? new Date() : null,
        receiptNumber,
      };
    } else if (term === "final") {
      payment.final = {
        status,
        datePaid: status === "Paid" ? new Date() : null,
        receiptNumber,
      };
    }

    await payment.save();

    // * Get updated grade access status
    const accessStatus = payment.getGradeAccess();

    res.json({
      message: "Payment status updated successfully",
      payment,
      accessStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
