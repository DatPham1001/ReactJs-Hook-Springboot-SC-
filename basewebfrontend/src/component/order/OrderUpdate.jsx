
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import MaterialTable from 'material-table';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Card, CardContent, Typography, Avatar, 
    Checkbox, Button, CardActions, CircularProgress, 
    TextField, Stepper, Step, StepLabel, Accordion, 
    AccordionSummary, FormControlLabel, AccordionDetails, 
    FormControl, InputLabel, Select } from '@material-ui/core';
import {makeStyles, withStyles} from "@material-ui/core/styles";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
import { axiosGet } from 'Api';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OrderCreateSupplier from './OrderCreateSupplier';
import OrderUpdateProducts from './OrderUpdateProducts';
import StepConnector from '@material-ui/core/StepConnector';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import clsx from 'clsx';
import { Label } from 'reactstrap';

import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import SaveIcon from '@material-ui/icons/Save';
import OrderDetailSupplier from './OrderDetailSupplier';

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
      }
}))

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

function OrderUpdate(props) {
    const orderId = useParams().id;

    const [orderDetail, setOrderDetail] = useState();

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

    const [paymentWay, setPaymentWay] = useState('1');
    const listPaymentWay = [
        {value: '1', name: 'Tiền mặt'},
        {value: '2', name: 'Chuyển khoản'},
        {value: '3', name: 'COD'},
    ]

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(()=>{
        axiosGet(dispatch, token, `/order/${orderId}`).then(resp => {
            setOrderDetail(resp.data);
            console.log(resp.data);
            let {data} = resp;
            setOrderCode(data.orderCode);
            setExpDeliveryDate(data.expDeliveryDate);
            setNote(data.note);
        })
    }, [])

    const handleCancel = () => {
        //alert('Hủy');
      }

    const onSubmit = data =>{
        console.log(data);
    }

    const supplier = (id)=> {
        // console.log(id);
        setSupplierId(id);
    }

    const handleSubmitAll = ()=>{
        let date = ''
        if(expDeliveryDate !== ''){
            date = `${expDeliveryDate.slice(-2)}/${expDeliveryDate.slice(5,7)}/${expDeliveryDate.slice(0,4)}`;
        }

        let data = {
            orderCode,
            expDeliveryDate: date,
            note,
            supplierId: supplierId,
        };
        console.log(data);
    }

    return orderDetail === undefined ? "" : (
        <div>
            <MuiPickersUtilsProvider  utils={DateFnsUtils} >
                <Typography variant="h5" component="h2" className="my-3">
                    Cập nhật đơn nhập hàng
                </Typography>
                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} className={classes.stepper}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className="row">
                    <div className="col-9">
                        <OrderDetailSupplier
                            id={orderDetail.supplier.supplierId}
                        />
                        <OrderUpdateProducts 
                            oldProducts={orderDetail.orderItems}
                            quantity={orderDetail.quantity}
                            totalPayment={orderDetail.totalPayment}
                        />

                        <div className="mx-2 my-2">
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-label="Expand"
                                    aria-controls="additional-actions1-content"
                                    id="additional-actions1-header"
                                >
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    checked={checkedWareHouse}
                                    // disabled={!checked}
                                    onChange={(event) => {
                                        // console.log(event.target.checked);
                                        setCheckedWareHouse(event.target.checked);
                                        if(event.target.checked){
                                            setActiveStep(1);
                                        }else{
                                            setActiveStep(0);
                                        }
                                    }}
                                    onFocus={(event) => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="Nhập kho"
                                />
                                </AccordionSummary>
                                <AccordionDetails>
                                <Typography color="textSecondary">

                                        <Typography variant="body1" gutterBottom>
                                            Nhập vào kho
                                        </Typography>
                                        

                                </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <div className="mx-2">
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-label="Expand"
                                    aria-controls="additional-actions1-content"
                                    id="additional-actions1-header"
                                >
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    checked={checked}
                                    disabled={!checkedWareHouse}
                                    onChange={(event) => {
                                        setChecked(event.target.checked);
                                        if(event.target.checked){
                                            setActiveStep(2);
                                        }else{
                                            setActiveStep(1);
                                        }
                                    }}
                                    onFocus={(event) => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="Thanh toán"
                                />
                                </AccordionSummary>
                                <AccordionDetails>
                                <Typography color="textSecondary">

                                        <Typography variant="body1" gutterBottom>
                                            <Label>Chọn hình thức thanh toán: </Label>
                                            <FormControl variant="outlined" className={classes.payment}>
                                                <InputLabel htmlFor="outlined-age-native-simple">Hình thức thanh toán</InputLabel>
                                                <Select
                                                    native
                                                    value={paymentWay}
                                                    onChange={(event) => {
                                                        console.log(event.target.value);
                                                        setPaymentWay(event.target.value)
                                                    }}
                                                    label="Hình thức thanh toán"
                                                    inputProps={{
                                                        name: 'age',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                    size="small"
                                                >
                                                    {listPaymentWay.map((item, index)=>{
                                                        return <option 
                                                                value={item.value}
                                                                key={index}
                                                                >
                                                                    {item.name}
                                                                </option>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Typography>
                                        
                                        <Typography variant="body1" gutterBottom>
                                            <Label >Số tiền thanh toán: <b>1,000,000 đ</b> </Label>
                                        </Typography>

                                </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        

                    </div>
                    <div className="col-3">
                        <Card className={classes.cardTT}>
                            <CardContent>
                            <Typography variant="h6" component="h6" align="left">
                                Thông tin đơn nhập hàng
                            </Typography>
                            <br/>
                            <div>
                            <TextField
                                label="Mã đơn hàng*"
                                id="outlined-size-small"
                                className={classes.textField}
                                fullWidth

                                value={orderCode}
                                onChange={(event)=> setOrderCode(event.target.value)}

                                // defaultValue="OD001"
                                placeholder="OD001"
                                variant="outlined"
                                size="small"
                                helperText="VD: OD001"
                                />
                               {" "} 
                            <TextField
                                id="date"
                                label="Ngày hẹn giao"
                                variant="outlined"
                                size="small"
                                fullWidth

                                value={expDeliveryDate}
                                onChange={(event)=> setExpDeliveryDate(event.target.value)}

                                type="date"
                                format="dd/MM/yyyy"
                                defaultValue="2020-08-29"
                                placeholder="Chọn ngày hẹn"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                id="outlined-multiline-static"
                                label="Ghi chú"
                                className={classes.textField}
                                fullWidth

                                value={note}
                                onChange={(event)=> setNote(event.target.value)}

                                multiline
                                rows={8}
                                placeholder="Ghi chú"
                                defaultValue=""
                                variant="outlined"
                                />
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                </div>

                <div className="float-right my-3 mx-4">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.buttonSubmit}
                        startIcon={<SaveIcon />}
                        onClick={handleSubmitAll}
                    >
                        Lưu lại
                    </Button>
                </div>
               
            </MuiPickersUtilsProvider>
        </div>
    );
}

export default OrderUpdate;