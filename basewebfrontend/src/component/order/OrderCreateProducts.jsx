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
  Box,
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

  useEffect(() => {
    axiosGet(dispatch, token, `/product?page=${page - 1}&limit=${limit}`).then(
      (resp) => {
        let content = resp.data.content;
        // console.log(content);
        let data = content.map((item) => {
          let value = item.productId;
          let label = item.productName;
          return { value, label };
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
        console.log(resp.data);

        if (page === resp.data.totalPages) {
          setNext(true);
        } else {
          setNext(false);
        }
        if (page <= 1) {
          setPre(true);
        } else {
          setPre(false);
        }
      }
    );
  }, []);

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
        console.log(resp.data);
        let content = resp.data.content;
        let data = content.map((item) => {
          let value = item.productId;
          let label = item.productName;
          return { value, label };
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

  console.log(products);
  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        <div className="">{props.children}</div>

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
    console.log(productId);
    let tmpProducts = products;

    let arr = tmpProducts.filter((item) => item.productId !== productId);
    setProducts(arr);
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row " style={{ paddingTop: "0" }}>
            <div className="col-6 ">
              <Typography variant="h6" component="h6" align="left">
                Chọn nhà các sản phẩm
              </Typography>
            </div>
          </div>

          <Controller
            name="iceCreamType"
            as={Select}
            options={listProduct}
            components={{ MenuList }}
            control={control}
            className={classes.selectProduct}
            defaultValue=""
            placeholder="Tìm kiếm"
            onInputChange={(event) => {
              setSearch(event);
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
                    { key: resp.data.productId },
                    { quantity: 1 },
                    { unit: "Chiếc" },
                    { total: resp.data.price }
                  );

                  setProducts([...products, product]);
                  console.log([...products, product]);
                });
              }
            }}
          />
          <br />
          <div style={{ fontSize: 12 }}>
            <OrderCreateProductsDetail
              products={products}
              handleClear={handleClear}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default OrderCreateProducts;
