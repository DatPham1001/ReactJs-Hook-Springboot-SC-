import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { axiosGet, authDelete, axiosPut } from '../../Api'
import "./Product.css";
import SaveIcon from '@material-ui/icons/Save';
import { currencyFormat } from "utils/NumberFormat";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, DialogContentText, Container } from '@material-ui/core';
import {
    TextField, FormControl, InputLabel,
    Select, MenuItem
}

    from '@material-ui/core';
import CurrencyTextField from "@unicef/material-ui-currency-textfield/dist/CurrencyTextField";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from 'react-number-format';
import Axios from 'axios';
const uploadApi = Axios.create({})

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
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const productId = useParams().id;
    const [isUpdate, setisUpdate] = useState(false);
    const [isNotUpload, setisNotUpload] = useState(true);
    const [uploadedFile, setuploadedFile] = useState(false);
    const [hideInfo, sethideInfo] = useState(true);

    //Data
    const [listCategory, setListCategory] = useState([]);
    const [product, setproduct] = useState([]);
    const [category, setcategory] = useState([]);
    const [categoryName] = useState();

    //Input Update
    const [linkImg, setlinkImg] = useState();

    //Form
    const { register, handleSubmit, watch, control, errors, setError, setValue } = useForm({
        defaultValues: {
            productName: product.productName,
            productCode: product.productCode,
            price: "",
            warehouseQuantity: "",
            linkImg: product.linkImg,
            description: product.description,
            categoryId: product.categoryId
        },
    });
    const onSubmit = (data) => {
        console.log(data);
        let warehouseQuantity = data.warehouseQuantity.split(",").join("");
        let price = data.price.split(",").join("");
        axiosPut(dispatch, token, `/product/${productId}`, {
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
                window.location.reload(false);
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
    const handleUpload = (e) => {
        const file = e.target.files[0];
        console.log(file)
        const name = "linkImg";
        const formData = new FormData()
        formData.append('type', 'file')
        formData.append('image', file)
        // setUploadFile(file);
        uploadApi.post("https://api.imgbb.com/1/upload?expiration=600&key=7c778367c2c9123a930f180aa2e750ef",
            formData).then(res => {
                console.log(res.data.data.url);
                setisNotUpload(false);
                setuploadedFile(true);
                setlinkImg(res.data.data.url);
            })

    }
    //
    useEffect(() => {
        axiosGet(dispatch, token, `/product/${productId}`).then(res => {
            const data = res.data;
            setproduct(data);
        });
        axiosGet(dispatch, token, '/category?name=&page=0&limit=').then(res => {
            setListCategory(res.data.content);
        }).catch(e => {
            console.log("Error in getProductList", e)
        });
        return () => {
        }
    }, [])
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
    }
    const handleDelete = () => {
        authDelete(dispatch, token, "/product/" + product.productId).then(
            res => {
                if (res === true) {
                    history.push("/products/list");
                }
            },
            () => {
            }
        );
    }
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <h3 className="create-title">Chi tiết sản phẩm</h3>
                    <div style={{ marginLeft: "50%" }}>
                        {hideInfo && (
                            <div>
                                <IconButton
                                    onClick={handleClickOpen}
                                    className="icons" aria-label="Xóa">
                                    <DeleteIcon color="error"></DeleteIcon>
                                </IconButton>
                                <IconButton
                                    onClick={handleHide}
                                    className="icons" aria-label="Chỉnh sửa">
                                    <CreateIcon ></CreateIcon>
                                </IconButton>
                            </div>
                        )}
                        {isUpdate && (
                            <div className="row">
                                <Button
                                    variant="contained"
                                    color="#9e9e9e"
                                    size="large"
                                    className="update-button"
                                    onClick={handleCancel}
                                // startIcon={<SaveIcon />}
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
                                    Lưu
                            </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {isNotUpload && (
                            <div className="img-container">
                                <img
                                    className="image-responsive"
                                    src={product.linkImg}></img>
                            </div>
                        )}
                        {uploadedFile && (
                            <div className="img-container">
                                <img
                                    className="image-responsive"
                                    src={linkImg}></img>
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
                                    onChange={handleUpload}
                                />
                            </Button>)}
                    </div>
                    <div className="col">
                        {hideInfo && (
                            <div>
                                <h3 className="product-title">
                                    {product.productName}
                                </h3>
                                <h3 className="product-title">
                                    Mã sản phẩm : {product.productCode}
                                </h3>
                                <div className="product-price">
                                    {currencyFormat(product.price)}
                                </div>
                                <div className="product-detail">
                                    Loại sản phẩm : {category.categoryName}
                                </div>
                                <div className="product-detail">
                                    Tồn kho : {product.warehouseQuantity}
                                </div>
                                <div className="product-detail">
                                    Mô tả sản phẩm: {product.description}
                                </div>
                                <div className="product-detail">
                                    Link ảnh sản phẩm : {product.linkImg}
                                </div>
                            </div>
                        )}

                        {isUpdate && (
                            <div>
                                <TextField
                                    name="productName"
                                    label="Tên sản phẩm"
                                    value={product.produtName}
                                    className="text-input"
                                    id="standard-basic"
                                    defaultValue={product.productName}
                                    // InputLabelProps={{ shrink: true, }}
                                    error={errors.productName ? true : null}
                                    helperText={errors.productName?.message}
                                    inputRef={register({
                                        required: "Tên không được để trống",
                                    })}
                                />
                                <TextField
                                    name="productCode"
                                    // value={watch("productCode")}
                                    error={errors.productCode ? true : null}
                                    helperText={errors.productCode?.message}
                                    defaultValue={product.productCode}
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
                                    className="text-input"
                                    label="Số lượng"
                                    type="numberformat"
                                    defaultValue={product.warehouseQuantity}
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
                                            id="standard-select-currency"
                                            // required
                                            name="categoryId"
                                            className="text-input"
                                            select
                                            label="Chọn loại hàng"
                                            value={product.categoryId}
                                            defaultValue={product.categoryId}
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
                                    defaultValue={product.categoryId}
                                    rules={{ required: "Vui lòng chọn một mặt hàng" }}
                                />
                                <TextField
                                    name="description"
                                    className="text-input"
                                    id="standard-multiline-static"
                                    label="Mô tả sản phẩm"
                                    inputRef={register}
                                    multiline
                                    rows={4}
                                    defaultValue={product.description}
                                />
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
                    <DialogTitle id="alert-dialog-slide-title">{"Bạn có muốn xóa sản phẩm này không?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <h4>{product.productName} : {product.productCode}</h4>
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