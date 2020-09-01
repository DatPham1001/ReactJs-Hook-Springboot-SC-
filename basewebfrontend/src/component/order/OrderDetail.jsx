
import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import MaterialTable from 'material-table';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Card, CardContent, Typography, Avatar, 
    Checkbox, Button, CardActions, CircularProgress, 
    TextField, Stepper, Step, StepLabel, Accordion, 
    AccordionSummary, FormControlLabel, AccordionDetails, 
    FormControl, InputLabel, Select, IconButton, Tooltip } from '@material-ui/core';
import {makeStyles, withStyles} from "@material-ui/core/styles";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
import { axiosGet } from 'Api';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OrderDetailSupplier from './OrderDetailSupplier';
import OrderCreateProducts from './OrderCreateProducts';
import StepConnector from '@material-ui/core/StepConnector';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import clsx from 'clsx';
import { Label } from 'reactstrap';

import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import SaveIcon from '@material-ui/icons/Save';
import OrderDetailProducts from './OrderDetailProducts';
import { GiAutoRepair } from "react-icons/gi";
import { RiArrowGoBackFill } from "react-icons/ri";

import DeleteIcon from "@material-ui/icons/Delete";
import { FontIcon } from 'material-ui';


const useStyles = makeStyles(theme =>({
    root: {
        padding: theme.spacing(4),
        "& .MuiTextField-root": {
          margin: theme.spacing(1),
          minWidth: 700,
          maxWidth: 1000,
          height: 1000,
        }
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 700,
        maxWidth: 1200,
        height: 1000,
      },
      cardTT:{
        marginTop: theme.spacing(1),
      },
      textField: {
        marginTop: theme.spacing(2),
      },

      payment: {
        margin: theme.spacing(1),
        minWidth: 200,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },

      stepper: {
          marginLeft: 10,
      },

      buttonSubmit:{
          minWidth: 240,
      },

      IconButton: {
        float: "right", padding:10, margin: 10,
      }
}));

const ColorlibConnector = withStyles({
    alternativeLabel: {
      top: 22,
    },
    active: {
      '& $line': {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    completed: {
      '& $line': {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    line: {
      height: 3,
      border: 0,
      backgroundColor: '#eaeaf0',
      borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: '#ccc',
      zIndex: 1,
      color: '#fff',
      width: 50,
      height: 50,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
});

function getSteps() {
    return ['Đặt hàng', 'Nhập kho', 'Thanh toán'];
}

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;
  
    const icons = {
      1: <LocalShippingIcon />,
      2: <OpenInBrowserIcon />,
      3: <AttachMoneyIcon />,
    };
  
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {icons[String(props.icon)]}
      </div>
    );
}

function OrderDetail(props) {
    const orderId = useParams().id;

    const [detailOrder,setDetailOrder] = useState();

    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const history = useHistory();

    const classes = useStyles();

    const { control, handleSubmit } = useForm();

    const [isRequesting, setIsRequesting] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const [checked, setChecked] = useState(false);
    const [checkedWareHouse, setCheckedWareHouse] = useState(false);

    const [orderCode, setOrderCode] = useState('');
    const [expDeliveryDate, setExpDeliveryDate] = useState('');
    const [note, setNote] = useState('');
    const [supplierId, setSupplierId] = useState('');

    const [products, setProducts] = useState([]);


    useEffect(()=>{
        axiosGet(dispatch, token, `/order/${orderId}`).then(resp=>{
            setDetailOrder(resp.data);
        })
    }, [])

    console.log(detailOrder)
    return (
        <div>
        <MuiPickersUtilsProvider  utils={DateFnsUtils} >
            <Typography variant="h5" component="h2" className="mx-2 my-3">
                Đơn nhập hàng - Mã: {(detailOrder !== undefined) && detailOrder.orderCode} <br/>
                
                <Tooltip title="Trở lại" arrow={true} >
                    <IconButton
                        style={{float:'left', padding:10, margin: 10,}}
                        onClick={() => history.goBack()}
                        aria-label="Delete"
                        component="span"
                        tooltipPosition="top-center"
                    >
                        <RiArrowGoBackFill style={{fontSize:35}}  tooltip="Xoa" color="	#ff8080"></RiArrowGoBackFill>
                    </IconButton>
                </Tooltip>
                    
                <Tooltip title="Xóa" arrow={true} >
                    <IconButton
                        className={classes.IconButton}
                        onClick={() => "a"}
                        aria-label="Delete"
                        component="span"
                        tooltipPosition="top-center"
                    >
                        <DeleteIcon style={{fontSize:35}}  tooltip="Xoa" color="error"></DeleteIcon>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Sửa" arrow={true} >
                    <IconButton
                        tooltipPosition="top-center"
                        className={classes.IconButton}
                        onClick={() => history.push(`/orders/update/${orderId}`)}
                        aria-label="Update"
                        component="span"
                    >
                        <GiAutoRepair style={{fontSize:35}} fontSize="large" className="material-icons" color="blue" ></GiAutoRepair>
                    </IconButton>
                </Tooltip>
                    
            </Typography><br/><br/><br/>
            <div>
                
                
            </div>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} className={classes.stepper}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className="row">
                <div className="col-9">
                    {(detailOrder !== undefined) && <OrderDetailSupplier
                        id={detailOrder.supplier.supplierId}
                    />}
                    {(detailOrder !== undefined) && <OrderDetailProducts
                        products={detailOrder.orderItems}
                        quantity={detailOrder.quantity}
                        totalPayment={detailOrder.totalPayment}
                    />}

                </div>
                <div className="col-3">
                    <Card className={classes.cardTT}>
                        <CardContent>
                        <Typography variant="h6" component="h6" align="left">
                            Thông tin đơn nhập hàng
                        </Typography>
                        <br/>
                        <div>
                            <div className="row mx-1">
                                <b>Mã đơn hàng</b>: {(detailOrder !== undefined) && detailOrder.orderCode}
                            </div>
                            <br />
                            <div className="row mx-1">
                                <b>Ngày hẹn giao</b>: {(detailOrder !== undefined) && 
                                    `${detailOrder.expDeliveryDate.slice(-2)}/${detailOrder.expDeliveryDate.slice(5,7)}/${detailOrder.expDeliveryDate.slice(0,4)}`
                                }
                            </div>
                            <br />
                            <span className="row mx-1">
                                <b>Ghi chú : </b> {(detailOrder !== undefined) && detailOrder.note}
                            </span>
                            <br />
                        </div>
                        </CardContent>
                    </Card>
                </div>
                
            </div>
           
        </MuiPickersUtilsProvider>
    </div>
    );
}

export default OrderDetail;