import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { axiosGet, authDelete, axiosPut, axiosDelete } from "../../Api";
import "./Product.css";
import SaveIcon from "@material-ui/icons/Save";
import { currencyFormat, numberDecimalFormat } from "utils/NumberFormat";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  DialogContentText,
  Container,
  Tooltip,
  Snackbar,
} from "@material-ui/core";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { storage } from "./firebase";
import { useForm, Controller } from "react-hook-form";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import NumberFormat from "react-number-format";
import Axios from "axios";
import { toFormattedDateVN, toFormattedDateTime } from "utils/DateUtils";
import Alert from "@material-ui/lab/Alert";
import parse from "html-react-parser";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import { FieldNumber } from "material-ui-hook-form";
const uploadApi = Axios.create({});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
function ProductDetail() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const productId = useParams().id;
  const tableRef = React.createRef();
  const [isUpdate, setisUpdate] = useState(false);
  const [isNotUpload, setisNotUpload] = useState(true);
  const [uploadedFile, setuploadedFile] = useState(false);
  const [hideInfo, sethideInfo] = useState(true);
  const [alertUpdated, setalertUpdated] = useState(false);
  const [alertDelete, setAlertDelete] = useState(false);
  //Data
  const [listCategory, setListCategory] = useState([]);
  const [product, setproduct] = useState({ description: "" });
  const [category, setcategory] = useState([]);

  //Input Update
  const [linkImg, setlinkImg] = useState();
  const [description, setDescription] = useState("");
  //Form
  const {
    register,
    handleSubmit,
    watch,
    control,
    errors,
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      productName: product.name,
      productCode: product.code,
      price: "",
      uom: product.uom,
      warehouseQuantity: "",
      linkImg: linkImg,
      description: description,
      categoryId: category.categoryId,
    },
  });
  // console.log("Error", errors)
  const onSubmit = (data) => {
    console.log(data);
    let warehouseQuantity = data.warehouseQuantity.split(",").join("");
    let price = data.price.split(",").join("");
    if (!data.categoryId) {
      console.log(true)
      axiosPut(dispatch, token, `/product/${productId}`, {
        productName: data.productName,
        productCode: data.productCode,
        price: price,
        uom: data.uom,
        warehouseQuantity: warehouseQuantity,
        linkImg: linkImg,
        description: description,
        categoryId: product.category.id,
      })
        .then((res) => {
          setalertUpdated(true)
          setTimeout(() => {
            window.location.reload(false);
            // history.push(`/products/detail/${productId}`)
          }, 1000);

        })
        .catch((e) => {
          let res = e.response.data;
          console.log(res);
          if (res.status === 400) {
            setError(res.errors[0].location, {
              type: res.errors[0].type,
              message: res.errors[0].message,
            });
          }
        });
    } else if (data.categoryId) {
      axiosPut(dispatch, token, `/product/${productId}`, {
        productName: data.productName,
        productCode: data.productCode,
        price: price,
        uom: data.uom,
        warehouseQuantity: warehouseQuantity,
        linkImg: linkImg,
        description: description,
        categoryId: data.categoryId,
      })
        .then((res) => {
          setalertUpdated(true)
          setTimeout(() => {
            window.location.reload(false);
          }, 1000);
        })
        .catch((e) => {
          let res = e.response.data;
          console.log(res);
          if (res.status === 400) {
            setError(
              res.errors[0].location,
              res.errors[0].type,
              res.errors[0].message
            );
          }
        });
    }
    // axiosPut(dispatch, token, `/product/${productId}`, {
    //   productName: data.productName,
    //   productCode: data.productCode,
    //   price: price,
    //   warehouseQuantity: warehouseQuantity,
    //   linkImg: linkImg,
    //   description:description,
    //   categoryId: data.categoryId,
    // })
    //   .then((res) => {
    //     window.location.reload(false);
    //   })
    //   .catch((e) => {
    //     let res = e.response.data;
    //     console.log(res);
    //     if (res.status === 400) {
    //       setError(res.errors[0].location, {
    //         type: res.errors[0].type,
    //         message: res.errors[0].message,
    //       });
    //     }
    //   });
  };
  const [progress, setProgress] = useState(0);
  const handleUpload2 = (e) => {
    const image = e.target.files[0];
    console.log(image);
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    setisNotUpload(false);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        setuploadedFile(true);
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setlinkImg(url);
          });
      }
    );
  };
  const handleBack = () => {
    history.push("/products/list");
  };
  //
  useEffect(() => {
    axiosGet(dispatch, token, `/product/${productId}`).then((res) => {
      const data = res.data;
      console.log(data.category.name);
      console.log(data)
      setproduct(data);
      setlinkImg(data.imageLink);
      setcategory(data.category);
      setDescription(data.description)
    });
    axiosGet(dispatch, token, "/category?name=&page=0&limit=")
      .then((res) => {
        setListCategory(res.data.content);
      })
      .catch((e) => {
        console.log("Error in getProductList", e);
      });
    return () => { };
  }, []);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleHide = () => {
    setisUpdate(true);
    sethideInfo(false);
  };
  const handleCancel = () => {
    setisUpdate(false);
    sethideInfo(true);
    setisNotUpload(true);
    setuploadedFile(false);
  };
  const handleDelete = () => {
    axiosDelete(dispatch, token, "/product/" + product.id)
      .then(
        (res) => {
          if (res.data === "OK") {
            setAlertDelete(true)
            setTimeout(() => {
              history.push("/products/list");
            }, 1000);
          }
        },
        () => { }
      );
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Snackbar open={alertDelete} autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setAlertDelete(false)}
      >
        <Alert variant="filled" severity="success">
          Xóa sản phẩm thành công!
                </Alert>
      </Snackbar>
      <Snackbar open={alertUpdated} autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setalertUpdated(false)}
      >
        <Alert variant="filled" severity="success">
          Cập nhật thành công!
                </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <h3 className="create-title">Chi tiết sản phẩm</h3>
          <div style={{ marginLeft: "50%" }}>
            {hideInfo && (
              <div>
                <Tooltip title="Xóa" arrow={true}>
                  <IconButton
                    onClick={handleClickOpen}
                    className="icons"
                    aria-label="Xóa"
                  >
                    <DeleteIcon color="error"></DeleteIcon>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Sửa" arrow={true}>
                  <IconButton
                    onClick={handleHide}
                    className="icons"
                    aria-label="Chỉnh sửa"
                  >
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Trở lại" arrow={true}>
                  <IconButton
                    onClick={handleBack}
                    className="icons"
                    aria-label="Xóa"
                  >
                    <ArrowBackIcon></ArrowBackIcon>
                  </IconButton>
                </Tooltip>
              </div>
            )}

            {isUpdate && (
              <div className="row">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  className="update-button"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  // onClick={handleUpdate}
                  className="update-button"
                  startIcon={<SaveIcon />}
                >
                  Cập nhật
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {isNotUpload && (
              <div className="img-container">
                <img className="image-responsive" src={linkImg}></img>
              </div>
            )}
            {uploadedFile && (
              <div className="img-container">
                {/* <CircularProgress variant="static" value={progress} /> */}
                <img className="image-responsive" src={linkImg}></img>
              </div>
            )}
            {isUpdate && (
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
                  onChange={handleUpload2}
                />
              </Button>
            )}
          </div>
          <div className="col">
            {hideInfo && (
              <div>
                <h3 className="product-title">{product.name}</h3>
                <h3 className="product-title">
                  Mã sản phẩm : {product.code}
                </h3>
                <div className="product-price">
                  {currencyFormat(product.price)}
                </div>
                <div className="product-detail">
                  Loại sản phẩm : {category.name}
                </div>
                <div className="product-detail">
                  Tồn kho : {numberDecimalFormat(product.inventoryNumber)}
                </div>
                <div className="product-detail">
                  Đơn vị tính : {product.uom}
                </div>
                <div className="product-detail">
                  Ngày khởi tạo: {toFormattedDateTime(product.createdStamp)}
                </div>
                <div className="product-detail">
                  Ngày cập nhật: {toFormattedDateTime(product.lastUpdatedStamp)}
                </div>
                <div className="product-detail">
                  Mô tả sản phẩm:
                </div>
                <div className="product-detail">
                  {parse(product.description)}
                </div>

              </div>
            )}

            {isUpdate && (
              <div>
                <TextField
                  variant="outlined"
                  name="productName"
                  label="Tên sản phẩm"
                  // value={product.name}
                  className="text-input"
                  id="standard-basic"
                  defaultValue={product.name}
                  // InputLabelProps={{ shrink: true, }}
                  error={errors.productName ? true : null}
                  helperText={errors.productName?.message}
                  inputRef={register({
                    required: "Tên không được để trống",
                  })}
                />
                <TextField
                  name="productCode"
                  variant="outlined"
                  // value={watch("productCode")}
                  error={errors.productCode ? true : null}
                  helperText={errors.productCode?.types.message}
                  defaultValue={product.code}
                  className="text-input"
                  id="standard-full-width"
                  margin="normal"
                  // InputLabelProps={{ shrink: true,}}
                  inputRef={register({
                    required: "Mã sản phẩm không được để trống",
                  })}
                  label="Mã sản phẩm"
                // onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  className="text-input"
                  label="Số lượng"
                  type="numberformat"
                  defaultValue={product.inventoryNumber}
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
                  name="uom"
                  variant="outlined"
                  // value={watch("productCode")}
                  error={errors.uom ? true : null}
                  helperText={errors.uom?.message}
                  defaultValue={product.uom}
                  className="text-input"
                  id="standard-full-width"
                  margin="normal"
                  // InputLabelProps={{ shrink: true,}}
                  inputRef={register({
                    required: "Đơn vị tính không được để trống",
                  })}
                  label="Đơn vị tính"
                // onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  className="text-input"
                  label="Giá sản phẩm"
                  type="numberformat"
                  name="price"
                  defaultValue={product.price}
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
                      variant="outlined"
                      id="standard-select-currency"
                      // required
                      name="categoryId"
                      className="text-input"
                      select
                      label="Chọn loại hàng"
                      defaultValue={category.id}
                    // error={errors.categoryId}
                    // helperText={errors.categoryId?.message}
                    >
                      {listCategory.map((category, index) => (
                        <MenuItem key={index} value={category.categoryId}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </TextField>
                  }
                  name="categoryId"
                  control={control}
                  defaultValue={category.categoryId}
                // rules={{ required: "Vui lòng chọn một mặt hàng" }}
                />
                <p className="product-detail">Mô tả sản phẩm:</p>
                <div className="ck-container">
                  <CKEditor
                    editor={ClassicEditor}
                    config={{
                      toolbar: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', '|', 'undo', 'redo',]
                    }}
                    data={description}
                    onInit={(editor) => {
                      // You can store the "editor" and use when it is needed.
                      console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      setDescription(editor.getData());
                      console.log(editor.getData())
                    }}
                  />
                </div>
                {/* <TextField
                  variant="outlined"
                  name="description"
                  className="text-input"
                  id="standard-multiline-static"
                  label="Mô tả sản phẩm"
                  inputRef={register}
                  multiline
                  rows={4}
                  defaultValue={product.description}
                /> */}
              </div>
            )}
          </div>
        </div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Bạn có muốn xóa sản phẩm này không?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <h4>
                {product.name} : {product.code}
              </h4>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Hủy
            </Button>
            <Button onClick={handleDelete} color="primary">
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Container >
  );
}

export default ProductDetail;
