import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import {
    Card, CardContent, Typography,
    TextField, FormControl, InputLabel,
    Select, Input, MenuItem, CardActions,
    Button, CircularProgress, Menu, FormHelperText, Container, Dialog, DialogContent, DialogTitle, DialogActions, Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import "./Product.css";
import CancelIcon from "@material-ui/icons/Cancel";
import { axiosPost, axiosPut } from 'Api';
import Alert from '@material-ui/lab/Alert';
import parse from "html-react-parser";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    button: {
        margin: 20,
    },
});
function CategoryUpdate(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const token = useSelector(state => state.auth.token);
    // const [category, setcategory] = useState({description : ""});
    const [openCreateDialog, setopenCreateDialog] = useState(false);
    const [openUpdateDialog, setopenUpdateDialog] = useState(false)
    const [alertUpdated, setalertUpdated] = useState(false)
    const [description, setDescription] = useState("");
    const { register, handleSubmit, watch, control, errors, setError, setValue } = useForm({
        defaultValues: {
            categoryName: props.category.categoryName,
            description: ""
        },
    });
    console.log(props.category)
    const onSubmit = (data) => {
        console.log(props.category.description)
        axiosPut(dispatch, token, `/category/${props.category.categoryId}`,
            {
                categoryName: data.categoryName,
                description:description
            }).then(res => {
                setalertUpdated(true)
                setTimeout(() => {
                    window.location.reload(false);
                }, 1000);
            })
    }
    return (
        <div>
            {/* <Dialog open={props.open}
                onClose={() => setopenUpdateDialog(false)} aria-labelledby="form-dialog-title"> */}
            <DialogTitle id="form-dialog-title">Cập nhật danh mục</DialogTitle>
            <DialogContent>
                {/* <DialogContentText>
                                    To subscribe to this website, please enter your email address here. We will send updates
                                    occasionally.
                                 </DialogContentText> */}
                <form className={classes.formControl}
                    onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        className="category-create-input"
                        name="categoryName"
                        label="Tên danh mục"
                        variant="outlined"
                        error={errors.categoryName ? true : null}
                        helperText={errors.categoryName?.message}
                        inputRef={register({
                            required: "Tên không được để trống",
                        })}
                    />
                    <p className="des-btn2">Mô tả sản phẩm</p>
                    <CKEditor
                        editor={ClassicEditor}
                        config={{
                            toolbar: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', '|', 'undo', 'redo',]
                        }}
                        data={props.category.description}
                        onInit={(editor) => {
                            // You can store the "editor" and use when it is needed.
                            console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                            setDescription(editor.getData());
                        }}
                    />
                    <br />
                    <DialogActions>
                        <Button
                            color="secondary"
                            variant="outlined"
                            size="large"
                            type="reset"
                            className={classes.button}
                            // startIcon={<SaveIcon />}
                            startIcon={<CancelIcon />}
                            onClick={() => props.openUpdateDialog(false)}
                        >
                            Hủy
                                </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                        >
                            Cập nhật
                                </Button>
                    </DialogActions>
                </form>
            </DialogContent>
            <Snackbar open={alertUpdated} autoHideDuration={1000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => setalertUpdated(false)}
            >
                <Alert variant="filled" severity="success">
                    Cập nhật thành công
                </Alert>
            </Snackbar>
            {/* </Dialog> */}
        </div>
    );
}

export default CategoryUpdate;