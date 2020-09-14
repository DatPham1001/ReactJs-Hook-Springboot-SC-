import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { Pagination } from 'reactstrap';
import { Button, InputAdornment, OutlinedInput, TextField, MenuItem, Card, NativeSelect } from '@material-ui/core';
import { useEffect } from 'react';
import { makeStyles,withStyles  } from '@material-ui/core/styles';
import clsx from 'clsx';
import NumberFormat from 'react-number-format';
import {currencyFormat} from 'utils/NumberFormat';
import InputBase from '@material-ui/core/InputBase';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

OrderCreateProductsDetail.propTypes = {
    products: PropTypes.array,
};
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: 0,
      marginLeft: 5,
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: 96,
      fontSize:12,
    },
    cardDiscount:{
        zIndex:100,
    }
  }));
  const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);

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

function OrderCreateProductsDetail(props) {
    const classes = useStyles();
    const {products} = props;
    console.log("sp la", products);
    // const [products, setProducts] = useState(props.products);
    const [newProducts, setNewProducts] = useState([]);
    

    const [price, setPrice] = useState(100);
    const [unit, setUnit] = useState([{value:'c01',label:'Chiếc'}]);
    const [discountProduct, setDiscountProduct] = useState(false);

    const [priceProduct, setPriceProduct] = useState(0);
    const [quantityProduct, setQuantityProduct] = useState(1);

    //discount
    const [uomDiscount, setUomDiscount] = useState("1"); //1: d, 2: %
    const [discount, setDiscount] = useState("0");

    const tableRef = useRef(null);
    useEffect(()=>{
        console.log(products);
        let row = products.length;
        if(row <=5){
            row=5;
        }
        tableRef.current.dataManager.changePageSize(row);
        
        if(products.length > 0 && products.length > newProducts.length){
            let tmpArray = newProducts.map((item, index) => item);
            tmpArray.push(products[products.length-1]);
            console.log(tmpArray);
            
            setNewProducts(tmpArray);
        }

        
        
    }, [products]);
    // console.log(newProducts);
    props.handleListProduct(newProducts);

    const columns = [
        {title: "Mã SKU", field: "code", width: "10%", readonly: true, cellStyle: {textAlign: 'center'}},
        {title: "Tên sản phẩm", field: "name", width: '25%', cellStyle: {textAlign: 'center'}},
        {title: "Giá nhập", field: "price", width: '15%',headerStyle: { textAlign: 'right' },
            render: rowData =>
                    (<CurrencyTextField
                        variant="outlined"
                        className={clsx(classes.margin, classes.textField)}
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        currencySymbol={null}
                        decimalPlaces={0}
                        size="small"
                        minimumValue="0"

                        inputProps={{style: {fontSize:13}}}
                        
                        // defaultValue={rowData.quantity}
                        value={rowData.price}
                        onChange={((event, value)=>{
                            let tmpArr = newProducts.map((item, index)=>{
                                if(item.productId === rowData.productId){
                                    return Object.assign({}, rowData, {price: value});
                                }
                                return item;
                            })
                            // console.log(tmpArr);
                            setNewProducts(tmpArr);
                        })}
                        onBlur={(e,v)=>{
                            let tmp = v;
                            if(tmp === '' || tmp === undefined){
                                let tmpArr = newProducts.map((item, index)=>{
                                    if(item.productId === rowData.productId){
                                        return Object.assign({}, rowData, {price: "0"});
                                    }
                                    return item;
                                })
                                // console.log(tmpArr);
                                setNewProducts(tmpArr);
                            }
                        }}
                        />)
        },
        {title: "Số lượng", field: "quantity", width: '15%',headerStyle: { textAlign: 'right' },
                render: rowData =>
                    (<CurrencyTextField
                        variant="outlined"
                        className={clsx(classes.margin, classes.textField)}
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        currencySymbol=""
                        decimalPlaces={0}
                        size="small"
                        autoFocus={true}
                        minimumValue="0"

                        inputProps={{style: {fontSize:13}}}
                        
                        // defaultValue={rowData.quantity}
                        value={rowData.quantity}
                        onChange={((event, value)=>{
                            console.log(value, 'row', rowData);
                            let tmpArr = newProducts.map((item, index)=>{
                                if(item.productId === rowData.productId){
                                    return Object.assign({}, rowData, {quantity: value});
                                }
                                return item;
                            })
                            // console.log(tmpArr);
                            setNewProducts(tmpArr);
                        })}
                        onBlur={(e,v)=>{
                            let tmp = v;
                            // console.log("soluong",tmp);
                            // console.log("soluong type",typeof tmp);
                            // console.log("bool",tmp === '', tmp === undefined, tmp === null);
                            if(tmp === '' || tmp === undefined || tmp === null){
                                let tmpArr = newProducts.map((item, index)=>{
                                    if(item.productId === rowData.productId){
                                        return Object.assign({}, rowData, {quantity: "1"});
                                    }
                                    return item;
                                })
                                // console.log("arr",tmpArr);
                                setNewProducts(tmpArr);
                            }
                        }}
                    />)
        },
        {title: "Đơn vị", field: "uom", width: '15%',headerStyle: { textAlign: 'right' },type: 'numeric',
            render: rowData => (<span>{rowData.uom} </span>)
        },
        {title: "Thành tiền", field: "total", width: '20%',headerStyle: { textAlign: 'right' } , type: 'numeric',
            render: rowData => (<span>
                {currencyFormat(rowData.price*rowData.quantity)}
            </span>)
        }, //headerStyle: { textAlign: 'right' }
    ];

    const handleDiscount = (e)=>{
        setDiscount(e.target.value);
    }

    const showTotalQuantity = ()=>{
        let totalQuantity = 0;
        if(newProducts.length > 0){
            newProducts.map((item, index)=>{
                if(item.quantity !== ''){
                    totalQuantity  = totalQuantity + parseInt(item.quantity) ;
                }
                
                // return item;
            })
        }
        return totalQuantity;
    }

    const showTotalPayment = () => {
        let totalPayment = 0;
        if(newProducts.length > 0){
            newProducts.map((item, index)=>{
                if(item.quantity !== '' && item.price !== ''){
                    totalPayment += parseInt(item.quantity) * parseInt(item.price);
                }
                
            })
        }
        return (totalPayment);
    }
    
    const showEndPayment = () => {
        //1: dd, 2: %

        
        // let arr = discount.split(",");
        // let tmp='';
        // arr.map(item => {
        //     tmp = tmp + item;
        // })
        // console.log("tmp", tmp)
        let tmpDiscount = parseInt(discount);

        let total = showTotalPayment();

        if(uomDiscount === "1"){
            if(tmpDiscount < 0){
                setDiscount("0");
            }else if (tmpDiscount > total ){
                setDiscount(`${total}`);
            }
            props.handleDiscount(tmpDiscount);
            return (total - tmpDiscount);
        }else {
            if(tmpDiscount > 100){
                setDiscount("100");
            }else if(tmpDiscount < 0){
                setDiscount("0");
            }
            props.handleDiscount(((total/100 )* tmpDiscount));
            return (total - ((total/100 )* tmpDiscount));
        }
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
                    headerStyle: { 
                        backgroundColor: '#a5c3f2',
                        paddingLeft:2,
                        paddingRight:0, 
                        textAlign: 'center',
                        fontWeight: 'bold',
                    },
                    cellStyle: {
                        paddingLeft:2,
                        paddingRight:0, 
                        // textAlign: 'center',
                    },
                    // rowStyle: {
                    //     textAlign: 'left',
                    // },
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
                                <div className="row" style={{marginTop:10}}>
                                    <div className="col-6">Số lượng</div>
                                    <div className="col-6 ">
                                        <div className="float-right mx-3">{
                                            showTotalQuantity()
                                        } </div>
                                     </div>
                                </div><br/>
                                <div className="row">
                                    <div className="col-6">Tổng tiền</div>
                                    <div className="col-6 ">
                                        <div className="float-right mx-3">{
                                            currencyFormat(showTotalPayment())
                                        } </div>
                                     </div>
                                </div><br/>
                                <div className="row">
                                    <div className="col-4">Chiết khấu</div>
                                    <div className="col-8 ">
                                        <div className="float-right mx-3"> 

                                            <NativeSelect
                                                id="demo-customized-select-native"
                                                value={uomDiscount}
                                                onChange={(e)=> {
                                                    setUomDiscount(e.target.value);
                                                }}
                                                input={<BootstrapInput />}
                                                inputProps={{style: {fontSize:12}}}
                                            >
                                                <option value="1">đ</option>
                                                <option value="2">%</option>
                                            </NativeSelect>

                                            {/* <TextField
                                                id="outlined-start-adornment"
                                                defaultValue="0"
                                                
                                                className={clsx(classes.margin, classes.textField)}
                                                name="numberformat"
                                                variant="outlined"
                                                size="small"
                                                value={discount}
                                                // onChange={handleDiscount}
                                                onBlur={(e)=>{
                                                    // console.log("value", e.target.value)
                                                    let tmp = e.target.value;
                                                    if(tmp === '' || tmp === undefined){
                                                        tmp = "0";
                                                    }
                                                    setDiscount(tmp);
                                                }}

                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            /> */}
                                            <CurrencyTextField
                                                variant="outlined"
                                                
                                                value={discount}
                                                outputFormat="string"
                                                decimalCharacter="."
                                                digitGroupSeparator=","
                                                currencySymbol=""
                                                decimalPlaces={0}
                                                size="small"
                                                // style={{width: 110, marginLeft: 5, height: 10}}

                                                inputProps={{style: {fontSize:13}}}     //text
                                                InputProps={{style: { width: 110, marginLeft: 5,}}} //label

                                                minimumValue="0"
                                                onBlur={(e,v)=>{
                                                    let tmp = v;
                                                    if(tmp === '' || tmp === undefined){
                                                        tmp = "0";
                                                    }
                                                    setDiscount(tmp);
                                                }}
                                            />
                                            
                                        </div>
                                     </div>
                                </div><br/>
                                <div className="row"  style={{marginBottom:10}}>
                                    <div className="col-6">Số tiền cần trả</div>
                                    <div className="col-6  ">
                                        <div className="float-right mx-3"><b>{
                                            currencyFormat(showEndPayment())
                                        }</b> </div>
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

export default OrderCreateProductsDetail;