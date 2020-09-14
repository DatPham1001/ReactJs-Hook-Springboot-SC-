import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { axiosGet } from '../../Api'
import "./Product.css";
import { makeStyles } from '@material-ui/core/styles';
import { currencyFormat, numberDecimalFormat } from "utils/NumberFormat";
import MaterialTable from "material-table";
import { Button, Box } from "@material-ui/core";


// const useStyles = makeStyles({
//     table: {
//         minWidth: 650,
//     },
// });
function Product() {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();

    const [productNameInput, setProductNameInput] = useState("");
    // async function getProductList() {
    //     let productList = axiosGet(dispatch, token, '/product?name=' + productNameInput + '&page=0&limit=').then(res => {
    //         // setProductList(res.data);
    //         // setProductContent(res.data.content);
    //     }).catch(e => console.log("Error in getProductList", e))
    //     // setProductList(productList);
    // }
    // useEffect(() => {
    //     getProductList();
    // }, []);
    function getProductDetail(e) {
        history.push("/products/detail/" + e);
    }
    return (
        <div className="container">
            <div className="table-container">
                <Box display='flex' justifyContent='flex-end'>
                    <Button
                        className="product-btn"
                        variant="contained"
                        color="primary"
                        onClick={() => history.push("/products/create")}>
                        Thêm mới
                </Button>
                    <Button
                        className="product-btn"
                        variant="contained"
                        color="primary"
                        onClick={() => history.push("/category/")}>
                        Quản lý danh mục
                </Button>
                </Box>
                <MaterialTable
                    title="Danh sách sản phẩm"

                    columns={[
                        // {
                        //     title: 'STT', field: "stt", width: '6%',
                        //     headerStyle: {
                        //         textAlign: 'center',
                        //         paddingLeft: 40,
                        //     },
                        //     cellStyle: {
                        //         textAlign: 'center'
                        //     },
                        // },
                        {
                            title: 'Mã sản phẩm', field: 'productCode',
                            width: '17%', 
                            headerStyle: {
                                paddingLeft: 20,
                            },
                            cellStyle: {
                                paddingLeft:22,
                            },
                        },
                        {
                            title: 'Ảnh sản phẩm',
                            field: 'linkImg',
                            width: '17%',
                            cellStyle: {
                                paddingLeft: 30,
                            },
                            render: rowData => (
                                <img
                                    style={{ height: 70, borderRadius: '10px' }}
                                    src={rowData.linkImg}
                                />
                            ),
                        },
                        {
                            title: 'Tên sản phẩm', field: 'productName',
                            width: '18%',
                        },
                        {
                            title: 'Loại', field: 'categoryName',
                            // width: '10%',
                        },
                        {
                            title: 'Đơn vị', field: 'uom',
                            width: '10%',
                        },
                        {
                            title: 'Giá nhập', field: 'price',
                            // width: '12%',
                        },
                        {
                            title: 'Tồn kho', field: 'warehouseQuantity',
                            // width: '15%'
                        },

                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: "Không bản ghi để hiển thị.",
                        },
                        toolbar: {
                            searchPlaceholder: "Tìm kiếm",
                            searchTooltip: "Tìm kiếm",
                        },
                        pagination: {
                            hover: "pointer",
                            labelRowsSelect: "hàng",
                            labelDisplayedRows: "{from}-{to} của {count}",
                            nextTooltip: "Trang tiếp",
                            lastTooltip: "Trang cuối",
                            firstTooltip: "Trang đầu",
                            previousTooltip: "Trang trước",
                        },
                    }}
                    data={query =>
                        new Promise((resolve, reject) => {
                            axiosGet(dispatch,
                                token,
                                '/product?name=' +
                                query.search +
                                '&page=' + query.page +
                                '&limit=' + query.pageSize)
                                .then(result => {
                                    console.log(result.data.content)
                                    let data = result.data.content;
                                    //format price
                                    let datas = data.map((item, index) => {
                                        let tmp = Object.assign({}, item,
                                            { price: currencyFormat(item.price) },
                                            { stt: ((result.data.number) * result.data.size + index + 1) },
                                            { warehouseQuantity: numberDecimalFormat(item.warehouseQuantity) },
                                        );
                                        return tmp;
                                    })
                                    resolve({
                                        data: datas,
                                        page: result.data.number,
                                        totalCount: result.data.totalElements,
                                    })
                                })
                        })
                    }

                    onRowClick={((e, rowData) => history.push("/products/detail/" + rowData.productId))}
                    options={{
                        debounceInterval: 500,
                        // selection: true,
                        headerStyle: { backgroundColor: '#a5c3f2' },
                        cellStyle: {},
                        rowStyle: {
                            textAlign: 'left',
                        },
                    }}
                />
            </div>
        </div>

    );
}

export default Product