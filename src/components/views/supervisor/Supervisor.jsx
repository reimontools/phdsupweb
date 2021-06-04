import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Table, Loading, Container, Dialog, Modal, Title, Button, Input, DropDown, Avatar, ButtonFloat, SupervisorUniversity, Link } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
// import useList from '../../hooks/useList';
import axios from '../../../config/axios'

const Supervisor = () => {
    
    // CONST ########################################################################################################################################
    const defaultSupervisor = {supervisor_id: 0, supervisor_name: "", supervisor_surname: "", supervisor_orcid_web: "", supervisor_research_web: "", supervisor_academic_web: ""};

    // STATE ########################################################################################################################################
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSupervisor, setcurrentSupervisor] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});
    const [supervisorUniversities, setSupervisorUniversities] = useState([]);

    // MODAL ########################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalSupervisorUniversity, openModalSupervisorUniversity, closeModalSupervisorUniversity] = useModal();  

    // LIST #########################################################################################################################################
    // const phdCurrentYearList = useList("list/phd-current-year");
    // const phdFinishYearList = useList("list/phd-finish-year");
    // const countryList = useList("list/country");

    // EFFECT #######################################################################################################################################
    useEffect(() => fetchSupervisors(), []);

    // CRUD VALIDATIONS #############################################################################################################################
    const schemaCrud = Yup.object().shape({
        supervisor_name: Yup.string()
            .required('Required!')
            .min(2, "Too short!")
            .max(100, "Too long!"),
        supervisor_surname: Yup.string()
            .required('Required!')
            .min(2, "Too short!")
            .max(100, "Too long!"),
        supervisor_orcid_web: Yup.string()
            .url("Must be a valid url!")
            .max(500, "Too long!"),
        supervisor_research_web: Yup.string()
            .url("Must be a valid url!")
            .max(500, "Too long!"),
        supervisor_academic_web: Yup.string()
            .url("Must be a valid url!")
            .max(500, "Too long!")
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

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

    // CRUD #########################################################################################################################################
    const updateSupervisor = async data => {
        try {
            const res = await axios.post("supervisor", {supervisor_id: currentSupervisor.supervisor_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchSupervisors();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Supervisor already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Supervisor already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateSupervisorIsActive = async id => {
        try {
            const res = await axios.put("supervisor/" + id);
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
        resetCrud(supervisor);
        openModalCrud();
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
            <DropDown.Basic family="more">
                <div className="menu-content" onClick={e => handleUpdate(e, supervisor)}>Update</div>
                <div className="menu-content" onClick={e => handleDelete(e, supervisor)}>Delete</div>
            </DropDown.Basic>
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

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.Form isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>Supervisor</Title.Basic>
                    <Input.Validation name="supervisor_name" label="Name *" placeholder="Set supervisor name" register={registerCrud} error={errorsCrud.supervisor_name} />
                    <Input.Validation name="supervisor_surname" label="Surname *" placeholder="Set supervisor surname" register={registerCrud} error={errorsCrud.supervisor_surname} />
                    <Input.Validation name="supervisor_orcid_web" label="Orcid Number Link" placeholder="Set supervisor Orcid Number Link" register={registerCrud} error={errorsCrud.supervisor_orcid_web} />
                    <Input.Validation name="supervisor_research_web" label="Researchgate Website" placeholder="Set supervisor Researchgate Website" register={registerCrud} error={errorsCrud.supervisor_research_web} />
                    <Input.Validation name="supervisor_academic_web" label="Academic Google" placeholder="Set supervisor Academic Google" register={registerCrud} error={errorsCrud.supervisor_academic_web} />
                    <Button.Basic onClick={handleSubmitCrud(updateSupervisor)}>Save</Button.Basic>
                </Container.Basic>
            </Modal.Form>

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultSupervisor)} hover family="newFloat"/>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />

            {/* SUPERVISOR UNIVERSITY MODAL ######################################################################################################### */}
            <SupervisorUniversity.Basic 
                supervisor_id={currentSupervisor.supervisor_id} 
                fetch={fetchAll} 
                supervisorUniversities={supervisorUniversities} 
                isOpen={isOpenModalSupervisorUniversity} 
                close={closeModalSupervisorUniversity} /> 
            
        </Container.Primary>
    );  
};

export default Supervisor;