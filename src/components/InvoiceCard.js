import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiTrash, BiEdit, BiCopyAlt } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import invoiceSlice from "../redux/invoiceSlice";
import "./main.css";
import { AnimatePresence } from "framer-motion";
import InvoiceEditForm from "./InvoiceEditForm";
import DeleteModal from "./DeleteModal";

const InvoiceCard = ({ invoice, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currency] = useState(invoice.currency);
  const [currentDate] = useState(invoice.currentDate);
  const [dateOfIssue] = useState(invoice.dateOfIssue);
  const [billTo] = useState(invoice.billTo);
  const [billToEmail] = useState(invoice.billToEmail);
  const [billToAddress] = useState(invoice.billToAddress);
  const [billFrom] = useState(invoice.billFrom);
  const [billFromEmail] = useState(invoice.billFromEmail);
  const [billFromAddress] = useState(invoice.billFromAddress);
  const [notes] = useState(invoice.notes);
  const [total] = useState(invoice.total);
  const [subTotal] = useState(invoice.subTotal);
  const [taxRate] = useState(invoice.taxRate);
  const [taxAmount] = useState(parseFloat(invoice.taxAmount));
  const [discountRate] = useState(invoice.discountRate);
  const [discountAmount] = useState(invoice.discountAmount);

  const [items] = useState(
    invoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      quantity: item.quantity,
    }))
  );
  const onDelete = (invoiceNumber) => {
    dispatch(
      invoiceSlice.actions.deleteInvoice({ invoiceNumber: invoiceNumber })
    );
  };
  const copyItemHandler = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await dispatch(
      invoiceSlice.actions.addInvoice({
        currency,
        currentDate,
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
      })
    );
  };
  const onDeleteButtonClick = (e) => {
    console.log("delete button clicked");
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };
  const onDeleteConfirmed = () => {
    onDelete(invoice.invoiceNumber);
    setIsDeleteModalOpen(false);
  };
  const viewInvoice = () => {
    navigate(`invoice?${invoice.invoiceNumber}`);
  };

  const formattedDate = new Date(invoice.dateOfIssue).toLocaleDateString(
    "en-GB"
  );

  return (
    <>
      <div className="flex flex-row items-stretch duration-100 ease-in-out hover:border border-purple-500 py-4 shadow-sm px-6 dark:bg-[#1E2139] dark:border-2 dark:border-white rounded-lg grid grid-flow-col justify-stretch ">
        <div onClick={viewInvoice} className="cursor-pointer">
          {/* Big Screen  */}
          <div
            style={{ width: "100%" }}
            className="hidden md:flex duration-100 ease-in-out dark:bg-[#1E2139] rounded-lg items-center justify-between"
          >
            <h2 className="dark:text-white ">{index + 1}. </h2>

            <h2 className="text-sm text-gray-400 font-light ml-6">
              Due : {formattedDate}
            </h2>

            <h2 className="text-sm text-gray-400 font-light ml-10">
              {invoice.billTo}
            </h2>
            <h1 className="text-xl mr-8 dark:text-white">
              {invoice.currency} {invoice.total}
            </h1>
            <Link to={`invoice?${invoice.invoiceNumber}`}>
              <div className="text-white mt-1 bg-[#0b3de0] hover:bg-[##0b3de060] rounded-xl ">
                <FaEye
                  style={{ height: "33px", width: "33px", padding: "7.5px" }}
                />
              </div>
            </Link>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
              className="cursor-pointer"
            >
              <BiEdit
                style={{ height: "33px", width: "33px", padding: "7.5px" }}
                className=" text-white mt-1 bg-[#999900] hover:bg-[#99990060] rounded-xl"
              />
            </div>
            <div onClick={onDeleteButtonClick} className="cursor-pointer">
              <BiTrash
                style={{ height: "33px", width: "33px", padding: "7.5px" }}
                className="text-white  mt-1 bg-[#d11a2a] hover:bg-[#d11a2a60] rounded-xl"
              />
            </div>
            <div onClick={copyItemHandler} className="cursor-pointer">
              <BiCopyAlt
                style={{ height: "33px", width: "33px", padding: "7.5px" }}
                className=" text-white mt-1 bg-[#512fad] hover:bg-[#512fad60] rounded-xl"
              />
            </div>
          </div>

          {/* Phone Screen */}
          <div className="md:hidden flex flex-row dark:bg-[#1E2139] rounded-lg items-center justify-between">
            <div className="flex flex-col w-1/2">
              <h2 className="dark:text-white ">{index + 1}.</h2>
              <h2 className="text-sm text-gray-400 font-light ">
                {invoice.billTo}
              </h2>
            </div>

            <div className="flex flex-col">
              <h2 className="text-sm text-gray-400 font-light ">
                Due : {formattedDate}
              </h2>
              <h1 className="text-xl dark:text-white">
                {invoice.currency} {invoice.total}
              </h1>
            </div>
            <div className="flex flex-col space-y-2">
              <Link to={`invoice?${invoice.invoiceNumber}`}>
                <div className="text-white mt-1 bg-[#0b3de0] hover:bg-[##0b3de060] rounded-xl ">
                  <FaEye
                    style={{ height: "33px", width: "33px", padding: "7.5px" }}
                  />
                </div>
              </Link>
              <div onClick={onDeleteButtonClick} className="cursor-pointer">
                <BiTrash
                  style={{ height: "33px", width: "33px", padding: "7.5px" }}
                  className="text-white  mt-1 bg-[#d11a2a] hover:bg-[#d11a2a60] rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div
                onClick={() => {
                  setIsEditOpen(true);
                }}
                className="cursor-pointer"
              >
                <BiEdit
                  style={{ height: "33px", width: "33px", padding: "7.5px" }}
                  className=" text-white mt-1 bg-[#999900] hover:bg-[#99990060] rounded-xl"
                />
              </div>
              <div onClick={copyItemHandler} className="cursor-pointer">
                <BiCopyAlt
                  style={{ height: "33px", width: "33px", padding: "7.5px" }}
                  className="text-white mt-1 bg-[#512fad] hover:bg-[#512fad60] rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isEditOpen ? (
          <InvoiceEditForm
            invoice={invoice}
            setOpenCreateInvoice={setIsEditOpen}
          />
        ) : null}
      </AnimatePresence>
      {isDeleteModalOpen ? (
        <DeleteModal
          invoice={invoice}
          onDeleteButtonClick={onDeleteConfirmed}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      ) : null}
    </>
  );
};

export default InvoiceCard;
