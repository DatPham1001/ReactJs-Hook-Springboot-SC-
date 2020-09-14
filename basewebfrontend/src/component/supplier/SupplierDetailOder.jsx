
import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { axiosGet, authGet, axiosPut, axiosDelete } from 'Api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {currencyFormat, formatDate} from 'utils/NumberFormat';
import { Chip, Snackbar } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { tableIcons } from 'utils/IconUtil';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import Alert from '@material-ui/lab/Alert';
import Axios from 'axios';
import { API_URL } from 'config/Config';

function SupplierDetailOder(props) {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();

    const {supplierName, supplierId } = props;
    // console.log("id", supplierId)

    const tableRef = useRef(null);

    const [messageStatus, setMessageStatus] = useState(false);
    const [messageDelete, setMessageDelete] = useState(false);

    const [data, setData] = useState([]);
    
  //message success create supplier
  const [state, setState] = React.useState({
    openMes: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, openMes } = state;
  const handleCloseMes = () => {
    setState({ ...state, openMes: false });
    setMessageStatus(false);
    setMessageDelete(false);
  };

  const renderData = () => {
   
    let name = '';
    if(supplierId !== undefined && supplierId !== ''){
        name = "&search=" + supplierId;
    }
    authGet(dispatch,token, `/order/?pageSize=20&pageNumber=0${name}`//&search=${supplierName}
    ).then((res) => {
                    console.log(res);
                    if (res !== undefined && res !== null) {
                        let { content, number, size, totalElements } = res;
                        setData(content);
                    } 
                    },
                    (error) => {
                        console.log("error");
                    }
            );
}

    useEffect(()=>{
        tableRef.current.dataManager.changePageSize(20);
    }, [])
    useEffect(()=>{
        
        renderData();
    }, [messageStatus, messageDelete])

    let columns = [
        { title: "Mã đơn", field: "orderCode", width: '12%' },
        { title: "Nhà cung cấp", field: "supplierName",  width: '20%' },
        { title: "Số lượng", field: "quantity" },
        { title: "Tổng tiền", field: "totalPayment",
            render: rowData => (
                <span>{currencyFormat(rowData.totalPayment)} </span>
            )
         },
         { title: "Trạng thái", field: "status" , 
            render: rowData => {
                let name = '';
                let icon = '';
                let color = '';
                if(rowData.status === 'ORDER'){
                    name = 'Đã đặt hàng';
                    icon = <LocalShippingIcon  />;
                    color = '';
                }else if (rowData.status === 'STOCKED'){
                    name = 'Đã nhập kho';
                    icon = <OpenInBrowserIcon />;
                    color='secondary';
                }else if (rowData.status === 'PAID'){
                    name = 'Hoàn thành';
                    icon = <AttachMoneyIcon />;
                    color="primary" ;
                }
                return (<Chip 
                        label={rowData.status} 
                        variant="outlined" 
                        color={color} 
                        label={name}
                        icon={icon}
                        style={{width: 140}}
                    />)
            }
        },
        { title: "Ghi chú", field: "note" },
        { title: "Ngày hẹn", field: "expDeliveryDate" ,
         render: rowData => (
             <span>{formatDate(rowData.expDeliveryDate)} </span>
         )
        },
    ];

    


    return (
        <div className="my-3">
            <MaterialTable
                title="Danh sách đơn đặt hàng."
                columns={columns}
                tableRef={tableRef}
                data={data}

                onRowClick={(event, rowData) => {
                    // setSelectedRow(rowData.tableData.id);
                    console.log(rowData.supplierId);
                    history.push(`/orders/detail/${rowData.orderId}`);
                }}
                
                
                onSearchChange={(value)=>{
                    console.log("value",value)
                }}

                localization={{
                    body: {
                        emptyDataSourceMessage: "Không bản ghi để hiển thị.",
                    },
                    toolbar: {
                        searchPlaceholder: "Tìm kiếm",
                        searchTooltip: "Tìm kiếm",
                        nRowsSelected: "{0} đơn đặt hàng được chọn"
                    },
                    pagination: {
                        labelRowsSelect: "hàng",
                        labelDisplayedRows: "{from}-{to} của {count}",
                        nextTooltip: "Trang tiếp",
                        lastTooltip: "Trang cuối",
                        firstTooltip: "Trang đầu",
                        previousTooltip: "Trang sau",
                    },
                    // header:{
                    //     actions: null
                    // }
                }}
            />
            {messageStatus && <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openMes}
                onClose={handleCloseMes}
                key={vertical + horizontal}
            >
                <Alert onClose={handleCloseMes} severity="success">
                    Cập nhật trạng thái của các đơn hàng thành công!
                </Alert>
            </Snackbar>}
            {messageDelete && <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openMes}
                onClose={handleCloseMes}
                key={vertical + horizontal}
            >
                <Alert onClose={handleCloseMes} severity="success">
                    Xóa các đơn hàng thành công!
                </Alert>
            </Snackbar>}
        </div>
    );
}

export default SupplierDetailOder;