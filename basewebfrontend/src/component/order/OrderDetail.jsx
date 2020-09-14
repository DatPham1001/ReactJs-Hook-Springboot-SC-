import { useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import MaterialTable from "material-table";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Checkbox,
  Button,
  CardActions,
  CircularProgress,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  FormControlLabel,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
import { axiosGet, axiosDelete, axiosPut } from "Api";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OrderDetailSupplier from "./OrderDetailSupplier";
import OrderCreateProducts from "./OrderCreateProducts";
import StepConnector from "@material-ui/core/StepConnector";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import clsx from "clsx";
import { Label } from "reactstrap";

import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import SaveIcon from "@material-ui/icons/Save";
import OrderDetailProducts from "./OrderDetailProducts";
import { GiAutoRepair } from "react-icons/gi";
import { RiArrowGoBackFill } from "react-icons/ri";

import DeleteIcon from "@material-ui/icons/Delete";
import { FontIcon } from "material-ui";
import { formatDateTime, formatDate } from "utils/NumberFormat";
import CreateIcon from "@material-ui/icons/Create";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Alert from "@material-ui/lab/Alert";

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
    minWidth: 700,
    maxWidth: 1200,
    height: 1000,
  },
  cardTT: {
    marginTop: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(2),
  },

  payment: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  stepper: {
    marginLeft: 10,
  },

  buttonSubmit: {
    minWidth: 240,
  },

  IconButton: {
    float: "right",
    padding: 10,
    margin: 10,
  },
}));

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  },
});

function getSteps() {
  return ["Đặt hàng", "Nhập kho", "Thanh toán"];
}

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <LocalShippingIcon />,
    2: <OpenInBrowserIcon />,
    3: <AttachMoneyIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

