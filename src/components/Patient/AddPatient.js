import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Navbar from "../Layouts/Navbar";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { getYear, getMonth } from "date-fns";
import range from "lodash/range";
import { DatePicker } from "rsuite";

function AddPatient() {
  const insuranceOptions = [
    { insuranceCompany: "AYUSHMAN_BHARAT_YOJNA", policyNumber: "2345992" },
    { insuranceCompany: "NATIONAL_INSURANCE", policyNumber: "9876543" },
  ];
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      insuranceDetails: [],
    },
  });

  const formatDate = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleDateofBirth = (e) => {
    setValue("dateOfBirth", formatDate(e));
  };
  const handleInsuranceChange = (event) => {
    const selectedPolicyNumber = event.target.value;
    const selectedInsurance = insuranceOptions.find(
      (option) => option.policyNumber === selectedPolicyNumber
    );
    setValue("insuranceDetails", selectedInsurance ? [selectedInsurance] : []);
  };
  const onSubmit = async (data) => {
    try {
      const insuranceDetail = {
        insuranceCompany: data.insuranceCompany,
        policyNumber: data.policyNumber,
      };
      const insurance = [{ ...insuranceDetail }];
      const formattedData = {
        ...data,
        mobileNumber: "+91" + data.mobileNumber,
        insuranceDetails: insurance,
      };
      console.log(formattedData);
      const result = await axios.post(`patient`, formattedData);
      if (result.status == 201) {
        toast.success("Patient Added Succesfully");
        reset();
        console.log("result", result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <Navbar />

      <div className="container">
        <div className="page-inner">
          <h3 className="fw-bold mb-3">ADD Patient</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={{textAlign: "left", textDecoration: "underline", marginBottom: "10px"}}>
              <h4>Patient Details</h4>
            </div>
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formFirstName" className="formGroupDiv">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    {...register("firstName")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formMiddleName" className="formGroupDiv">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Middle Name"
                    {...register("middleName")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formLastName" className="formGroupDiv">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    {...register("lastName")}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formDOB" className="formGroupDiv">
                  <Form.Label>Select Date</Form.Label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        format="dd-MM-yyyy"
                        onChange={handleDateofBirth}
                        shouldDisableDate={(date) => {
                          const todayDate = new Date();
                          return todayDate < date;
                        }}
                      />
                    )}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formGender" className="formGroupDiv">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    aria-label="Select Gender"
                    {...register("gender")}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formAadharNumber" className="formGroupDiv">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Aadhar Number"
                    {...register("aadharNumber")}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formWhatsAppNumber" className="formGroupDiv">
                  <Form.Label>WhatsApp Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter WhatsApp Number"
                    {...register("whatsAppNumber")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formMobileNumber" className="formGroupDiv">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Mobile Number"
                    {...register("mobileNumber")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formEmailId" className="formGroupDiv">
                  <Form.Label>Email Id</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email Id"
                    {...register("emailId")}
                  />
                </Form.Group>
              </div>
            </div>
            <div style={{textAlign: "left", textDecoration: "underline", marginBottom: "10px"}}>
              <h4>Insurance Details</h4>
            </div>
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formInsuranceCompany" className="formGroupDiv">
                  <Form.Label>Insurance Company</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Insurance Details"
                    {...register("insuranceCompany")}
                  />
                </Form.Group>
              </div>

              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formInsuranceDetails" className="formGroupDiv">
                  <Form.Label>Policy Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Policy Number"
                    {...register("policyNumber")}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="primary" type="submit">
                Add Patient
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default AddPatient;
