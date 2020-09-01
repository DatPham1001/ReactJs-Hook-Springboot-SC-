import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { axiosGet, authGet } from 'Api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {currencyFormat, formatDate} from 'utils/NumberFormat';

function OrderList(props) {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();

    const tableRef = useRef(null);

    useEffect(()=>{
        tableRef.current.dataManager.changePageSize(20);
    }, [])

    let columns = [
        { title: "Mã đơn hàng", field: "orderCode" },
        { title: "Nhà cung cấp", field: "supplierName" },
        { title: "Số lượng", field: "quantity" },
        { title: "Tổng tiền", field: "totalPayment",
            render: rowData => (
                <span>{currencyFormat(rowData.totalPayment)} </span>
            )
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
                data={
                    (query) => new Promise((resolve, reject) => {
                        console.log(query);
                        let sortParam = "";
                        if (query.orderBy !== undefined) {
                        sortParam =
                            "&sort=" + query.orderBy.field + "," + query.orderDirection;
                        }
                        let filterParam = "";
                        if(query.search !== null || query.search !== ''){
                            filterParam = "&search=" + query.search;
                        }
                        
                        authGet(dispatch,token, "/order?"+
                                "pageSize="+(query.pageSize)+
                                "&pageNumber="+(query.page)+
                                filterParam
                        ).then((res) => {
                                        console.log(res);
                                        if (res !== undefined && res !== null) {
                                            let { content, number, size, totalElements } = res;
                                            resolve({
                                                data: content,
                                                page: number,
                                                totalCount: totalElements,
                                            });
                                        } else {
                                            reject({
                                                message: "Không tải được dữ liệu. Thử lại ",
                                                errorCause: "query",
                                            });
                                        }
                                        },
                                        (error) => {
                                            console.log("error");

                                            reject();
                                        }
                                );
                    })
                }

                onRowClick={(event, rowData) => {
                    // setSelectedRow(rowData.tableData.id);
                    console.log(rowData.supplierId);
                    history.push(`/orders/detail/${rowData.orderId}`);
                }}
                
                localization={{
                    body: {
                        emptyDataSourceMessage: "Không bản ghi để hiển thị.",
                    },
                    toolbar: {
                        searchPlaceholder: "Tìm kiếm",
                        searchTooltip: "Tìm kiếm",
                    },
                    pagination: {
                        labelRowsSelect: "hàng",
                        labelDisplayedRows: "{from}-{to} của {count}",
                        nextTooltip: "Trang tiếp",
                        lastTooltip: "Trang cuối",
                        firstTooltip: "Trang đầu",
                        previousTooltip: "Trang trước",
                    },
                }}
            />
        </div>
    );
}

export default OrderList;