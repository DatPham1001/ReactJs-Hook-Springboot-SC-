import React, { useEffect } from "react";
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
  Box,Tooltip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useSelector, useDispatch } from "react-redux";
import { axiosGet } from "Api";
import { useHistory } from "react-router";
import AddShoppingCartTwoToneIcon from "@material-ui/icons/AddShoppingCartTwoTone";
import { useState } from "react";
import OrderCreateProductsDetail from "./OrderCreateProductsDetail";
import { currencyFormat, numberDecimalFormat} from 'utils/NumberFormat'
// import Tooltip from '@atlaskit/tooltip';

OrderCreateProducts.propTypes = {};
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

const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
    //   backgroundColor: color,
        backgroundImage: "url("+'https://s3.amazonaws.com/iconbros/icons/icon_pngs/000/000/220/original/search.png?1510300432'+")",
        backgroundSize:"cover",
        borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 15,
      width: 15,
    },
});

function OrderCreateProducts(props) {
  const classes = useStyles();
  const { control, handleSubmit, watch } = useForm();
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [listProduct, setListProduct] = useState([]);
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [next, setNext] = useState(false);
  const [pre, setPre] = useState(false);

  const [search, setSearch] = useState("");
  const [searchSupplier, setSearchSupplier] = useState({value:"1", label: "Tìm kiếm"});

  const [showWarning, setShowWarning] = useState(true);

  const [showColor, setShowColor] = useState('');
  const [timeoutSearch, setTimeoutSearch] = useState();


  useEffect(() => {
    if (search !== "") {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    const getSearch = async () => {
      await sleep(500);

      axiosGet(
        dispatch,
        token,
        `/product?page=${page - 1}&limit=${limit}&name=${search}`
      ).then((resp) => {
        
        let content = resp.data.content;
        let data = content.map((item) => {
            // console.log("product",item);

          let value = item.productId;
          let label = `${item.productCode} - ${item.productName}`;

          let img = item.linkImg;
          let price = item.price;
          let quantity = item.warehouseQuantity;
          return { value, label, img, price, quantity };
        });
        // console.log(data);
        let elements = resp.data.numberOfElements;
        if (elements < limit) {
          let number = limit - elements;
          for (let i = 0; i < number; i++) {
            data.push({ value: "", label: ".", isDisabled: true });
          }
        }

        setListProduct(data);
        console.log(resp.data.numberOfElements);

        if (page >= resp.data.totalPages) {
          setNext(true);
        } else {
          setNext(false);
        }
        if (page <= 1) {
          setPre(true);
        } else {
          setPre(false);
        }
      });
    };
    getSearch();
  }, [page, search]);

  const onSubmit = (data) => {
    console.log(data);
  };

  const handlePre = () => {
    setPage(page - 1);
  };
  const handleNext = () => {
    setPage(page + 1);
  };

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

//   console.log(products);
  const MenuList = (props) => {
    //   console.log("children",props.children);
    //   props.children.map(item => {
    //       console.log("item",item.props.data);
    //   })
    // setShowColor(props.children[0].props.data.value);
    return (
      <components.MenuList {...props} o>

          
        {props.children.length > 0 ? <div className="">
            
            <div>
                {props.children.map((item, index)=> (
                     <div  > 
                        <div key={index} style={{display: 'flex'}}>
                            {item.props.data.label !== '.' ? <img src={item.props.data.img} alt="" height={36} width={36} /> : ""}
                            <div style={{width: 500}} onMouseOver={()=>{
                                // console.log(item.props.data.value);
                                // setShowColor(item.props.data.value);
                            }} >{item}</div>
                            {item.props.data.label !== '.' ? <div className="float-right" style={{backgroundColor:'#deebff', paddingRight: 5, height: 42, width: 200, borderStyle: 'ridge', paddingBottom:5}}>
                                <div >giá: <b>{currencyFormat(item.props.data.price)}</b> </div>
                                <div style={{marginTop: 0}}>số lượng: <b>{numberDecimalFormat(item.props.data.quantity)}</b></div>
                            </div> : ''}
                        </div>
                        <hr class="light" style={{margin:0}}></hr>
                    </div>
                ))}
            </div>
            
        </div> : <div className="text-center">Không tìm thấy sản phẩm nào</div>}
        
        

        <div className="float-right my-1 mx-1">
          <Button
            color={"primary"}
            variant="outlined"
            onClick={handlePre}
            disabled={pre}
          >
            <ChevronLeftIcon />
          </Button>{" "}
          <Button
            color={"primary"}
            variant="outlined"
            onClick={handleNext}
            disabled={next}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </components.MenuList>
    );
  };

  const handleClear = (productId) => {
    // console.log("id",productId);
    let tmpProducts = products;
    
    let arr = tmpProducts.filter((item) => item.productId !== productId);
    // console.log("arr ",arr)
    setProducts(arr);
  };

  return (
    <Card className={classes.formControl}>
      {/* <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <AddShoppingCartTwoToneIcon />
          </Avatar>
        }
        style={{fontWeight: 'bold',}}
        // title="Sản phẩm"
      /> */}
      
        <Typography variant="h5" component="h6" align="left" style={{display:'flex'}}>
            <Avatar aria-label="recipe" className={classes.avatar} style={{margin: 10}}>
                <AddShoppingCartTwoToneIcon />
            </Avatar>
            <div style={{margin: 10, marginLeft:0, paddingTop:4}}>Sản phẩm</div>
            
        </Typography> 

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row " style={{ paddingTop: "0" }}>
            <div className="col-6 ">
              <Typography variant="h6" component="h6" align="left">
                Chọn các sản phẩm
              </Typography>
            </div>
          </div>

          <Controller
            name="iceCreamType"
            as={<Select
                noOptionsMessage={() => 'Không tìm thấy sản phẩm cần tìm'} 
                styles={{
                    singleValue: (styles) => ({ ...styles, ...dot()})
                }}
            />}
            options={listProduct}
            components={{ MenuList }}
            control={control}
            className={classes.selectProduct}
            defaultValue=""
            value={searchSupplier}

            // closeMenuOnSelect={false}
            valueName="abc"
            placeholder="Tìm kiếm"
            
            onInputChange={(event) => {
                if(timeoutSearch !== undefined){
                    clearTimeout(timeoutSearch);
                }
                let time = setTimeout(()=>{
                    setSearch(event);
                }, 500);
                setTimeoutSearch(time);
            }}
            onChange={(value) => {
              let id = value[0].value;
              let check = false;

              let tmpProduct = products.map((item, index) => {
                if (item.productId === id) {
                  check = true;
                  return Object.assign(
                    {},
                    item,
                    { quantity: 1 },
                    { total: item.price * 1 }
                  );
                }
                return item;
              });

              if (check) {
                setProducts(tmpProduct);
              } else {
                axiosGet(dispatch, token, `/product/${id}`).then((resp) => {
                  // console.log(resp.data);
                  let product = Object.assign(
                    {},
                    resp.data,
                    { productId: resp.data.id },
                    { quantity: 1 },
                    { unit: "Chiếc" },
                    { total: resp.data.price }
                  );
                    setShowWarning(false);
                  setProducts([...products, product]);
                  console.log([...products, product]);
                });
              }
            }}
            
          />
          {/* {showWarning && (<div style={{color:'red'}}>{props.warningProducts} </div>)} */}
          <br />
          <div style={{ fontSize: 13 }}>
            <OrderCreateProductsDetail
              products={products}
              handleClear={handleClear}
              handleListProduct={props.handleListProduct}
              handleDiscount={props.handleDiscount}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default OrderCreateProducts;
