import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import {
    Card, CardContent, Typography,
    TextField, FormControl, InputLabel,
    Select, Input, MenuItem, CardActions,
    Button, CircularProgress, Menu, FormHelperText, Container, Dialog, Slide, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import "./Product.css";
import { toFormattedDateVN } from '../../utils/DateUtils';
import CancelIcon from "@material-ui/icons/Cancel";
import { axiosPost, axiosGet, authDelete } from 'Api';
import { IconButton } from 'material-ui';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from "@material-ui/icons/Delete";
import { DevTool } from 'react-hook-form-devtools';
const useStyles = makeStyles((theme) => ({
    formControl: {
        marginTop: 30,
        marginBottom: 20,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: 20,
    },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function CategoryDetail(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const token = useSelector(state => state.auth.token);
    const { register, handleSubmit, watch, control, errors, setError, setValue } = useForm({
        defaultValues: {
            categoryName: "",
            description: ""
        },
    });
    const [open, setopen] = useState({});
    const [update, setupdate] = useState(false);
    const [hideInfo, sethideInfo] = useState(true);

    const [category, setcategory] = useState({});
    //Dialog state
    const [openDialog, setopenDialog] = useState(false);
    const [deleteAllProductOfCate, setdeleteAllProductOfCate] = useState(false);
    useEffect(() => {
        setopen(props.setOpen);
        axiosGet(dispatch, token, `/category/${props.categoryId}`)
            .then(res => {
                console.log("body", res.data.categoryName);
                setValue("categoryName", res.data.categoryName)
                setValue("description", category.description);
                setcategory(res.data);
            });

    }, [props])

    useEffect(() => {
        setValue("categoryName", category.categoryName);
        setValue("description", category.description);
    }, [update])

    const onSubmit = (data) => {
        console.log(data)
        axiosPost(dispatch, token, '/category/', {
            categoryName: data.categoryName,
            description: data.description
        })
            .then(res => {
                alert("thanh cong")
                window.location.reload(false);
            })
    }
    const handleUpdateFormOpen = () => {
        setupdate(true);
        sethideInfo(false)

    };
    const handleCancelUpdate = () => {
        setupdate(false);
        sethideInfo(true);
    };
    const handleDelete = (isDeleteProduct) => {
        console.log(isDeleteProduct, category.categoryId)
        authDelete(dispatch, token, `/category?uuid=${category.categoryId}&clear=${isDeleteProduct}`)
            .then(
                res => {
                    if (res === true) {
                        alert("thanh cong");
                        history.push("/products/list");
                    }
                },
            )}

    return (
        <div style={{ marginTop: "10px" }}>

            <h4 className="category-header">Chi tiết danh mục</h4>
            {hideInfo && (
                <div>
                    <div className="icon-container">
                        <CreateIcon
                            className="catedetail-icon"
                            aria-label="Chỉnh sửa"
                            onClick={handleUpdateFormOpen}
                        />
                        <DeleteIcon className="catedetail-icon" color="error" onClick={() => setopenDialog(true)} />
                    </div>
                    <p className="category-detail-title">
                        Tên danh mục : {category.categoryName}</p>
                    <p className="category-detail-title">
                        Mô tả : {category.description}</p>
                    <p className="category-detail-title">
                        Ngày khởi tạo : {toFormattedDateVN(category.createdStamp)}</p>
                    <p className="category-detail-title">
                        Ngày cập nhật : {toFormattedDateVN(category.lastUpdatedStamp)}</p>
                </div>
            )}
            {update && (
                <form className={classes.formControl}
                    onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ textAlign: "center" }}>
                        <TextField
                            name="categoryName"
                            className="category-update-input"
                            label="Tên danh mục"
                            variant="outlined"
                            value={watch("categoryName")}
                            error={errors.categoryName ? true : null}
                            helperText={errors.categoryName?.message}
                            inputRef={register({
                                required: "Tên không được để trống",
                            })}
                        />
                        <TextField
                            name="description"
                            className="category-update-input"
                            label="Mô tả"
                            variant="outlined"
                            defaultValue="asf"
                            multiline
                            rows={4}
                            inputRef={register}
                        />
                        <br />
                        <Button
                            color="secondary"
                            variant="outlined"
                            size="large"
                            type="reset"
                            className={classes.button}
                            onClick={handleCancelUpdate}
                            // startIcon={<SaveIcon />}
                            startIcon={<CancelIcon />}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            //type="submit"
                            onClick={() => setValue("categoryName", "abc")}
                            className={classes.button}
                            startIcon={<SaveIcon />}
                        >
                            Lưu
              </Button>
                    </div>

                </form>
            )}
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setopenDialog(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Bạn có muốn xóa những sản phẩm thuộc danh mục này không?"}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-slide-description">
                        
                    </DialogContentText> */}
                    <DialogContentText id="alert-dialog-slide-description">
                        <h4>{category.categoryName}</h4>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setopenDialog(false)} color="secondary"
                        variant="outlined">
                        Hủy
                     </Button>
                    <Button onClick={() => handleDelete(true)} color="inherit">
                        Có xóa
                    </Button>
                    <Button onClick={() => handleDelete(false)} color="primary" variant="contained">
                        Không xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}