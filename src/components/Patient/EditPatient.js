import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
// import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../Layouts/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { DatePicker } from "rsuite";
const EditPatient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData } = location.state || {};
  console.log("patient data", patientData);
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
      dateOfBirth: new Date(),
      gender: "",
      aadharNumber: "",
      whatsAppNumber: "",
      mobileNumber: "",
      emailId: "",
      firstName: "",
      middleName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (patientData) {
      reset({
        firstName: patientData.firstName || "",
        middleName: patientData.middleName || "",
        lastName: patientData.lastName || "",
        dateOfBirth: parseDate(patientData.dateOfBirth) || new Date(),
        gender: patientData.gender || "",
        aadharNumber: patientData.aadharNumber || "",
        whatsAppNumber: patientData.whatsAppNumber || "",
        mobileNumber: patientData.mobileNumber || "",
        emailId: patientData.emailId || "",
        insuranceCompany:
          patientData.insuranceDetails[0].insuranceCompany || "",
        policyNumber: patientData.insuranceDetails[0].policyNumber || "",
      });
    }
  }, [patientData, reset]);

  const parseDate = (dateString) => {
    if (dateString instanceof Date) {
      return dateString;
    }
    if (!dateString || typeof dateString !== "string") {
      return null;
    }
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleDateofBirth = (e) => {
    const formattedDate = formatDate(e);
    setValue("dateOfBirth", formattedDate);
  };

  const isDateInDDMMYYYY = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(dateString);
  };
  const onSubmit = async (data) => {
    try {
      const insuranceDetail = {
        insuranceCompany: data.insuranceCompany,
        policyNumber: data.policyNumber,
      };
      const insurance = [{ ...insuranceDetail }];
      const formattedDOB = isDateInDDMMYYYY(data.dateOfBirth)
        ? data.dateOfBirth
        : formatDate(data.dateOfBirth);
      const formattedData = {
        ...data,
        dateOfBirth: formattedDOB,
        mobileNumber: data.mobileNumber,
        patientId: patientData.patientId,
        insuranceDetails: insurance,
      };
      console.log("Updated Patient Data:", formattedData);

      const result = await axios.put(
        `patient/${patientData.patientId}`,
        formattedData
      );
      console.log(result);

      if (result.status === 204) {
        toast.success("Patient Updated Successfully");
        navigate("/patient");
      }
    } catch (error) {
      toast.error("Error updating patient: " + error.message);
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-inner">
          <h3 className="fw-bold mb-3">Edit Patient</h3>
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
                Update Patient
              </Button>
            </div>
          </Form>
          
        </div>
      </div>
    </>
  );
};

export default EditPatient;
