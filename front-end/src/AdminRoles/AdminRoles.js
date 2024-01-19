import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import { Container, Row } from 'react-bootstrap';

function AdminRoles()
{

  return (
    <>
        <Container style={{ overflowY: 'auto' }}>
            <Row className='d-flex justify-content-center ml-auto mr-auto mt-4 mb-4'>
                <h2 style={{ textAlign: 'center' }}>List of All Roles</h2>
            </Row>
        </Container>
    </>
  );
};

export default AdminRoles;
