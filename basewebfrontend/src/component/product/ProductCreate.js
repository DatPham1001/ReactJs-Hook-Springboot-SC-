import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import {
  Button,
  InputAdornment, MenuItem,
  Paper, Snackbar, TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import { FieldNumber } from "material-ui-hook-form";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { axiosGet, axiosPost } from "../../Api";
import { storage } from "./firebase";
const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: 10,
    marginBottom: 20,
    minWidth: "70%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: 20,
  },
}));

function ProductCreate(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const [desOpen, setdesOpen] = useState(false);
  const [hideDes, sethideDes] = useState(true);
  //Data from sever.
  const [listCategory, setListCategory] = useState([]);
  const [alertCreated, setalertCreated] = useState(false);
  //Form.
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
      productName: "",
      productCode: "",
      warehouseQuantity: "",
      linkImg: "",
      uom: "Chiếc",
      categoryId: "",
    },
  });
  const [linkImg, setlinkImg] = useState("https://firebasestorage.googleapis.com/v0/b/img-base-d6dac.appspot.com/o/images%2Fno%20img.png?alt=media&token=b5ce4d6e-f184-4843-80f1-2014beab70f0");
  const { inputRef, onChange, ...other } = props;
  const [description, setDescription] = useState("");
  // Functions.
  const onSubmit = (data) => {
    console.log("Method onSubmit, form data", data);
    axiosPost(dispatch, token, "/product", {
      productName: data.productName.trim(),
      productCode: data.productCode.trim(),
      price: data.price,
      uom: data.uom,
      warehouseQuantity: data.warehouseQuantity,
      linkImg: linkImg,
      description: description.trim(),
      categoryId: data.categoryId,
    })
      .then((res) => {
        setalertCreated(true)
        setTimeout(() => {
          history.push("/products/list");
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
  };
  const handleCancel = (e) => {
    history.push("/products/list");
  };

  useEffect(() => {
    axiosGet(dispatch, token, "/category?name=&page=0&limit=")
      .then((res) => {
        setListCategory(res.data.content);
        console.log(res.data.content)
      })
      .catch((e) => {
        console.log("Error in getProductList", e);
      });
    // axiosGet(dispatch, token, "/product/count").then((res) => {
    //   let SKUCode = res.data + 1;
    //   setValue("productCode", "SKU" + SKUCode);
    // });
  }, []);
  const [progress, setProgress] = useState(0);
  const handleUpload2 = (e) => {
    const image = e.target.files[0];
    console.log(image)
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            setlinkImg(url);
          });
      }
    );
  };
  return (
    <div className="container box">
      <Snackbar open={alertCreated} autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setalertCreated(false)}
      >
        <Alert variant="filled" severity="success">
          Tạo sản phẩm thành công!
                </Alert>
      </Snackbar>
      <h3 className="create-title">Tạo mới sản phẩm</h3>
      <div className="add-title">
        <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col">
              <TextField
                variant="outlined"
                name="productName"
                label="Tên sản phẩm*"
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
              <FieldNumber
                variant="outlined"
                className="text-input"
                label="Số lượng*"
                name="warehouseQuantity"
                error={errors.warehouseQuantity ? true : null}
                helperText={errors.warehouseQuantity?.message}
                allowNegative={false}
                thousandSeparator
                rules={{
                  required: "Số lượng không được để trống",
                }}
                control={control}
              />
              <FieldNumber
                variant="outlined"
                className="text-input"
                label="Giá sản phẩm*"
                name="price"
                error={errors.price ? true : null}
                helperText={errors.price?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VND</InputAdornment>
                  ),
                }}
                thousandSeparator
                allowNegative={false}
                rules={{
                  required: "Giá tiền không được để trống",
                }}
                control={control}
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
                    value={watch("categoryId")}
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
              // rules={{ required: "Vui lòng chọn một mặt hàng" }}
              />
              {hideDes &&
                <p className="des-btn" onClick={() => { setdesOpen(true); sethideDes(false) }}>Thêm mô tả</p>
              }

              {desOpen && (
                <div>
                  <p className="des-btn" onClick={() => { setdesOpen(false); sethideDes(true) }}>Ẩn mô tả</p>
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
                </div>
              )}
            </div>
            <div className="col">
              <TextField
                variant="outlined"
                name="productCode"
                value={watch("productCode")}
                error={errors.productCode ? true : null}
                helperText={errors.productCode?.message}
                className="text-input"
                id="standard-full-width"
                margin="normal"
                // InputLabelProps={{ shrink: true,}}
                inputRef={register({
                  // required: "Mã sản phẩm không được để trống",
                })}
                label="Mã sản phẩm"
              />
              <TextField
                variant="outlined"
                name="uom"
                value={watch("uom")}
                className="text-input"
                id="standard-full-width"
                margin="normal"
                // InputLabelProps={{ shrink: true,}}
                inputRef={register({})}
                label="Đơn vị tính"
              />
              <br />
              <div>
                <Paper variant="outlined" className="upload-img-container" >
                  <h5>Ảnh sản phẩm</h5>
                  <div className="img-create-container">
                    <img className="image-responsive" src={linkImg}></img>
                  </div>
                  <div style={{ textAlign: "center" }}>
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
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleUpload2}

                      />
                    </Button>
                  </div>
                </Paper>
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
              Tạo sản phẩm
            </Button>
          </div>
        </form>
        {/* {parse(description)} */}
        <DevTool control={control} />
      </div>
    </div>
  );
}

export default ProductCreate;
