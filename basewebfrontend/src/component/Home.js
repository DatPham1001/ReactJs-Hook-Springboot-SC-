import React, { useEffect, useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
import { authPost } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        height: window.innerHeight,
        backgroundImage:"url("+'https://www.muahangmyebay.com/wp-content/uploads/2017/12/mua-hang-sale-off-tai-my.png'+")",
        backgroundRepeat:"no-repeat",
        backgroundSize:"cover",
    },
    img: {
        backgroundSize: "cover",
    }
}));
export default function Home(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const classes = useStyles();

  return (
    <div className="container">
      <h2>Trang chủ</h2>
      <Card className={classes.root}>
          {/* <div className="text-center"> */}
            {/* <img 
            className={classes.img}
            src="" /> */}
          {/* </div> */}
      </Card>
    </div>
  );
}
