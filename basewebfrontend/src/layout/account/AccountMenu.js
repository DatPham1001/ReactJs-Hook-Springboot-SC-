import { Divider, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

export function AccountMenu(props) {
  const history = useHistory();

  const handlePasswordChange = () => {
    props.handleClose();
    history.push("/userlogin/change-password/" + props.userName);
  };

  const handleViewAccount = () => {
    props.handleClose();
    history.push("/userlogin/" + props.partyId);
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={props.anchorEl}
      keepMounted
      open={Boolean(props.anchorEl)}
      onClose={props.handleClose}
      style={{ marginTop: "40px" }}
    >
      <MenuItem onClick={handleViewAccount}>Tài khoản của tôi</MenuItem>
      <MenuItem onClick={props.handleClose}>Cài đặt</MenuItem>
      <MenuItem onClick={handlePasswordChange}>Đổi mật khẩu</MenuItem>
      <Divider />
      <MenuItem onClick={props.handleLogout}>Đăng xuất</MenuItem>
    </Menu>
  );
}
