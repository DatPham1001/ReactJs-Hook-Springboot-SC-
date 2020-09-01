import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authGet } from "../../Api";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

export default function SupplierList() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const columns = [
    { title: "STT", field: "stt" },
    { title: "Tên nhà cung cấp", field: "supplierName", filtering: false },
    { title: "Số điện thoại", field: "phoneNumber" },
    { title: "Email", field: "email" },
    { title: "Địa chỉ", field: "address" },
  ];

    const tableRef = useRef(null);

    useEffect(()=>{
        tableRef.current.dataManager.changePageSize(20);
    }, [])

  const [supplierList, setSupplierList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  async function getSupplierList() {
    let supplierList = await authGet(
      dispatch,
      token,
      "/supplier?page=1&limit=3"
    );
    console.log(supplierList.content);
    setSupplierList(supplierList.content);
  }

  useEffect(() => {
    getSupplierList().then((r) => r);
  }, []);

  return (
    <div>
      <h2>Danh sách nhà cung cấp </h2>

      <Grid container spacing={3}>
        <Grid item xs={8} />
        <Grid
          item
          xs={4}
          style={{ verticalAlign: "text-bottom", textAlign: "right" }}
        >
          <Button
            color={"primary"}
            variant={"contained"}
            onClick={() => history.push("/supplier/create")}
          >
            Thêm mới
          </Button>
        </Grid>
      </Grid>

      <MaterialTable
        title={"Danh sách nhà cung cấp"}
        columns={columns}
        tableRef={tableRef}

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
        data={(query) =>
          new Promise((resolve, reject) => {
            console.log(query);
            let sortParam = "";
            if (query.orderBy !== undefined) {
              sortParam =
                "&sort=" + query.orderBy.field + "," + query.orderDirection;
            }
            let filterParam = "";
            filterParam = "&search=" + query.search;
            authGet(
              dispatch,
              token,
              "/supplier" +
                "?page=" +
                (query.page + 1) +
                "&limit=" +
                query.pageSize +
                filterParam
            ).then(
              (res) => {
                console.log(res);
                if (res !== undefined && res !== null) {
                  let { content, number, size, totalElements } = res;
                  let data = content.map((item, index) => {
                    let tmp = Object.assign({}, item, {
                      stt: number * size + index + 1,
                    });
                    return tmp;
                  });
                  resolve({
                    data: data,
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
          setSelectedRow(rowData.tableData.id);
          console.log(rowData.supplierId);
          history.push(`/supplier/detail/${rowData.supplierId}`);
        }}
        options={{
          search: true,
          // filtering: true,
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
          }),
        }}
      />
    </div>
  );
}
