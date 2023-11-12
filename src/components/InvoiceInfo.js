import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import leftArrow from "../assets/icon-arrow-left.svg";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import invoiceSlice from "../redux/invoiceSlice";
// import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";
function InvoiceInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const userId = process.env.REACT_APP_EMAILJS_USER_ID;
  const invoiceNumber = location.search.substring(1);

  console.log("serviceId", serviceId);
  useEffect(() => {
    dispatch(
      invoiceSlice.actions.getInvoiceById({ invoiceNumber: invoiceNumber })
    );
  }, [dispatch, invoiceNumber]);

  const invoice = useSelector((state) => state.invoices.invoiceById);
  const invoices = useSelector((state) =>
    state.invoices.allInvoice.find(
      (invoice) => invoice.invoiceNumber === invoiceNumber
    )
  );
  if (!invoices) {
    return <div>Error: Invoice not found</div>;
  }
  const formattedDate = invoice
    ? new Date(invoice.dateOfIssue).toLocaleDateString("en-GB")
    : "";
  const SendEmail = () => {
    const templateParams = {
      to_name: invoices.billTo,
      to_email: invoices.billToEmail,
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
      .send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        alert(`Email sent successfully to ${invoices.billToEmail}`);
      })
      .catch((error) => {
        alert("Error sending email");
      });
  };

  const GenerateInvoice = async () => {
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
              <img className="mb-1" src={leftArrow} alt="left-arrow" />
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
              <div className="p-4 dark:bg-[#141625] bg-[#f8f8fb] duration-300 rounded-b-3xl  dark:text-white">
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
                <table className="mb-0 dark:text-white">
                  <thead>
                    <tr>
                      <th className="px-2">QTY</th>
                      <th className="px-2">DESCRIPTION</th>
                      <th className="text-end px-2">PRICE</th>
                      <th className="text-end px-2">AMOUNT</th>
                    </tr>
                    <td
                      colSpan="4"
                      className="border-b dark:border-white border-gray-300"
                    ></td>
                  </thead>
                  <tbody>
                    {invoices.items.map((item, i) => {
                      return (
                        <tr id={i} key={i}>
                          <td style={{ width: "70px" }} className="px-2">
                            {item.quantity}
                          </td>
                          <td className="w-full mx-1 px-2">
                            {item.name} - {item.description}
                          </td>
                          <td
                            className="text-end px-2"
                            style={{ width: "100px" }}
                          >
                            {invoices.currency} {item.price}
                          </td>
                          <td
                            className="text-end px-2"
                            style={{ width: "100px" }}
                          >
                            {invoices.currency} {item.price * item.quantity}
                          </td>
                          <td
                            colSpan="4"
                            className="border-b dark:border-white border-gray-300"
                          ></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <table class="font-sans dark:text-white border-collapse w-full text-gray-700">
                  <tbody>
                    <tr class="h-20 border-b dark:border-white border-grey-700">
                      <td class="w-1/3"></td>
                      <td class="w-1/3"></td>
                      <td class="w-1/3"></td>
                    </tr>
                    <tr class="text-right border-b dark:border-white border-grey-700">
                      <td></td>
                      <td class="font-bold w-32">SUBTOTAL</td>
                      <td class="text-right w-32">
                        {invoices.currency} {invoices.subTotal}
                      </td>
                    </tr>
                    {invoices.taxAmount !== "0.00" && (
                      <tr class="text-right border-b dark:border-white border-grey-700">
                        <td></td>
                        <td class="font-bold w-32">TAX</td>
                        <td class="text-right w-32">
                          {invoices.currency} {invoices.taxAmount}
                        </td>
                      </tr>
                    )}
                    {invoices.discountAmount !== "0.00" && (
                      <tr class="text-right border-b dark:border-white border-grey-700">
                        <td></td>
                        <td class="font-bold w-32">DISCOUNT</td>
                        <td class="text-right w-32">
                          {invoices.currency} {invoices.discountAmount}
                        </td>
                      </tr>
                    )}
                    <tr class="text-right border-b dark:border-white border-grey-700">
                      <td></td>
                      <td class="font-bold w-32">TOTAL</td>
                      <td class="text-right w-32">
                        {invoices.currency} {invoices.total}
                      </td>
                    </tr>
                  </tbody>
                </table>

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
                    onClick={SendEmail}
                  >
                    <BiPaperPlane
                      style={{
                        width: "15px",
                        height: "15px",
                        marginTop: "-3px",
                      }}
                      className="me-2"
                    />
                    Send Invoice Mail
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
    </div>
  );
}

export default InvoiceInfo;
