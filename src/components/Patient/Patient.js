import React, { useState, useEffect } from "react";
import "../../index.css";
import Navbar from "../Layouts/Navbar";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import useGetAPI from "../../hooks/useGetApi";
function Patient() {
  // const [patient, setPatient] = useState([]);
  const navigate = useNavigate();
  const { data: patient, error, refetch } = useGetAPI(`patient`);

  if (error) return <p>Error: {toast.error(error.message)}</p>;
  // const getPatients = async () => {
  //   try {
  //     const result = await axios.get(`patient`);
  //     console.log(result);
  //     if (result.status === 200) {
  //       setPatient(result.data);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
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
  // useEffect(() => {
  //   getPatients();
  // }, []);
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
                                    onClick={() => {
                                      deletePatient(item.patientId);
                                    }}
                                  >
                                    <FaTrashAlt />
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
    </>
  );
}

export default Patient;
