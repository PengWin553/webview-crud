import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

const Clients = () => {
    const [clients, setClients] = useState([]); // Corrected variable name
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false); //the close AddModal
    const makeAddModalAppear = () => setShowAddModal(!showAddModal); //to open AddModal

    const [showUpdateModal, setShowUpdateModal] = useState(false); //the close UpdateModal
    const makeUpdateModalAppear = () => setShowUpdateModal(!showUpdateModal); //to open UpdateModal

    const [clientName, setClientName] = useState(""); //for AddClientName
    const [residency, setResidency] = useState(""); //for AddClientResidency

    const [clientNameUpdate, setClientNameUpdate] = useState(""); //for updateClientNmae
    const [residencyUpdate, setResidencyUpdate] = useState(""); //for UpdateClientResidency
    const [clientIdUpdate, setClientIdUpdate] = useState(""); //for UpdateClientResidency

    // Fetch Clients
    const getClients = async () => {
        const response = await fetch(
            "http://localhost:5029/api/ClientApi/GetClients"
        );
        const result = await response.json();
        setClients(result);
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
        setClientName('');
        setResidency('');
        getClients();
        makeAddModalAppear();
    }

    const handleToUpdate = (id, clientName, residency) => {
        setClientIdUpdate(id);
        setClientNameUpdate(clientName);
        setResidencyUpdate(residency);
    };

    // Update Client
    const updateClient = async () => { // Changed function name to lowercase
        const dataToSend = {
            "clientName": clientNameUpdate,
            "residency": residencyUpdate,
        }

        const response = await fetch(
            "http://localhost:5029/api/ClientApi/UpdateClient?Id=" + clientIdUpdate,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            }
        );

        setClientName('');
        setResidency('');
        getClients();
        makeUpdateModalAppear();
    }

    // Delete Client
    const deleteClient = async (id) => { // Changed function name to lowercase
        const response = await fetch(
            "http://localhost:5029/api/ClientApi/DeleteClient?Id=" + id,
            {
                method: "DELETE",
            }
        );
        getClients();
    }

    useEffect(() => {
        getClients();
    }, []);

    if (loading) return <center><h1>Loading</h1></center>

    return (
        <>
            {/* Add Client */}
            <Modal show={showAddModal} onHide={makeAddModalAppear}>
                <Modal.Header closeButton>
                    New Client Info
                </Modal.Header>
                <Modal.Body>
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
                    <Button onClick={saveClient}>Save Client</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Client */}
            <Modal show={showUpdateModal} onHide={makeUpdateModalAppear}>
                <Modal.Header closeButton>
                    Update Client Info
                </Modal.Header>
                <Modal.Body>

                    <label htmlFor="id">Id:</label>
                    <input type="text"
                        value={clientIdUpdate}
                        onChange={(e) => setClientIdUpdate(e.target.value)}
                        id="id"
                        readOnly // Make the ID field read-only
                    />

                    <label htmlFor="name">Name:</label>
                    <input type="text"
                        value={clientNameUpdate}
                        onChange={(e) => setClientNameUpdate(e.target.value)}
                        id="name"
                    />

                    <label htmlFor="residency">Residency:</label>
                    <input type="text"
                        value={residencyUpdate}
                        onChange={(e) => setResidencyUpdate(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={updateClient}>Update Client</Button>
                </Modal.Footer>
            </Modal>

            <div className="container mt-5">
                <Button
                    className='mb-2'
                    onClick={makeAddModalAppear}
                >Add New Client</Button>
                <ul>
                    {
                        clients.map((c) =>
                            <li key={c.id} >{c.clientName} || {c.residency}
                                <Button onClick={() => deleteClient(c.id)}>Delete</Button>
                                <Button onClick={() => { handleToUpdate(c.id, c.clientName, c.residency); makeUpdateModalAppear(); }}>Update</Button>
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    );
}

export default Clients;
