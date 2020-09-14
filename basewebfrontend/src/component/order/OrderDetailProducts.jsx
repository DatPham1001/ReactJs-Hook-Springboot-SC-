
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
import { axiosGet, authGet, axiosPost } from "Api";
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

  const {products, quantity, totalPayment, detailOrder} = props;
  console.log("sanpham",products);
  const [product, setProduct] = useState();
  const [listProduct, setListProduct] = useState([]);

  const [total, setTotal] = useState(0);

  const tableRef = useRef(null);



    useEffect(()=>{
        let productIds = products.map(item=>item.productId);
        let tmpProducts = [];

        axiosPost(dispatch, token, "/product/products-of-order", {productIds: productIds}).then(resp=>{
            products.map(item => {
                resp.data.map(product => {
                    if(item.productId === product.id){
                        tmpProducts.push(Object.assign({}, product, 
                                                        {orderQuantity: item.orderQuantity}, 
                                                        {price: item.price}),
                                                        );
                    }
                })
            })
            setListProduct(tmpProducts);
        })
        .catch(err => {
            console.log(err.response.data);
        })
    },[]);

  const columns = [
    {title: "Mã SP", field: "code", width: '10%', readonly: true , cellStyle: {textAlign: 'center'}},
    {title: "Tên sản phẩm", field: "name", width: '25%', cellStyle: {textAlign: 'center'}},
    {title: "Giá nhập", field: "price", width: '15%',headerStyle: { textAlign: 'right' },type: 'numeric',
        render: rowData => <span>{currencyFormat(rowData.price)} </span>
    },
    {title: "Số lượng", field: "orderQuantity", width: '15%',headerStyle: { textAlign: 'right' },type: 'numeric',},
    {title: "Đơn vị", field: "uom", width: '15%',headerStyle: { textAlign: 'right' },type: 'numeric',
        render: rowData => (
            <span>{rowData.uom} </span>
        )
    },
    {title: "Thành tiền", field: "total", width: '20%',headerStyle: { textAlign: 'right', paddingRight: 10 },cellStyle: {paddingRight: 10 },type: 'numeric',
        render: rowData => {
            return (
            <span>{currencyFormat(rowData.price * rowData.orderQuantity)} </span>
            )
    }
    }, //headerStyle: { textAlign: 'right' }
];

    const showTotal = ()=>{
        let tmp = 0;
        
        if(listProduct.length > 0){
            listProduct.map(item => {
                tmp  = tmp + (item.price * item.orderQuantity);
                console.log( item.price);
        console.log( item.orderQuantity);
            })
        }
        return currencyFormat(tmp);
    }

  return (
    <Card className={classes.formControl}>
      {/* <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <AddShoppingCartTwoToneIcon />
          </Avatar>
        }
        title="Sản phẩm"
      /> */}
      <Typography variant="h5" component="h6" align="left" style={{display:'flex'}}>
            <Avatar aria-label="recipe" className={classes.avatar} style={{margin: 10}}>
                <AddShoppingCartTwoToneIcon />
            </Avatar>
            <div style={{margin: 10, marginLeft:0, paddingTop:4}}>Sản phẩm</div>
            
        </Typography> 
      <CardContent>
         
          <div style={{ fontSize: 15 }}>
          <MaterialTable 
                title="Danh sách sản phẩm đã chọn"
                columns={columns}
                data={listProduct}

                tableRef={tableRef}

                options={{
                    search: false, 
                    headerStyle: { 
                        backgroundColor: '#a5c3f2',
                        paddingLeft:2,
                        paddingRight:3, 
                        textAlign: 'center',
                        fontWeight: 'bold',
                    },
                    cellStyle: {
                        paddingLeft:2,
                        paddingRight:3,
                    },
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
                            <div className="col-4"></div>
                            <div className="col-8">
                                <div className="row">
                                    <div className="col-6">Số lượng</div>
                                    <div className="col-6 ">
                                        <div className="float-right mx-3 my-1">{
                                            quantity
                                        } </div>
                                     </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">Tổng tiền</div>
                                    <div className="col-6 ">
                                        <div className="float-right mx-3 my-1">{
                                            showTotal()
                                        //    currencyFormat(total)
                                        } </div>
                                     </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">Chiết khấu</div>
                                    <div className="col-6 ">
                                        <div className="float-right mx-3 my-1"> {currencyFormat(detailOrder.discount)} </div>
                                     </div>
                                </div>
                                <div className="row" style={{marginBottom:10}}>
                                    <div className="col-6">Số tiền cần trả</div>
                                    <div className="col-6 ">
                                        <div className="float-right mx-3 my-1">{
                                            currencyFormat(detailOrder.totalPayment)
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
