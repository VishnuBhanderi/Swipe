import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import InvoiceCard from "./InvoiceCard";
import { useSelector } from "react-redux";
import InvoiceForm from "./InvoiceForm";
import { useLocation } from "react-router-dom";
import { BiPlusMedical } from "react-icons/bi";

function Center() {
  const location = useLocation();
  const controls = useAnimation();
  const [isInvoiceFormOpen, setInvoiceFormOpen] = useState(false);

  const openInvoiceForm = () => {
    setInvoiceFormOpen(true);
  };

  const invoices = useSelector((state) => state.invoices.allInvoice);

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    });
  }, [controls]);

  return (
    <div className="h-full dark:bg-[#141625] scrollbar-hide duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-12 lg:py-[72px]  ">
      <motion.div
        key={location.pathname}
        initial={{ x: "0" }}
        animate={{ x: 0 }}
        exit={{ x: "-150%" }}
        transition={{ duration: 0.5 }}
        className="   max-w-3xl flex flex-col   mx-auto my-auto"
      >
        {/* Center Header */}

        <div className=" min-w-full max-h-[64px] flex items-center justify-center">
          <h1 className=" lg:text-4xl md:text-2xl  text-xl  dark:text-white tracking-wide font-semibold">
            Invoices
          </h1>
        </div>
        <div className=" min-w-full max-h-[64px] flex items-center justify-center">
          <p className=" text-gray-500 font-light">
            There are {invoices ? invoices.length : 0} total invoices.
          </p>
        </div>
        <div className=" min-w-full max-h-[64px] flex items-center justify-center">
          <div className="flex items-center my-4 space-x-4">
            <button
              onClick={openInvoiceForm}
              className="hover:opacity-80 flex items-center px-2 space-x-4 dark:border-2 border-[#7c5dfa] dark:bg-[#7c5dfa00] bg-[#7c5dfa] rounded-full"
            >
              <BiPlusMedical
                style={{ height: "33px", width: "33px", padding: "7.5px" }}
                className="rounded-full text-white my-2"
                size={100}
              />
            </button>
          </div>
        </div>
        {/* Invoice Cards */}

        <div className=" mt-10   space-y-4">
          {invoices &&
            invoices.map((invoice, index) => (
              <motion.div
                key={invoice.invoiceNumber}
                initial={{ opacity: 0, y: -50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.2 },
                }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
              >
                <InvoiceCard invoice={invoice} index={index} />
              </motion.div>
            ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {isInvoiceFormOpen && (
          <InvoiceForm setOpenCreateInvoice={setInvoiceFormOpen} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Center;
