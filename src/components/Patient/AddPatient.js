import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
// import DatePicker from "react-datepicker";
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
      const formattedData = {
        ...data,
        mobileNumber: "+91" + data.mobileNumber,
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
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    {...register("firstName")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formMiddleName">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Middle Name"
                    {...register("middleName")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="formLastName">
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
                <Form.Group controlId="formDOB">
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
                <Form.Group controlId="formGender">
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
                <Form.Group controlId="formAadharNumber">
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
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <Form.Group controlId="formWhatsAppNumber">
                  <Form.Label>WhatsApp Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter WhatsApp Number"
                    {...register("whatsAppNumber")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <Form.Group controlId="formMobileNumber">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Mobile Number"
                    {...register("mobileNumber")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <Form.Group controlId="formEmailId">
                  <Form.Label>Email Id</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email Id"
                    {...register("emailId")}
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <Form.Group controlId="formInsuranceDetails">
                  <Form.Label>Insurance Details</Form.Label>
                  <Form.Select
                    aria-label="Select Insurance Details"
                    onChange={handleInsuranceChange}
                    defaultValue=""
                  >
                    <option value="">Select Insurance</option>
                    {insuranceOptions.map((option) => (
                      <option
                        key={option.policyNumber}
                        value={option.policyNumber}
                      >
                        {option.insuranceCompany} - {option.policyNumber}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              {/* <div className="col-12 col-md-6 col-lg-3 mb-3">
                <Form.Group controlId="formInsuranceDetails">
                  <Form.Label>Insurance Details</Form.Label>
                  <Controller
                    name="insuranceDetails"
                    control={control}
                    render={({ field }) => (
                      <Form.Select
                        aria-label="Select Insurance Details"
                        {...field}
                      >
                        <option value="">Select Insurance</option>
                        {insuranceOptions.map((option) => (
                          <option
                            key={option.policyNumber}
                            value={JSON.stringify(option)}
                          >
                            {option.company} - {option.policyNumber}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  />
                </Form.Group>
              </div> */}
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
