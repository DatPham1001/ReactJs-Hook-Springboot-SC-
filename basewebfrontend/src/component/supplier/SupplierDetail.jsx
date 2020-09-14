import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { axiosGet, authDelete } from "Api";
import {
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
  Chip,
  InputLabel,
  FormControl,
  Tooltip,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { toFormattedDateVN } from "utils/DateUtils";
import DoneIcon from "@material-ui/icons/Done";
import SupplierDetailOder from "./SupplierDetailOder";
import { RiArrowGoBackFill } from "react-icons/ri";
import { GiAutoRepair } from "react-icons/gi";
import CreateIcon from "@material-ui/icons/Create";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleSharpIcon from "@material-ui/icons/CheckCircleSharp";
import { formatDateTime } from "utils/NumberFormat";
import Alert from "@material-ui/lab/Alert";

import { ImWarning } from 'react-icons/im';


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
    // minWidth: 200,
    // maxWidth: 200,
    // paddingTop: theme.spacing(),
  },
  categories: {
    // paddingLeft:10,
    // flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(0.5),
    // },
  },
  IconButton: {
    float: "right",
    padding: 10,
    margin: 10,
  },
}));

function SupplierDetail(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();
  let classes = useStyles();

  const [data, setData] = useState({});
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [transactionOrder, setTransactionOrder] = useState(false);

  //notifi
  const [mesDelete, setMesDelete] = useState(false);

  const [state, setState] = React.useState({
    openMes: false,
    vertical: "bottom",
    horizontal: "right",
  });

  const { vertical, horizontal, openMes } = state;

  const handleCloseMes = () => {
    setState({ ...state, openMes: false });
    setMesDelete(false);
  };

  const supplieId = useParams().id;

  // console.log(props.match.params.id);
  useEffect(() => {
    axiosGet(dispatch, token, `/supplier/${supplieId}`).then((resp) => {
      console.log(resp.data);
      setData(resp.data);
      //   let tmp = resp.data.categories.map((cate) => cate.categoryName);
      //   console.log(tmp);
      //   setCategories(tmp);
      //   let dataOption = resp.data.categories.map((category) => {
      //     let value = category.categoryId;
      //     let label = category.categoryName;
      //     return { value: value, label: label };
      //   });
      //   localStorage.setItem("categories", JSON.stringify(dataOption));
      //   console.log(dataOption);
    });
  }, []);
  const handlePopup = (value) => {

    setOpenPopup(value);

    axiosGet(dispatch, token, `/order/?pageSize=10&pageNumber=0&search=${supplieId}`).then(res => {
      if (res.data.totalElements > 0) {
        setTransactionOrder(true);
      } else {
        setTransactionOrder(false);
      }
    })
  };

  const deleteSupplier = (value) => {
    setIsWaiting(true);

    authDelete(dispatch, token, "/supplier/" + supplieId).then(
      (res) => {
        if (res === true) {
          setOpenPopup(false);

          setState({ ...state, openMes: true });
          setMesDelete(true);
          setTimeout(() => {
            history.push("/supplier/list");
          }, 1000);
        }
      },
      (error) => {
        setData([]);
      }
    );
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  return data ? (
    <div>
      <Dialog
        open={openPopup}
        onClose={() => handlePopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="text-center">
          {transactionOrder && <Typography variant="h5" align="left" style={{ color: 'red' }}>
            <ImWarning />
            {"  Nhà cung cấp này đang có giao dịch với kho."}
          </Typography>}<br />
          <Typography variant="h6" align="left">
            {"Bạn có chắc muốn xóa nhà cung cấp này không?"}
          </Typography>
          <Typography variant="body2" align="left" style={{ color: 'red' }}>
            {"Lưu ý: Hành động này không thể hoàn tác."}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button
            // variant="outlined"
            variant="contained"
            disabled={isWaiting}
            onClick={() => deleteSupplier()}
            // color="action"
            style={{ marginRight: 20, width: 100 }}
          >
            {isWaiting ? <CircularProgress color="secondary" /> : "Xóa"}
          </Button>

          <Button
            disabled={isWaiting}
            onClick={() => handlePopup(false)}
            variant="contained"
            autoFocus
            color="primary"
            style={{ marginRight: 20, width: 100 }}
          >
            Không
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <div className="float-left">
          <Tooltip title="Trở lại" arrow={true}>
            <IconButton
              onClick={() => history.goBack()}
              className="icons"
              aria-label="Xóa"
            >
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
          </Tooltip>
        </div>
        <div className="float-right">
          <Tooltip title="Sửa" arrow={true}>
            <IconButton
              onClick={() => history.push(`/supplier/edit/${supplieId}`)}
              className="icons"
              aria-label="Chỉnh sửa"
            >
              <CreateIcon></CreateIcon>
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa" arrow={true}>
            <IconButton
              onClick={() => handlePopup(true)}
              className="icons"
              aria-label="Xóa"
            >
              <DeleteIcon color="error"></DeleteIcon>
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="left">
            Chi tiết nhà cung cấp
          </Typography>
          <br />

          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <div className="row">
                <div className="col-3">
                  <b> Tên nhà cung cấp</b>
                </div>
                <div className="col-9">
                  <b>:</b> {data.name}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b> Mã nhà cung cấp</b>
                </div>
                <div className="col-9">
                  <b>:</b> {data.code}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b> Số điện thoại</b>
                </div>
                <div className="col-9">
                  <b>:</b> {data.phoneNumber}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Email</b>
                </div>
                <div className="col-9">
                  <b>:</b> {data.email}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Địa chỉ</b>
                </div>
                <div className="col-9">
                  <b>:</b> {data.address}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Ngày tạo</b>
                </div>
                <div className="col-9">
                  <b>:</b> {toFormattedDateVN(data.createdStamp)}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b> Ngày sửa cuối</b>
                </div>
                <div className="col-9">
                  <b>:</b> {toFormattedDateVN(data.lastUpdatedStamp)}
                </div>
              </div>
              <br />
              {/* <div className="row">
                <div className="col-3">
                  <b>Danh mục</b>
                </div>
                <div className="col-9">
                  {categories.map((category, index) => {
                    return (
                      <span className={classes.categories}>
                        <Chip
                          key={index}
                          label={category}
                          onClick={handleClick}
                          onDelete={handleDelete}
                          deleteIcon={<CheckCircleSharpIcon />}
                          color="primary"
                          variant="outlined"
                        />{" "}
                      </span>
                    );
                  })}
                </div>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
      {data && (
        <SupplierDetailOder
          supplierName={data.supplierName}
          supplierId={supplieId}
        />
      )}
      {mesDelete && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openMes}
          onClose={handleCloseMes}
          key={vertical + horizontal}
        >
          <Alert onClose={handleCloseMes} severity="success"
            variant="filled">
            Xóa nhà cung cấp thành công!
          </Alert>
        </Snackbar>
      )}
    </div>
  ) : (
      ""
    );
}

export default SupplierDetail;
