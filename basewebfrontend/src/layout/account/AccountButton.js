import { Avatar, IconButton, Button, Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authGet } from "../../Api";
import { AccountMenu } from "./AccountMenu";
import { FcPortraitMode } from "react-icons/fc";
import makeStyles from "@material-ui/core/styles/makeStyles";

export default function AccountButton(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [partyId, setPartyId] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    authGet(dispatch, token, "/my-account/").then(
      (res) => {
        if (res !== undefined && res !== null) {
          setName(res.name);
          setUserName(res.user);
          setPartyId(res.partyId);
        }
      },
      (error) => {}
    );
  }, []);

  return (
    <div>
      <IconButton onClick={handleClick} color="inherit">
        <Avatar color="inherit">
          {/* {name !== "" ? name[0] : ""} */}
          <FcPortraitMode />
        </Avatar>
      </IconButton>

      <AccountMenu
        anchorEl={anchorEl}
        handleClose={handleClose}
        name={name}
        userName={userName}
        partyId={partyId}
        handleLogout={props.handleLogout}
      />
    </div>
  );
}
