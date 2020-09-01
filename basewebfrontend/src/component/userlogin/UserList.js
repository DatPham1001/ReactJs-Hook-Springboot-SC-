import MaterialTable from "material-table";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../Api";
import { tableIcons } from "../../utils/IconUtil";

export default function UserList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const columns = [
    { title: "Full Name", field: "fullName" },
    {
      title: "Status",
      field: "status",
      lookup: {
        PARTY_ENABLED: "PARTY_ENABLED",
        PARTY_DISABLED: "PARTY_DISABLED",
      },
    },
    { title: "Type", field: "partyType" },
    { title: "Created Date", field: "createdDate", type: "date" },
    {
      title: "User Name",
      field: "userLoginId",
      render: (rowData) => (
        <Link to={"/userlogin/" + rowData.partyId}>{rowData.userLoginId}</Link>
      ),
    },
    { title: "Party Code", field: "partyCode" },
  ];
  return (
    <MaterialTable
      title="List Users"
      columns={columns}
      options={{
        //filtering: true,
        search: true,
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
            "/users" +
              "?size=" +
              query.pageSize +
              "&page=" +
              query.page +
              sortParam +
              filterParam
          ).then(
            (res) => {
              console.log("res", res);
              if (res !== undefined && res !== null)
                resolve({
                  data: res.content,
                  page: res.number,
                  totalCount: res.totalElements,
                });
              else {
                reject({
                  message: "Không tải được dữ liệu. Thử lại ",
                  errorCause: "query",
                });
              }
            },
            (error) => {
              console.log("error", error);
              reject();
            }
          );
        })
      }
      icons={tableIcons}
    />
  );
}
