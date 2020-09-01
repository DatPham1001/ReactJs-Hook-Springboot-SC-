import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { axiosGet } from "Api";

function SupplierDetailOder(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [orders, setOrders] = useState([]);

  let columns = [
    { title: "Mã đơn hàng", field: "orderId" },
    { title: "Số lượng", field: "quantity" },
    { title: "Tổng tiền", field: "totalPayment" },
    { title: "Ghi chú", field: "note" },
    { title: "Ngày hẹn", field: "expDeliveryDate" },
  ];

  useEffect(() => {
    axiosGet(dispatch, token, `/order/1`).then((resp) => {
      let data = [];
      data.push(resp.data);
      setOrders(data);
    });
  }, []);

  return (
    <div className="my-3">
      <MaterialTable
        title="Danh sách đơn đặt hàng."
        columns={columns}
        data={orders}
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
            nextTooltip: "Trang đầu",
            lastTooltip: "Trang cuối",
            firstTooltip: "Trang tiếp",
            previousTooltip: "Trang trước",
          },
        }}
      />
    </div>
  );
}

export default SupplierDetailOder;
