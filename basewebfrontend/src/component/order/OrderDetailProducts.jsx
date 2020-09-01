
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Checkbox,
  Button,
  CardActions,
  CircularProgress,
  Box,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useSelector, useDispatch } from "react-redux";
import { axiosGet, authGet } from "Api";
import { useHistory } from "react-router";
import AddShoppingCartTwoToneIcon from "@material-ui/icons/AddShoppingCartTwoTone";
import { useState } from "react";
import OrderCreateProductsDetail from "./OrderCreateProductsDetail";
import MaterialTable from "material-table";
import {currencyFormat} from 'utils/NumberFormat';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      minWidth: 700,
      maxWidth: 1000,
      height: 1000,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 500,
    maxWidth: 1200,
    minHeight: 450,
  },
  label: {
    textTransform: "capitalize",
    // marginLeft: -305,
    paddingRight: -300,
  },
  selectProduct: {
    zIndex: 1000,
  },
}));

function OrderDetailProducts(props) {
  const classes = useStyles();
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const {products, quantity, totalPayment} = props;
  const [product, setProduct] = useState();
  const [listProduct, setListProduct] = useState([]);

  const tableRef = useRef(null);

  useEffect(()=>{
    products.map((item, index)=>{
        axiosGet(dispatch, token, `/product/${item.productId}`).then(resp=>{
            let tmp = Object.assign({}, resp.data, {quantity: item.quantity});
            setProduct(tmp);
            console.log(tmp)
            return tmp;
        })
    })
  },[])

  useEffect(()=>{
    if(product !== undefined){
        console.log(product)
        let tmp = listProduct.map(item=>item);
        tmp.push(product);
        setListProduct(tmp);
    }
  }, [product]);

  const columns = [
    {title: "Mã SP", field: "productCode", width: '10%', readonly: true},
    {title: "Tên sản phẩm", field: "productName", width: '25%'},
    {title: "Giá nhập", field: "price", width: '15%',
        render: rowData => <span>{currencyFormat(rowData.price)} </span>
    },
    {title: "Tổng số lượng", field: "quantity", width: '15%',},
    {title: "Đơn vị", field: "unit", width: '15%',
        render: rowData => (
            <span>Chiếc</span>
        )
    },
    {title: "Thành tiền", field: "total", width: '20%',
        render: rowData => (
            <span>{currencyFormat(rowData.price * rowData.quantity)} </span>
        )
    }, //headerStyle: { textAlign: 'right' }
];

  return (
    <Card className={classes.formControl}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <AddShoppingCartTwoToneIcon />
          </Avatar>
        }
        title="Sản phẩm"
      />
      <CardContent>
         
          <div style={{ fontSize: 12 }}>
          <MaterialTable 
                title="Danh sách sản phẩm đã chọn"
                columns={columns}
                data={listProduct}

                tableRef={tableRef}

                options={{
                    search: false, 
                    headerStyle: { backgroundColor: '#dddddd' },
                    cellStyle: {},
                    rowStyle: {
                        textAlign: 'left',
                    },
                    sorting:false,
                    actionsColumnIndex: -1,
                }}
                localization = {{
                    body: {
                        emptyDataSourceMessage: 'Chưa có sản phẩm nào được chọn',
                    },
                }}
                components={{
                    Pagination:props=>(<div>
                        <div className="row">
                            <div className="col-6"></div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-6">Số lượng</div>
                                    <div className="col-6 ">
                                        <div className="float-right">{
                                            quantity
                                        } </div>
                                     </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">Tổng tiền</div>
                                    <div className="col-6 ">
                                        <div className="float-right">{
                                           currencyFormat(totalPayment)
                                        } </div>
                                     </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">Chiết khấu</div>
                                    <div className="col-6 ">
                                        <div className="float-right"> 0 </div>
                                     </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">Số tiền cần trả</div>
                                    <div className="col-6 ">
                                        <div className="float-right">{
                                            currencyFormat(totalPayment)
                                        } </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>),
                }}
            />
          </div>
      </CardContent>
    </Card>
  );
}

export default OrderDetailProducts;
