import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  InputLabel,
  Chip,
  Button,
  Tooltip,IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toFormattedDateVN } from "utils/DateUtils";
import DoneIcon from "@material-ui/icons/Done";

OrderCreateSupplierDetail.propTypes = {};
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    minHeight: 300,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 700,
      minHeight: 410,
    },
  },
}));

function OrderCreateSupplierDetail(props) {
  const classes = useStyles();
  const { data } = props;
  console.log("ncc: ",data)

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     if (data) {
//       console.log(data);
//       let tmp = data.categories.map((cate) => cate.categoryName);
//       setCategories(tmp);
//     }
//   }, []);
  return (
    <div>
      <Card>
        <CardContent className={classes.root}>
            <div className="row">
                <div className="col-6">
                    <Typography variant="h6" component="h6" align="left">
                        Chi tiết nhà cung cấp 
                    </Typography>
                </div>
                <div className="col-6 float-right">
                    <Tooltip title="Xóa" arrow={true}>
                        <IconButton
                        style={{float:'right', padding:0, margin: 10,}}
                        onClick={()=> {props.handleClear()}}
                        className="icons"
                        aria-label="Xóa"
                        >
                            X
                        </IconButton>
                        
                    </Tooltip>
                </div>
            </div>
          
          <form  noValidate autoComplete="off">
            <div>
            <div className="row">
                <div className="col-4">
                  <b> Tên nhà cung cấp</b>
                </div>
                <div className="col-8">: {data.name}</div>
              </div>
              <br />
            <div className="row">
                <div className="col-4">
                  <b> Mã nhà cung cấp</b>
                </div>
                <div className="col-8">: {data.code}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-4">
                  <b> Số điện thoại</b>
                </div>
                <div className="col-8">: {data.phoneNumber}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-4">
                  <b>Email</b>
                </div>
                <div className="col-8">: {data.email}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-4">
                  <b>Địa chỉ</b>
                </div>
                <div className="col-8">: {data.address}</div>
              </div>
              <br />
              {/* <div className="row">
                <div className="col-4">
                  <b>Danh mục</b>
                </div>
                <div className="col-8">
                  {categories.map((category, index) => {
                    return (
                      <span className={classes.categories}>
                        <Chip
                          key={index}
                          label={category}
                          // onClick={handleClick}
                          // onDelete={handleDelete}
                          deleteIcon={<DoneIcon />}
                          color="secondary"
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
    </div>
  );
}

export default OrderCreateSupplierDetail;