function OrderDetail(props) {
  const orderId = useParams().id;

  const [detailOrder, setDetailOrder] = useState();

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const classes = useStyles();

  const { control, handleSubmit } = useForm();

  const [isRequesting, setIsRequesting] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const [checked, setChecked] = useState(false);
  const [checkedWareHouse, setCheckedWareHouse] = useState(false);

  //notifi
  const [mesUpdateStatus, setMesUpdateStatus] = useState(false);
  const [mesUpdateStocked, setMesUpdateStocked] = useState(false);
  const [mesUpdatePaid, setMesUpdatePaid] = useState(false);
  const [mesDelete, setMesDelete] = useState(false);
 
  const [state, setState] = React.useState({
    openMes: false,
    vertical: "bottom",
    horizontal: "right",
  });

  const { vertical, horizontal, openMes } = state;

  const [orderCode, setOrderCode] = useState("");
  const [expDeliveryDate, setExpDeliveryDate] = useState("");
  const [note, setNote] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [products, setProducts] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);

  const [paymentWay, setPaymentWay] = useState("1");
  const listPaymentWay = [
    { value: "1", name: "Tiền mặt" },
    { value: "2", name: "Chuyển khoản" },
    { value: "3", name: "COD" },
  ];

  const handleCloseMes = () => {
    setState({ ...state, openMes: false });
    setMesUpdateStatus(false);
    setMesUpdateStocked(false);
    setMesUpdatePaid(false);
    setMesDelete(false);
  };

  const handlePopup = (value) => {
    setOpenPopup(value);
  };

  const takeData = () => {
    axiosGet(dispatch, token, `/order/${orderId}`).then((resp) => {
        setDetailOrder(resp.data);
        if (resp.data.status === "ORDER") {
          setActiveStep(0);
        } else if (resp.data.status === "STOCKED") {
          setActiveStep(1);
        } else if (resp.data.status === "PAID") {
          setActiveStep(2);
        }
      });
  }

  useEffect(() => {
    takeData();
  }, []);

  // console.log(detailOrder)
  const showPaymentMethod = () => {
    let paymentWay = detailOrder.paymentMethod;
    if (paymentWay === "CASH") {
      return "Tiền mặt";
    } else if (paymentWay === "BANK_TRANSFER") {
      return "Chuyển khoản";
    } else {
      return "COD";
    }
  };

  const handleDelete = () => {
    axiosDelete(dispatch, token, `/order/${orderId}`, null)
      .then((res) => {
        // console.log(res.data);
        setState({...state, openMes: true});
        setMesDelete(true);

        setTimeout(()=>{
            history.push("/orders/list");
        }, 1000);

        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitStatus = () => {
    //exexpDeliveryDate
    let date = formatDateTime(detailOrder.expDeliveryDate);

    //status
    let status = "ORDER";
    if (activeStep === 0) {
      status = "ORDER";
    } else if (activeStep === 1) {
      status = "STOCKED";
    } else if (activeStep === 2) {
      status = "PAID";
    }

    //paymentWay
    // console.log("payment : ",typeof paymentWay)
    let paymentMethod = "CASH";
    if (paymentWay === "1") {
      paymentMethod = "CASH";
    } else if (paymentWay === "2") {
      paymentMethod = "BANK_TRANSFER";
    } else if (paymentWay === "3") {
      paymentMethod = "COD";
    }

    let body = Object.assign(
      {},
      detailOrder,
      { status: status },
      { paymentMethod: paymentMethod },
      { expDeliveryDate: date }
    );
    console.log("body", body);
    axiosPut(dispatch, token, `/order/${orderId}`, body)
      .then((res) => {
        
        setState({ ...state, openMes: true });
        if(body.status === "STOCKED"){
            setMesUpdateStocked(true);
        }else if (body.status === "PAID" && detailOrder.status === "STOCKED"){
            setMesUpdatePaid(true);
        }else {
            setMesUpdateStatus(true);
        }
        
        setChecked(false);
        setCheckedWareHouse(false);

        takeData();
      })
      .catch((err) => {
        let resp = err.response.data;
        console.log(resp);
      });
  };

  return detailOrder !== undefined ? (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Dialog
          open={openPopup}
          onClose={() => handlePopup(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bạn có chắc muốn xóa đơn hàng này không?"}
          </DialogTitle>
          <DialogActions>
            <Button
            //   variant="outlined"
            variant="contained"
              // disabled={isWaiting}
              onClick={() => handleDelete()}
              color="action"
              style={{ marginRight: 20, width: 100 }}
            >
              Xóa
            </Button>

            <Button
              // disabled={isWaiting}
              onClick={() => handlePopup(false)}
              variant="contained"
              autoFocus
              color="primary"
              style={{ marginRight: 20, width: 100 }}
            >
              Không
            </Button>
          </DialogActions>
        </Dialog>
        <Tooltip title="Trở lại" arrow={true}>
          <IconButton
            style={{ float: "left", padding: 10, margin: 10 }}
            onClick={() => history.goBack()}
            className="icons"
            aria-label="Xóa"
          >
            <ArrowBackIcon></ArrowBackIcon>
          </IconButton>
        </Tooltip>{" "}
        <div className="float-right">
            {detailOrder.status !== "PAID" ? (
              <Tooltip title="Sửa" arrow={true}>
                <IconButton
                    style={{margin:10}}
                  onClick={() => history.push(`/orders/update/${orderId}`)}
                  className="icons"
                >
                  <CreateIcon></CreateIcon>
                </IconButton>
              </Tooltip>
            ) : (
              ""
            )}

            {detailOrder.status === "ORDER" ? (
              <Tooltip title="Xóa" arrow={true}>
                <IconButton
                  // onClick={handleDelete}
                  style={{margin:10}}
                  onClick={() => handlePopup(true)}
                  className="icons"
                  aria-label="Xóa"
                >
                  <DeleteIcon color="error"></DeleteIcon>
                </IconButton>
              </Tooltip>
            ) : (
              ""
            )}
          </div>

        <br />
        <br />
        <Typography variant="h5" component="h2" className="mx-2 my-3">
          
          
        </Typography>
        <br />

        <div className="row">
          <div className="col-5 " style={{ paddingTop: 22 }}>
            <Typography variant="h4" component="h2" className="mx-2">
              Chi tiết đơn nhập hàng
            </Typography>
          </div>
          <div className="col-7">
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
              className={classes.stepper}
              style={{ backgroundColor: "#fafafa" }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>

        {/* <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          className={classes.stepper}
          style={{ backgroundColor: "#fafafa" }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper> */}

        <div className="row">
          <div className="col-9">
            <OrderDetailSupplier 
                // id={detailOrder.supplier.supplierId} 
                supplier={detailOrder.supplier}
            />
            <OrderDetailProducts
              products={detailOrder.orderItems}
              detailOrder={detailOrder}
              quantity={detailOrder.quantity}
              totalPayment={detailOrder.totalPayment}
            />

            {detailOrder.status !== "PAID" ? (
              ""
            ) : (
              <Card className="mx-2">
                <CardContent>
                  Phương thức thanh toán đã chọn: <b>{showPaymentMethod()}</b>
                </CardContent>
              </Card>
            )}

            {detailOrder.status === "PAID" ? (
              ""
            ) : (
              <div>
                <div className="mx-2 my-2">
                  <Card>
                    <CardContent>
                      <FormControlLabel
                        aria-label="Acknowledge"
                        checked={
                          detailOrder.status === "ORDER"
                            ? checkedWareHouse
                            : true
                        }
                        disabled={detailOrder.status === "ORDER" ? false : true}
                        // disabled={orderDetail.status !== "ORDER" ? true : false}
                        onChange={(event) => {
                          setCheckedWareHouse(event.target.checked);
                          if (event.target.checked) {
                            setActiveStep(1);
                          } else {
                            setActiveStep(0);
                            setChecked(false);
                          }
                        }}
                        control={<Checkbox />}
                        label="Nhập kho"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="mx-2">
                  <Accordion
                    expanded={
                      detailOrder.status === "STOCKED"
                        ? checked
                        : checkedWareHouse
                        ? checked
                        : false
                    }
                  >
                    <AccordionSummary
                      //   expandIcon={<ExpandMoreIcon />}
                      aria-label="Expand"
                      aria-controls="additional-actions1-content"
                      id="additional-actions1-header"
                    >
                      <FormControlLabel
                        aria-label="Acknowledge"
                        checked={
                          detailOrder.status === "STOCKED"
                            ? checked
                            : checkedWareHouse === false
                            ? false
                            : checked
                        }
                        disabled={
                          detailOrder.status === "STOCKED"
                            ? false
                            : !checkedWareHouse
                        }
                        onChange={(event) => {
                          setChecked(event.target.checked);
                          if (event.target.checked) {
                            setActiveStep(2);
                          } else {
                            setActiveStep(1);
                          }
                        }}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Checkbox />}
                        label="Thanh toán"
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="textSecondary">
                        <Typography variant="body1" gutterBottom>
                          <Label>Chọn hình thức thanh toán: </Label>
                          <FormControl
                            variant="outlined"
                            className={classes.payment}
                          >
                            <InputLabel htmlFor="outlined-age-native-simple">
                              Hình thức thanh toán
                            </InputLabel>
                            <Select
                              native
                              value={paymentWay}
                              onChange={(event) => {
                                // console.log(event.target.value);
                                setPaymentWay(event.target.value);
                              }}
                              label="Hình thức thanh toán"
                              inputProps={{
                                name: "age",
                                id: "outlined-age-native-simple",
                              }}
                              size="small"
                            >
                              {listPaymentWay.map((item, index) => {
                                return (
                                  <option value={item.value} key={index}>
                                    {item.name}
                                  </option>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Typography>

                        {/* <Typography variant="body1" gutterBottom>
                                            <Label >Số tiền thanh toán: <b>1,000,000 đ</b> </Label>
                                        </Typography> */}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            )}

            {checkedWareHouse || checked ? (
              <div className="float-right my-3 mx-1">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.buttonSubmit}
                  startIcon={<SaveIcon />}
                  onClick={handleSubmitStatus}
                >
                  Xác nhận
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-3">
            <Card className={classes.cardTT}>
              <CardContent>
                <Typography variant="h6" component="h6" align="left">
                  Thông tin đơn nhập hàng
                </Typography>
                <br />
                <div>
                  <div className="row mx-1">
                    <b>Mã đơn hàng:</b>&nbsp;
                    {detailOrder !== undefined && detailOrder.orderCode}
                  </div>
                  <br />
                  <div className="row mx-1">
                    <b>Ngày hẹn giao:</b>&nbsp;
                    {
                      detailOrder !== undefined &&
                        formatDate(detailOrder.expDeliveryDate)
                    }
                  </div>
                  <br />
                  <span className="row mx-1">
                    <b>Ghi chú:</b>&nbsp;
                    {(detailOrder.note !== '') ? detailOrder.note : "không có ghi chú"}
                  </span>
                  <br />
                  <div className="row mx-1">
                    <b>Ngày tạo đơn:</b>&nbsp;
                    {detailOrder !== undefined &&
                      formatDateTime(detailOrder.createdStamp)}
                  </div>
                  <br />
                  <div className="row mx-1">
                    <b>Ngày sửa đơn:</b>&nbsp;
                    {detailOrder !== undefined &&
                      formatDateTime(detailOrder.lastUpdatedStamp)}
                  </div>
                  <br />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {mesUpdateStocked && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openMes}
            onClose={handleCloseMes}
            key={vertical + horizontal}
          >
            <Alert onClose={handleCloseMes} severity="success" variant="filled">
              Nhập kho thành công!
            </Alert>
          </Snackbar>
        )}
        {mesUpdatePaid && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openMes}
            onClose={handleCloseMes}
            key={vertical + horizontal}
          >
            <Alert onClose={handleCloseMes} severity="success" variant="filled">
              Thanh toán thành công!
            </Alert>
          </Snackbar>
        )}
        {mesUpdateStatus && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openMes}
            onClose={handleCloseMes}
            key={vertical + horizontal}
          >
            <Alert onClose={handleCloseMes} severity="success" variant="filled">
              Cập nhật trạng thái thành công!
            </Alert>
          </Snackbar>
        )}
        {mesDelete && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openMes}
            onClose={handleCloseMes}
            key={vertical + horizontal}
          >
            <Alert onClose={handleCloseMes} severity="success" variant="filled">
              Xóa đơn hàng thành công thành công!
            </Alert>
          </Snackbar>
        )}
      </MuiPickersUtilsProvider>
    </div>
  ) : (
    ""
  );
}

export default OrderDetail;
