import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Checkbox,
  Button,
  CardActions,
  CircularProgress,
  Box,
  Dialog,
  IconButton,
  TextField,
  Snackbar,
  Chip,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useSelector, useDispatch } from "react-redux";
import { axiosGet, axiosPost } from "Api";
import { useHistory } from "react-router";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      minWidth: 700,
      maxWidth: 1000,
      height: 1000,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 500,
    maxWidth: 1200,
    minHeight: 350,
    maxHeight: 1000,
  },
  label: {
    textTransform: "capitalize",
    paddingRight: -300,
  },
  textField: {
    margin: theme.spacing(2),
    minWidth: 250,
  },
}));

function OrderDetailSupplier(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {id} = props;
  console.log(props.data)
  const [data, setData] = useState({});

  useEffect(()=>{
    axiosGet(dispatch, token , `/supplier/${id}`).then(resp =>{
        setData(resp.data);
        console.log(resp.data)
    })
  }, [])
  

  return (
    <Card className={classes.formControl}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <GroupAddIcon />
          </Avatar>
        }
        title="Nhà cung cấp"
      />
      <CardContent>
      <form noValidate autoComplete="off">
            <div>
              <div className="row">
                <div className="col-3">
                  <b> Mã nhà cung cấp</b>
                </div>
                <div className="col-9">: {data.supplierCode}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b> Tên nhà cung cấp</b>
                </div>
                <div className="col-9">: {data.supplierName}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b> Số điện thoại</b>
                </div>
                <div className="col-9">: {data.phoneNumber}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Email</b>
                </div>
                <div className="col-9">: {data.email}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Địa chỉ</b>
                </div>
                <div className="col-9">: {data.address}</div>
              </div>
              <br />
              
            </div>
          </form>
      </CardContent>
    </Card>
  );
}

export default OrderDetailSupplier;
