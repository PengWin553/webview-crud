import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import {Toaster, toast} from 'sonner';

const Clients = () => {

    // get Clients to display
    const [clients, setClients] = useState([]); 

    // set loading...
    const [loading, setLoading] = useState(true);

    // Handle individual variables
    const [id, setId] = useState("");
    const [clientName, setClientName] = useState(""); 
    const [residency, setResidency] = useState("");

    // Add Modal
    const [showAddModal, setShowAddModal] = useState(false); 
    const makeAddModalAppear = () => setShowAddModal(!showAddModal); 

    // Update Modal
    const [showUpdateModal, setShowUpdateModal] = useState(false); 
    const makeUpdateModalAppear = () => setShowUpdateModal(!showUpdateModal); 

    // Fetch Clients
    const getClients = async () => {
        const response = await fetch(
            "http://localhost:5029/api/ClientApi/GetClients"
        );
        const result = await response.json();
        setClients(result);
        setLoading(false);
    }

    // Fetch Client
    const getClient = async (id) => {
        const response = await fetch(
            "http://localhost:5029/api/ClientApi/GetClient?id="+id,
        );

        const result = await response.json();
        setId(result.id);
        setClientName(result.clientName);
        setResidency(result.residency);

        setLoading(false);
    }

    // Add Client
    const saveClient = async () => {
        const dataToSend = {
            "clientName": clientName,
            "residency": residency
        }

        const response = await fetch(
            "http://localhost:5029/api/ClientApi/SaveClient",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dataToSend)
            }
        );

        if(response.ok){
            await getClients();
            makeAddModalAppear();
            setClientName('');
            setResidency('');
            toast.success('Client saved successfully');
        }else{
            toast.error('Failed to save client');
        }
    }

    // Update Client
    const updateClient = async () => {
        const dataToSend = {
            "clientName": clientName,
            "residency": residency,
        }

        const response = await fetch(
            "http://localhost:5029/api/ClientApi/UpdateClient?Id=" + id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dataToSend)
            }
        );

        if(response.ok){
            await getClients();
            makeUpdateModalAppear();
            setClientName('');
            setResidency('');
            toast.success('Client updated successfully');
        }else{
            toast.error('Failed to save client');
        }

    }

    // Delete Client
    const deleteClient = async (id) => {
        if (confirm("Are you sure you want to delete this?") == true) {
            const response = await fetch(
                "http://localhost:5029/api/ClientApi/DeleteClient?Id=" + id,
                {
                    method: "DELETE",
                }
            );

            if(response.ok){
                await getClients();
                toast.success('Client deleted successfully');
            }else{
                toast.error('Failed to delete client');
            }
        }
    }
  
    // update browser in case of database updates
    useEffect(() => {
        getClients();
    }, []);

    // if the browser is still loading data
    if (loading) return <center><h1>Loading</h1></center>

    return (
        <>
            {/* Add Client */}
            <Modal show={showAddModal} onHide={makeAddModalAppear}>
                <Modal.Header closeButton>
                    <b className='bold-color'>New Client Info</b>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="name">Name:</label>
                    <input type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        id="name"
                        placeholder='Enter client name'
                    />

                    <label htmlFor="residency">Residency:</label>
                    <input type="text"
                        value={residency}
                        onChange={(e) => setResidency(e.target.value)}
                        placeholder='Enter residency'
                    />
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <button onClick={saveClient} className="action-btn modal-btn">Save Client</button>
                </Modal.Footer>
            </Modal>

            {/* Update Client */}
            <Modal show={showUpdateModal} onHide={makeUpdateModalAppear}>
                <Modal.Header closeButton>
                    <b className='bold-color'>Update Client Info</b>
                </Modal.Header>
                <Modal.Body>
                    {/* <label htmlFor="id">Id:</label> */}
                    <input type="hidden"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        id="id"
                        readOnly
                    />

                    <label htmlFor="name">Name:</label>
                    <input type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        id="name"
                    />

                    <label htmlFor="residency">Residency:</label>
                    <input type="text"
                        value={residency}
                        onChange={(e) => setResidency(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={updateClient} className="action-btn modal-btn" >Update Client</button>
                </Modal.Footer>
            </Modal>

            {/* title */}
            <h3 class="title">CRUD With C# API</h3> 

            {/* Show Add Client Modal */}
            <div className="add-client-btn-container">
                <button className="action-btn add-client-btn" onClick={makeAddModalAppear} >Add New Client</button>
            </div>

            {/* Display All Client Data */}
            <div className="fixTableHead">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Residency</th>
                            <th className='action-btn-row-container'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => 
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.clientName}</td>
                                <td>{c.residency}</td>
                                <td className='action-btn-container-display'>
                                    <button className="action-btn row-btn update-client-btn" onClick={() => {getClient(c.id); makeUpdateModalAppear()}}>Update</button>  {/* Show Update Modal */}
                                    <button className="action-btn row-btn delete-client-btn" onClick={() => {deleteClient(c.id)}}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <Toaster expand={true} richColors position='bottom-right' className='mr-8'></Toaster>
        </>
    );
}

export default Clients;
