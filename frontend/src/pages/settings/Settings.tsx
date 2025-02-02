import styled from "styled-components";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { AiFillCamera } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import FontModal from "../../components/setting/FontModal";
import LogoutModal from "../../components/setting/LogoutModal";
import ImageModal from "../../components/setting/ImageModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUserName } from "../../features/user/userSlice";
import { setPush } from "../../features/setting/settingSlice";
import { setFamilyCreatedAt, setFamilyId, setFamilyName, setFamilyUsers } from "../../features/family/familySlice";
import axios from "axios";
import { MdOutlineEmojiPeople } from "react-icons/md";
import { ModalBack, ModalContent, ModalDiv } from "../../components";
import { useNavigate } from "react-router-dom";

const Modal24 = styled.div`
  font-weight: 600;
  margin-bottom: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ConfirmButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 35%;
  height: 2em;

  color: #fff;
  background-color: #ff787f;
  border-radius: 0.4em;
  margin-right: 0.4em;
`;

const CancelButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 35%;
  height: 2.2em;

  box-sizing: border-box;

  color: #aaa;
  border: 2px solid #aaa;
  border-radius: 0.4em;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0px;
  background-color: #ffcdbe;
  height: 56px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  z-index: 1;
`;
const SettingLabel = styled.div`
  font-weight: bold;
  text-align: center;
  line-height: 56px;
`;
const SettingsBody = styled.div`
  position: relative;
`;

const ProfileImgDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px auto 40px;
`;
const ProfileImgCover = styled.div`
  position: relative;
`;

const ProfileEditIcon = styled.div`
  position: absolute;
  font-size: 1.2em;
  border-radius: 0.9em;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 8px;
  right: 8px;
  height: 36px;
  width: 36px;
  background: linear-gradient(120.28deg, #ff787f 15.03%, #fec786 87.76%);
  color: #fff;
`;
const ProfileImg = styled.img`
  width: 144px;
  height: 144px;
  border-radius: 72px;
`;
const NameEmailDiv = styled.div`
  height: 24px; // 나중에 폰트 사이즈 변수화 하여 연동 할 것
  position: relative;
  padding-bottom: 16px;
  margin: 0 5%;
  border-bottom: 1px solid #ff787f;
`;
const UserName = styled.div`
  margin: 0 8px;
  display: flex;
`;
const UserNameEdit = styled.div`
  margin-left: 0.4em;
  color: #ff787f;
`;

const UserEmail = styled.div`
  position: absolute;
  top: 0;
  right: 1em;
`;
const SettingMenu = styled.div`
  margin: 0.8em 1.2em;
`;
const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f9d7d3;
  height: 48px;
  font-size: 0.8em;
`;

const SettingItemTitle = styled.div`
  margin: 0 8px;
`;
const SettingItemContent = styled.div`
  color: #ff787f;
  margin: 0 8px;
`;
const SettingItemContentPush = styled.div`
  color: #ff787f;
  margin: 0;
`;
const SettingCopyright = styled.div`
  position: absolute;
  bottom: 68px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;
const SettingIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  width: 28px;
  font-size: 1.4em;
`;
const NameEditInput = styled.input`
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom: 1;
  width: 30vw;
  height: 1em;
  background-color: transparent;
  border-color: #ffd5d7;
  outline: 0;
  font-family: "Pretendard-Regular";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1em;
