import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { nanoid } from "nanoid";
const today = moment().format("YYYY-MM-DD");

const invoiceSlice = createSlice({
  name: "invoces",

  initialState: {
    allInvoice: [],
    invoiceById: null,
  },

  reducers: {
    getInvoiceById: (state, action) => {
      const { allInvoice } = state;
      const invoice = allInvoice.find(
        (item) => item.invoiceNumber === action.payload.invoiceNumber
      );
      state.invoiceById = invoice;
    },
    deleteInvoice: (state, action) => {
      const { allInvoice } = state;
      const index = allInvoice.findIndex(
        (invoice) => invoice.invoiceNumber === action.payload.invoiceNumber
      );
      if (index !== -1) {
        allInvoice.splice(index, 1);
      }
    },
    addInvoice: (state, action) => {
      const {
        currency,
        currentDate,
        invoiceNumber,
        dateOfIssue,
        billTo,
        billToEmail,
        billToAddress,
        billFrom,
        billFromEmail,
        billFromAddress,
        notes,
        total,
        subTotal,
        taxRate,
        taxAmount,
        discountRate,
        discountAmount,
        items,
      } = action.payload;

      const finalData = {
        invoiceNumber: nanoid(4),
        createdAt: today,
        currency: currency,
        currentDate: currentDate,
        dateOfIssue: dateOfIssue,
        billTo: billTo,
        billToEmail: billToEmail,
        billToAddress: billToAddress,
        billFrom: billFrom,
        billFromEmail: billFromEmail,
        billFromAddress: billFromAddress,
        notes: notes,
        total: total,
        subTotal: subTotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        discountRate: discountRate,
        discountAmount: discountAmount,
        items: items,
      };
      state.allInvoice.push(finalData);
      console.log(state.allInvoice[invoiceNumber - 1]);
    },
    editInvoice: (state, action) => {
      console.log("Edit Invoice Reducer Payload:", action.payload);
      
      const {
        currency,
        currentDate,
        invoiceNumber,
        dateOfIssue,
        billTo,
        billToEmail,
        billToAddress,
        billFrom,
        billFromEmail,
        billFromAddress,
        notes,
        taxRate,
        discountRate,
        items,
      } = action.payload;
      const invoice = state.allInvoice.find(
        (item) => item.invoiceNumber === invoiceNumber
      );
      const invoiceIndex = state.allInvoice.findIndex(
        (invoice) => invoice.invoiceNumber === invoiceNumber
      );
      const edittedObject = {
        invoiceNumber: invoiceNumber,
        createdAt: today,
        currency: currency,
        currentDate: currentDate,
        dateOfIssue: dateOfIssue,
        billTo: billTo,
        billToEmail: billToEmail,
        billToAddress: billToAddress,
        billFrom: billFrom,
        billFromEmail: billFromEmail,
        billFromAddress: billFromAddress,
        notes: notes,
        items: items,
        subTotal: items.reduce((acc, item) => {
          const itemTotal = Number(item.price) * item.quantity;
          return acc + itemTotal;
        }, 0),
        taxRate: taxRate,
        taxAmount: items.reduce((acc, item) => {
          const itemTax = (Number(item.price) * item.quantity * taxRate) / 100;
          return acc + itemTax;
        }, 0),
        discountRate: discountRate,
        discountAmount: items.reduce((acc, item) => {
          const itemDiscount =
            (Number(item.price) * item.quantity * discountRate) / 100;
          return acc + itemDiscount;
        }, 0),
        total:
          items.reduce((acc, item) => {
            const itemTotal = Number(item.price) * item.quantity;
            return acc + itemTotal;
          }, 0) -
          items.reduce((acc, item) => {
            const itemDiscount =
              (Number(item.price) * item.quantity * discountRate) / 100;
            return acc + itemDiscount;
          }, 0) +
          items.reduce((acc, item) => {
            const itemTax =
              (Number(item.price) * item.quantity * taxRate) / 100;
            return acc + itemTax;
          }, 0),
      };

      edittedObject.subTotal = edittedObject.subTotal.toFixed(2);
      edittedObject.taxAmount = edittedObject.taxAmount.toFixed(2);
      edittedObject.discountAmount = edittedObject.discountAmount.toFixed(2);
      edittedObject.total = edittedObject.total.toFixed(2);
      if (invoiceIndex !== -1) {
        state.allInvoice[invoiceIndex] = {
          ...state.allInvoice[invoiceIndex],
          ...edittedObject,
        };
        console.log(`Invoice found - ${invoiceIndex}`);
      }
      else{
        console.log("Invoice not found", invoiceIndex, " ", invoiceNumber);
      }
      
      console.log(invoice);
    },
  },
});

export default invoiceSlice;
