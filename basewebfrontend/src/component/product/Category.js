import React from 'react';
import { Container, Box, Button } from '@material-ui/core';
import MaterialTable from 'material-table';

function Category(props) {
    return (
        <Container>
            <MaterialTable

                title="Danh sách danh mục"
                columns={[
                    { title: 'Name', field: 'name' },
                    { title: 'Surname', field: 'surname' },
                    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
                    {
                        title: 'Birth Place',
                        field: 'birthCity',
                        lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
                    },
                ]}
                data={[
                    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
                    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
                ]}
                options={{
                    search: true,
                    cellStyle: {
                        maxWidth: 50,
                    },
                    headerStyle: {
                        maxWidth: 50,
                    },
                }}
            />
        </Container>
    );
}

export default Category;