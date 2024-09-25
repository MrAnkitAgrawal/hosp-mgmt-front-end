import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Navbar from "../Layouts/Navbar";
import { GrView } from "react-icons/gr";
import axios from "axios";
import { toast } from "react-toastify";
import { IoAddCircleOutline } from "react-icons/io5";
import { Modal, ButtonToolbar, Button, Placeholder } from "rsuite";
import { DatePicker } from "rsuite";
import { useForm, Controller } from "react-hook-form";
import { MdIncompleteCircle } from "react-icons/md";
import { Toggle } from "rsuite";
import RemindIcon from "@rsuite/icons/legacy/Remind";
import { MdCancel } from "react-icons/md";
const DialysisDetails = () => {
  const [BillingCheck, setBillingCheck] = useState(false);
  const [nextDialysis, setnextDialysis] = useState(false);
  const [selectedDialysisSlot, setselectedDialysisSlot] = useState("");
  const [cancelledScheduled, setCancelScheduled] = useState(false);
  const [completedSchedule, setCompletedSchedule] = useState(false);
  const [billingHead, setBillingHead] = useState("");
  const [billingRemarks, setbillingRemarks] = useState("");
  const [amount, setAmount] = useState("");
  const [scheduleRandom, setscheduleRandom] = useState(false);
  const [billItems, setBillItems] = useState();
  const [itemQuantity, SetitemQuantity] = useState("");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [type, setType] = useState("");
  const [dialysisDetails, setdialysisDetails] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [billindDetailsView, setBillingDetailsView] = useState([]);
  const [selectedStation, setselectedStation] = useState("");
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
  const handleOpen = (value, modalType) => {
    setType(modalType);
    setSize(value);
    setOpen(true);
  };
  const handleSchedule = (e) => {
    setValue("scheduleRandomlyIfMentionedStationAndSlotNotAvailable", e);
    setscheduleRandom(e);
  };
  const handleDialysisDate = (e) => {
    const currentDate = new Date();
    if (e > currentDate) {
      const date = new Date(e);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setValue("dialysisDate", `${day}-${month}-${year}`);
    } else {
      toast.error("Please select Valid date");
    }
  };
  const handleDialysisSlot = (event) => {
    setValue("dialysisSlot", event.target.value);
    setselectedDialysisSlot(event.target.value);
  };
  const handleStationChange = (event) => {
    setValue("dialysisStationLabel", event.target.value);
    setselectedStation(event.target.value);
  };
  const handleClose = () => setOpen(false);
  const handleBillingCheck = (e) => {
    setValue("declareThatBillCheckedAndVerifiedWithCustomer", e);
    setBillingCheck(e);
  };
  const handleNextDialysis = (e) => {
    setValue("nextDialysisDetails", e);
    setnextDialysis(e);
  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9.]/g, "");
    const decimalCount = (formattedValue.match(/\./g) || []).length;
    const validAmount = formattedValue.match(/^\d{0,5}(\.\d{0,2})?$/);
    if (validAmount && decimalCount <= 1) {
      setValue("amount", formattedValue);
      setAmount(formattedValue);
    }
  };
  const handleItemQuantityChange = (e) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "");
    setValue("itemQuantity", formattedValue);
    SetitemQuantity(formattedValue);
  };
  useEffect(() => {
    const today = new Date();
    setFromDate(today);
    setCancelScheduled(false);
    setCompletedSchedule(false);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 7);
    setToDate(futureDate);
    getDialsisDetail(today, futureDate);
  }, [cancelledScheduled, completedSchedule]);

  const getDialsisDetail = async (fromDate, ToDate) => {
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(ToDate);
    debugger;
    try {
      const result = await axios.get(
        `dialysisScheduler?dateFrom=${formattedFromDate}&dateTo=${formattedToDate}`
      );
      if (result.status === 200) {
        setdialysisDetails(result.data);
      }
    } catch (error) {
      // toast.error(error.message);
      console.log(error);
    }
  };
  const dialysisBilling = async () => {
    try {
      debugger;
      const billingHead = getValues("billingHead");
      const billingRemarks = getValues("billingRemarks");
      const billItemType = getValues("billItemType");
      const billItemName = getValues("billItemName");
      const itemQuantity = getValues("itemQuantity");
      const prevBills = getValues("billItems");
      const amount = getValues("amount");
      const scheduleID = parseInt(localStorage.getItem("scheduleID"));
      const billingData = {
        billingHead: billingHead || "Dialysis",
        billingRemarks: billingRemarks || "Dialysis Bill",
        billItems: [
          ...prevBills,
          {
            itemId: null,
            billItemType: billItemType || "DIALYSIS",
            billItemName: billItemName || "Type2",
            itemQuantity: itemQuantity ? parseInt(itemQuantity, 10) : null,
            amount: amount ? parseFloat(amount) : 0,
          },
        ],
      };
      console.log(billingData);
      debugger;
      const result = await axios.post(
        `dialysisScheduler/${scheduleID}/billing`,
        billingData
      );
      if (result.status === 204) {
        toast.success("Bill Added Succesfully");
        localStorage.clear();
        handleClose();
        reset({
          billingHead: "",
          billingRemarks: "",
          billItemType: "",
          billItemName: "",
          itemQuantity: 0,
          amount: 0,
        });
        SetitemQuantity("");
        setAmount("");
      }
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateStatus = async () => {
    const nextDialysis = getValues("nextDialysisDetails");
    const scheduleID = parseInt(localStorage.getItem("schedulecompleteID"));
    console.log(scheduleID);
    debugger;
    const status = getValues("dialysisStatus");
    if (nextDialysis) {
      const patientId = parseInt(localStorage.getItem("patientID"));
      const data = {
        dialysisStatus: status.toUpperCase(),
        doctorName: getValues("doctorName"),
        nursingStaffName: getValues("nursingStaffName"),
        declareThatBillCheckedAndVerifiedWithCustomer: getValues(
          "declareThatBillCheckedAndVerifiedWithCustomer"
        ),
        nextDialysisDetails: {
          patientId: patientId,
          dialysisDate: getValues("dialysisDate"),
          dialysisStationLabel: getValues("dialysisStationLabel"),
          dialysisSlot: getValues("dialysisSlot"),
          scheduleRandomlyIfMentionedStationAndSlotNotAvailable: getValues(
            "scheduleRandomlyIfMentionedStationAndSlotNotAvailable"
          ),
        },
      };
      debugger;
      const result = await axios.put(
        `dialysisScheduler/${scheduleID}/status`,
        data
      );
      if (result.status === 204) {
        localStorage.clear();
        toast.success("Dialysis Completed & New Dialysis Scheduled");
        handleClose();
        setCompletedSchedule(true);
      }
      debugger;
      console.log(result);
    } else {
      const data = {
        dialysisStatus: status.toUpperCase(),
        doctorName: getValues("doctorName"),
        nursingStaffName: getValues("nursingStaffName"),
        declareThatBillCheckedAndVerifiedWithCustomer: getValues(
          "declareThatBillCheckedAndVerifiedWithCustomer"
        ),
        nextDialysisDetails: null,
      };
      debugger;

      const result = await axios.put(
        `dialysisScheduler/${scheduleID}/status`,
        data
      );
      if (result.status === 204) {
        localStorage.clear();
        toast.success("Dialysis Completed");
        setCompletedSchedule(true);
        handleClose();
      }
      console.log(result);
    }
  };

  const getDailysisView = async (id, action) => {
    try {
      const result = await axios.get(`dialysisScheduler/${id}/billing`);
      debugger;
      if (result.status === 200 && result.data) {
        setBillingDetailsView(result.data);
        setBillingHead(result.data.billingHead);
        setbillingRemarks(result.data.billingRemarks);
        handleOpen("md", action);
      }
    } catch (error) {
      debugger;
      if (error.response.status === 400) {
        toast.info("No bill items added yet");
        // handleOpen("md",action);
        // setValue("billingHead", "");
        // setValue("billingRemarks", "");
        // setValue("billItems", []);
        // setBillItems(false);
      }
    }
  };
  const getDialysisBillingDetails = async (id, action) => {
    try {
      if (action === "view") {
        debugger;
        const result = await axios.get(`dialysisScheduler/${id}/billing`);
        if (result.status === 200 && result.data) {
          setBillingDetailsView(result.data);
          setBillingHead(result.data.billingHead);
          setbillingRemarks(result.data.billingRemarks);
          handleOpen("md", "view");
        }
      } else {
        debugger;
        const result = await axios.get(`dialysisScheduler/${id}/billing`);
        debugger;
        setValue("billingHead", result.data.billingHead);
        setValue("billingRemarks", result.data.billingRemarks);
        setValue("billItems", result.data.billItems);
        console.log(result);
        handleOpen("md", "add");
        setBillItems(true);
      }
    } catch (error) {
      if (error.response.status === 400) {
        handleOpen("md", "add");
        setValue("billingHead", "");
        setValue("billingRemarks", "");
        setValue("billItems", []);
        setBillItems(false);
      }
      console.log(error.message);
    }
  };
  const handleSearch = () => {
    debugger;
    if (fromDate > toDate) {
      toast.error("To Date cannot be lesser than from Date");
      return;
    }
    setdialysisDetails([]);
    getDialsisDetail(fromDate, toDate);
  };
  const cancelSchedule = async () => {
    try {
      debugger;
      const cancelId = parseInt(localStorage.getItem("cancelId"));
      const result = await axios.put(`dialysisScheduler/${cancelId}/status`, {
        dialysisStatus: "CANCELLED",
      });
      if (result.status === 204) {
        localStorage.clear();
        toast.success("Schedule Deleted Succesfully");
        handleClose();
        setCancelScheduled((prev) => !prev);
      }
    } catch (error) {
      console.log(error.message);
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
                  <h4 className="card-title">Dialysis Details</h4>
                  <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                      <Form.Group controlId="formFirstName">
                        <Form.Label>From Date</Form.Label>
                        <DatePicker
                          format="dd-MM-yyyy"
                          value={fromDate}
                          onChange={(date) => setFromDate(date)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                      <Form.Group controlId="formMiddleName">
                        <Form.Label>To Date</Form.Label>
                        <DatePicker
                          format="dd-MM-yyyy"
                          value={toDate}
                          onChange={(date) => setToDate(date)}
                        />
                      </Form.Group>
                    </div>
                    <div className="">
                      <Button variant="primary" onClick={handleSearch}>
                        Search
                      </Button>
                    </div>
                  </div>
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
                        <th>Schedule ID</th>
                        <th>Patient Name</th>
                        <th>Patient MobileNumber</th>
                        <th>Schedule Date</th>
                        <th>Dialysis StationLabel</th>
                        <th>Dialysis Slot</th>
                        <th>Schedule Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dialysisDetails.length > 0 ? (
                        dialysisDetails.map((item) => {
                          return (
                            <tr key={item.scheduleID}>
                              <td>{item.scheduleID}</td>
                              <td>{item.patientName}</td>
                              <td>{item.patientMobileNumber}</td>
                              <td>{item.scheduleDate}</td>
                              <td>{item.dialysisStation}</td>
                              <td>{item.dialysisSlot}</td>
                              <td>{item.scheduleStatus}</td>

                              <td>
                                <div className="form-button-action">
                                  <Button
                                    size="md"
                                    onClick={() => {
                                      getDailysisView(item.scheduleID, "view");
                                    }}
                                  >
                                    <GrView style={{ color: "green" }} />
                                  </Button>
                                  <Button
                                    size="md"
                                    onClick={() => {
                                      getDialysisBillingDetails(
                                        item.scheduleID,
                                        "add"
                                      );
                                      localStorage.setItem(
                                        "scheduleID",
                                        item.scheduleID
                                      );
                                    }}
                                  >
                                    <IoAddCircleOutline
                                      style={{ color: "blue" }}
                                    />
                                  </Button>
                                  <Button
                                    size="md"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "patientID",
                                        item.patientId
                                      );
                                      localStorage.setItem(
                                        "schedulecompleteID",
                                        item.scheduleID
                                      );
                                      handleOpen("md", "delete");
                                    }}
                                  >
                                    <MdIncompleteCircle />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "cancelId",
                                        item.scheduleID
                                      );
                                      handleOpen("sm", "alert");
                                    }}
                                  >
                                    <MdCancel style={{ color: "red" }} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7">No Data Found</td>
                        </tr>
                      )}
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
              {type === "view" && `${billingHead}, ${billingRemarks}`}
              {type === "add" && "Add Dialysis Billings"}
              {type === "delete" && "Complete Dialysis"}
              {type === "alert" && "Cancel Schedule"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {type === "view" && (
              <div>
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
                        <th>Item Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {billindDetailsView.billItems ? (
                        billindDetailsView.billItems.map((item) => {
                          return (
                            <tr key={item.itemId}>
                              <td>{item.itemId}</td>
                              <td>{item.billItemType}</td>
                              <td>{item.billItemName}</td>
                              <td>{item.itemQuantity}</td>
                              <td>{item.amount}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7">No Data Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {type === "add" && (
              <div>
                <div className="col">
                  {billItems === false && (
                    <div className="mb-3">
                      <Form.Group controlId="formFirstName">
                        <Form.Label>Billing Head</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Billing Head"
                          {...register("billingHead")}
                        />
                      </Form.Group>
                    </div>
                  )}

                  <div className="mb-3">
                    <Form.Group controlId="formBillItemName">
                      <Form.Label> Bill Item Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Bill Item Name"
                        {...register("billItemName")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formItemQuantity">
                      <Form.Label>Item Quantity</Form.Label>
                      <Form.Control
                        type="text"
                        value={itemQuantity}
                        maxLength="2"
                        onChange={handleItemQuantityChange}
                        placeholder="Enter Item Quantity"
                        // {...register("middleName")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formBillItemType">
                      <Form.Select
                        aria-label="Select Bill Item Type"
                        {...register("billItemType")}
                      >
                        <option value="">Select Bill Item Type</option>
                        <option value="DIALYSIS">Dialysis</option>
                        <option value="PATHOLOGY">Pathology</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formAmount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={handleAmountChange}
                        pattern="^\d{1,5}(\.\d{1,2})?$"
                        title="Enter up to 5 digits and 2 decimal places (e.g., 10000.00)"
                      />
                    </Form.Group>
                  </div>
                  {billItems === false && (
                    <div className="mb-3">
                      <Form.Group controlId="formBillingRemarks">
                        <Form.Label>Billing Remarks</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Billings Remarks"
                          {...register("billingRemarks")}
                        />
                      </Form.Group>
                    </div>
                  )}
                </div>
              </div>
            )}
            {type === "delete" && (
              <div>
                <div className="col">
                  <div className="mb-3">
                    <Form.Group controlId="formDoctorName">
                      <Form.Label>Billing Head</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Doctor Name"
                        {...register("doctorName")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formdialysisStatus">
                      <Form.Label>Dialysis Status</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Dialysis Status"
                        {...register("dialysisStatus")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formNursingStaffName">
                      <Form.Label>Nursing Staff Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Nursing Staff Name"
                        {...register("nursingStaffName")}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formdeclareThatBillCheckedAndVerifiedWithCustomer">
                      <Form.Label>Billing Check</Form.Label>
                      <Toggle
                        value={BillingCheck}
                        onChange={handleBillingCheck}
                      />
                    </Form.Group>
                  </div>
                  <div className="mb-3">
                    <Form.Group controlId="formdeclareThatBillCheckedAndVerifiedWithCustomer">
                      <Form.Label>Next Dialysis</Form.Label>
                      <Toggle
                        value={nextDialysis}
                        onChange={handleNextDialysis}
                      />
                    </Form.Group>
                  </div>
                  {nextDialysis && (
                    <div>
                      <div className="mb-3">
                        <Form.Group controlId="dialysisDate">
                          <Form.Label>Dialysis Date</Form.Label>
                          <DatePicker
                            format="dd-MM-yyyy"
                            onChange={handleDialysisDate}
                            shouldDisableDate={(date) => {
                              const todayDate = new Date();

                              return todayDate > date;
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div>
                        <Form.Group controlId="dialysisStationLabel">
                          <Form.Label>Dialysis Station</Form.Label>
                          <div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="BED#1"
                                name="radioGroup"
                                value="DS_ONE"
                                checked={selectedStation === "DS_ONE"}
                                onChange={handleStationChange}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="BED#2"
                                name="radioGroup"
                                value="DS_TWO"
                                checked={selectedStation === "DS_TWO"}
                                onChange={handleStationChange}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="BED#3"
                                name="radioGroup"
                                value="DS_THREE"
                                checked={selectedStation === "DS_THREE"}
                                onChange={handleStationChange}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="BED#4"
                                name="radioGroup"
                                value="DS_FOUR"
                                checked={selectedStation === "DS_FOUR"}
                                onChange={handleStationChange}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="BED#5"
                                name="radioGroup"
                                value="DS_FIVE"
                                checked={selectedStation === "DS_FIVE"}
                                onChange={handleStationChange}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="BED#6"
                                name="radioGroup"
                                value="DS_SIX"
                                checked={selectedStation === "DS_SIX"}
                                onChange={handleStationChange}
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                      <div>
                        <Form.Group controlId="dialysisSlot">
                          <Form.Label>Dialysis Slot</Form.Label>

                          <div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="MORNING"
                                name="slotGroup"
                                value="MORNING"
                                checked={selectedDialysisSlot === "MORNING"}
                                onChange={handleDialysisSlot}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="AFTER_NOON"
                                name="slotGroup"
                                value="AFTER_NOON"
                                checked={selectedDialysisSlot === "AFTER_NOON"}
                                onChange={handleDialysisSlot}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="EVENING"
                                name="slotGroup"
                                value="EVENING"
                                checked={selectedDialysisSlot === "EVENING"}
                                onChange={handleDialysisSlot}
                              />
                            </div>
                            <div className="d-inline-block me-3">
                              <Form.Check
                                type="radio"
                                label="NIGHT"
                                name="slotGroup"
                                value="NIGHT"
                                checked={selectedDialysisSlot === "NIGHT"}
                                onChange={handleDialysisSlot}
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                      <div>
                        <Form.Group controlId="scheduleRandomlyIfMentionedStationAndSlotNotAvailable">
                          <Form.Label>Schedule Randomly</Form.Label>
                          <Toggle
                            value={scheduleRandom}
                            onChange={handleSchedule}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {type === "alert" && (
              <div>
                <RemindIcon style={{ color: "#ffb300", fontSize: 24 }} />{" "}
                <span>Do you want cancel this schedule ?</span>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            {type === "delete" && (
              <Button onClick={updateStatus} appearance="primary">
                Update
              </Button>
            )}
            {type === "add" && (
              <Button onClick={dialysisBilling} appearance="primary">
                ADD
              </Button>
            )}
            {type === "view" && (
              <Button onClick={handleClose} appearance="primary">
                Close
              </Button>
            )}
            {type === "alert" && (
              <div>
                <Button appearance="primary" onClick={cancelSchedule}>
                  Yes
                </Button>
                <Button appearance="ghost" onClick={handleClose}>
                  No
                </Button>
              </div>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default DialysisDetails;
