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
import SaveIcon from '@material-ui/icons/Save';

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
    minHeight: 450,
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

function OrderCreateSupplier(props) {
  const classes = useStyles();
  const { control, handleSubmit, watch } = useForm();
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

  //create supplier
  const [supplierName, setSupplierName] = useState("");
  const [supplierCode, setSupplierCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [saveSupplier, setSaveSupplier] = useState(false);
  const [errSaveSupplier, setErrSaveSupplier] = useState(false);

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
  };

  useEffect(() => {
    axiosGet(dispatch, token, `/supplier?page=${page}&limit=${limit}`).then(
      (resp) => {
        let content = resp.data.content;
        let data = content.map((item) => {
          let value = item.supplierId;
          let label = item.supplierName;
          return { value, label };
        });
        // console.log(data);
        let elements = resp.data.numberOfElements;
        if (elements < limit) {
          let number = limit - elements;
          for (let i = 0; i < number; i++) {
            data.push({ value: "", label: ".", isDisabled: true });
          }
        }

        setListSupplier(data);
        console.log(resp.data.numberOfElements);

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
      }
    );
  }, []);

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
        console.log(resp.data);
        let content = resp.data.content;
        let data = content.map((item) => {
          let value = item.supplierId;
          let label = item.supplierName;
          return { value, label };
        });
        // console.log(data);
        let elements = resp.data.numberOfElements;
        if (elements < limit) {
          let number = limit - elements;
          for (let i = 0; i < number; i++) {
            data.push({ value: "", label: ".", isDisabled: true });
          }
        }

        setListSupplier(data);
        console.log(resp.data.numberOfElements);

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

  const onSubmit = (data) => {
    console.log(data);
  };

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
        <div className="">{props.children}</div>

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

  const handleSubmitSupplier = (newState) => {
    let data = {
      supplierName,
      supplierCode,
      phoneNumber,
      email,
      address,
      categoryIds: [],
    };
    console.log(data);
    axiosPost(dispatch, token, `/supplier`, data)
      .then((resp) => {
        console.log(resp);
        setSaveSupplier(true);
        setState({ openMes: true, ...newState });
      })
      .catch((err) => {
        setState({ openMes: true, ...newState });
        setErrSaveSupplier(true);
      });
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row my-3">
            <div className="col-6 ">
              <Typography variant="h6" component="h6" align="left">
                Chọn nhà cung cấp
              </Typography>
            </div>
            <div className="col-6 float-left  my-2">
              <Button
                color={"primary"}
                className={classes.label}
                fullwidth
                variant="outlined"
                onClick={handleClickOpen}
              >
                <PersonAddIcon /> Thêm nhà cung cấp mới
              </Button>

              <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                  Tạo nhanh nhà cung cấp
                </DialogTitle>

                <DialogContent dividers>
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Tên nhà cung cấp"
                    value={supplierName}
                    onChange={(event) => setSupplierName(event.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Mã nhà cung cấp*"
                    value={supplierCode}
                    placeholder="NCC001"
                    helperText="VD: NCC001"
                    // error={true}
                    onChange={(event) => setSupplierCode(event.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    variant="outlined"
                    size="small"
                    helperText=" "
                  />
                  <TextField
                    className={classes.textField}
                    id="outlined-name"
                    label="Địa chỉ"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </DialogContent>

                <DialogActions>
                  <Button
                    autoFocus
                    variant="contained"
                    onClick={() =>
                      handleSubmitSupplier({
                        vertical: "bottom",
                        horizontal: "right",
                      })
                    }
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Lưu lại
                  </Button>
                </DialogActions>
              </Dialog>

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
              </div>
            </div>
          </div>

          <Controller
            name="iceCreamType"
            as={<Select
                
                placeholder="Tìm kiếm"
                    >
            </Select>}
            options={listSupplier}
            components={{ MenuList }}
            control={control}
            defaultValue=""
            onInputChange={(event) => {
              console.log(event);
              setSearch(event);
              return event;
            }}
            onChange={(value) => {
                console.log(value)
              console.log(value[0]);
              let id = value[0].value;
              props.supplier(id);
              axiosGet(dispatch, token, `/supplier/${id}`).then((resp) => {
                console.log(resp.data);
                setSupplier(resp.data);
              });
              return value;
            }}
          />
          <br />
          {!supplier && "Chưa chọn nhà cung cấp nào"}
          {supplier && <OrderCreateSupplierDetail data={supplier} />}
        </form>
      </CardContent>
    </Card>
  );
}

export default OrderCreateSupplier;
