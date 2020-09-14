
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Container, Box, Grid, Tooltip, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog, Slide, TextField, Snackbar } from '@material-ui/core';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { axiosGet, axiosPut, authDelete, axiosDelete } from 'Api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { toFormattedDateVN } from 'utils/DateUtils';
import CategoryCreate from './CategoryCreate';
import CategoryUpdate from './CategoryUpdate';
import { IconButton } from 'material-ui';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useForm } from 'react-hook-form';
import Alert from '@material-ui/lab/Alert';
import parse from "html-react-parser";
import Typography from 'material-ui/styles/typography';
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
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function Category(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [oldCategory, setoldCategory] = useState({});
    const tableRef = React.createRef();
    const [category, setcategory] = useState({ description: "" });
    const [description, setdescription] = useState("");
    const [numProducts, setnumProducts] = useState();
    //Show hide
    const [hideCreate, sethideCreate] = useState(true);
    //Dialog state
    const [openDialog, setopenDialog] = useState(false);
    const [deleteAllProductOfCate, setdeleteAllProductOfCate] = useState(false);
    const [openUpdateDialog, setopenUpdateDialog] = useState(false);
    const [alertDelete, setalertDelete] = useState(false);
    const onSubmit = (data) => {
        // console.log(data)
        //     axiosPost(dispatch, token, '/category/', {
        //         categoryName: data.categoryName,
        //         description: data.description
        //     })
        //         .then(res => {
        //             alert("thanh cong")
        //             window.location.reload(false);
        //         })
    }
    const handleDelete = (isDeleteProduct, categoryId) => {
        console.log(isDeleteProduct, category.categoryId)
        axiosDelete(dispatch, token, `/category?uuid=${category.categoryId}&clear=${isDeleteProduct}`)
            .then(
                res => {
                    setalertDelete(true)
                    setTimeout(() => {
                        window.location.reload(false);
                    }, 1000);
                },
            )
    }
    //call back close update dialog
    const callBackOpen = (childData) => {
        setopenUpdateDialog(childData)

    }
    const handleOpenDeleteDialog = (rowData) => {
        axiosGet(dispatch,
            token,
            `/product/count/${rowData.categoryId}`)
            .then(result => {
                console.log(result.data)
                setnumProducts(result.data)
            })
        setopenDialog(true)
        setcategory(rowData)
    }

    return (
        <div className="container">
            <div>
                <Tooltip title="Trở lại" arrow={true}>
                    <ArrowBackIcon
                        onClick={() => history.push('/products/list')}
                        className="icons-category" aria-label="Xóa"></ArrowBackIcon>
                </Tooltip>
                <CategoryCreate></CategoryCreate>
            </div>
            <div className="container-category">

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MaterialTable
                            title="Danh sách danh mục"
                            tableRef={tableRef}
                            columns={[
                                {
                                    title: 'STT', field: 'stt', width: '7%',
                                    headerStyle: {
                                        paddingLeft: 15,
                                    },
                                    cellStyle: {
                                        paddingLeft: 25,
                                    }, editable: 'never'
                                },
                                {
                                    title: 'Tên danh mục', field: 'categoryName', width: '18%'
                                },
                                { title: 'Mô tả', field: 'description', width: '40%', render: rowData => parse(rowData.description) },
                                { title: 'Ngày khởi tạo', field: 'createdStamp', editable: 'never' },
                                { title: 'Ngày cập nhật', field: 'lastUpdatedStamp', editable: 'never' }
                            ]}
                            localization={{
                                body: {
                                    emptyDataSourceMessage: "Không bản ghi để hiển thị.",
                                    editRow: { deleteText: '' }
                                },
                                toolbar: {
                                    searchPlaceholder: "Tìm kiếm",
                                    searchTooltip: "Tìm kiếm",
                                },
                                pagination: {
                                    labelRowsSelect: "hàng",
                                    labelDisplayedRows: "{from}-{to} của {count}",
                                    nextTooltip: "Trang đầu",
                                    lastTooltip: "Trang cuối",
                                    firstTooltip: "Trang tiếp",
                                    previousTooltip: "Trang trước",
                                },
                                header: {
                                    actions: ""
                                },
                            }}
                            data={query =>
                                new Promise((resolve, reject) => {
                                    axiosGet(dispatch,
                                        token,
                                        '/category?name=' + query.search +
                                        '&page=' + query.page +
                                        '&limit=' + query.pageSize)
                                        .then(result => {
                                            let data = result.data.content;
                                            let datas = data.map((item, index) => {
                                                let tmp = Object.assign({}, item,
                                                    { createdStamp: toFormattedDateVN(item.createdStamp) },
                                                    { lastUpdatedStamp: toFormattedDateVN(item.lastUpdatedStamp) },
                                                    { description: item.description },
                                                    { stt: ((result.data.number) * result.data.size + index + 1) });
                                                return tmp;
                                            })
                                            resolve({
                                                data: datas,
                                                page: result.data.number,
                                                totalCount: result.data.totalElements,
                                            })
                                        })
                                })
                            }
                            // onRowClick={((e, rowData) => handleDetail(rowData.categoryId))}

                            options={{
                                // selection: true,
                                debounceInterval: 500,
                                headerStyle: { backgroundColor: '#a5c3f2' },
                                cellStyle: {},
                                rowStyle: {
                                    textAlign: 'left',
                                },
                                actionsColumnIndex: -1
                            }}
                            actions={[
                                {
                                    icon: 'edit',
                                    tooltip: 'Sửa',
                                    onClick: (event, rowData) => {
                                        setopenUpdateDialog(true);
                                        setcategory(rowData)
                                    }
                                },
                                {
                                    icon: 'delete',
                                    tooltip: 'Xóa',
                                    onClick: (event, rowData) => {
                                        handleOpenDeleteDialog(rowData)
                                        console.log()
                                    }

                                }
                            ]}
                        />

                        {/* Popup for delete */}
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
                                <DialogContentText id="alert-dialog-slide-description">
                                </DialogContentText>
                                <DialogContentText id="alert-dialog-slide-description">
                                    <p>Sẽ có : {numProducts} sản phẩm bị xóa nếu bạn chọn "Có Xóa"</p>
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
                        <Dialog open={openUpdateDialog}
                            onClose={() => setopenUpdateDialog(false)} aria-labelledby="form-dialog-title"
                            fullWidth={true}
                            maxWidth={'sm'}
                        >
                            <CategoryUpdate category={category}
                                openUpdateDialog={callBackOpen}
                            ></CategoryUpdate>
                        </Dialog>
                    </Grid>
                </Grid>
                <Snackbar open={alertDelete} autoHideDuration={1000}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    onClose={() => setalertDelete(false)}
                >
                    <Alert variant="filled" severity="success">
                        Xóa danh mục thành công!
                </Alert>
                </Snackbar>
            </div>
        </div >
    );

}
export default Category;
