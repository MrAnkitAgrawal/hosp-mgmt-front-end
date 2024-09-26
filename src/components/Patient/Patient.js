import React, { useState, useEffect } from "react";
import "../../index.css";
import Navbar from "../Layouts/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { Modal, ButtonToolbar, Button, Placeholder } from "rsuite";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import useGetAPI from "../../hooks/useGetApi";
import { MdOutlinePayment } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { MdOutlinePayments } from "react-icons/md";
function Patient() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({});
  const [open, setOpen] = useState(false);
  const [billingDetails, setBillingDetails] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [size, setSize] = useState();
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const { data: patient, error, refetch } = useGetAPI(`patient`);

  if (error) return <p>Error: {toast.error(error.message)}</p>;
  const handleOpen = (value, modalType) => {
    setType(modalType);
    setSize(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const deletePatient = async (id) => {
    try {
      const result = await axios.delete(`patient/${id}`);
      console.log(result);
      if (result.status === 204) {
        toast.success("patient deleted succefully");
        refetch();
        // getPatients();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPatientDetails = async (id) => {
    try {
      const result = await axios.get(`patient/${id}`);
      console.log(result.data);
      navigate("/edit-patient", { state: { patientData: result.data } });
      console.log(result);
    } catch (error) {}
  };
  const getPaymentDetails = async (id) => {
    try {
      const result = await axios.get(`patient/${id}/billing`);
      if (result.status === 200) {
        setBillingDetails(result.data.billingDetails);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleBillItem = (size, type, id) => {
    handleOpen(size, type);
    const bill = [];
    billingDetails.filter((item) => {
      if (item.billingId === id) {
        item.billItems.forEach((element) => {
          bill.push(element);
        });
      }
    });
    setBillItems(bill);
  };
  const completePayment = async () => {
    try {
      const patientID = parseInt(localStorage.getItem("patientID"));
      const billingDetail = billingDetails.map((item) => {
        return { billingId: item.billingId };
      });
      const paymentMode = getValues("paymentMode");
      const amount = getValues("paidAmount");
      const details = {
        paymentId: null,
        paymentType: getValues("paymentType"),
        paidAmount: parseInt(amount),
        paymentMode: paymentMode.toUpperCase(),
        paymentRemarks: getValues("paymentRemarks"),
        billingDetails: billingDetail,
      };
      const result = await axios.post(`patient/${patientID}/payment`, details);
      console.log(result);
      toast.success("payment succesfully");
      console.log(details);
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Bill not ready yet");
      }
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Patient</h3>
          <ul className="breadcrumbs mb-3">
            <li className="nav-home">
              <a>
                <i className="icon-home"></i>
              </a>
            </li>
            <li className="separator">
              <i className="icon-arrow-right"></i>
            </li>
            <li className="nav-item">
              <a>Patient</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <h4 className="card-title">Patient</h4>
                  <button
                    className="btn btn-primary btn-round ms-auto"
                    onClick={() => {
                      navigate("/add-patient");
                    }}
                  >
                    <i className="fa fa-plus"></i>
                    Add Patient
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div
                  className="modal fade"
                  id="addRowModal"
                  tabindex="-1"
                  role="dialog"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header border-0">
                        <h5 className="modal-title">
                          <span className="fw-mediumbold"> New</span>
                          <span className="fw-light"> Row </span>
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p className="small">
                          Create a new row using this form, make sure you fill
                          them all
                        </p>
                        <form>
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="form-group form-group-default">
                                <label>Name</label>
                                <input
                                  id="addName"
                                  type="text"
                                  className="form-control"
                                  placeholder="fill name"
                                />
                              </div>
                            </div>
                            <div className="col-md-6 pe-0">
                              <div className="form-group form-group-default">
                                <label>Position</label>
                                <input
                                  id="addPosition"
                                  type="text"
                                  className="form-control"
                                  placeholder="fill position"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group form-group-default">
                                <label>Office</label>
                                <input
                                  id="addOffice"
                                  type="text"
                                  className="form-control"
                                  placeholder="fill office"
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer border-0">
                        <button
                          type="button"
                          id="addRowButton"
                          className="btn btn-primary"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table
                    id="add-row"
                    className="display table table-striped table-hover"
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Date of Birth</th>
                        <th>Aadhar Number</th>
                        <th>Mobile Number</th>
                        <th>Whatsapp Number</th>
                        <th>Email ID</th>
                        <th>Insurance Details</th>
                        <th style={{ width: "10%" }}>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {patient &&
                        patient.map((item) => {
                          return (
                            <tr key={item.patientId}>
                              <td>{item.firstName}</td>
                              <td>{item.gender}</td>
                              <td>{item.dateOfBirth}</td>
                              <td>{item.aadharNumber}</td>
                              <td>{item.mobileNumber}</td>
                              <td>{item.whatsAppNumber}</td>
                              <td>{item.emailId}</td>
                              <td>
                                {item.insuranceDetails[0]?.insuranceCompany}
                              </td>
                              <td>
                                <div className="form-button-action">
                                  <button
                                    type="button"
                                    data-bs-toggle="tooltip"
                                    title=""
                                    className="btn btn-link btn-primary btn-lg"
                                    data-original-title="Edit Task"
                                    onClick={() => {
                                      getPatientDetails(item.patientId);
                                    }}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    type="button"
                                    data-bs-toggle="tooltip"
                                    title=""
                                    className="btn btn-link btn-danger"
                                    data-original-title="Remove"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                  <button
                                    type="button"
                                    data-bs-toggle="tooltip"
                                    title=""
                                    className="btn btn-link btn-primary btn-lg"
                                    data-original-title="Payment"
                                    onClick={() => {
                                      handleOpen("md", "payment");
                                      getPaymentDetails(item.patientId);
                                    }}
                                  >
                                    <MdOutlinePayment />
                                  </button>
                                  <button
                                    type="button"
                                    data-bs-toggle="tooltip"
                                    title=""
                                    className="btn btn-link btn-primary btn-lg"
                                    data-original-title="Payment"
                                    onClick={() => {
                                      getPaymentDetails(item.patientId);
                                      localStorage.setItem(
                                        "patientID",
                                        item.patientId
                                      );
                                      handleOpen("md", "completePayment");
                                    }}
                                  >
                                    <MdOutlinePayments />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {type && (
        <Modal size={size} open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>
              {type === "payment" && "Check Payment Detials"}
              {type === "completePayment" && "Complete Payment Detials"}
              {type === "checkBill" && "Check Bill Items"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {type === "payment" && (
              <div>
                <h4>Billing Details</h4>
                <div className="table-responsive">
                  <table
                    id="add-row"
                    className="display table table-striped table-hover"
                  >
                    <thead>
                      <tr>
                        <th>Billing Id</th>
                        <th>Billing Time stamp</th>
                        <th>Billing Head</th>
                        <th>Billing Remarks</th>
                        <th>Bill Status</th>
                        <th>Paid Amount</th>
                        <th>Total Bill Amount</th>
                        <th style={{ width: "10%" }}>Check Billing Item</th>
                      </tr>
                    </thead>

                    <tbody>
                      {billingDetails &&
                        billingDetails.map((item) => {
                          return (
                            <tr key={item.itemId}>
                              <td>{item.billingId}</td>
                              <td>{item.billingTimestamp}</td>
                              <td>{item.billingHead}</td>
                              <td>{item.billingRemarks}</td>
                              <td>{item.billStatus}</td>
                              <td>{item.paidAmount}</td>
                              <td>{item.totalBillAmount}</td>
                              <td>
                                <div className="form-button-action">
                                  <Button
                                    size="md"
                                    onClick={() => {
                                      handleBillItem(
                                        "md",
                                        "checkBill",
                                        item.billingId
                                      );
                                    }}
                                  >
                                    <GrView style={{ color: "green" }} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {type === "completePayment" && (
              <div>
                <div className="col">
                  <div className="mb-3">
                    <Form.Group controlId="formPaymentType">
                      <Form.Label> Payment Type</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Payment Type"
                        {...register("paymentType")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formPaidAmount">
                      <Form.Label>Paid Amount</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Amount"
                        {...register("paidAmount")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formPaymentMode">
                      <Form.Label>Payment Mode</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Payment Mode"
                        {...register("paymentMode")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formPaymentRemarks">
                      <Form.Label> Payment Rremarks</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Payment Remarks"
                        {...register("paymentRemarks")}
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>
            )}
            {type === "checkBill" && (
              <div>
                <h1>Check Bill</h1>
                <div className="table-responsive">
                  <table
                    id="add-row"
                    className="display table table-striped table-hover"
                  >
                    <thead>
                      <tr>
                        <th>Item Id</th>
                        <th>Bill Item Type</th>
                        <th>Bill Item Name</th>
                        <th>Item Quanitity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {billItems &&
                        billItems.map((item) => {
                          return (
                            <tr key={item.itemId}>
                              <td>{item.itemId}</td>
                              <td>{item.billItemType}</td>
                              <td>{item.billItemName}</td>
                              <td>{item.itemQuantity}</td>
                              <td>{item.amount}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {type === "payment" && <Button appearance="primary">Close</Button>}
            {type === "checkBill" && (
              <Button appearance="primary">Close</Button>
            )}
            {type === "completePayment" && (
              <Button appearance="primary" onClick={completePayment}>
                Complete
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Patient;
