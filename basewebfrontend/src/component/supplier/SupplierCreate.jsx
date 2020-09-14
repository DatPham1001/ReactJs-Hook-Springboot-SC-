import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { axiosGet, axiosPost } from "../../Api";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Snackbar,
} from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useForm } from "react-hook-form";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import Alert from "@material-ui/lab/Alert";

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

const animatedComponents = makeAnimated();

export default function SupplierCreate() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);

    //notifi
  
    const [state, setState] = React.useState({
      openMes: false,
      vertical: "bottom",
      horizontal: "right",
    });
  
    const { vertical, horizontal, openMes } = state;
    const [mesSaveSuccess, setMesSaveSuccess] = useState(false);
    const [mesSystem, setMesSystem] = useState(false);
    const [mesExistCode, setMesExitsCode] = useState(false);

    const handleCloseMes = () => {
        setState({ ...state, openMes: false });
        setMesSaveSuccess(false);
        setMesSystem(false);
        setMesExitsCode(false);
      };

  // Form.
  const { register, handleSubmit, watch, errors, setError, reset  } = useForm({
    defaultValues: {
      supplierName: "",
      supplierCode: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
  });

//   const getCategories = () => {
//     axiosGet(dispatch, token, "/category?page=0&limit=10").then((resp) => {
//       console.log(resp.data.content);

//       let dataOption = resp.data.content.map((category) => {
//         let value = category.categoryId;
//         let label = category.categoryName;
//         return { value: value, label: label };
//         // setOptions([...options, {value: value, label: label}]);
//       });
//       setOptions(dataOption);
//     });
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);


  const onSubmit = (data) => {
    console.log(data);

    axiosPost(dispatch, token, `/supplier`, {
      supplierName: data.supplierName.trim(),
      supplierCode: data.supplierCode.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email.trim(),
      address: data.address.trim(),
    })
      .then((res) => {
        // console.log(res);

        setMesSaveSuccess(true);
        setState({ ...state, openMes: true });

        setTimeout(()=>{
            history.push("/supplier/list");
        }, 1000);
        
      })
      .catch((e) => {
        let body = e.response.data;
        console.log("body",body);
        if (body.status === 400) {
            let { errors } = body;
            let location = [];
            location = errors.map((err) => err.location);
            if(location.indexOf("supplierCode") !== -1){
                setState({...state, openMes: true});
                setMesExitsCode(true);
            }else {
                setState({...state, openMes: true});
                setMesSystem(true);
            }
        }else {
            setState({...state, openMes: true});
            setMesSystem(true);
        }
      });
  };

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" align="left">
              Tạo nhà cung cấp mới
            </Typography>
            <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
              <div>
                <TextField
                  id="supplierName"
                  name="supplierName"
                  label="Tên nhà cung cấp*"
                  variant="outlined"
                  size="small"
                  
                  value={watch("supplierName")}
                  error={errors.supplierName ? true : null}
                  helperText={errors.supplierName?.message}
                  inputRef={register({
                    required: "Trường này được yêu cầu",
                    maxLength: {
                        value: 255,
                        message: "Độ dài vượt quá kích thước cho phép"
                    },
                  })}

                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="supplierCode"
                  name="supplierCode"
                  label="Mã nhà cung cấp*"
                  variant="outlined"
                  size="small"
                  value={watch("supplierCode")}
                  error={errors.supplierCode ? true : null}
                  helperText={errors.supplierCode?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={register({
                    maxLength: {
                        value: 100,
                        message: "Mã nhà cung cấp vượt quá độ dài cho phép"
                    }
                  })}
                />
                <TextField
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Số điện thoại*"
                  variant="outlined"
                  size="small"
                  value={watch("phoneNumber")}
                  error={errors.phoneNumber ? true : null}
                  helperText={errors.phoneNumber?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={register({
                    required: "Trường này được yêu cầu",
                    pattern: {
                      value: /((09|03|07|08|05)+([0-9]{8,9})\b)/g,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                />
                <TextField
                  id="email"
                  name="email"
                  label="Email*"
                  variant="outlined"
                  size="small"
                  value={watch("email")}
                  error={errors.email ? true : null}
                  helperText={errors.email?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={register({
                    required: "Trường này được yêu cầu",
                    pattern: {
                      value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                <TextField
                  id="address"
                  name="address"
                  label="Địa chỉ*"
                  variant="outlined"
                  size="small"
                  value={watch("address")}
                  error={errors.address ? true : null}
                  helperText={errors.address?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={register({
                    required: "Trường này được yêu cầu",
                    maxLength: {
                      value: 255,
                      message: "Độ dài vượt quá kích thước cho phép",
                    },
                  })}
                />
                {/* <FormControl className={classes.formControl}>
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={options}
                    onChange={(value) => {
                      let id = [];
                      if (value !== null) {
                        id = value.map((item) => item.value);
                      }

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
              <br />
              <br />
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6" style={{ marginBottom: "1000" }}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={reset}
                    size="medium"
                    startIcon={<CancelIcon />}
                    style={{ marginRight: 20, marginLeft: 42 }}
                  >
                    Hủy
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    size="medium"
                    startIcon={<SaveIcon />}
                    style={{ marginRight: 30 }}
                  >
                    Lưu
                  </Button>{" "}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        {mesSaveSuccess && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openMes}
            onClose={handleCloseMes}
            key={vertical + horizontal}
          >
            <Alert onClose={handleCloseMes} severity="success" variant="filled">
              Tạo nhà cung cấp thành công !
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
        {mesSystem && (
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
      </MuiPickersUtilsProvider>
    </div>
  );
}
