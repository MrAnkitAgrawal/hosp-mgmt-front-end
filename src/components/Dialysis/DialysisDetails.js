import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Navbar from "../Layouts/Navbar";
import { GrView } from "react-icons/gr";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, ButtonToolbar, Button, Placeholder } from "rsuite";
import { DatePicker } from "rsuite";
const DialysisDetails = () => {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState();
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [dialysisDetails, setdialysisDetails] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const today = new Date();
    setFromDate(today);

    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 7);
    setToDate(futureDate);
    getDialsisDetail(today, futureDate);
  }, []);

  const getDialsisDetail = async (fromDate, ToDate) => {
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(ToDate);
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

  // const handleDialysisFromDate = (date) => {
  //   setFromDate(date);
  // };

  // const handleDialysisToDate = (date) => {
  //   setToDate(date);
  // };
  const handleSearch = () => {
    debugger;
    if (fromDate > toDate) {
      toast.error("To Date cannot be lesser than from Date");
      return;
    }
    setdialysisDetails([]);
    getDialsisDetail(fromDate, toDate);
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
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {dialysisDetails.length > 0 ? (
                        dialysisDetails.map((item) => {
                          return (
                            <tr key={item.patientId}>
                              <td>{item.scheduleID}</td>
                              <td>{item.patientName}</td>
                              <td>{item.patientMobileNumber}</td>
                              <td>{item.scheduleDate}</td>
                              <td>{item.dialysisStation}</td>
                              <td>{item.dialysisSlot}</td>
                              <td>{item.scheduleStatus}</td>
                              {/* <td>
                                <div className="form-button-action">
                                  <Button
                                    size="md"
                                    onClick={() => handleOpen("md")}
                                  >
                                    <GrView />
                                  </Button>
                                </div>
                              </td> */}
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
      <Modal size={size} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder.Paragraph rows={size === "full" ? 100 : 10} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DialysisDetails;
