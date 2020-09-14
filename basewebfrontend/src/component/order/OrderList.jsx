import React, { useState, useEffect, useRef } from "react";
import MaterialTable from "material-table";
import { axiosGet, authGet } from "Api";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { currencyFormat, formatDate } from "utils/NumberFormat";
import { Chip } from "@material-ui/core";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";

function OrderList(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const tableRef = useRef(null);

  useEffect(() => {
    tableRef.current.dataManager.changePageSize(20);
  }, []);

  let columns = [
    {
      title: "Mã đơn",
      field: "orderCode",
      width: "12%",
      cellStyle: { maxWidth: 30, overflowWrap: "break-word" },
      headerStyle: { maxWidth: 30, overflowWrap: "break-word" },
    },
    {
      title: "Nhà cung cấp",
      field: "supplierName",
      width: "20%",
      headerStyle: { textAlign: "center" },
      cellStyle: { textAlign: "center" },
    },
    {
      title: "Số lượng",
      field: "quantity",
      headerStyle: { textAlign: "right" },
      cellStyle: { textAlign: "right" },
    },
    {
      title: "Tổng tiền",
      field: "totalPayment",
      headerStyle: { textAlign: "right" },
      cellStyle: { textAlign: "right" },
      render: (rowData) => <span>{currencyFormat(rowData.totalPayment)} </span>,
    },
    {
      title: "Trạng thái",
      field: "status",
      headerStyle: { textAlign: "center" },
      render: (rowData) => {
        let name = "";
        let icon = "";
        let color = "";
        if (rowData.status === "ORDER") {
          name = "Đã đặt hàng";
          icon = <LocalShippingIcon />;
          color = "";
        } else if (rowData.status === "STOCKED") {
          name = "Đã nhập kho";
          icon = <OpenInBrowserIcon />;
          color = "secondary";
        } else if (rowData.status === "PAID") {
          name = "Hoàn thành";
          icon = <AttachMoneyIcon />;
          color = "primary";
        }
        return (
          <Chip
            label={rowData.status}
            variant="outlined"
            color={color}
            label={name}
            icon={icon}
            style={{ width: 140 }}
          />
        );
      },
    },
    // { title: "Ghi chú", field: "note" },
    {
      title: "Ngày hẹn",
      field: "expDeliveryDate",
      render: (rowData) => <span>{formatDate(rowData.expDeliveryDate)} </span>,
    },
  ];

  return (
    <div className="my-3">
      <MaterialTable
        title="Danh sách đơn đặt hàng."
        columns={columns}
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject) => {
            console.log(query);
            let sortParam = "";
            if (query.orderBy !== undefined) {
              sortParam =
                "&sort=" + query.orderBy.field + "," + query.orderDirection;
            }
            let filterParam = "";
            // if(query.search !== null || query.search !== '' || query.search !== undefined){
            //     filterParam = "&search=" + query.search;
            //     console.log("filterParam",filterParam)
            // }
            if (query.search !== null) {
              filterParam = "&search=" + query.search;
              console.log("filterParam", filterParam);
            }
            // console.log("filterParam", query.pageSize);

            axiosGet(
              dispatch,
              token,
              `/order?pageSize=20&pageNumber=${query.page}${filterParam}`
            )
              .then((res) => {
                if (res.data !== undefined && res.data !== null) {
                  let { content, number, size, totalElements } = res.data;
                  console.log("content", content, query.page);
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
              })
              .catch((err) => {
                reject({
                  message: "Không tải được dữ liệu. Thử lại ",
                  errorCause: "query",
                });
              });

            // authGet(dispatch,token, "/order?"+
            //         "pageSize=20"+ //+(query.pageSize)
            //         "&pageNumber="+(query.page)+
            //         filterParam
            // ).then((res) => {
            //                 console.log(res);
            //                 if (res !== undefined && res !== null) {
            //                     let { content, number, size, totalElements } = res;
            //                     resolve({
            //                         data: content,
            //                         page: number,
            //                         totalCount: totalElements,
            //                     });
            //                 } else {
            //                     reject({
            //                         message: "Không tải được dữ liệu. Thử lại ",
            //                         errorCause: "query",
            //                     });
            //                 }
            //                 },
            //                 (error) => {
            //                     console.log("error");

            //                     reject();
            //                 }
            //         );
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
            previousTooltip: "Trang sau",
          },
        }}
        options={{
          search: true,
          sorting: false,
          debounceInterval: 500,
          headerStyle: {
            backgroundColor: "#a5c3f2",
            fontWeight: "bold",
            paddingLeft: 16,
            textAlign: "left",
          },
          cellStyle: {
            paddingLeft: 16,
            textAlign: "left",
          },
          // filtering: false,
          //   rowStyle: (rowData) => ({
          //     backgroundColor:
          //       selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
          //   }),
        }}
      />
    </div>
  );
}

export default OrderList;
