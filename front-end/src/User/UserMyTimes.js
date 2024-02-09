import React, {useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import EditUserTimesheetForm from './EditUserTimesheetForm';
import { HiEye  } from 'react-icons/hi';
import { BsPencil } from 'react-icons/bs';
//import { format } from 'date-fns';
//import XLSX from 'xlsx';
//import { json2csv } from 'json2csv';
//import 'react-html-table-to-excel';

function UserMyTimes() 
{
  const [userId, setUserId] = useState(null);

  const [timesheet, setTimesheet] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

  useEffect(() => 
  {
    const fetchUserData = async () => 
    {
      try 
      {
        await fetchUserId();
        setLoading(false);
      } 
      catch (error) 
      {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    fetchUserData();
  },[]);

  const fetchUserId = async () => 
  {
      try 
      {
        const response = await fetch('http://localhost:8081/login/user_home/userid',{method: 'GET',credentials: 'include'});
        if(response.ok) 
        {
          const data = await response.json();
          setUserId(data.userId);
        } 
        else 
        {
          throw new Error('Failed to fetch user ID');
        }
      } 
      catch(error) 
      {
        console.error('Error fetching user ID:', error);
      }
  };

  const fetchData = useCallback(async () => 
  {
    try 
    {
      const response = await fetch(`http://localhost:8081/user_home/all_timesheet_data/${userId}`, { method: 'GET', credentials: 'include' });
      const data = await response.json();
      if (Array.isArray(data)) 
      {
        setTimesheet(data);
      } 
      else 
      {
        console.error("Invalid data format:", data);
      }
    } 
    catch (error) 
    {
      console.error("Error fetching data:", error);
    } 
    finally 
    {
      setLoading(false);
    }
  },[userId]);

  useEffect(() => 
  {
    if(!userId) 
    {
      return;
    } 
    else 
    {
      fetchData();
    }
  },[userId, fetchData]);
  
  const ExportAllTimesheetData = async () =>
  {
    if(!userId || !timesheet) 
    {
      return;
    } 
    else 
    {
      try 
      {
        const formattedTimesheet = timesheet.map(entry => ({
          ...entry,
          //projects: JSON.parse(entry.projects)[0]
          projects: Array.isArray(entry.projects) ? entry.projects : [entry.projects]
        }));
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Timesheet Data');
        const headers = Object.keys(formattedTimesheet[0]);
        worksheet.addRow(headers);
        formattedTimesheet.forEach(entry => 
        {
          worksheet.addRow(Object.values(entry));
        });
        const blob = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `user_${userId}_timesheet_data.xlsx`);
      } 
      catch (error) 
      {
        console.error('Error exporting timesheet data:', error);
      }
    }
};

const formatDateWithoutTime = (dateString) => 
{
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};

const [selectedRecord, setSelectedRecord] = useState(null);
const [showModal, setShowModal] = useState(false);

const handleViewClick = (record) => 
{
  setSelectedRecord(record);
  setShowModal(true);
};

const handleCloseModal = () => 
{
  setSelectedRecord(null);
  setShowModal(false);
};

const [editData, setEditData] = useState(null);
//const [editData, setEditData] = useState({ record: null, id: null });
const [showEditModal, setShowEditModal] = useState(false);

const handleEditClick = (record) => 
{
  //setEditData(record);
  setEditData({ record, id: record.id });
  setShowEditModal(true);
};

const handleCloseEditModal = () => 
{
  setEditData(null);
  setShowEditModal(false);
};

const handleItemsPerPageChange = (event) => {
  const newValue = parseInt(event.target.value, 10);
  setItemsPerPage(newValue);
  setCurrentPage(1); // Reset to first page when changing items per page
};

const paginate = (pageNumber) => setCurrentPage(pageNumber);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = timesheet.slice(indexOfFirstItem, indexOfLastItem);

const handlePrevPage = () => 
{
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextPage = () => 
{
  const maxPage = Math.ceil(timesheet.length / itemsPerPage);
  if (currentPage < maxPage) {
    setCurrentPage(currentPage + 1);
  }
};

return (
    <>
      <Container>
      {
        loading
        ? 
        (
          <>
            <Row className="mt-5"><p style={{ textAlign: 'center' }}>Loading...</p></Row>
          </>
        ) 
        : 
        (
          <>
            <Row className="mt-3 mb-3 className='d-flex justify-content-center ml-auto mr-auto'">
              <Col style={{ flex: 1, textAlign: 'left', marginLeft: '60px' }}>
                <p style={{ fontWeight: 'bold' }}>Your Times</p>
              </Col>
              <Col style={{ flex: 1, textAlign: 'right', marginRight: '70px' }}>
                <Button variant="success" onClick={ExportAllTimesheetData}>Export to Excel</Button>
              </Col>
            </Row>
            <Row className="d-none justify-content-center ml-auto mr-auto">
              <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </Row>
            <Row className='d-flex justify-content-center ml-auto mr-auto mt-0 mb-0'>
              <table id="timesheetTable" style={styles.table} className='table table-hover'>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th }}>Sr. No.</th>
                      <th style={{ ...styles.th }}>DATE</th>
                      <th style={{ ...styles.th }}>BEGIN</th>
                      <th style={{ ...styles.th }}>END</th>
                      <th style={{ ...styles.th }}>DURATION</th>
                      <th style={{ ...styles.th }}>CUSTOMER</th>
                      <th style={{ ...styles.th }}>PROJECT</th>
                      <th style={{ ...styles.th }}>ACTIVITY</th>
                      <th style={{ ...styles.th }}>DESCRIPTION</th>
                      <th style={{ ...styles.th }}>TAG</th>
                      <th style={{ ...styles.th }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={styles.tbody}>  
                  {currentItems.map((timesheet, index) => 
                  (
                    <tr key={timesheet.id}>
                      <td style={{ ...styles.td }}>{indexOfFirstItem + index + 1}</td>
                      <td style={{ ...styles.td }}>{formatDateWithoutTime(timesheet.fromdate)}</td>
                      <td style={{ ...styles.td }}>{timesheet.fromtime}</td>
                      <td style={{ ...styles.td }}>{timesheet.endtime}</td>
                      <td style={{ ...styles.td }}>{timesheet.duration}</td>
                      <td style={{ ...styles.td }}>{timesheet.customer}</td>
                      <td style={{ ...styles.td }}>{timesheet.projects}</td>
                      <td style={{ ...styles.td }}>{timesheet.activity}</td>
                      <td style={{ ...styles.td }}>{timesheet.description}</td>
                      <td style={{ ...styles.td }}>{timesheet.tag}</td>
                      <td style={{...styles.button_td, display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant="outline-primary" onClick={()=>handleViewClick(timesheet)} title="View Your Times"><HiEye /></Button>
                        <Button variant="outline-warning" style={{ marginLeft: '4%' }} onClick={()=>handleEditClick(timesheet)} title="Edit Your Times"><BsPencil /></Button>
                      </td>
                    </tr>
                   ))}
                </tbody>
              </table>
            </Row>
            <Row className='d-flex justify-content-center ml-auto mr-auto'>
              <Col className="d-flex justify-content-start" style={{ marginLeft: '64px' }}>
                  <Button onClick={handlePrevPage} disabled={currentPage === 1} style={{ width: '40px', height: '40px' }}>
                    {"<"}
                  </Button>
                  <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(timesheet.length / itemsPerPage)} style={{ marginLeft: '10px', width: '40px', height: '40px' }}>
                    {">"}
                  </Button>
              </Col>
              <Col className='d-flex justify-content-end' style={{ marginRight: '66px' }}>
                <ul className="pagination">
                  {timesheet.length > 0 && (
                    Array.from({ length: Math.ceil(timesheet.length / itemsPerPage) }).map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button onClick={() => paginate(index + 1)} className="page-link" style={{ width: '40px', height: '40px' }}>
                          {index + 1}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </Col>
            </Row>
          </>
        )
      }
      <Modal show={showModal} onHide={handleCloseModal} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 'bold' }}>View Your Times</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && 
          (
            <div>
              <p style={{ fontWeight: 'bold' }}>Date: {formatDateWithoutTime(selectedRecord.fromdate)}</p>
              <p style={{ fontWeight: 'bold' }}>Begin: {selectedRecord.fromtime}</p>
              <p style={{ fontWeight: 'bold' }}>End: {selectedRecord.endtime}</p>
              <p style={{ fontWeight: 'bold' }}>Duration: {selectedRecord.duration}</p>
              <p style={{ fontWeight: 'bold' }}>Customer: {selectedRecord.customer}</p>
              <p style={{ fontWeight: 'bold' }}>Project: {selectedRecord.projects}</p>
              <p style={{ fontWeight: 'bold' }}>Activity: {selectedRecord.activity}</p>
              <p style={{ fontWeight: 'bold' }}>Description: {selectedRecord.description}</p>
              <p style={{ fontWeight: 'bold' }}>Tag: {selectedRecord.tag}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {showEditModal && editData && 
      (
        <EditUserTimesheetForm editData={editData.record} userId={userId} recordId={editData.id} onClose={handleCloseEditModal} fetchData={fetchData} />
      )}
      </Container>
    </>
  );
};

const styles = 
{
  table: 
  {
    width: '90%',
    height: 'auto',
    overflowX: 'hidden',
    overflowY: 'hidden',
    display: 'block'
  },
  tbody: 
  {
    height: 'auto',
    overflowY: 'auto'
  },
  th: 
  {
    background: '#f2f2f2',
    textAlign: 'center',
    border: '1px solid #ddd',
    verticalAlign: 'middle',
    alignItems: 'center'
  },
  td: 
  {
    border: '1px solid #ddd',
    textAlign: 'center',
    verticalAlign: 'middle',
    alignItems: 'center',
    paddingTop: '4px',
    paddingRight: '4px'
  },
  name_td:
  {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left'
  },
  button_td:
  {
    borderBottom: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    textAlign: 'center',
    verticalAlign: 'middle',
    alignItems: 'center',
    paddingTop: '24px',
    paddingBottom: '24px'
  }
};

export default UserMyTimes;
