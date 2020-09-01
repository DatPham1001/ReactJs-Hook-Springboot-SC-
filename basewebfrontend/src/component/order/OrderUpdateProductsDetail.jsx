import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { Pagination } from 'reactstrap';
import { Button, InputAdornment, OutlinedInput, TextField, MenuItem, Card } from '@material-ui/core';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import NumberFormat from 'react-number-format';
import {currencyFormat} from 'utils/NumberFormat';

OrderUpdateProductsDetail.propTypes = {
    products: PropTypes.array,
};
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: 0,
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: 100,
      fontSize:12,
    },
    cardDiscount:{
        zIndex:100,
    }
  }));

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

function OrderUpdateProductsDetail(props) {
    const classes = useStyles();
    const {products} = props;
    console.log(products)
    // const [products, setProducts] = useState(props.products);
    const [newProducts, setNewProducts] = useState([]);
    

    const [price, setPrice] = useState(100);
    const [unit, setUnit] = useState([{value:'c01',label:'Chiếc'}]);
    const [discountProduct, setDiscountProduct] = useState(false);

    const tableRef = useRef(null);

    useEffect(()=>{
        if(products.length>0 && newProducts.length===0){
            let tmpArray = products.map((item, index) => item);
            // tmpArray.push(products[products.length-1]);
            setNewProducts(tmpArray);
        }
    },[]);

    useEffect(()=>{
        console.log(products);
        let row = products.length;
        if(row <=5){
            row=5;
        }
        tableRef.current.dataManager.changePageSize(row);
        
        if(products.length > 0 && products.length > newProducts.length ){
            let tmpArray = newProducts.map((item, index) => item);
            tmpArray.push(products[products.length-1]);
            setNewProducts(tmpArray);
        }
        
    }, [products]);
    console.log(newProducts);

    const columns = [
        {title: "Mã SP", field: "productCode", width: '10%', readonly: true},
        {title: "Tên sản phẩm", field: "productName", width: '25%'},
        {title: "Giá nhập", field: "price", width: '15%',
            render: rowData => (<span>
                <TextField
                    id="outlined-start-adornment"
                    className={clsx(classes.margin, classes.textField)}
                    name="numberformat"

                    defaultValue={rowData.price}
                    // value={rowData.price}
                    onChange={(event=>{
                        console.log(event.target.value, 'row', rowData);
                        let tmpArr = newProducts.map((item, index)=>{
                            if(item.productId === rowData.productId){
                                return Object.assign({}, rowData, {price: event.target.value});
                            }
                            return item;
                        })
                        console.log(tmpArr);
                        setNewProducts(tmpArr);
                    })}

                    variant="outlined"
                    size="small"
                    InputProps={{
                        // endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                        inputComponent: NumberFormatCustom,
                    }}
                    onClick={(event)=>{
                        setDiscountProduct(true);
                    }}
                    
                >
                </TextField>
                {/* {discountProduct && <Card className={classes.cardDiscount} onBlur={()=>{
                        setDiscountProduct(false);
                    }}> abc</Card>} */}
                

            </span>)
        },
        {title: "Tổng số lượng", field: "quantity", width: '15%',
            render: rowData => (<span>
                <TextField
                    id="outlined-start-adornment"
                    defaultValue={rowData.quantity}
                    // value={rowData.quantity}
                    className={clsx(classes.margin, classes.textField)}
                    name="numberformat"

                    variant="outlined"
                    size="small"
                    autoFocus={true}

                    onChange={(event=>{
                        console.log(event.target.value, 'row', rowData);
                        let tmpArr = newProducts.map((item, index)=>{
                            if(item.productId === rowData.productId){
                                return Object.assign({}, rowData, {quantity: event.target.value});
                            }
                            return item;
                        })
                        console.log(tmpArr);
                        setNewProducts(tmpArr);
                    })}

                    InputProps={{
                        inputComponent: NumberFormatCustom,
                    }}
                />
            </span>)
        },
        {title: "Đơn vị", field: "unit", width: '15%',
            render: rowData =>(<span>
                <TextField
                    id="outlined-select-currency"
                    select
                    value={'c01'}
                    // onChange={handleChange}
                    variant="outlined"
                    size="small"
                    >
                    {unit.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </span>)
        },
        {title: "Thành tiền", field: "total", width: '20%',
            render: rowData => (<span>
                {currencyFormat(rowData.price*rowData.quantity)}
            </span>)
        }, //headerStyle: { textAlign: 'right' }
    ];

    const showTotalQuantity = ()=>{
        let totalQuantity = 0;
        if(newProducts.length > 0){
            newProducts.map((item, index)=>{
                totalQuantity  = totalQuantity + parseInt(item.quantity) ;
                // return item;
            })
        }
        return totalQuantity;
    }

    const showTotalPayment = () => {
        let totalPayment = 0;
        if(newProducts.length > 0){
            newProducts.map((item, index)=>{
                totalPayment += parseInt(item.quantity) * parseInt(item.price);
            })
        }
        return currencyFormat(totalPayment);
    }

    return (
        <div>
            <MaterialTable 
                title="Danh sách sản phẩm đã chọn"
                columns={columns}
                data={newProducts}

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
                    // showTitle: false,
                    // pageSize: 30,
                }}
                localization = {{
                    body: {
                        emptyDataSourceMessage: 'Chưa có sản phẩm nào được chọn',
                    },
                    header:{
                        actions: ""
                    }
                }}
                actions={[
                    {
                        icon: 'clear',
                        tooltip: 'Xóa',
                        onClick: (event, rowData) => {
                            props.handleClear(rowData.productId);

                            let tmpProducts = newProducts;

                            let tmpArr = tmpProducts.filter(item => item.productId !== rowData.productId);
                            setNewProducts(tmpArr);
                        }
                    }
                ]}
                components={{
                    Pagination:props=>(<div>
                        <div className="row">
                            <div className="col-6"></div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-6">Số lượng</div>
                                    <div className="col-6 ">
                                        <div className="float-right">{
                                            showTotalQuantity()
                                        } </div>
                                     </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">Tổng tiền</div>
                                    <div className="col-6 ">
                                        <div className="float-right">{
                                            showTotalPayment()
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
                                            showTotalPayment()
                                        } </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>),
                }}
            />
        </div>
    );
}

export default OrderUpdateProductsDetail;