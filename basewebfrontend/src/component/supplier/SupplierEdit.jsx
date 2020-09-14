import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { axiosGet, authGet, axiosPut } from "Api";
import { useDispatch, useSelector } from "react-redux";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Input,
  MenuItem,
  CardActions,
  Button,
  CircularProgress,
  Menu,
  Tooltip,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import ChipInput from "material-ui-chip-input";
import { Controller, useForm } from "react-hook-form";
import Chip from "@material-ui/core/Chip";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Alert from "@material-ui/lab/Alert";

const animatedComponents = makeAnimated();
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 700,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    width: 700,
    display: "flex",
  },
  select: {
    width: 300,
  },
  chipInput: { minWidth: 300 },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function SupplierEdit(props) {
  const supplierId = useParams().id;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const history = useHistory();

  //data of old supplier
  const [categories, setCategories] = useState([]);

  //form 
  const { register, handleSubmit, watch, errors, setError, reset, setValue   } = useForm({
    defaultValues: {
      supplierName: "",
      supplierCode: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
  });

  //notifi
  
  const [state, setState] = React.useState({
    openMes: false,
    vertical: "bottom",
    horizontal: "right",
  });

  const { vertical, horizontal, openMes } = state;
  const [mesUpdateSuccess, setMesUpdateSuccess] = useState(false);
  const [mesExistCode, setMesExitCode] = useState(false);
  const [mesErrSystem, setMesErrSystem] = useState(false);

  const [listCategory, setListCategory] = useState([]);
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(async () => {
    let data = await axiosGet(dispatch, token, `/supplier/${supplierId}`).then(
      (resp) => {
        console.log(resp.data);
        let dataOption = resp.data.categories.map((category) => {
          let value = category.categoryId;
          let label = category.categoryName;
          return { value: value, label: label };
        });
        console.log(dataOption);
        return dataOption;
      }
    );
    console.log(data);
    return data;
  });

  const [isRequesting, setIsRequesting] = useState(false);

  const handleCloseMes = () => {
    setState({ ...state, openMes: false });
    setMesUpdateSuccess(false);
    setMesExitCode(false);
    setMesErrSystem(false);
  };


  useEffect(() => {
    axiosGet(dispatch, token, `/supplier/${supplierId}`).then((resp) => {
      console.log(resp.data);
      let { data } = resp;
        setValue("supplierName",data.name);
        setValue("supplierCode", data.code);
        setValue("phoneNumber",data.phoneNumber);
        setValue("email",data.email);
        setValue("address",data.address);
    });
  }, []);

  useEffect(() => {
    axiosGet(dispatch, token, "/category?page=0&limit=10").then((resp) => {
      setListCategory(resp.data.content);
      let dataOption = resp.data.content.map((category) => {
        let value = category.categoryId;
        let label = category.categoryName;
        return { value: value, label: label };
      });
      setOptions(dataOption);
      console.log(resp.data.content);
    });
  }, []);

  const onSubmit = (data)=> {
      console.log("data",data);
      let body = {
        supplierName: data.supplierName.trim(),
        supplierCode: data.supplierCode.trim(),
        phoneNumber: data.phoneNumber.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
      };
      console.log(data);
      axiosPut(dispatch, token, `/supplier/${supplierId}`, body).then((resp) => {
          setState({...state, openMes: true});
          setMesUpdateSuccess(true);

          setTimeout(()=>{
                history.push(`/supplier/detail/${supplierId}`);
          }, 1000);
        
      }).catch(e=>{
        let body = e.response.data;
        console.log("body",body);
        if (body.status === 400) {
            let { errors } = body;
            let location = [];
            location = errors.map((err) => err.location);
            if(location.indexOf("supplierCode") !== -1){
                setState({...state, openMes: true});
                setMesExitCode(true);
            }else {
                setState({...state, openMes: true});
                setMesErrSystem(true);
            }
        }else {
            setState({...state, openMes: true});
            setMesErrSystem(true);
        }
      });
  }
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Tooltip title="Trở lại" arrow={true}>
        <IconButton
          onClick={() => history.goBack()}
          className="icons"
          aria-label="Xóa"
        >
          <ArrowBackIcon></ArrowBackIcon>
        </IconButton>
      </Tooltip>
        <br/><br/>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="left">
            Chỉnh sửa chi tiết nhà cung cấp
          </Typography>
          <form className={classes.root} autoComplete="off"  onSubmit={handleSubmit(onSubmit)}>
            <div>
              <TextField
                id="supplierName"
                label="Tên nhà cung cấp"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}

                name="supplierName"
                value={watch("supplierName")}
                error={errors.supplierName ? true : null}
                helperText={errors.supplierName?.message}
                inputRef={register({
                    required: "Bạn chưa điền tên."
                })}
              />
              <TextField
                id="supplierCode"
                label="Mã nhà cung cấp"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}

                name="supplierCode"
                value={watch("supplierCode")}
                error={errors.supplierCode ? true : null}
                helperText={errors.supplierCode?.message}
                inputRef={register({
                    required: "Bạn chưa điền mã code."
                })}
              />
              <TextField
                id="firstName"
                label="Số điện thoại"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}

                name="phoneNumber"
                value={watch("phoneNumber")}
                error={errors.phoneNumber ? true : null}
                helperText={errors.phoneNumber?.message}
                inputRef={register({
                    required: "Bạn chưa điền số điện thoại.",
                    pattern: {
                        value: /((09|03|07|08|05)+([0-9]{8,9})\b)/g,
                        message: "Số điện thoại không hợp lệ",
                      },
                })}
              />
              <TextField
                id="middleName"
                label="Email"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}

                name="email"
                value={watch("email")}
                error={errors.email ? true : null}
                helperText={errors.email?.message}
                inputRef={register({
                    required: "Bạn chưa điền email.",
                    pattern: {
                        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Email không hợp lệ",
                      },
                })}
              />
              <TextField
                id="lastName"
                label="Địa chỉ"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}

                name="address"
                value={watch("address")}
                error={errors.address ? true : null}
                helperText={errors.address?.message}
                inputRef={register({
                    required: "Bạn chưa điền địa chỉ."
                })}
              />
              {/* <FormControl className={classes.formControl}>
                <InputLabel id="role-label">Danh mục</InputLabel>

                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={JSON.parse(localStorage.getItem("categories"))}
                  isMulti
                  options={options}
                  onChange={(value) => {
                    console.log(defaultValue);
                    let id = [];
                    if (value !== null) {
                      id = value.map((item) => item.value);
                    }
                    console.log(value);
                    setCategories(id);
                  }}
                  placeholder="Chọn các danh mục"
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      backgroundColor: "#eeffff",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      backgroundColor: "#84e9ec",
                      color: "#12878b",
                    }),
                  }}
                />
              </FormControl> */}
            </div>
            <div className="row">
                <div className="col-9"></div>
                <div className="col-3">
                    <Button
                        disabled={isRequesting}
                        variant="contained"
                        color="primary"
                        // onClick={handleSubmit}
                        style={{minWidth: 200}}
                        startIcon={<SaveIcon />}
                        type="submit"
                    >
                        {isRequesting ? <CircularProgress /> : "Lưu"}
                    </Button>
                </div>
            </div>
          </form>
          
        </CardContent>
        <div>
        {mesUpdateSuccess && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openMes}
            onClose={handleCloseMes}
            key={vertical + horizontal}
          >
            <Alert onClose={handleCloseMes} severity="success" variant="filled">
              Cập nhật nhà cung cấp thành công !
            </Alert>
          </Snackbar>
        )}
        {mesExistCode && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openMes}
            onClose={handleCloseMes}
            key={vertical + horizontal}
          >
            <Alert onClose={handleCloseMes} severity="error" variant="filled">
              Mã nhà cung cấp đã tồn tại !
            </Alert>
          </Snackbar>
        )}
        {mesErrSystem && (
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
        </div>
      </Card>
    </MuiPickersUtilsProvider>
  );
}

export default SupplierEdit;
