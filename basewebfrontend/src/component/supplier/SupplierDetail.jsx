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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { toFormattedDateVN } from "utils/DateUtils";
import DoneIcon from "@material-ui/icons/Done";
import SupplierDetailOder from "./SupplierDetailOder";

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

  const supplieId = useParams().id;
  // console.log(props.match.params.id);
  useEffect(() => {
    axiosGet(dispatch, token, `/supplier/${supplieId}`).then((resp) => {
      console.log(resp.data);
      setData(resp.data);
      let tmp = resp.data.categories.map((cate) => cate.categoryName);
      console.log(tmp);
      setCategories(tmp);
      let dataOption = resp.data.categories.map((category) => {
        let value = category.categoryId;
        let label = category.categoryName;
        return { value: value, label: label };
      });
      localStorage.setItem("categories", JSON.stringify(dataOption));
      console.log(dataOption);
    });
  }, []);
  const handlePopup = (value) => {
    setOpenPopup(value);
  };

  const deleteUser = (value) => {
    setIsWaiting(true);

    authDelete(dispatch, token, "/supplier/" + supplieId).then(
      (res) => {
        if (res === true) {
          setOpenPopup(false);
          history.push("/supplier/list");
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

  return (
    <div>
      <Dialog
        open={openPopup}
        onClose={() => handlePopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có chắc muốn xóa nhà cung cấp này không?"}
        </DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            disabled={isWaiting}
            onClick={() => deleteUser()}
            color="secondary"
          >
            {isWaiting ? <CircularProgress color="secondary" /> : "Yes"}
          </Button>
          <Button
            disabled={isWaiting}
            onClick={() => handlePopup(false)}
            color="action"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="left">
            Chi tiết nhà cung cấp {data.supplierName}
            {canDelete ? (
              <IconButton
                style={{ float: "right" }}
                onClick={() => handlePopup(true)}
                aria-label="Delete"
                component="span"
              >
                <DeleteIcon color="error"></DeleteIcon>
              </IconButton>
            ) : (
              ""
            )}
            {canEdit ? (
              <IconButton
                style={{ float: "right" }}
                onClick={() => history.push(`/supplier/edit/${supplieId}`)}
                aria-label="Edit"
                component="span"
              >
                <EditIcon color="action"></EditIcon>
              </IconButton>
            ) : (
              ""
            )}
          </Typography>

          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <div className="row">
                <div className="col-3">
                  <b> Mã nhà cung cấp</b>
                </div>
                <div className="col-9">:{data.supplierCode}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b> Số điện thoại</b>
                </div>
                <div className="col-9">:{data.phoneNumber}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Email</b>
                </div>
                <div className="col-9">:{data.email}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Địa chỉ</b>
                </div>
                <div className="col-9">:{data.address}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b>Ngày tạo</b>
                </div>
                <div className="col-9">
                  :{toFormattedDateVN(data.createdStamp)}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <b> Ngày sửa cuối</b>
                </div>
                <div className="col-9">
                  :{toFormattedDateVN(data.lastUpdatedStamp)}
                </div>
              </div>
              <br />
              <div className="row">
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
                          deleteIcon={<DoneIcon />}
                          color="secondary"
                        />{" "}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <SupplierDetailOder />
    </div>
  );
}

export default SupplierDetail;
