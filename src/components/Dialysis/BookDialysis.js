import React, { useState, useEffect } from "react";
import "../../index.css";
import Navbar from "../Layouts/Navbar";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Toggle } from "rsuite";
import { toast } from "react-toastify";
import { DatePicker } from "rsuite";
const BookDialysis = () => {
  const [selectedDialysisSlot, setselectedDialysisSlot] = useState("");
  const [selectedStation, setselectedStation] = useState("");
  const [patients, setpatients] = useState([]);
  const [scheduleRandom, setscheduleRandom] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({});
  const handleDialysisSlot = (event) => {
    setValue("dialysisSlot", event.target.value);
    setselectedDialysisSlot(event.target.value);
  };
  const handleStationChange = (event) => {
    setValue("dialysisStationLabel", event.target.value);
    setselectedStation(event.target.value);
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
  const getPatients = async () => {
    try {
      const result = await axios.get("patient");
      setpatients([...result.data]);
      console.log("patient detials", patients);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getPatients();
  }, []);
  const handlePatientsChange = (event) => {
    const selectedPatientID = event.target.value;
    const selectedPatient = patients.find(
      (option) => option.patientId == selectedPatientID
    );
    setValue("patientId", selectedPatient ? selectedPatient.patientId : "");
  };
  const onSubmit = async (data) => {
    try {
      const result = await axios.post("dialysisScheduler", data);

      if (result.status === 201) {
        toast.success("schedule Created");
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    console.log(data);
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-inner">
          <h3 className="fw-bold mb-3">Book Dialysis</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="patientId">
                  <Form.Select
                    aria-label="Select Patient"
                    onChange={handlePatientsChange}
                    defaultValue=""
                  >
                    <option value="">Select Patient</option>
                    {patients.map((option) => (
                      <option key={option.patientId} value={option.patientId}>
                        {option.firstName} - {option.mobileNumber}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-3">
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
              <div className="col-12 col-md-4 mb-3">
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
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
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
              <div className="col-12 col-md-4 mb-3">
                <Form.Group controlId="scheduleRandomlyIfMentionedStationAndSlotNotAvailable">
                  <Form.Label>Schedule Randomly</Form.Label>
                  <Toggle value={scheduleRandom} onChange={handleSchedule} />
                </Form.Group>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="primary" type="submit">
                Book Dialysis
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BookDialysis;
