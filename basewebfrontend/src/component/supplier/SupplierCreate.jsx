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
} from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useForm } from "react-hook-form";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

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

  // Form.
  const { register, handleSubmit, watch, errors, setError } = useForm({
    defaultValues: {
      supplierName: "",
      supplierCode: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
  });

  const getCategories = () => {
    axiosGet(dispatch, token, "/category?page=0&limit=10").then((resp) => {
      console.log(resp.data.content);

      let dataOption = resp.data.content.map((category) => {
        let value = category.categoryId;
        let label = category.categoryName;
        return { value: value, label: label };
        // setOptions([...options, {value: value, label: label}]);
      });
      setOptions(dataOption);
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  // let categoriesId=[];
  // categories.map(categoryName => {
  //     listCategory.map(category=>{
  //         if(category.categoryName === categoryName){
  //             categoriesId.push(category.categoryId);
  //         }
  //     })
  // })

  const onSubmit = (data) => {
    console.log(data);

    axiosPost(dispatch, token, `/supplier`, {
      supplierName: data.supplierName,
      supplierCode: data.supplierCode,
      phoneNumber: data.phoneNumber,
      email: data.phoneNumber,
      address: data.address,
      categoryIds: categories,
    })
      .then((res) => {
        console.log(res);

        history.push("/supplier/list");
      })
      .catch((e) => {
        let body = e.response.data;
        console.log(body)
        if (body.status === 400) {
          setError(body.errors[0].location, {
            type: body.errors[0].type,
            message: body.errors[0].message,
          });
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
                  value={watch("supplierName")}
                  error={errors.supplierName ? true : null}
                  helperText={errors.supplierName?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={register({
                    required: "Trường này được yêu cầu",
                  })}
                />
                <TextField
                  id="supplierCode"
                  name="supplierCode"
                  label="Mã nhà cung cấp*"
                  value={watch("supplierCode")}
                  error={errors.supplierCode ? true : null}
                  helperText={errors.supplierCode?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={register({
                    required: "Trường này được yêu cầu",
                  })}
                />
                <TextField
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Số điện thoại*"
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
                <FormControl className={classes.formControl}>
                  {/* <InputLabel id="role-label">Danh mục</InputLabel> */}
                  <br />
                  <br />
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
                </FormControl>
              </div>
              <br />
              <br />
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6" style={{ marginBottom: "1000" }}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    type="reset"
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
      </MuiPickersUtilsProvider>
    </div>
  );
}
