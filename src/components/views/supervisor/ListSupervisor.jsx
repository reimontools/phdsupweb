import { useState, useEffect} from "react";
import { Table, Loading, Container, Dialog, Title, Button, DropDown, Avatar, ButtonFloat, ListSupervisorUniversity, Link, CrudSupervisor } from "../../../component";
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'

const ListSupervisor = () => {
    
    // CONST ########################################################################################################################################
    const defaultSupervisor = {supervisor_id: 0, supervisor_name: "", supervisor_surname: "", supervisor_orcid_web: "", supervisor_research_web: "", supervisor_academic_web: ""};

    // STATE ########################################################################################################################################
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSupervisor, setcurrentSupervisor] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});
    const [supervisorUniversities, setSupervisorUniversities] = useState([]);

    // MODAL ########################################################################################################################################
    // const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalSupervisorUniversity, openModalSupervisorUniversity, closeModalSupervisorUniversity] = useModal();  
    const [isOpenModalCrudSupervisor, openModalCrudSupervisor, closeModalCrudSupervisor] = useModal();  
    
    // EFFECT #######################################################################################################################################
    useEffect(() => fetchSupervisors(), []);

    // FETCHS #######################################################################################################################################
    const fetchSupervisors = async () => {
        setLoading(true);
        let supervisors = await getList("supervisor");
        setSupervisors(supervisors);
        setLoading(false);
    };

    const fetchSupervisorUniversities = async supervisor_id => {
        const supervisorUniversities = await getList("supervisor-university/" + supervisor_id);
        setSupervisorUniversities(supervisorUniversities);
    };

    const fetchAll = async supervisor_id => {
        fetchSupervisors()
        fetchSupervisorUniversities(supervisor_id);
    };

    const updateSupervisorIsActive = async supervisor_id => {
        try {
            const res = await axios.put("supervisor/" + supervisor_id);
            if (!res.data.error) {
                fetchSupervisors();
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = supervisor => {
        if (supervisor.supervisor_id === currentSupervisor.supervisor_id) {
            setcurrentSupervisor(0);
        } else {
            setcurrentSupervisor(supervisor);
        };
    };

    const handleDelete = (e, supervisor) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this supervisor?', text: 'Are you sure you want to delete this supervisor?', action: () => updateSupervisorIsActive(supervisor.supervisor_id) });
    };

    const handleUpdate = (e, supervisor) => {
        e.stopPropagation();
        setcurrentSupervisor(supervisor);
        openModalCrudSupervisor();
    };

    const handleButtonUniversities = (e, supervisor) => {
        e.stopPropagation();
        setcurrentSupervisor(supervisor);
        fetchSupervisorUniversities(supervisor.supervisor_id);
        openModalSupervisorUniversity();
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Full Name</th>
                <th>Orcid Number Link</th>
                <th>Researchgate Website</th>
                <th>Academic Google</th>
                <th>Universities</th>
                <th></th>
            </tr>
        );
    };

    const renderTableRows = supervisor => {
        var classContent = "";
        var classActions = "";

        if (supervisor.supervisor_id === currentSupervisor.supervisor_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={supervisor.supervisor_id} onClick={() => handleExpandir(supervisor)}>
                <td className="head">
                    {renderAvatar(supervisor)}
                    <div className="dropdown">
                        {renderDropDown(supervisor)}
                    </div>
                </td>
                <td className={classContent} data-label='Orcid Number Link'><Link.Basic href={supervisor.supervisor_orcid_web} /></td>
                <td className={classContent} data-label='Researchgate Website'><Link.Basic href={supervisor.supervisor_research_web} /></td> 
                <td className={classContent} data-label='Academic Google'><Link.Basic href={supervisor.supervisor_academic_web} /></td>
                <td className={classContent} data-label='Universities'>{renderButtonUniversities(supervisor)}</td>
                <td className={classActions}>{renderActions(supervisor)}</td>
            </tr>  
        );
    };

    const renderButtonUniversities = supervisor => {
        var text = "", family = "";
        if (supervisor.supervisor_count_universities > 0) {
            text = supervisor.supervisor_count_universities + " universities";
            family = "remove";
        } else {
            text = "No universities";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleButtonUniversities(e, supervisor)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderDropDown = supervisor => {
        return (
            <DropDown.ButtonIcon family="more">
                <div onClick={e => handleUpdate(e, supervisor)}>Update</div>
                <div onClick={e => handleDelete(e, supervisor)}>Delete</div>
            </DropDown.ButtonIcon>
        );
    };

    const renderActions = supervisor => {
        return (
            <div className="td-container">
               {renderDropDown(supervisor)}
            </div>
        );
    };

    const renderAvatar = supervisor => {
        return (
            <div className="avatar-container">
                <Avatar.Letter>{supervisor.supervisor_name[0]}</Avatar.Letter>
                {supervisor.supervisor_fullname}
            </div>
        );
    };
    
    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <Title.Primary>Supervisors</Title.Primary>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{supervisors.map(supervisor => renderTableRows(supervisor))}</tbody>
                    </Table.Basic>
                </Container.Table>
            }

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultSupervisor)} hover family="newFloat"/>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />

            {/* CRUD SUPERVISOR UNIVERSITY  ######################################################################################################### */}
            <CrudSupervisor.Basic 
                fetch={fetchSupervisors} 
                supervisor={currentSupervisor} 
                isOpen={isOpenModalCrudSupervisor} 
                close={closeModalCrudSupervisor} /> 

            {/* SUPERVISOR UNIVERSITY MODAL ######################################################################################################### */}
            <ListSupervisorUniversity.Basic 
                supervisor_id={currentSupervisor.supervisor_id} 
                fetch={fetchAll} 
                supervisorUniversities={supervisorUniversities} 
                isOpen={isOpenModalSupervisorUniversity} 
                close={closeModalSupervisorUniversity} /> 
            
        </Container.Primary>
    );  
};

export default ListSupervisor;