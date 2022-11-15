import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useAppSelector } from "../../app/hooks";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Modal from "react-modal";
import { IoIosClose } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import CreateSchedule from "./CreateSchedule";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const ModalBox = styled.div`
  width: 80vw;
  height: 500px;
  /* margin: 30% 5%; */
  top: 100px;
  left: auto;
  border-radius: 30px;
  background-color: white;
  padding: 10% 5% 5%;
  position: absolute;
  animation: ${(props) => (props.show === true ? fadeIn : null)} 0.5s ease-out;
  visibility: ${(props) => (props.show === true ? "visible" : "hidden")};
  transition: visibility 0.5s ease-out;
`;
const CloseIcon = styled.div`
  margin: 5% 5% 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
`;
const DeleteIcon = styled.div`
  margin: 5% 5% 0;
  display: ${(props) => (props.state === "read" ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
`;
const SaveIcon = styled.div`
  margin: 5% 5% 0;
  display: ${(props) => (props.state === "create" ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
`;
const PlusIcon = styled.div`
  margin: 0 5% 5%;
  display: ${(props) => (props.state === "view" ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 1.8em;
  font-weight: bold;
  div {
    background: linear-gradient(45deg, #ff787f, #fec786);
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 30px;
    color: white;
    font-size: 1.8em;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const ModalDateBox = styled.div`
  margin: 5% auto 0;
  font-weight: bold;
