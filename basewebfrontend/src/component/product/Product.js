import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { axiosGet } from '../../Api'
import "./Product.css";
import { makeStyles } from '@material-ui/core/styles';
import { currencyFormat } from "utils/NumberFormat";
import MaterialTable from "material-table";


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
function Product() {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();

    const [productNameInput, setProductNameInput] = useState("");
    async function getProductList() {
        let productList = axiosGet(dispatch, token, '/product?name=' + productNameInput + '&page=0&limit=').then(res => {
            // setProductList(res.data);
            // setProductContent(res.data.content);
        }).catch(e => console.log("Error in getProductList", e))
        // setProductList(productList);
    }
    useEffect(() => {
        getProductList();
    }, []);
    // function handleDelete(e) {
    //     console.log(e);
    // }
    function getProductDetail(e) {
        history.push("/products/detail/" + e);
    }
    return (
        <div className="container">
            <div className="table-container">
                <div className="add-container">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => history.push("/products/create")}>
                        Thêm mới
                     </button>
                     <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => history.push("/category/")}>
                        Quản lý danh mục
                     </button>
                </div>
                <MaterialTable
                    title="Danh sách sản phẩm"
                    columns={[
                        {
                            title: 'STT', field: "stt", width: 30,
                            headerStyle: {
                                textAlign: 'center',
                                paddingLeft: 40,
                            },
                            cellStyle: {
                                textAlign: 'center'
                            },
                        },
                        {
                            title: 'Ảnh sản phẩm',
                            field: 'linkImg',
                            width: '15%',
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
                            width: '15%',
                        },
                        {
                            title: 'Mã sản phẩm', field: 'productCode',
                            width: '15%', textAlign: 'center',
                        },
                        {
                            title: 'Loại', field: 'categoryName',
                            width: '10%',
                        },
                        {
                            title: 'Giá nhập', field: 'price',
                            width: '12%',
                        },
                        { title: 'Tồn kho', field: 'warehouseQuantity', width: '12%' },
                        {
                            title: '', field: 'id', width: '12%',
                            headerStyle: { textAlign: 'right' },
                            cellStyle: { textAlign: 'right' }
                        }

                    ]}
                    data={query =>
                        new Promise((resolve, reject) => {
                            axiosGet(dispatch,
                                token,
                                '/product?name=' +
                                query.search +
                                '&page=' + query.page +
                                '&limit=' + query.pageSize)
                                .then(result => {
                                    let data = result.data.content;
                                    //format price
                                    let datas = data.map((item, index) => {
                                        let tmp = Object.assign({}, item,
                                            { price: currencyFormat(item.price) },
                                            { stt: ((result.data.number) * result.data.size + index + 1) });
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
                    onRowClick={((e, rowData) => getProductDetail(rowData.productId))}
                    options={{
                        // selection: true,
                        headerStyle: { backgroundColor: '#a5c3f2' },
                        cellStyle: {},
                        rowStyle: {
                            textAlign: 'left',
                        },
                    }}
                // onSelectionChange={(evt, rowData) => getProductDetail(rowData.productId)}
                // actions={[
                //     {
                //         tooltip: 'Remove All Selected Users',
                //         icon: 'delete',
                //         onClick: (evt, data) => alert('You want to delete ' +  + ' rows')
                //     }
                // ]}
                />
            </div>
        </div>

    );
}

export default Product
