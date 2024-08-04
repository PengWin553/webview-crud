import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Toaster, toast } from 'sonner';
import 'boxicons';

const Clients = () => {

    // handle dropdown
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    // get clients
    const [clients, setClients] = useState([]);

    // set loading...
    const [loading, setLoading] = useState(true);

    // add client modal
    const [showAddModal, setShowAddModal] = useState(false); 
    const makeAddModalAppear = () => setShowAddModal(!showAddModal); 

    // update client modal
    const [showUpdateModal, setShowUpdateModal] = useState(false); 
    const makeUpdateModalAppear = () => setShowUpdateModal(!showUpdateModal); 

    // handle client table's variables
    const [clientName, setClientName] = useState(""); 
    const [id, setId] = useState(0) 
    const [residency, setResidency] = useState(""); 

    // handle show more details modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    function toggleOptions(clientId) {
        const optionsContainer = document.getElementById(`options-${clientId}`);
        optionsContainer.classList.toggle('show');
    }

    const handleClientClick = (client) => {
        setSelectedClient(client);
        setShowDetailsModal(true);
    }

    const toggleDropdown = (clientId) => {
        setActiveDropdown(activeDropdown === clientId ? null : clientId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handleToUpdate = (id, clientName, residency) => {
        setId(id);
        setClientName(clientName);
        setResidency(residency);
    };

    // Update Client
    const updateClient = async () => { // Changed function name to lowercase
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

    useEffect(() => {
        getClients();
    }, []);

    if (loading) return <center><h4>Loading</h4></center>

    return (
        <>
            {/* Client Details Modal */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                <Modal.Header closeButton>
                    <b className='bold-color'>Client Details</b>
                </Modal.Header>
                <Modal.Body>
                    {/* <p><strong>ID:</strong> {selectedClient?.id}</p> */}
                    <p><strong>Name:</strong> {selectedClient?.clientName}</p>
                    <p><strong>Residency:</strong> {selectedClient?.residency}</p>
                </Modal.Body>
            </Modal>

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
                    <Button onClick={updateClient}>Update Client</Button>
                </Modal.Footer>
            </Modal>

            {/* title */}
            <h3 class="title"> <i class='bx bxl-react icon'></i>CRUD With C# API</h3> 

            {/* Show Add Client Modal */}
            <div className="add-client-btn-container">
                <button className="action-btn add-client-btn" onClick={makeAddModalAppear}>+</button>
            </div>

            {/* Display All Client Data */}
            <div className="client-list">
                {clients.map((c) => (
                    <div key={c.id} className="client-item">
                    <div className="client-info" onClick={() => handleClientClick(c)}>
                        <h4>{c.clientName}</h4>
                        <p>{c.residency}</p>
                    </div>
                    <div className="options-icon" onClick={() => toggleDropdown(c.id)}> … </div>
                    {activeDropdown === c.id && (
                        <div className="dropdown-menu show" ref={dropdownRef}>
                        <div className="dropdown-item" onClick={() => {handleToUpdate(c.id, c.clientName, c.residency); makeUpdateModalAppear();}}>
                            Update
                        </div>
                        <div className="dropdown-item" onClick={() => {deleteClient(c.id)}}>
                            Delete
                        </div>
                        </div>
                    )}
                    </div>
                ))}
            </div>

            <Toaster expand={true} richColors position='bottom-right' className='mr-8'></Toaster>

        </>
    );
}

export default Clients;
