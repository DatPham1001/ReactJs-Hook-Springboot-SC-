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
import OrderCreateSupplierDetail from "./OrderCreateSupplierDetail";
import { useHistory } from "react-router";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";
import SaveIcon from "@material-ui/icons/Save";
import { DevTool } from "react-hook-form-devtools";

OrderCreateSupplier.propTypes = {};
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
    minHeight: 480,
    maxHeight: 1000,
  },
  label: {
    textTransform: "capitalize",
    // marginLeft: -305,
    paddingRight: -300,
  },
  textField: {
    margin: theme.spacing(2),
    minWidth: 250,
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

//alert
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
    //   backgroundColor: color,
        backgroundImage: "url("+'https://s3.amazonaws.com/iconbros/icons/icon_pngs/000/000/220/original/search.png?1510300432'+")",
        backgroundSize:"cover",
        borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 15,
      width: 15,
    },
});

function OrderCreateSupplier(props) {
  const classes = useStyles();
  const { handleSubmit, watch, register, errors, setError, control } = useForm({
    defaultValues: {
      supplierName: "",
      supplierCode: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
  });
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [next, setNext] = useState(false);
  const [pre, setPre] = useState(false);

  const [listSupplier, setListSupplier] = useState([]);
  const [supplier, setSupplier] = useState();
  const [search, setSearch] = useState("");

  const [searchSupplier, setSearchSupplier] = useState({value:"1", label: "Tìm kiếm"});


  const [saveSupplier, setSaveSupplier] = useState(false);
  const [errSaveSupplier, setErrSaveSupplier] = useState(false);
  const [errorSystem, setErrorSystem] = useState(false);

  const [showWarning, setShowWarning] = useState(true);

  const [timeoutSearch, setTimeoutSearch] = useState();

  console.log("even:",props.warningSupplier);
  //form create
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //message success create supplier
  const [state, setState] = React.useState({
    openMes: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, openMes } = state;

  const handleClick = (newState) => () => {
    setState({ openMes: true, ...newState });
  };

  const handleCloseMes = () => {
    setState({ ...state, openMes: false });
    setSaveSupplier(false);
    setErrSaveSupplier(false);
    setErrorSystem(false);
  };

  useEffect(() => {
    if (search !== "") {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    const getSearch = async () => {
      await sleep(500);
      axiosGet(
        dispatch,
        token,
        `/supplier?page=${page}&limit=${limit}&search=${search}`
      ).then((resp) => {
        console.log("data",resp.data);
        let content = resp.data.content;
        // setPage(resp.data.totalPages);
        let data = content.map((item) => {
          let value = item.supplierId;
          let label = `${item.supplierCode} - ${item.supplierName}`;
          return { value, label };
        });
        // console.log(data);
        let elements = resp.data.numberOfElements;
        if (elements < limit) {
          let number = limit - elements;
          for (let i = 0; i < number; i++) {
            data.push({ value: i, label: ".", isDisabled: true });
          }
        }

        setListSupplier(data);
        console.log("list",data);

        if (page >= resp.data.totalPages) {
          setNext(true);
        } else {
          setNext(false);
        }
        if (page <= 1) {
          setPre(true);
        } else {
          setPre(false);
        }
      });
    };
    getSearch();
  }, [page, search, saveSupplier]);

  const handlePre = () => {
    setPage(page - 1);
  };
  const handleNext = () => {
    setPage(page + 1);
  };

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        <div className="">
          <Button
            color={"primary"}
            className={classes.label}
            fullwidth
            variant="outlined"
            onClick={handleClickOpen}
            style={{ minWidth: '100%' }}
          >
            <PersonAddIcon /> Thêm nhà cung cấp mới
          </Button>
          {props.children}
        </div>

        <div className="float-right my-1 mx-1">
          <Button
            color={"primary"}
            variant="outlined"
            onClick={handlePre}
            disabled={pre}
          >
            <ChevronLeftIcon />
          </Button>{" "}
          <Button
            color={"primary"}
            variant="outlined"
            onClick={handleNext}
            disabled={next}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </components.MenuList>
    );
  };

  const handleClear = () => {
      props.supplier('');
      setSupplier();
  }

  const onSubmit = (data) => {
    console.log("submitAll: ", data);
    let body = {
        supplierName: data.supplierName,
        supplierCode: data.supplierCode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
      };

    axiosPost(dispatch, token, `/supplier`, body)
        .then((resp) => {
            console.log(resp);
            setSaveSupplier(true);
            setState({ openMes: true, 
                    vertical: "bottom",
                    horizontal: "right",
                });
            setOpen(false);
            axiosGet(dispatch, token, `/supplier/${resp.data.id}`).then((res) => {
                setSupplier( res.data )
            });
            
        })
        .catch((err) => {
            let body = err.response.data;
            if(body.status === 400){
                setState({ openMes: true, 
                    vertical: "bottom",
                    horizontal: "right",
                });
                setErrSaveSupplier(true);
            } else {
                setState({ openMes: true, 
                    vertical: "bottom",
                    horizontal: "right",
                });
                setErrorSystem(true);
            }
            
        });
  };

  return (
    <Card className={classes.formControl}>
      {/* <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <GroupAddIcon />
          </Avatar>
        }
        title="Nhà cung cấp"
      /> */}

      <Typography variant="h5" component="h6" align="left" style={{display:'flex'}}>
            <Avatar aria-label="recipe" className={classes.avatar} style={{margin: 10}}>
                <GroupAddIcon />
            </Avatar>
            <div style={{margin: 10, marginLeft:0, paddingTop:4}}>Nhà cung cấp</div>
            
        </Typography> 
      <CardContent>

        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <div className="row my-3">
          <div className="col-6 ">
            <Typography variant="h6" component="h6" align="left">
              Chọn nhà cung cấp
            </Typography>
          </div>
          <div className="col-6 float-left  my-2">
            
              {/* <Button
                color={"primary"}
                className={classes.label}
                fullwidth
                variant="outlined"
                onClick={handleClickOpen}
              >
                <PersonAddIcon /> Thêm nhà cung cấp mới
              </Button> */}

              <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                  Tạo nhanh nhà cung cấp
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                
                  <TextField
                    className={classes.textField}
                    id="supplierName"
                    label="Tên nhà cung cấp"
                    variant="outlined"
                    size="small"

                    name="supplierName"
                    value={watch("supplierName")}
                    error={errors.supplierName ? true : null}
                    helperText={errors.supplierName?.message}
                    inputRef={register({
                      required: "Bạn chưa điền tên",
                      maxLength: {
                        value: 255,
                        message: "Tên vượt quá độ dài cho phép",
                      },
                    })}
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Mã nhà cung cấp*"
                    placeholder="NCC001"
                    variant="outlined"
                    size="small"
                    name="supplierCode"
                    value={watch("supplierCode")}
                    error={errors.supplierCode ? true : false}
                    helperText={errors.supplierCode?.message}
                    inputRef={register({
                      maxLength: {
                        value: 100,
                        message: "Độ dài vượt quá kích thước cho phép",
                      },
                    })}
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Số điện thoại"
                    variant="outlined"
                    size="small"
                    name="phoneNumber"
                    value={watch("phoneNumber")}
                    error={errors.phoneNumber ? true : false}
                    helperText={errors.phoneNumber?.message}
                    inputRef={register({
                      required: "Bạn chưa điền số điện thoại",
                      pattern: {
                        value: /((09|03|07|08|05)+([0-9]{8,9})\b)/g,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Email"
                    variant="outlined"
                    size="small"
                    name="email"
                    value={watch("email")}
                    error={errors.email ? true : false}
                    helperText={errors.email?.message}
                    inputRef={register({
                      required: "Bạn chưa điền email",
                      pattern: {
                        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Địa chỉ"
                    variant="outlined"
                    size="small"

                    name="address"
                    value={watch("address")}
                    error={errors.address ? true : false}
                    helperText={errors.address?.message}
                    inputRef={register({
                      required: "Bạn chưa điền địa chỉ",
                      maxLength: {
                        value: 255,
                        message: "Độ dài vượt quá kích thước cho phép",
                      },
                    })}
                  />
                  {/* <Button
                    autoFocus
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Lưu lại
                  </Button> */}
                  
                </DialogContent>
                

                <DialogActions>
                  <Button
                    autoFocus
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Lưu lại
                  </Button>
                </DialogActions>
                </form>
                
              </Dialog>
            
            {/* <DevTool control={control}/> */}
            <div>
              {saveSupplier && (
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={openMes}
                  onClose={handleCloseMes}
                  key={vertical + horizontal}
                >
                  <Alert onClose={handleCloseMes} severity="success">
                    Thêm nhà cung cấp thành công!
                  </Alert>
                </Snackbar>
              )}
              {errSaveSupplier && (
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={openMes}
                  onClose={handleCloseMes}
                  key={vertical + horizontal}
                >
                  <Alert onClose={handleCloseMes} severity="error">
                    Mã nhà cung cấp đã tồn tại!
                  </Alert>
                </Snackbar>
              )}
              {errorSystem && (
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={openMes}
                  onClose={handleCloseMes}
                  key={vertical + horizontal}
                >
                  <Alert onClose={handleCloseMes} severity="error">
                    Lỗi hệ thống!
                  </Alert>
                </Snackbar>
              )}
            </div>
          </div>
        </div>

        <Controller
          name="iceCreamType"
          as={<Select 
            placeholder="Tìm kiếm"
            noOptionsMessage={() => 'Không tìm thấy nhà cung cấp cần tìm'}
            autoFocus={props.warningSupplier}
            // isClearable={true}
            styles={{
                singleValue: (styles) => ({ ...styles, ...dot()}),
                loadingMessage: base => ({
                    ...base,
                    backgroundColor: "#999999",
                    color: 'white',
                  }),
            }}
            
            ></Select>}
          options={listSupplier}
          components={{ MenuList }}
          control={props.control}
          defaultValue=""
          value={searchSupplier}

        //   noOptionsMessage="abc"
        // isClearable
        // defaultValue={{value: 1, label: "timkiem"}}
        valueName="abc"
        onInputChange={(event) => {
            // console.log(event);
            // setSearch(event);
            if(timeoutSearch !== undefined){
                clearTimeout(timeoutSearch);
            }
            let time = setTimeout(()=>{
                setSearch(event);
            }, 500);
            setTimeoutSearch(time);
            // return event;
        }}
        onChange={(value) => {
                // console.log("v",value)
            //   console.log("v0",value[0]);
            if(value[0] !== null){
                let id = value[0].value;
                props.supplier(id);
                axiosGet(dispatch, token, `/supplier/${id}`).then((resp) => {
                console.log(resp.data);
                setSupplier(resp.data);
                });
            }
            setShowWarning(false);
            
            return value;
        }}
        />
        {/* {showWarning && <div style={{ color: "red" }}>{props.warningSupplier} </div>} */}
        <br />
        {!supplier && <div>
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <img src="https://mekongsoft.com.vn/assets/images/tintuc/2136697d0b0344f33150e244fc65283a.jpg"
                            alt="ko"
                            style={{width: 315, height:148, opacity:0.5}}
                            className="rounded-circle"
                            />
                    </div>
                </div><br/>
                <div className="row text-center">
                    <div className="col-3"></div>
                    <div className="col-6">
                        Bạn chưa chọn nhà cung cấp nào
                    </div>
                </div>
                
                
            </div>}
        {supplier && <OrderCreateSupplierDetail data={supplier} handleClear={handleClear} />}
        {/* </form> */}
      </CardContent>
    </Card>
  );
}

export default OrderCreateSupplier;