`;
const theme = createTheme({
  palette: {
    neutral: {
      main: "#FF787F",
      contrastText: "#fad7d4",
    },
  },
});
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Switch" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

const Settings = () => {
  const [profile, setProfile] = useState<{
    phone: string;
    name: string;
    image: string;
  }>({
    phone: "",
    name: "",
    image:
      "",
  }); // 유저 프로필 정보
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [version, setVersion] = useState<string>("1.0.0");
  const fontSize = useAppSelector((state) => state.setting.fontSize);
  const [isImageModal, toggleImageModal] = useState<boolean>(false);
  const [isFontModal, toggleFontModal] = useState<boolean>(false);
  const [isLogoutModal, toggleLogoutModal] = useState<boolean>(false);
  const [isFamilyModal, setIsFamilyModal] = useState<boolean>(false);
  const [isFamilyConfirmed, setIsFamilyConfirmed] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const fontLetter = ["작게", "보통", "크게"];

  const accessToken = useAppSelector((state) => state.token.access);
  const familyId = useAppSelector((state) => state.family.id)
  const userName = useAppSelector((state) => state.user.name);
  const userImage = useAppSelector((state) => state.user.image);
  const userKakao = useAppSelector((state) => state.user.kakaoId);
  const isPush = useAppSelector((state) => state.setting.push);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (familyId < 0) {
      navigate("/");
    }
  }, [])

  const handleNameEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPush(e.target.checked));
  };
  const onEditName = () => {
    setToggleEdit(true);
  };
  const offEditName = () => {
    if (editName !== "") {
      const data = new FormData();
      data.append("name", editName);
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BACK_HOST}/accounts/profile/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: data,
      })
        .then((res) => {
          dispatch(setUserName(res.data.name));
          axios({
            method: "get",
            url: `${process.env.REACT_APP_BACK_HOST}/family/${familyId}`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => {
              dispatch(setFamilyUsers(res.data.users));
            })
          setToggleEdit(false);
        })
        .catch((err) => {
          setToggleEdit(false);
        });
    }
  };
  const confirmFamily = () => {
    if (familyId >= 0) {
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BACK_HOST}/family/secession/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          family_id: familyId
        }
      })
        .then(() => {
          setIsFamilyConfirmed(true);
          setTimeout(() => {
            dispatch(setFamilyId(-1));
            dispatch(setFamilyName(""));
            dispatch(setFamilyCreatedAt(""));
            dispatch(
              setFamilyUsers([
                {
                  id: -1,
                  name: "",
                  image: "",
                  set_name: "",
                },
              ])
            );
            setIsFamilyModal(false);
            setIsFamilyConfirmed(false);
            navigate("/");
          }, 2000)
        })
    }
  }

  return (
    <>
      <SettingsHeader>
        <SettingLabel>설정</SettingLabel>
      </SettingsHeader>
      {isFamilyModal && <ModalBack onClick={() => setIsFamilyModal(false)}/>}
      {isFamilyModal && (
        <ModalDiv>
          <ModalContent>
            <Modal24> {isFamilyConfirmed ? "가족 탈퇴되었습니다." : "정말 가족을 탈퇴하시겠습니까?"} </Modal24>
            {!isFamilyConfirmed && (
              <ButtonDiv>
                <ConfirmButton onClick={confirmFamily}>확인</ConfirmButton>
                <CancelButton onClick={() => {
                  setIsFamilyModal(false);
                }}>취소</CancelButton>
              </ButtonDiv>
            )}
          </ModalContent>
        </ModalDiv>
      )}
      <SettingsBody>
        <ProfileImgDiv>
          <ProfileImgCover>
            <div>
              <ProfileImg src={userImage} />
            </div>
            <ProfileEditIcon onClick={() => toggleImageModal(true)}>
              <AiFillCamera />
            </ProfileEditIcon>
          </ProfileImgCover>
        </ProfileImgDiv>
        <NameEmailDiv>
          <UserName>
            {!toggleEdit ? (
              <>
                <div>{userName}</div>
                <UserNameEdit onClick={onEditName}>
                  <FiEdit />
                </UserNameEdit>
              </>
            ) : (
              <>
                <div>
                  <NameEditInput
                    placeholder={userName}
                    onChange={handleNameEdit}
                  />
                </div>
                <UserNameEdit onClick={offEditName}>
                  <FaCheck />
                </UserNameEdit>
              </>
            )}
          </UserName>
          <UserEmail>{userKakao < 0 ? null : userKakao}</UserEmail>
        </NameEmailDiv>
        <SettingMenu>
          {/* <SettingItem>
            <SettingItemTitle>푸시알림</SettingItemTitle>
            <SettingItemContentPush>
              <ThemeProvider theme={theme}>
                <Switch
                  checked={isPush}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                  color="neutral"
                />
              </ThemeProvider>
            </SettingItemContentPush>
          </SettingItem> */}
          <SettingItem onClick={() => toggleFontModal(true)}>
            <SettingItemTitle>글자크기</SettingItemTitle>
            <SettingItemContent>{fontLetter[fontSize]}</SettingItemContent>
          </SettingItem>
          <SettingItem>
            <SettingItemTitle>버전정보</SettingItemTitle>
            <SettingItemContent>{version}</SettingItemContent>
          </SettingItem>
          <SettingItem onClick={() => toggleLogoutModal(true)}>
            <SettingItemTitle>로그아웃</SettingItemTitle>
            <SettingItemContent>
              <SettingIcon>
                <TbLogout />
              </SettingIcon>
            </SettingItemContent>
          </SettingItem>
          { familyId >= 0 && (
            <SettingItem onClick={() => {setIsFamilyModal(true)}}>
              <SettingItemTitle>가족 탈퇴</SettingItemTitle>
              <SettingItemContent>
                <SettingIcon>
                  <MdOutlineEmojiPeople />
                </SettingIcon>
              </SettingItemContent>
            </SettingItem>
          )}
        </SettingMenu>
      </SettingsBody>
      {isImageModal ? (
        <ImageModal
          currentImage={userImage}
          isOpen={isImageModal}
          toggle={toggleImageModal}
        />
      ) : (
        <div></div>
      )}
      {isFontModal ? (
        <FontModal isOpen={isFontModal} toggle={toggleFontModal} />
      ) : (
        <div></div>
      )}
      {isLogoutModal ? (
        <LogoutModal isOpen={isLogoutModal} toggle={toggleLogoutModal} />
      ) : (
        <div></div>
      )}
      <SettingCopyright>
        <div>Copyright ⓒB103</div>
      </SettingCopyright>
    </>
  );
};

export default Settings;
