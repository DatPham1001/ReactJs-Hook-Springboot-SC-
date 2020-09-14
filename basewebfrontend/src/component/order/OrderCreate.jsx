import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
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
  Snackbar,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
import { axiosGet, axiosPost } from "Api";
import OrderCreateSupplier from "./OrderCreateSupplier";
import OrderCreateProducts from "./OrderCreateProducts";
import StepConnector from "@material-ui/core/StepConnector";
import clsx from "clsx";
import { Label } from "reactstrap";

import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import SaveIcon from "@material-ui/icons/Save";

import { formatDate } from "utils/NumberFormat";
import Alert from "@material-ui/lab/Alert";
import { toFormattedDate } from "utils/DateUtils";

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

function OrderCreate(props) {
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

  const [orderCode, setOrderCode] = useState("");
  const [expDeliveryDate, setExpDeliveryDate] = useState(
    toFormattedDate(new Date(new Date().setDate(new Date().getDate() + 1)))
  );
  const [note, setNote] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [discount, setDiscount] = useState("0");
  

  const [paymentWay, setPaymentWay] = useState("1");
  const listPaymentWay = [
    { value: "1", name: "Tiền mặt" },
    { value: "2", name: "Chuyển khoản" },
    { value: "3", name: "COD" },
  ];

  //notifi
  const [state, setState] = React.useState({
    openMes: false,
    vertical: "bottom",
    horizontal: "right",
  });

  //notifi
  const { vertical, horizontal, openMes } = state;
  const [mesSaveSuccess, setMesSaveSuccess] = useState(false);
  const [mesExitsCode, setMesExitsCode] = useState(false);
  const [warningSystem, setWarningSystem] = useState(false);
  const [mesWarningSupplier, setMesWarningSupplier] = useState(false);
  const [mesWarningProduct, setMesWarningProduct] = useState(false);
  //   const [mesErrSupplier]

  const handleCloseMes = () => {
    setState({ ...state, openMes: false });
    setMesSaveSuccess(false);
    setMesExitsCode(false);
    setWarningSystem(false);
    setMesWarningSupplier(false);
    setMesWarningProduct(false);
  };

  //warning
  const [warningDate, setWarningDate] = useState("");
  const [warningOrderCode, setWarningOrderCode] = useState("");
  const [warningSupplier, setWarningSupplier] = useState("");
  const [warningProducts, setWarningProducts] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCancel = () => {
    //alert('Hủy');
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const supplier = (id) => {
    // console.log(id);
    setSupplierId(id);
  };

  const handleListProduct = (products) => {
    // console.log("products : ",products);

    setListProduct(products);
  };

  const handleDiscount = (disc) => {
    setDiscount(disc);
  };

  const handleSubmitAll = () => {
    //expDeliveryDate
    let date = "";
    if (expDeliveryDate !== "" && expDeliveryDate !== undefined) {
      date = formatDate(expDeliveryDate);
      console.log("ngay hen : ", expDeliveryDate);
    }

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

    //list product
    let tmpProducts = [];
    if (listProduct.length > 0) {
      tmpProducts = listProduct.map((item) => {
        // console.log(typeof item.price)
        // console.log(typeof parseInt(item.quantity))
        let tmp = Object.assign(
          {},
          { productId: item.productId },
          { price: parseInt(item.price) },
          { orderQuantity: parseInt(item.quantity) }
        );
        return tmp;
      });
    }

    //discount
    let tmpDiscount = parseInt(discount);

    let data = {
      code: orderCode.trim(),
      expDeliveryDate: date,
      note: note.trim(),
      supplierId: supplierId,
      status: status,
      paymentMethod: paymentMethod,
      orderItems: tmpProducts,
      discount: tmpDiscount,
    };
    console.log("submitAll: ", data);

    //call API
    axiosPost(dispatch, token, "/order", data)
      .then((resp) => {
        setMesSaveSuccess(true);
        setState({ openMes: true, vertical: "bottom", horizontal: "right" });
        setTimeout(() => {
          history.push("/orders/list");
        }, 1000);
        return resp.data;
      })
      .catch((err) => {
        let body = err.response.data;
        console.log(body);
        if (body.status === 400) {
          let { errors } = body;
          let location = [];
          location = errors.map((err) => err.location);
          if (location.indexOf("expDeliveryDate") !== -1) {
            setWarningDate("Ngày hẹn phải là ngày trong tương lai.");
          } else {
            setWarningDate("");
          }

          if (location.indexOf("code") !== -1) {
            // setWarningOrderCode("Bạn chưa điền mã cho đơn hàng.");
            setMesExitsCode(true);
            setState({
              openMes: true,
              vertical: "bottom",
              horizontal: "right",
            });
          } else {
            setWarningOrderCode("");
          }

          if (location.indexOf("supplierId") !== -1) {
            // setWarningSupplier("Bạn chưa chọn nhà cung cấp cho đơn hàng.");

            setState({
              openMes: true,
              vertical: "bottom",
              horizontal: "right",
            });
            setMesWarningSupplier(true);
          } else {
            setWarningSupplier("");
          }

          if (location.indexOf("orderItems") !== -1) {
            // setWarningProducts("Bạn chưa chọn sản phẩm cho đơn hàng.");

            setState({
              openMes: true,
              vertical: "bottom",
              horizontal: "right",
            });
            setMesWarningProduct(true);
          } else {
            setWarningProducts("");
          }
        } else {
          setState({ ...state, openMes: true });
          setWarningSystem(true);
        }

        return err;
      });
  };

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="row">
          <div className="col-5 " style={{ paddingTop: 22 }}>
            <Typography variant="h4" component="h2" className="mx-2">
              Tạo đơn nhập hàng
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

        <div className="row">
          <div className="col-9">
            <OrderCreateSupplier
              supplier={supplier}
              control={control}
              warningSupplier={mesWarningSupplier}
            />
            <OrderCreateProducts
              handleListProduct={handleListProduct}
              handleDiscount={handleDiscount}
            />

            <div className="mx-2 my-2">
              <Card>
                <CardContent>
                  <FormControlLabel
                    aria-label="Acknowledge"
                    checked={checkedWareHouse}
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
              <Accordion expanded={checkedWareHouse ? checked : false}>
                <AccordionSummary
                  //   expandIcon={<ExpandMoreIcon />}
                  aria-label="Expand"
                  aria-controls="additional-actions1-content"
                  id="additional-actions1-header"
                >
                  <FormControlLabel
                    aria-label="Acknowledge"
                    checked={checkedWareHouse === false ? false : checked}
                    disabled={!checkedWareHouse}
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
          <div className="col-3">
            <Card className={classes.cardTT}>
              <CardContent>
                <Typography variant="h6" component="h6" align="left">
                  Thông tin đơn nhập hàng
                </Typography>
                <br />
                <div>
                  <TextField
                    label="Mã đơn hàng*"
                    id="outlined-size-small"
                    className={classes.textField}
                    fullWidth
                    value={orderCode}
                    onChange={(event) => setOrderCode(event.target.value)}
                    // error={warningOrderCode === "" ? false : true}
                    helperText="VD: HD001"
                    // defaultValue="OD001"
                    placeholder="HD001"
                    variant="outlined"
                    size="small"
                    inputProps={{
                        maxLength: 30,
                    }}
                  />{" "}
                  <TextField
                    id="date"
                    label="Ngày hẹn giao"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={expDeliveryDate}
                    onChange={(event) => setExpDeliveryDate(event.target.value)}
                    error={warningDate === "" ? false : true}
                    helperText={warningDate}
                    type="date"
                    format="dd/MM/yyyy"
                    // defaultValue={toFormattedDate(new Date())}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: toFormattedDate(new Date()), //"2020-09-07"
                    }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Ghi chú"
                    className={classes.textField}
                    fullWidth
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    multiline
                    rows={8}
                    placeholder="Ghi chú"
                    defaultValue=""
                    variant="outlined"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="float-right my-3 mx-4">
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.buttonSubmit}
            startIcon={<SaveIcon />}
            onClick={handleSubmitAll}
          >
            Tạo đơn
          </Button>
        </div>
        <div>
          {mesSaveSuccess && (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openMes}
              onClose={handleCloseMes}
              key={vertical + horizontal}
            >
              <Alert onClose={handleCloseMes} severity="success" variant="filled">
                Tạo đơn nhập hàng thành công!
              </Alert>
            </Snackbar>
          )}
          {mesExitsCode && (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openMes}
              onClose={handleCloseMes}
              key={vertical + horizontal}
            >
              <Alert onClose={handleCloseMes} severity="error" variant="filled">
                Mã đơn hàng đã tồn tại!
              </Alert>
            </Snackbar>
          )}
          {warningSystem && (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openMes}
              onClose={handleCloseMes}
              key={vertical + horizontal}
            >
              <Alert onClose={handleCloseMes} severity="error" variant="filled">
                Lỗi hệ thống !
              </Alert>
            </Snackbar>
          )}
          {mesWarningSupplier && (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openMes}
              onClose={handleCloseMes}
              key={vertical + horizontal}
            >
              <Alert onClose={handleCloseMes} severity="error" variant="filled">
                Bạn chưa chọn nhà cung cấp !
              </Alert>
            </Snackbar>
          )}
          {mesWarningProduct && !mesWarningSupplier && (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openMes}
              onClose={handleCloseMes}
              key={vertical + horizontal}
            >
              <Alert onClose={handleCloseMes} severity="error" variant="filled">
                Bạn chưa chọn sản phẩm !
              </Alert>
            </Snackbar>
          )}
        </div>
      </MuiPickersUtilsProvider>
      <div></div>
    </div>
  );
}

export default OrderCreate;
