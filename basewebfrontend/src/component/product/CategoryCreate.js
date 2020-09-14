import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import { axiosPost } from 'Api';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import "./Product.css";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const useStyles = makeStyles((theme) => ({

    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: 20,
    },
}));
function CategoryCreate(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const token = useSelector(state => state.auth.token);
    const [openCreateDialog, setopenCreateDialog] = useState(false);
    const [openAlertCreated, setopenAlertCreated] = useState(false);
    const [description, setDescription] = useState("");
    const { register, handleSubmit, watch, control, errors, setError, setValue } = useForm({
        defaultValues: {
            categoryName: "",
            description: ""
        },
    });
    const onSubmit = (data) => {
        console.log(data)
        axiosPost(dispatch, token, '/category/', {
            categoryName: data.categoryName,
            description: description
        })
            .then(res => {
                setopenAlertCreated(true)
                setTimeout(() => {
                    window.location.reload(false);
                    // setopenCreateDialog(false);
                    // history.push("/category/")
                }, 1000);

            })
    }
    return (
        <div>
            <Snackbar open={openAlertCreated} autoHideDuration={1000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => setopenAlertCreated(false)}
            >
                <Alert variant="filled" severity="success">
                    Tạo danh mục thành công!
                </Alert>
            </Snackbar>
            <Box display='flex' justifyContent='flex-end'>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setopenCreateDialog(true)}>
                    Thêm mới
                </Button>
            </Box>
            <Dialog open={openCreateDialog}
                onClose={() => setopenCreateDialog(false)}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle id="form-dialog-title">Tạo mới danh mục</DialogTitle>
                <DialogContent>
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
                        <p className="des-btn2">Thêm mô tả</p>
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
                        <DialogActions>
                            <Button
                                color="secondary"
                                variant="outlined"
                                size="large"
                                type="reset"
                                className={classes.button}
                                // startIcon={<SaveIcon />}
                                startIcon={<CancelIcon />}
                                onClick={() => setopenCreateDialog(false)}
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
                                Tạo danh mục
                                </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CategoryCreate;