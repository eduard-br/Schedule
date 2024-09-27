import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Row,
  Col,
  Table,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addSchedule } from "../../store/actions";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const dayMapping = {
  ПН: 1,
  ВТ: 2,
  СР: 3,
  ЧТ: 4,
  ПТ: 5,
  СБ: 6,
  ВС: 0,
};

const ScheduleModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [totalHours, setTotalHours] = useState(10);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [hourType, setHourType] = useState("academic");
  const [selectedDays, setSelectedDays] = useState(["ПН", "СР", "ПТ"]);
  const [breakOption, setBreakOption] = useState("withoutBreak");
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(null);

  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedule.schedules);

  const showModal = () => {
    setVisible(true);
    form.setFieldsValue({
      groupName: "",
      startDate: moment(),
      totalHours: 10,
      hourType: "academic",
      breakOption: "withoutBreak",
    });
    setStartDate(moment());
    setEndDate(null);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newSchedule = {
        id: uuidv4(),
        groupName: values.groupName,
        totalHours,
        hourType,
        selectedDays,
        startTime,
        endTime,
        breakOption,
        startDate,
        endDate,
        hoursPerDay,
      };
      dispatch(addSchedule(newSchedule));
      setVisible(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const selectMonWedFri = () => {
    setSelectedDays(["ПН", "СР", "ПТ"]);
  };

  const selectTueThu = () => {
    setSelectedDays(["ВТ", "ЧТ"]);
  };

  const calculateEndTime = useCallback(() => {
    const hourDuration = hourType === "academic" ? 45 : 60;
    const totalMinutes =
      hoursPerDay * hourDuration + (breakOption === "withBreak" ? 15 : 0);
    const [hours, minutes] = startTime.split(":");
    const start = moment().hour(hours).minute(minutes);
    const end = start.clone().add(totalMinutes, "minutes");
    setEndTime(end.format("HH:mm"));
  }, [hoursPerDay, startTime, hourType, breakOption]);

  const calculateEndDate = useCallback(() => {
    if (
      !startDate ||
      !totalHours ||
      !hoursPerDay ||
      selectedDays.length === 0
    ) {
      return;
    }

    let hoursLeft = totalHours;
    let currentDate = moment(startDate);

    while (hoursLeft > 0) {
      const currentDay = currentDate.day();
      const isSelectedDay = selectedDays.some(
        (day) => dayMapping[day] === currentDay
      );

      if (isSelectedDay) {
        hoursLeft -= hoursPerDay;
      }

      if (hoursLeft > 0) {
        currentDate.add(1, "days");
      }
    }

    setEndDate(currentDate);
  }, [startDate, totalHours, hoursPerDay, selectedDays]);

  useEffect(() => {
    calculateEndTime();
  }, [calculateEndTime]);

  useEffect(() => {
    calculateEndDate();
  }, [startDate, totalHours, hoursPerDay, selectedDays, calculateEndDate]);

  const buttonStyle = { fontSize: "16px", width: "100%", height: "40px" };

  const columns = [
    { title: "Название группы", dataIndex: "groupName", key: "groupName" },
    {
      title: "Общее количество часов",
      dataIndex: "totalHours",
      key: "totalHours",
    },
    {
      title: "Тип часов",
      dataIndex: "hourType",
      key: "hourType",
      render: (type) =>
        type === "academic" ? "Академические" : "Астрономические",
    },
    {
      title: "Дни недели",
      dataIndex: "selectedDays",
      key: "selectedDays",
      render: (days) => days.join(", "),
    },
    { title: "Время начала", dataIndex: "startTime", key: "startTime" },
    { title: "Время окончания", dataIndex: "endTime", key: "endTime" },
    {
      title: "Дата начала",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => moment(date).format("DD.MM.YYYY"),
    },
    {
      title: "Дата окончания",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) =>
        date ? moment(date).format("DD.MM.YYYY") : "Не установлена",
    },
  ];

  useEffect(() => {
    if (endDate) {
      form.setFieldsValue({
        endDate: endDate,
      });
    }
  }, [endDate, form]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row
        gutter={[16, 16]}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Col span={24}>
          <Table
            dataSource={schedules}
            columns={columns}
            rowKey={(record) => record.id}
          />
        </Col>
        <Col span={8}>
          <Button type="primary" onClick={showModal} style={buttonStyle}>
            Добавить расписание
          </Button>
        </Col>
      </Row>

      <Modal
        title="Добавление расписания"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        okText="Добавить расписание"
        cancelText="Отмена"
      >
        <Form layout="vertical" form={form}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Название группы" name="groupName">
                <Input
                  placeholder="Введите название"
                  style={{ fontSize: "16px", height: "40px" }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Цвет группы" name="groupColor">
                <Input
                  type="color"
                  defaultValue="#ff0000"
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item label="Тип часов" name="hourType">
                <Select
                  placeholder="Выберите тип часов"
                  onChange={(value) => setHourType(value)}
                  defaultValue="academic"
                  style={{ fontSize: "16px", height: "40px" }}
                >
                  <Select.Option value="academic">
                    Академические (45 мин)
                  </Select.Option>
                  <Select.Option value="astronomical">
                    Астрономические (60 мин)
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Общее количество часов" name="totalHours">
                <InputNumber
                  min={1}
                  value={totalHours}
                  onChange={(value) => setTotalHours(value)}
                  style={{ width: "100%", fontSize: "16px", height: "40px" }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Дата начала курса" name="startDate">
                <DatePicker
                  value={startDate}
                  onChange={(date) => setStartDate(date ? date : moment())}
                  format="DD.MM.YYYY"
                  style={{ width: "100%", fontSize: "16px", height: "40px" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Дата окончания курса" name="endDate">
                <DatePicker
                  value={endDate ? moment(endDate).format("YYYY-MM-DD") : null}
                  format="DD.MM.YYYY"
                  style={{ width: "100%", fontSize: "16px", height: "40px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Выбор дней недели">
            <Row gutter={[8, 8]} style={{ marginTop: "10px" }}>
              <Col span={4}>
                <Button
                  type="default"
                  onClick={selectMonWedFri}
                  style={buttonStyle}
                >
                  ПН/СР/ПТ
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  type="default"
                  onClick={selectTueThu}
                  style={buttonStyle}
                >
                  ВТ/ЧТ
                </Button>
              </Col>
              {daysOfWeek.map((day) => (
                <Col span={2} key={day}>
                  <Button
                    type={selectedDays.includes(day) ? "primary" : "default"}
                    onClick={() => toggleDaySelection(day)}
                    style={buttonStyle}
                  >
                    {day}
                  </Button>
                </Col>
              ))}
            </Row>
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item label="Наличие перерыва" name="breakOption">
                <Select
                  placeholder="Выберите"
                  onChange={(value) => setBreakOption(value)}
                  style={{ fontSize: "16px", height: "40px" }}
                >
                  <Select.Option value="withoutBreak">
                    Без перерыва
                  </Select.Option>
                  <Select.Option value="withBreak">С перерывом</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Часов в день" name="hoursPerDay">
                <InputNumber
                  min={1}
                  value={hoursPerDay}
                  onChange={(value) => setHoursPerDay(value)}
                  style={{ width: "100%", fontSize: "16px", height: "40px" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Время начала и окончания занятий"
                name="classTime"
              >
                <Input.Group compact>
                  <Input
                    style={{ width: "45%", fontSize: "16px", height: "40px" }}
                    placeholder="Начало"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    style={{
                      width: "10%",
                      textAlign: "center",
                      borderLeft: 0,
                      pointerEvents: "none",
                      height: "40px",
                    }}
                    placeholder="до"
                    disabled
                  />
                  <Input
                    style={{ width: "45%", fontSize: "16px", height: "40px" }}
                    placeholder="Окончание"
                    value={endTime}
                  />
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleModal;
