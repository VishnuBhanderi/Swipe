import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import leftArrow from "../assets/icon-arrow-left.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import invoiceSlice from "../redux/invoiceSlice";
import DeleteModal from "./DeleteModal";
// import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceEditForm from "./InvoiceEditForm";
import emailjs from "emailjs-com";
import pako from "pako";

function InvoiceInfo({ onDelete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const invoiceNumber = location.search.substring(1);

  useEffect(() => {
    dispatch(
      invoiceSlice.actions.getInvoiceById({ invoiceNumber: invoiceNumber })
    );
  }, [invoiceNumber]);

  const onDeleteButtonClick = () => {
    navigate("/");
    setIsDeleteModalOpen(false);
    onDelete(invoiceNumber);
  };

  const invoice = useSelector((state) => state.invoices.invoiceById);
  const invoices = useSelector((state) =>
    state.invoices.allInvoice.find(
      (invoice) => invoice.invoiceNumber === invoiceNumber
    )
  );

  const formattedDate = new Date(invoice.dateOfIssue).toLocaleDateString(
    "en-GB"
  );
  const SendEmail = () => {
    const templateParams = {
      to_name: invoices.billTo,
      to_email: invoices.billToEmail, // Replace with the recipient's email
      from_name: invoices.billFrom,
      subject: `Invoice from ${invoices.billFrom} `,
      currency: invoices.currency,
      invoice_number: invoices.invoiceNumber,
      amount_due: invoices.total,
      subTotal: invoices.subTotal,
      tax: invoices.taxAmount,
      discount_Amount: invoices.discountAmount,
      notes: invoices.notes,
      due_date: formattedDate,
    };

    emailjs
      .send(
        "service_6uqwaud",
        "template_wfkomjs",
        templateParams,
        "ZXgCl3yXRTWCDDSic"
      )
      .then((response) => {
        console.log("Email sent successfully:", response);
        alert(`Email sent successfully to ${invoices.billToEmail}`);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Error sending email");
      });
  };

  const GenerateInvoice = async () => {
    console.log("generate invoice");
    await html2canvas(document.querySelector("#invoiceCapture")).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: [612, 792],
        });
        pdf.internal.scaleFactor = 1;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice-001.pdf");
      }
    );
  };
  const SendInvoice = async () => {
    console.log("send invoice");
    await html2canvas(document.querySelector("#invoiceCapture")).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: [612, 792],
        });
        pdf.internal.scaleFactor = 1;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Get data URL of the generated PDF
        const pdfDataUrl = pdf.output("datauristring");
        // Compress the PDF data URL using pako
        const compressedPdfDataUrl = pako.deflate(pdfDataUrl, { to: "string" });
        // Send the email with the PDF attachment

        // Get the size in bytes
        const sizeInBytes = new TextEncoder().encode(imgData).length;

        // Convert bytes to kilobytes
        const sizeInKB = sizeInBytes / 1024;

        console.log("Compressed PDF size:", sizeInKB.toFixed(2), "KB");

        SendEmail(compressedPdfDataUrl);
      }
    );
  };
  if (!invoices) {
    return <div>Error: Invoice not found</div>;
    console.log(invoices);
  }

  console.log(invoice);

  return (
    <div className="pt-4">
      {invoice ? (
        <motion.div
          key="invoice-info"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: "200%" }}
          transition={{ duration: 0.5 }}
          className="dark:bg-[#141625] mx-auto duration-300 min-h-screen bg-[#f8f8fb]  py-[34px] px-2 md:px-8 lg:px-12 max-w-3xl lg:py-[72px] "
        >
          <div>
            <button
              onClick={() => navigate(-1)}
              className=" flex items-center space-4 space-x-4  group  dark:text-white font-thin "
            >
              <img className="mb-1" src={leftArrow} />
              <p className="mt-2 group-hover:opacity-80">Go back</p>
            </button>
          </div>

          <>
            <div
              id="invoiceCapture"
              className="dark:border border-2 shadow-sm border-white rounded-3xl my-4"
            >
              <div className="flex flex-row justify-between duration-300 items-start w-full p-4  rounded-t-3xl  dark:bg-[#141625] bg-[#f8f8fb] dark:text-white">
                <div className="w-100">
                  <h4 className="fw-bold my-2">
                    {invoices.billFrom || "Vishnu Bhanderi"}
                  </h4>
                  <h6 className="fw-bold text-secondary mb-1">
                    Invoice #: {invoices.invoiceNumber || ""}
                  </h6>
                </div>
                <div className="text-end ms-4">
                  <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                  <h5 className="fw-bold text-secondary">
                    {" "}
                    {invoices.currency} {invoices.total}
                  </h5>
                </div>
              </div>
              <div className="p-4 dark:bg-[#141625] bg-[#f8f8fb] rounded-b-3xl  dark:text-white">
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="fw-bold">Billed to:</div>
                    <div>{invoices.billTo || ""}</div>
                    <div>{invoices.billToAddress || ""}</div>
                    <div>{invoices.billToEmail || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold">Billed From:</div>
                    <div>{invoices.billFrom || ""}</div>
                    <div>{invoices.billFromAddress || ""}</div>
                    <div>{invoices.billFromEmail || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold mt-2">Date Of Issue:</div>
                    <div>{formattedDate || ""}</div>
                  </Col>
                </Row>
                <Table className="mb-0 dark:text-white">
                  <thead>
                    <tr>
                      <th>QTY</th>
                      <th>DESCRIPTION</th>
                      <th className="text-end">PRICE</th>
                      <th className="text-end">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.items.map((item, i) => {
                      return (
                        <tr id={i} key={i}>
                          <td style={{ width: "70px" }}>{item.quantity}</td>
                          <td>
                            {item.name} - {item.description}
                          </td>
                          <td className="text-end" style={{ width: "100px" }}>
                            {invoices.currency} {item.price}
                          </td>
                          <td className="text-end" style={{ width: "100px" }}>
                            {invoices.currency} {item.price * item.quantity}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                <Table className="dark:text-white">
                  <tbody>
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        SUBTOTAL
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {invoices.currency} {invoices.subTotal}
                      </td>
                    </tr>
                    {invoices.taxAmount !== "0.00" && (
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{ width: "100px" }}>
                          TAX
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {invoices.currency} {invoices.taxAmount}
                        </td>
                      </tr>
                    )}
                    {invoices.discountAmount !== "0.00" && (
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{ width: "100px" }}>
                          DISCOUNT
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {invoices.currency} {invoices.discountAmount}
                        </td>
                      </tr>
                    )}
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        TOTAL
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {invoices.currency} {invoices.total}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {invoices.notes && (
                  <div className="py-3 px-4 rounded">
                    Notes :- {invoices.notes}
                  </div>
                )}
              </div>
            </div>
            <div className="pb-4 px-4 dark:text-white">
              <Row>
                <Col md={6}>
                  <Button
                    variant="primary"
                    className="d-flex align-items-center justify-content-center my-2 w-100"
                    onClick={SendInvoice}
                  >
                    <BiPaperPlane
                      style={{
                        width: "15px",
                        height: "15px",
                        marginTop: "-3px",
                      }}
                      className="me-2"
                    />
                    Send Invoice
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center justify-content-center my-2 w-100"
                    onClick={GenerateInvoice}
                  >
                    <BiCloudDownload
                      style={{
                        width: "16px",
                        height: "16px",
                        marginTop: "-3px",
                      }}
                      className="me-2"
                    />
                    Download Copy
                  </Button>
                </Col>
              </Row>
            </div>
          </>
        </motion.div>
      ) : (
        <>loading</>
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteButtonClick={onDeleteButtonClick}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          invoiceNumber={invoice.invoiceNumber}
        />
      )}
      <AnimatePresence>
        {isEditOpen ? (
          <InvoiceEditForm
            invoice={invoice}
            setOpenCreateInvoice={setIsEditOpen}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default InvoiceInfo;
