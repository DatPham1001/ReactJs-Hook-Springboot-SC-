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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import ChipInput from "material-ui-chip-input";
import { Controller, useForm } from "react-hook-form";
import Chip from "@material-ui/core/Chip";
import { object, string, array } from "yup";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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
  const [data, setData] = useState({});
  //data of new supplier
  const [supplierName, setSupplierName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [categories, setCategories] = useState([]);
  const [address, setAddress] = useState();

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

  const schema = object({
    frequency: string().required("Trường này được yêu cầu"),
    days: array().min(1, "Trường này được yêu cầu"),
  });
  const { control, errors } = useForm({
    defaultValues: {
      days: [],
    },
    validationSchema: schema,
  });

  useEffect(() => {
    axiosGet(dispatch, token, `/supplier/${supplierId}`).then((resp) => {
      console.log(resp.data);
      setData(resp.data);
      let { data } = resp;
      setSupplierName(data.supplierName);
      setPhoneNumber(data.phoneNumber);
      setEmail(data.email);
      setAddress(data.address);
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

  const handleSupplierName = (event) => {
    setSupplierName(event.target.value);
  };

  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleAddress = (event) => {
    setAddress(event.target.value);
  };
  const handleCategory = (event) => {
    setCategories(event.target.value);
    console.log(event.target);
  };

  const onAdd = (chip) => {
    setCategories([...categories, chip]);
  };
  const onDelete = (chip, index) => {
    setCategories(
      categories.slice(0, index).concat(categories.slice(index + 1))
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = {
      supplierName,
      phoneNumber,
      email,
      address,
      categoryIds: categories,
    };
    console.log(data);
    axiosPut(dispatch, token, `/supplier/${supplierId}`, data).then((resp) => {
      history.push(`/supplier/detail/${supplierId}`);
    });
  };
  // console.log(defaultValue)
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="left">
            Edit Supplier
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                id="supplierName"
                label="Tên nhà cung cấp"
                value={supplierName}
                onChange={handleSupplierName}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="firstName"
                label="Số điện thoại"
                value={phoneNumber}
                onChange={handlePhoneNumber}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="middleName"
                label="Email"
                value={email}
                onChange={handleEmail}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="lastName"
                label="Địa chỉ"
                value={address}
                onChange={handleAddress}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl className={classes.formControl}>
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
              </FormControl>
            </div>
          </form>
        </CardContent>
        <CardActions>
          <Button
            disabled={isRequesting}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {isRequesting ? <CircularProgress /> : "Save"}
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  );
}

export default SupplierEdit;
