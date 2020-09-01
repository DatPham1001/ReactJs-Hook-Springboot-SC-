import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { axiosGet, axiosPost } from '../../Api'
import { useForm, Controller } from "react-hook-form";
import {
  Card, CardContent, Typography,
  TextField, FormControl, InputLabel,
  Select, Input, MenuItem, CardActions,
  Button, CircularProgress, Menu, FormHelperText
} from '@material-ui/core';
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import { currencyFormat } from "utils/NumberFormat";
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { predefinedOptions } from "@unicef/material-ui-currency-textfield/dist/CurrencyTextField";

import NumberFormat from 'react-number-format';
import Axios from 'axios';
const uploadApi = Axios.create({})


const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: 10,
    marginBottom: 20,
    minWidth: '70%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: 20,
  },
}));
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

function ProductCreate(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector(state => state.auth.token);
  //data from sever
  const [listCategory, setListCategory] = useState([]);
  const [categoryName, setCategoryName] = useState();
  const [categoryId, setcategoryId] = useState();
  const [response, setResponse] = useState();
  const [uploadFile, setUploadFile] = useState();
  const classes = useStyles();
  const [linkImgUpload, setlinkImgUpload] = useState();
  //Form
  const { register, handleSubmit, watch, control, errors, setError, setValue } = useForm({
    defaultValues: {
      productName: "",
      productCode: "",
      price: "",
      warehouseQuantity: "",
      linkImg: "",
      description: "",
      categoryId: ""
    },
  });
  const [linkImg, setlinkImg] = useState();
  const [isSubbmit, setisSubbmit] = useState(false);
  const { inputRef, onChange, ...other } = props;
  const onSubmit = (data) => {
    console.log(data);
    let warehouseQuantity = data.warehouseQuantity.split(",").join("");
    let price = data.price.split(",").join("");
    console.log(warehouseQuantity, price);
    axiosPost(dispatch, token, '/product', {
      productName: data.productName,
      productCode: data.productCode,
      price: price,
      warehouseQuantity: warehouseQuantity,
      linkImg: linkImg,
      description: data.description,
      categoryId: data.categoryId
    }
    )
      .then(res => {
        history.push('/products/list');
      }).catch(e => {
        let res = e.response.data;
        console.log(res)
        if (res.status === 400) {
          setError(res.errors[0].location, {
            type: res.errors[0].type,
            message: res.errors[0].message,
          });
        }
      }
      );
  }
  const handleCancel = (e) => {
    history.push('/products/list')
  }
  useEffect(() => {
    axiosGet(dispatch, token, '/category?name=&page=0&limit=')
      .then(res => {
        setListCategory(res.data.content);
      }).catch(e => {
        console.log("Error in getProductList", e)
      });
  }, [])

  const handleUpload = (e) => {
    const file = e.target.files[0];
    console.log(file)
    const name = "linkImg";
    const formData = new FormData()
    formData.append('type', 'file')
    formData.append('image', file)
    setUploadFile(file);
    uploadApi.post("https://api.imgbb.com/1/upload?expiration=600&key=7c778367c2c9123a930f180aa2e750ef",
      formData).then(res => {
        console.log(res.data.data.url);
        setlinkImg(res.data.data.url);
      })

  }
  return (
    <div className="container">
      <h3 className="create-title">Tạo mới sản phẩm</h3>
      <div className="add-title">
        <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col">
              <TextField
                name="productName"
                label="Tên sản phẩm"
                value={watch("productName")}
                className="text-input"
                id="standard-basic"
                // InputLabelProps={{ shrink: true, }}
                error={errors.productName ? true : null}
                helperText={errors.productName?.message}
                inputRef={register({
                  required: "Tên không được để trống",
                })}
              />
              <TextField
                className="text-input"
                label="Số lượng"
                type="numberformat"
                name="warehouseQuantity"
                error={errors.warehouseQuantity ? true : null}
                helperText={errors.warehouseQuantity?.message}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                inputRef={register({
                  required: "Số lượng không được để trống",
                })}
              />
              <TextField
                className="text-input"
                label="Giá sản phẩm"
                type="numberformat"
                name="price"
                error={errors.price ? true : null}
                helperText={errors.price?.message}
                inputRef={register({
                  required: "Giá tiền không được để trống",
                })}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
              <Controller
                as={
                  <TextField
                    id="standard-select-currency"
                    // required
                    name="categoryId"
                    className="text-input"
                    select
                    label="Chọn loại hàng"
                    value={watch("categoryId")}
                    error={errors.categoryId}
                    helperText={errors.categoryId?.message}
                  >
                    {listCategory.map((category, index) => (
                      <MenuItem
                        key={index}
                        value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </TextField>
                }
                name="categoryId"
                control={control}
                rules={{ required: "Vui lòng chọn một mặt hàng" }}
              />
              <TextField
                name="description"
                label="Mô tả sản phẩm"
                value={watch("description")}
                id="standard-basic"
                className="text-input"
                inputRef={register({})}
                margin="normal"
                multiline
              // InputLabelProps={{ shrink: true, }}
              />
            </div>
            <div className="col">
              <TextField
                name="productCode"
                value={watch("productCode")}
                error={errors.productCode ? true : null}
                helperText={errors.productCode?.message}
                className="text-input"
                id="standard-full-width"
                margin="normal"
                // InputLabelProps={{ shrink: true,}}
                inputRef={register({
                  required: "Mã sản phẩm không được để trống",
                })}
                label="Mã sản phẩm"
              />
              <br />
              <Button
                className="upload-btn"
                variant="contained"
                color="primary"
                size="large"
                component="label"

              >
                Tải ảnh lên
             <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleUpload}
                />
                </Button>
                <div className="img-create-container">
                  <img className="image-responsive" src={linkImg}></img>
                </div>
            </div>
            </div>
            <div className="save-icon">
              <Button
                color="secondary"
                variant="outlined"
                size="large"
                type="reset"
                className={classes.button}
                onClick={handleCancel}
                // startIcon={<SaveIcon />}
                startIcon={<CancelIcon />}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                // onClick={handleSubmit}
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Lưu
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductCreate;