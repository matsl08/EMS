// server/models/Payment.js
import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: Schema.Types.ObjectId, auto: true },
  studentId: {
    type: String,
    ref: "User.studentId",
    required: true,
  },
  schoolYear: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  payments: [
    {
      midterm: {
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Paid", "Partial"],
          default: "Pending",
        },
        datePaid: {
          type: Date,
        },
        receiptNumber: {
          type: String,
        },
      },

      final: {
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Paid"],
          default: "Pending",
        },
        datePaid: {
          type: Date,
        },
        receiptNumber: {
          type: String,
        },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