`;
const ModalDate = styled.span`
  background: linear-gradient(45deg, #ff787f, #fec786);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: 1.8em;
  font-weight: bold;
`;
const ModalContents = styled.div`
  margin: 5% auto 0;
`;

const HeaderBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  position: sticky;
  top: 0px;
  background-color: #ffcdbe;
  height: 56px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

const HeaderLabel = styled.div`
  font-size: 1.25em;
  font-weight: bold;
  text-align: center;
  line-height: 56px;
`;

const DateBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.5);
`;
const ArrowIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin: 4px;
  color: ${(props) => (props.active === true ? "black" : "#bebebe")};
`;
const DateValue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff787f;
  font-size: 20px;
  font-weight: bold;
  margin: auto 40px;
`;

const MonthlyCalendar = (props) => {
  const { year, month, setYearAndMonth, backgroundColor, monthSchedule } = props;

  // redux 값 불러오는 곳
  const userId = useAppSelector((state) => state.user.id);
  const familyId = useAppSelector((state) => state.family.id);
  const token = useAppSelector((state) => state.token.access);

  const weekly = ["일", "월", "화", "수", "목", "금", "토"];

  const [presDate, setPresDate] = useState(new Date(year, month - 1)); // 현재 날짜
  const [calendar, setCalendar] = useState([]); // 현재 달 날짜 채우기
  const [before, setBefore] = useState([]); // 이전 달 날짜 채우기
  const [after, setAfter] = useState([]); // 다음 달 날짜 채우기
  // const [monthSchedule, setMonthSchedule] = useState([]); // 이번 달 일정 채우기
  const [howday, setHowday] = useState(0);

  // // 월별 일정 조회 api 요청
  // const getMonthSchedule = () => {
  //   axios({
  //     method: "GET",
  //     url: `${process.env.REACT_APP_BACK_HOST}/calendar/schedule/${year}-${month}`,
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((res) => {
  //     setMonthSchedule(res.data);
  //   });
  // };
  // console.log(monthSchedule);

  // 오늘 날짜 찾기
  const [today, setToday] = useState(0);
  const goToday = () => {
    let TODAY = new Date().getDate();
    setToday(TODAY);
  };

  useEffect(() => {
    // getMonthSchedule();
    getCalendar();
    setYearAndMonth(presDate.getFullYear(), presDate.getMonth() + 1);
    goToday();
  }, [presDate]);

  // 달력 그리기
  const getCalendar = () => {
    const year = presDate.getFullYear();
    const month = presDate.getMonth() + 1;
    const beforeDay = new Date(year, month - 1, 1).getDay(); // 1일의 요일
    const afterDay = new Date(year, month, 0).getDate(); // 현재 달의 마지막 일
    const afterDays = (7 - ((afterDay + beforeDay) % 7)) % 7; // 다음 달 칸 채우기

    const before = new Array(beforeDay);
    for (let i = 0; i < beforeDay; i++) {
      before[i] = new Date(year, month - 1, -beforeDay + i + 1).getDate();
    }
    const after = new Array(afterDays);
    for (let i = 0; i < afterDays; i++) {
      after[i] = new Date(year, month - 1, i + 1).getDate();
    }
    let calendar = [];
    calendar = [...Array(afterDay + 1).keys()].slice(1);

    setHowday((before.length + after.length + calendar.length) / 7);
    setBefore([...before]);
    setAfter([...after]);
    setCalendar([...calendar]);
  };

  // 한 달 전으로
  const onHandleBeforeMonth = () => {
    setPresDate(
      new Date(
        presDate.getFullYear(),
        presDate.getMonth() - 1,
        presDate.getDate()
      )
    );
  };

  // 한 달 뒤로
  const onHandleAfterMonth = () => {
    setPresDate(
      new Date(
        presDate.getFullYear(),
        presDate.getMonth() + 1,
        presDate.getDate()
      )
    );
  };
  const [modalDate, setModalDate] = useState("");

  // 모달 설정
  // view=list read=한개 create=create
  const [state, setState] = useState("view");
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState({
    title: "",
    color: "",
    important_mark: false,
    writer: userId,
    start_date: "",
    end_date: "",
    family: familyId,
  });
  const openModal = (date) => {
    setShowModal(true);
    const zerodate = ("00" + date).slice(-2);
    setModalDate(
      `${presDate.getFullYear()}. ${presDate.getMonth() + 1}. ${zerodate}`
    );
  };
  const closeModal = () => {
    setState("view");
    setShowModal(false);
    setDailySchedule([]);
  };
  const modalStyle = {
    overlay: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(136, 136, 136, 0.5)",
      backdropFilter: "blur(2px)",
      width: "100vw",
      height: "100vh",
    },
    content: {
      inset: " auto ",
      width: "100vw",
      height: "100vh",
      border: "none",
      backgroundColor: "rgba(0,0,0,0)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  const [dailyschedule, setDailySchedule] = useState([]);
  // 일별 일정 조회
  const getDailySchedule = () => {
    if (state === "view") {
      axios({
        method: "GET",
        url: `${
          process.env.REACT_APP_BACK_HOST
        }/calendar/schedule/${year}-${month}-${modalDate.slice(-2)}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.status === 404) {
          setDailySchedule([]);
        }
        if (res.status === 200) {
          setDailySchedule(res.data);
        }
      });
    }
  };

  useEffect(() => {
    getDailySchedule();
  }, [state, modalDate.slice(-2)]);

  const deleteSchedule = () => {};

  const saveSchedule = () => {
    const data = new FormData();
    data.append("title", content.title);
    data.append("color", content.color);
    data.append("important_mark", content.important_mark);
    data.append("writer", content.writer);
    data.append("start_date", content.start_date);
    data.append("end_date", content.end_date);
    data.append("family", content.family);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACK_HOST}/calendar/schedule/${content.start_date}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    }).then((res) => {
      if (res.status === 201) {
        alert("일정이 성공적으로 등록되었습니다!");
        setState("view");
      }
    });
  };
  const addSchedule = () => {
    setState("create");
  };
  const schedules = (data) => {
    setContent({ ...data });
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={modalStyle}
        onClick={() => setShowModal(false)}
        dailyschedule={dailyschedule}
      >
        <ModalBox show={showModal}>
          <CloseIcon onClick={closeModal}>
            <IoIosClose size={32} color="#888888" />
          </CloseIcon>
          <DeleteIcon onClick={() => deleteSchedule()} state={state}>
            <RiDeleteBinLine size={28} color="#888888" />
          </DeleteIcon>
          <SaveIcon onClick={() => saveSchedule()} state={state}>
            <BsCheck size={32} color="#888888" />
          </SaveIcon>
          <PlusIcon onClick={() => addSchedule()} state={state}>
            <div>
              <FaPlus size={32} />
            </div>
          </PlusIcon>
          <ModalDateBox>
            <ModalDate>{modalDate}</ModalDate>
          </ModalDateBox>
          <ModalContents>
            {state === "create" ? (
              <CreateSchedule
                schedules={schedules}
                date={modalDate}
                state={state}
              ></CreateSchedule>
            ) : state === "view" ? (
              <>
                {dailyschedule.length === 0 ? (
                  <div style={{color: "#666666"}}>
                    이날의 일정이 없습니다.
                  </div>
                ) : 
                <>
                {dailyschedule.map((item, id) => {
                  return (
                    <DailyScheduleWrapper dailyschedule key={id}>
                      <ColorBox style={{ backgroundColor: `${item.color}` }} />
                      <div style={{ display: "block" }}>
                        {item.title}
                        <DailyDateWrapper>
                          {item.start_date === item.end_date ? (
                            <div>
                              {item.start_date.slice(5, 7)}/
                              {item.start_date.slice(8, 10)}
                            </div>
                          ) : (
                            <div>
                              {item.start_date.slice(5, 7)}/
                              {item.start_date.slice(8, 10)} ~{" "}
                              {item.end_date.slice(5, 7)}/
                              {item.end_date.slice(8, 10)}
                            </div>
                          )}
                        </DailyDateWrapper>
                      </div>
                    </DailyScheduleWrapper>
                  );
                })}
                </>
                }
              </>
            ) : (
              <>{/* one들어가야함 */}</>
            )}
          </ModalContents>
        </ModalBox>
      </Modal>
      <HeaderBox>
        <div></div>
        <HeaderLabel>가족 캘린더</HeaderLabel>
        <></>
      </HeaderBox>
      {/* 연, 월 이동 */}
      <DateBox>
        <ArrowIconBox onClick={onHandleBeforeMonth} active={true}>
          <BsChevronLeft />
        </ArrowIconBox>
        <DateValue>
          {presDate.getFullYear()}. {presDate.getMonth() + 1}
        </DateValue>
        <ArrowIconBox active={true} onClick={onHandleAfterMonth}>
          <BsChevronRight />
        </ArrowIconBox>
      </DateBox>
      {/* 요일 */}
      <WeeklyWrapper>
        {weekly.map((item, index) => {
          return (
            <div key={index}>
              <WeekText color={item}>{item}</WeekText>
            </div>
          );
        })}
      </WeeklyWrapper>
      {/* 달력 그리기 */}
      <MonthWrapper>
        {before.map((item, index) => {
          return (
            <NotMonthDay key={index}>
              <CalendarDate howweek={howday}>{item}</CalendarDate>
            </NotMonthDay>
          );
        })}
        {calendar.map((item, index) => {
          return (
            <OnMonthDay key={index} onClick={() => openModal(item)}>
              <CalendarDate howweek={howday}>{item}</CalendarDate>
              <ScheduleBox howweek={howday}>
                {monthSchedule.map((sc, idx) => {
                  return (
                    <div key={idx}>
                      {/* 범위 안에 */}
                      {Number(sc.start_date.slice(-2)) <=
                        Number(("00" + item).slice(-2)) &&
                      Number(("00" + item).slice(-2)) <=
                        Number(sc.end_date.slice(-2)) ? (
                        //하루치
                        sc.start_date.slice(-2) === sc.end_date.slice(-2) ? (
                          <>
                            <ScTitle color={sc.color}>
                              <p>{sc.title}</p>
                            </ScTitle>
                          </>
                        ) : // 달라
                        sc.start_date.slice(-2) !== ("00" + item).slice(-2) &&
                          sc.end_date.slice(-2) !== ("00" + item).slice(-2) ? (
                          //가운데
                          <>
                            <ScTitle3 color={sc.color}>
                              <p></p>
                            </ScTitle3>
                          </>
                        ) : sc.start_date.slice(-2) ===
                          ("00" + item).slice(-2) ? (
                          // 시작
                          <>
                            <ScTitle2 a={"start"} color={sc.color}>
                              <p a={"start"}>{sc.title}</p>
                            </ScTitle2>
                          </>
                        ) : (
                          //끝
                          <>
                            <ScTitle2 a={"end"} color={sc.color}>
                              <p></p>
                            </ScTitle2>
                          </>
                        )
                      ) : (
                        <></>
                      )}
                      {/* {sc.start_date.slice(-2) === ("00" + item).slice(-2) ? (
                        <>
                          <ScTitle color={sc.color}>
                            <p>{sc.title}</p>
                          </ScTitle>
                        </>
                      ) : (
                        <></>
                      )} */}
                    </div>
                  );
                })}
              </ScheduleBox>
            </OnMonthDay>
          );
        })}
        {after.map((item, index) => {
          return (
            <NotMonthDay key={index}>
              <CalendarDate howweek={howday}>{item}</CalendarDate>
              <ScheduleBox howweek={howday}></ScheduleBox>
            </NotMonthDay>
          );
        })}
      </MonthWrapper>
      <MinMargin></MinMargin>
    </>
  );
};

const WeeklyWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;
const WeekText = styled.div`
  display: flex;
  justify-content: center;
  margin: 3vh auto;
  color: ${(props) =>
    props.color === "일"
      ? "#FF787F"
      : props.color === "토"
      ? "#3DB9A4"
      : "black"};
`;

const MonthWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const NotMonthDay = styled.div`
  color: #bebebe;
`;

const OnMonthDay = styled.div`
  color: black;
`;

const CalendarDate = styled.div`
  display: flex;
  justify-content: center;
  /* @media screen and (max-height: 700px) {
    margin: 0 auto 60px;
  }
  margin: ${(props) =>
    props.howweek === 5 ? " 0 auto 10vh" : "0 auto 8vh"}; */
  color: ${(props) => props.color};
`;
const ScheduleBox = styled.div`
  @media screen and (max-height: 700px) {
    height: 60px;
  }
  height: ${(props) => (props.howweek === 5 ? "10vh" : "8vh")};
  overflow: hidden;
`;
const ScTitle = styled.div`
  margin: 4px auto;
  background-color: ${(props) => props.color};
  border: none;
  border-radius: 5px;
  height: 16px;
  width: 13vw;
  @media screen and (min-width: 720px) {
    width: calc(10vh - 4px);
  }
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* text-overflow: ellipsis; */
  p {
    margin: auto 2px;
    width: calc(13vw - 4px);
    @media screen and (min-width: 720px) {
      width: calc(10vh - 8px);
    }
    text-overflow: hidden;
    overflow: hidden;
    white-space: nowrap;
  }
`;
const ScTitle3 = styled.div`
  margin: 4px auto;
  background-color: ${(props) => props.color};
  border: none;
  height: 16px;
  width: calc(13vw + 4px);
  @media screen and (min-width: 720px) {
    width: calc(10vh);
  }
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  /* text-overflow: ellipsis; */
`;
const ScTitle2 = styled.div`
  margin: ${(props) =>
    props.a === "start" ? "4px 0 4px 4px" : "4px 4px 4px 0px"};
  background-color: ${(props) => props.color};
  border: none;
  border-radius: ${(props) =>
    props.a === "start" ? "5px 0 0 5px" : "0 5px 5px 0"};
  height: 16px;
  width: 13vw;
  @media screen and (min-width: 720px) {
    width: calc(10vh - 4px);
  }
  font-size: 12px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  z-index: ${(props) => (props.a === "start" ? 10 : 5)};
  p {
    margin: auto 2px;
    width: 200%;
    @media screen and (min-width: 720px) {
      width: calc(10vh - 8px);
    }
    text-overflow: ${(props) => (props.a === "start" ? "visible" : "hidden")};
    overflow: ${(props) => (props.a === "start" ? "visible" : "hidden")};
    white-space: nowrap;
  }
`;
const MinMargin = styled.div`
  height: 64px;
`;

const ColorBox = styled.div`
  background-color: ${(props) => props.backgroundColor};
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 4px;
`;

const DailyScheduleWrapper = styled.div`
  display: flex;
  margin-left: 6px;
  margin-bottom: 20px;
`;

const DailyDateWrapper = styled.div`
  color: #666666;
`;

const PlusButtonWrapper = styled.button`
  background-color: transparent;
  background: linear-gradient(45deg, #fec786, #fe9b7c);
  /* -webkit-background-clip: text; */
  /* -webkit-text-fill-color: transparent; */
  border: none;
  border-radius: 50%;
  font-size: xx-large;
  color: white;
  cursor: pointer;
`;

export default MonthlyCalendar;
