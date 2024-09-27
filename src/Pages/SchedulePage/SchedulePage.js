import React from "react";
import ScheduleModal from "../../Components/ScheduleModal/ScheduleModal";

const SchedulePage = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Создайте расписание курса</h1>
      <ScheduleModal />
    </div>
  );
};

export default SchedulePage;
