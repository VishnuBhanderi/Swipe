import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch } from "react-redux";
import invoiceSlice from "../redux/invoiceSlice";
import { motion } from "framer-motion";

const InvoiceEditForm = ({ setOpenCreateInvoice, invoice }) => {
  const dispatch = useDispatch();

  const [currency, setCurrency] = useState(invoice.currency);
  const [currentDate, ] = useState(invoice.currentDate);
  const [dateOfIssue, setDateOfIssue] = useState(invoice.dateOfIssue);
  const [billTo, setBillTo] = useState(invoice.billTo);
  const [billToEmail, setBillToEmail] = useState(invoice.billToEmail);
  const [billToAddress, setBillToAddress] = useState(invoice.billToAddress);
  const [billFrom, setBillFrom] = useState(invoice.billFrom);
  const [billFromEmail, setBillFromEmail] = useState(invoice.billFromEmail);
  const [billFromAddress, setBillFromAddress] = useState(
    invoice.billFromAddress
  );
  const [notes, setNotes] = useState(invoice.notes);
  const [total, setTotal] = useState(invoice.total);
  const [subTotal, setSubTotal] = useState(invoice.subTotal);
  const [taxRate, setTaxRate] = useState(invoice.taxRate);
  const [taxAmount, setTaxAmount] = useState(parseFloat(invoice.taxAmount));
  const [discountRate, setDiscountRate] = useState(invoice.discountRate);
  const [discountAmount, setDiscountAmount] = useState(invoice.discountAmount);
  const [, setRefresh] = useState(false);

  const [items, setItems] = useState(
    invoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      quantity: item.quantity,
    }))
  );

  useEffect(() => {
    handleCalculateTotal();
  }, [items, taxRate, discountRate]);

  const handleRowDel = (item) => {
    setItems((prevItems) => {
      const index = prevItems.indexOf(item);
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });

    // Use the callback form of setRefresh
    setRefresh((prevRefresh) => !prevRefresh);
  };
  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };

    // Use the callback form of setItems
    setItems((prevItems) => [...prevItems, newItem]);

    // Use the callback form of setRefresh
    setRefresh((prevRefresh) => !prevRefresh);

    console.log("Added: ", items);
  };

  const handleCalculateTotal = () => {
    let newSubTotal = 0;

    items.forEach((item) => {
      newSubTotal +=
        parseFloat(item.price).toFixed(2) * parseInt(item.quantity);
    });

    setSubTotal(parseFloat(newSubTotal).toFixed(2));
    setTaxAmount(
      parseFloat(parseFloat(newSubTotal) * (taxRate / 100)).toFixed(2)
    );
    setDiscountAmount(
      parseFloat(parseFloat(newSubTotal) * (discountRate / 100)).toFixed(2)
    );

    const calculatedTotal = (
      parseFloat(newSubTotal) -
      parseFloat(discountAmount) +
      parseFloat(taxAmount)
    ).toFixed(2);

    setTotal(calculatedTotal);

    console.log("handleTotal: subTotal : ", newSubTotal);
    console.log("handleTotal: tax : ", taxAmount);
    console.log("handleTotal: total : ", calculatedTotal);
  };
  const saveItemHandler = async (event) => {
    event.preventDefault();
    await dispatch(
      invoiceSlice.actions.editInvoice({
        currency,
        currentDate,
        dateOfIssue,
        billTo,
        invoiceNumber: invoice.invoiceNumber,
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
    // Alert and close modal
    alert("Invoice Saved");
    setOpenCreateInvoice(false);
  };
  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;
    setItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      });
      return newItems;
    });
    handleCalculateTotal();
  };
  const editField = (event) => {
    const { name, value } = event.target;
    setCurrency((prevCurrency) => (name === "currency" ? value : prevCurrency));
    setRefresh((prevRefresh) => !prevRefresh); // Force re-render
    switch (name) {
      case "dateOfIssue":
        setDateOfIssue(() => value);
        break;

      case "billTo":
        setBillTo(() => value);
        break;
      case "billToEmail":
        setBillToEmail(() => value);
        break;
      case "billToAddress":
        setBillToAddress(() => value);
        break;
      case "billFrom":
        setBillFrom(() => value);
        break;
      case "billFromEmail":
        setBillFromEmail(() => value);
        break;
      case "billFromAddress":
        setBillFromAddress(() => value);
        break;
      case "notes":
        setNotes(() => value);
        break;
      case "taxRate":
        setTaxRate(() => value);
        break;
      case "discountRate":
        setDiscountRate(() => value);
        break;
      default:
        break;
    }

    handleCalculateTotal();
  };

  const onCurrencyChange = (event) => {
    setCurrency(event.target.value);
    setRefresh((prevRefresh) => !prevRefresh); // Force re-render
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenCreateInvoice(false);
      }}
      className="fixed top-0 bottom-0 left-0 right-0  dark:bg-black bg-[#141625] bg-opacity-50 z-40 flex justify-center items-center "
    >
      <motion.div
        key="createInvoice-sidebar"
        initial={{ y: 700, opacity: 0 }} // Set initial y value to 700
        animate={{
          opacity: 1,
          y: 0, // Animate y to 0 for entry
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 40,
            duration: 0.4,
          },
        }}
        exit={{ y: 700, transition: { duration: 0.2 } }}
        className="fixed top-10 overflow-hidden flex flex-col dark:text-white dark:bg-[#141625] bg-white dark:border-2 border-white h-screen md:w-90 rounded-3xl"
        style={{ width: "80%" }}
      >
        {/* <div className="absolute top-4 right-4 flex mb-4">
        <button
          onClick={() => setOpenCreateInvoice(false)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <AiOutlineCloseCircle size={24} />
        </button>
      </div> */}
        <Form
          onSubmit={saveItemHandler}
          className="overflow-y-scroll scrollbar-hide dark:bg-[#141625] pl-[15px] pr-[15px] pb-[15px] w-full  "
        >
          <Row>
            <Col md={8} lg={9}>
              <Card className="p-4 p-xl-5 my-3 my-xl-4  dark:bg-[#141625] dark:text-white">
                <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-column">
                      <div className="mb-2">
                        <span className="fw-bold">
                          Current&nbsp;Date:&nbsp;
                        </span>
                        <span className="current-date">
                          {new Date().toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      <span className="fw-bold d-block me-2">
                        Due&nbsp;Date:
                      </span>
                      <Form.Control
                        type="date"
                        value={dateOfIssue}
                        className="me-2 dark:bg-[#141625] dark:text-white dark:border border-2"
                        name="dateOfIssue"
                        onChange={editField}
                        style={{
                          maxWidth: "150px",
                        }}
                        required="required"
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center"></div>
                </div>
                <hr className="my-4" />
                <Row className="mb-5">
                  <Col>
                    <Form.Label className="fw-bold">Bill to:</Form.Label>
                    <Form.Control
                      placeholder="Who is this invoice to?"
                      rows={3}
                      value={billTo}
                      type="text"
                      name="billTo"
                      className="my-2 dark:bg-[#141625] dark:text-white"
                      onChange={editField}
                      autoComplete="name"
                      required="required"
                    />
                    <Form.Control
                      placeholder="Email address"
                      value={billToEmail}
                      type="email"
                      name="billToEmail"
                      className="my-2 dark:bg-[#141625] dark:text-white"
                      onChange={editField}
                      autoComplete="email"
                      required="required"
                    />
                    <Form.Control
                      placeholder="Billing address"
                      value={billToAddress}
                      type="text"
                      name="billToAddress"
                      className="my-2 dark:bg-[#141625] dark:text-white"
                      autoComplete="address"
                      onChange={editField}
                      required="required"
                    />
                  </Col>
                  <Col>
                    <Form.Label className="fw-bold">Bill from:</Form.Label>
                    <Form.Control
                      placeholder="Who is this invoice from?"
                      rows={3}
                      value={billFrom}
                      type="text"
                      name="billFrom"
                      className="my-2 dark:bg-[#141625] dark:text-white"
                      onChange={editField}
                      autoComplete="name"
                      required="required"
                    />
                    <Form.Control
                      placeholder="Email address"
                      value={billFromEmail}
                      type="email"
                      name="billFromEmail"
                      className="my-2 dark:bg-[#141625] dark:text-white"
                      onChange={editField}
                      autoComplete="email"
                      required="required"
                    />
                    <Form.Control
                      placeholder="Billing address"
                      value={billFromAddress}
                      type="text"
                      name="billFromAddress"
                      className="my-2 dark:bg-[#141625] dark:text-white"
                      autoComplete="address"
                      onChange={editField}
                      required="required"
                    />
                  </Col>
                </Row>
                <InvoiceItem
                  onItemizedItemEdit={onItemizedItemEdit}
                  onRowAdd={handleAddEvent}
                  onRowDel={handleRowDel}
                  currency={currency}
                  items={items}
                />
                {items.length > 0 ? (
                  <Row className="mt-4 justify-content-end">
                    <Col lg={6}>
                      <div className="d-flex flex-row align-items-start justify-content-between">
                        <span className="fw-bold">Subtotal:</span>
                        <span>
                          {currency}
                          {subTotal}
                        </span>
                      </div>
                      <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                        <span className="fw-bold">Discount:</span>
                        <span>
                          <span className="small">({discountRate || 0}%)</span>
                          {currency}
                          {discountAmount || 0}
                        </span>
                      </div>
                      <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                        <span className="fw-bold">Tax:</span>
                        <span>
                          <span className="small">({taxRate || 0}%)</span>
                          {currency}
                          {taxAmount || 0}
                        </span>
                      </div>
                      <hr />
                      <div
                        className="d-flex flex-row align-items-start justify-content-between"
                        style={{
                          fontSize: "1.125rem",
                        }}
                      >
                        <span className="fw-bold">Total:</span>
                        <span className="fw-bold">
                          {currency}
                          {total || 0}
                        </span>
                      </div>
                    </Col>
                  </Row>
                ) : null}

                <hr className="my-4" />
                <Form.Label className="fw-bold">Notes:</Form.Label>
                <Form.Control
                  placeholder="Thanks for your business!"
                  name="notes"
                  value={notes}
                  onChange={editField}
                  as="textarea"
                  className="my-2 dark:bg-[#141625] dark:text-white"
                  rows={1}
                />
              </Card>
            </Col>
            <Col md={4} lg={3}>
              <div className="sticky top-4 pt-md-3 pt-xl-4">
                <Form.Group className="mb-3  dark:bg-[#141625] dark:text-white">
                  <Form.Label className="fw-bold">Currency:</Form.Label>
                  <Form.Select
                    onChange={onCurrencyChange}
                    className="dark:bg-[#141625] dark:text-white my-1"
                    aria-label="Change Currency"
                  >
                    <option value="$">USD (United States Dollar)</option>
                    <option value="£">GBP (British Pound Sterling)</option>
                    <option value="¥">JPY (Japanese Yen)</option>
                    <option value="$">CAD (Canadian Dollar)</option>
                    <option value="$">AUD (Australian Dollar)</option>
                    <option value="$">SGD (Singapore Dollar)</option>
                    <option value="¥">CNY (Chinese Renminbi)</option>
                    <option value="₿">BTC (Bitcoin)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="my-3  dark:bg-[#141625] dark:text-white">
                  <Form.Label className="fw-bold">Tax rate:</Form.Label>
                  <InputGroup className="my-1 flex-nowrap">
                    <Form.Control
                      name="taxRate"
                      type="number"
                      value={taxRate}
                      onChange={editField}
                      className=" dark:bg-[#141625] dark:text-white  border"
                      placeholder="0.0"
                      min="0.00"
                      step="0.01"
                      max="100.00"
                    />
                    <InputGroup.Text className=" dark:bg-[#141625] dark:text-white fw-bold text-secondary small">
                      %
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label className="fw-bold">Discount rate:</Form.Label>
                  <InputGroup className="my-1 flex-nowrap">
                    <Form.Control
                      name="discountRate"
                      type="number"
                      value={discountRate}
                      onChange={editField}
                      className=" dark:bg-[#141625] dark:text-white  border"
                      placeholder="0.0"
                      min="0.00"
                      step="0.01"
                      max="100.00"
                    />
                    <InputGroup.Text className=" dark:bg-[#141625] dark:text-white fw-bold text-secondary small">
                      %
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="d-block w-100 my-4"
                >
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </motion.div>
    </div>
  );
};

export default InvoiceEditForm;
